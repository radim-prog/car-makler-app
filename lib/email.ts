/**
 * FIX-019: Unified e-mail dispatcher s providerem na výběr.
 *
 * EMAIL_PROVIDER env switch:
 *   - "resend" (default, pokud RESEND_API_KEY je nastaven)
 *   - "wedos"  (SMTP fallback přes nodemailer; vyžaduje WEDOS_SMTP_USER + WEDOS_SMTP_PASSWORD)
 *   - "dev"    (pouze console.warn, nic neodesílá — pro lokální dev/CI)
 *
 * Auto-fallback strategie když EMAIL_PROVIDER není explicitní:
 *   1) RESEND_API_KEY existuje → resend
 *   2) WEDOS_SMTP_USER+WEDOS_SMTP_PASSWORD existují → wedos
 *   3) jinak → dev (no-op log)
 *
 * Backward-compat: lib/resend.ts re-exportuje sendEmail z tohoto modulu,
 * takže žádný caller se nemusí měnit.
 */

import { Resend } from "resend";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type EmailProvider = "resend" | "wedos" | "dev";

export type SendEmailParams = {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{ path?: string; filename?: string; content?: Buffer }>;
};

export type SendEmailResult = {
  success: boolean;
  id?: string;
  error?: string;
  provider?: EmailProvider;
};

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "info@carmakler.cz";
export const EMAIL_FROM_CONTRACTS =
  process.env.RESEND_FROM_EMAIL || "smlouvy@carmakler.cz";

/* ------------------------------------------------------------------ */
/*  Provider resolution                                                */
/* ------------------------------------------------------------------ */

export function resolveEmailProvider(): EmailProvider {
  const explicit = process.env.EMAIL_PROVIDER?.toLowerCase().trim();
  if (explicit === "resend" || explicit === "wedos" || explicit === "dev") {
    return explicit;
  }
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.WEDOS_SMTP_USER && process.env.WEDOS_SMTP_PASSWORD) return "wedos";
  return "dev";
}

/* ------------------------------------------------------------------ */
/*  Resend transport                                                   */
/* ------------------------------------------------------------------ */

let _resend: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_resend) _resend = new Resend(key);
  return _resend;
}

async function sendViaResend(params: SendEmailParams): Promise<SendEmailResult> {
  const resend = getResend();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY not configured", provider: "resend" };
  }
  try {
    const result = await resend.emails.send({
      from: params.from || EMAIL_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments,
    });
    return { success: true, id: result.data?.id ?? undefined, provider: "resend" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      provider: "resend",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Wedos SMTP transport (nodemailer)                                  */
/* ------------------------------------------------------------------ */

let _wedosTransport: Transporter | null = null;
function getWedosTransport(): Transporter | null {
  const user = process.env.WEDOS_SMTP_USER;
  const pass = process.env.WEDOS_SMTP_PASSWORD;
  if (!user || !pass) return null;
  if (!_wedosTransport) {
    _wedosTransport = nodemailer.createTransport({
      host: process.env.WEDOS_SMTP_HOST || "smtp.wedos.net",
      port: Number(process.env.WEDOS_SMTP_PORT) || 587,
      secure: false, // STARTTLS
      requireTLS: true,
      auth: { user, pass },
    });
  }
  return _wedosTransport;
}

async function sendViaWedos(params: SendEmailParams): Promise<SendEmailResult> {
  const transport = getWedosTransport();
  if (!transport) {
    return {
      success: false,
      error: "WEDOS_SMTP_USER / WEDOS_SMTP_PASSWORD not configured",
      provider: "wedos",
    };
  }
  try {
    const info = await transport.sendMail({
      from: params.from || EMAIL_FROM,
      to: Array.isArray(params.to) ? params.to.join(", ") : params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      attachments: params.attachments?.map((a) => ({
        path: a.path,
        filename: a.filename,
        content: a.content,
      })),
    });
    return { success: true, id: info.messageId, provider: "wedos" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      provider: "wedos",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const provider = resolveEmailProvider();

  if (provider === "dev") {
    console.warn(
      `[Email:DEV] No provider configured. Would send to: ${params.to}, subject: "${params.subject}"`
    );
    return { success: false, error: "No e-mail provider configured", provider: "dev" };
  }

  if (provider === "resend") {
    const result = await sendViaResend(params);
    // Soft-fallback: pokud Resend selže (např. domain not verified) a Wedos je nakonfigurovaný, zkus ho
    if (!result.success && process.env.WEDOS_SMTP_USER && process.env.WEDOS_SMTP_PASSWORD) {
      console.warn(`[Email] Resend failed (${result.error}), trying Wedos fallback`);
      return sendViaWedos(params);
    }
    return result;
  }

  return sendViaWedos(params);
}
