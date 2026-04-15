/**
 * FIX-037 (F-048): E-mail dispatcher — Wedos SMTP jediný provider.
 *
 * Resend byl odstraněn 2026-04-15 (Radim: „nebudeme používat resend... koupíme
 * si emaily normálně na wedosu"). Žádný fallback, žádný switch.
 *
 * ENV:
 *   - SMTP_USER, SMTP_PASSWORD   — Wedos mailbox creds (povinné)
 *   - SMTP_FROM                  — výchozí From: adresa (default info@carmakler.cz)
 *   - SMTP_HOST                  — default smtp.wedos.net
 *   - SMTP_PORT                  — default 587 (STARTTLS)
 *   - SMTP_MAX_CONNECTIONS       — default 3 (pool)
 *   - SMTP_MAX_MESSAGES          — default 50 per connection
 *   - SMTP_RATE_LIMIT            — default 5 msg/s per connection
 *
 * Bez SMTP_USER/SMTP_PASSWORD → sendEmail vrátí `[EMAIL:NOT_CONFIGURED]` warning
 * a nic neodešle (ne „dev fallback").
 */

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type EmailProvider = "wedos" | "not_configured";

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

export const EMAIL_FROM =
  process.env.SMTP_FROM || process.env.EMAIL_FROM || "info@carmakler.cz";
export const EMAIL_FROM_CONTRACTS =
  process.env.SMTP_FROM_CONTRACTS || "smlouvy@carmakler.cz";

/* ------------------------------------------------------------------ */
/*  Wedos SMTP transport (nodemailer)                                  */
/* ------------------------------------------------------------------ */

let _wedosTransport: Transporter | null = null;

function getWedosTransport(): Transporter | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) return null;
  if (!_wedosTransport) {
    _wedosTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.wedos.net",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // STARTTLS
      requireTLS: true,
      auth: { user, pass },
      // AUDIT-031: connection pooling
      pool: true,
      maxConnections: Number(process.env.SMTP_MAX_CONNECTIONS) || 3,
      maxMessages: Number(process.env.SMTP_MAX_MESSAGES) || 50,
      rateDelta: 1000,
      rateLimit: Number(process.env.SMTP_RATE_LIMIT) || 5,
    });
  }
  return _wedosTransport;
}

/**
 * AUDIT-031: Graceful shutdown — uzavře SMTP pool při SIGTERM/SIGINT.
 * Voláno z instrumentation.ts.
 */
export async function closeWedosTransport(): Promise<void> {
  if (_wedosTransport) {
    try {
      _wedosTransport.close();
      _wedosTransport = null;
    } catch (err) {
      console.error("[email] Wedos transport close failed:", err);
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const transport = getWedosTransport();
  if (!transport) {
    console.warn(
      `[EMAIL:NOT_CONFIGURED] SMTP_USER/SMTP_PASSWORD chybí. to=${params.to} subject="${params.subject}"`
    );
    return {
      success: false,
      error: "SMTP not configured (SMTP_USER/SMTP_PASSWORD missing)",
      provider: "not_configured",
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
