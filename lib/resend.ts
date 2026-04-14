/**
 * BACKWARD COMPAT shim — viz lib/email.ts pro skutečnou implementaci.
 *
 * Po FIX-019 (Wedos SMTP fallback) se sendEmail dispatchuje přes EMAIL_PROVIDER switch.
 * Tento soubor zachovává API pro existující callery, kteří importují z @/lib/resend.
 *
 * Nové callers by měli importovat přímo z @/lib/email.
 */

import {
  sendEmail as sendEmailImpl,
  EMAIL_FROM,
  EMAIL_FROM_CONTRACTS,
  type SendEmailParams,
  type SendEmailResult,
} from "@/lib/email";

import { Resend } from "resend";

let _resend: Resend | null = null;

/**
 * @deprecated Použij sendEmail z @/lib/email — provider switch řeší Resend vs Wedos.
 * Zachováno pro callery, kteří potřebovali přímý Resend client (např. attachments tooling).
 */
export function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!_resend) _resend = new Resend(apiKey);
  return _resend;
}

export const RESEND_FROM = EMAIL_FROM;
export const RESEND_FROM_CONTRACTS = EMAIL_FROM_CONTRACTS;

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  return sendEmailImpl(params);
}
