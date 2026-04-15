import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming, Message } from "@anthropic-ai/sdk/resources/messages";

/**
 * FIX-047a — Anthropic API resilience (503/529 overload fallback).
 *
 * Anthropic občas vrací 503 (service unavailable) nebo 529 ("overloaded_error")
 * pod vysokou zátěží. Bez retry logiky každý takový incident shodí AI asistenta
 * i generátor popisů. Tento helper:
 *   - Ověří konfiguraci API klíče (bez něj vrátí NOT_CONFIGURED — ne crash).
 *   - Retryuje 3× s exponenciálním backoffem na 503/529/ECONNRESET/ETIMEDOUT.
 *   - Po vyčerpání pokusů vrátí strukturovaný fallback místo throw.
 */

export type AnthropicErrorCode =
  | "NOT_CONFIGURED"
  | "OVERLOADED"
  | "RATE_LIMITED"
  | "AUTH"
  | "UNKNOWN";

export interface AnthropicResult {
  ok: boolean;
  message?: Message;
  errorCode?: AnthropicErrorCode;
  errorMessage?: string;
}

const MAX_RETRIES = 3;
const BASE_BACKOFF_MS = 500;

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

function isRetryableError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const e = err as { status?: number; code?: string; message?: string };
  if (e.status === 503 || e.status === 529 || e.status === 502 || e.status === 504) return true;
  if (e.code === "ECONNRESET" || e.code === "ETIMEDOUT" || e.code === "ECONNABORTED") return true;
  if (typeof e.message === "string" && /overloaded|unavailable|timeout/i.test(e.message)) return true;
  return false;
}

function classifyError(err: unknown): { code: AnthropicErrorCode; message: string } {
  if (!err || typeof err !== "object") {
    return { code: "UNKNOWN", message: "Neznámá chyba" };
  }
  const e = err as { status?: number; message?: string };
  const msg = e.message || "Unknown error";
  if (e.status === 401 || e.status === 403) return { code: "AUTH", message: msg };
  if (e.status === 429) return { code: "RATE_LIMITED", message: msg };
  if (e.status === 503 || e.status === 529 || /overloaded|unavailable/i.test(msg)) {
    return { code: "OVERLOADED", message: msg };
  }
  return { code: "UNKNOWN", message: msg };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Vytvoří Anthropic message s retry/backoff. Nikdy nehází — vrací strukturovaný výsledek.
 */
export async function createMessageWithRetry(
  params: MessageCreateParamsNonStreaming
): Promise<AnthropicResult> {
  if (!isAnthropicConfigured()) {
    console.warn("[Anthropic] NOT_CONFIGURED — ANTHROPIC_API_KEY chybí, vracím fallback");
    return {
      ok: false,
      errorCode: "NOT_CONFIGURED",
      errorMessage: "AI asistent není nakonfigurován. Kontaktujte administrátora.",
    };
  }

  const client = new Anthropic();
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const message = await client.messages.create(params);
      if (attempt > 0) {
        console.log(`[Anthropic] Succeeded on retry ${attempt}`);
      }
      return { ok: true, message };
    } catch (err) {
      lastError = err;
      if (!isRetryableError(err) || attempt === MAX_RETRIES - 1) break;
      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt) + Math.random() * 200;
      console.warn(
        `[Anthropic] Retry ${attempt + 1}/${MAX_RETRIES} po ${Math.round(backoff)}ms — ${
          (err as { status?: number; message?: string }).status ?? ""
        } ${(err as { message?: string }).message ?? ""}`
      );
      await sleep(backoff);
    }
  }

  const { code, message } = classifyError(lastError);
  console.error(`[Anthropic] Failed after ${MAX_RETRIES} attempts: ${code} — ${message}`);
  return { ok: false, errorCode: code, errorMessage: message };
}

/**
 * Extrahuje text z první textové části Message odpovědi. Vrací "" pokud není textový obsah.
 */
export function extractText(message: Message): string {
  const block = message.content[0];
  return block && block.type === "text" ? block.text : "";
}

/**
 * Lidsky čitelná chybová hláška pro UI podle error kódu.
 */
export function errorMessageForUser(code: AnthropicErrorCode): string {
  switch (code) {
    case "NOT_CONFIGURED":
      return "AI asistent není nakonfigurován. Kontaktujte administrátora.";
    case "OVERLOADED":
      return "AI služba je momentálně přetížena. Zkuste to prosím za chvíli.";
    case "RATE_LIMITED":
      return "Překročen limit požadavků na AI. Zkuste to za pár minut.";
    case "AUTH":
      return "Chyba autentizace AI služby. Kontaktujte administrátora.";
    default:
      return "Chyba při komunikaci s AI. Zkuste to prosím znovu.";
  }
}

/**
 * HTTP status code pro danou chybu (pro NextResponse).
 */
export function httpStatusForError(code: AnthropicErrorCode): number {
  switch (code) {
    case "NOT_CONFIGURED":
      return 503;
    case "OVERLOADED":
      return 503;
    case "RATE_LIMITED":
      return 429;
    case "AUTH":
      return 500;
    default:
      return 500;
  }
}
