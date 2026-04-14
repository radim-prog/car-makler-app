/**
 * F-020: Marketplace waitlist gate
 *
 * Strategie: invite tokens v env `MARKETPLACE_INVITE_TOKENS` (comma-separated).
 * Uživatel se dostane k plnému obsahu když:
 *   - má cookie `marketplace_invite` s platným tokenem, NEBO
 *   - má query param `?invite=TOKEN`, NEBO
 *   - je přihlášen jako role INVESTOR / VERIFIED_DEALER / ADMIN / BACKOFFICE / MANAGER
 *
 * Jinak vidí Coming Soon + signup do waitlistu.
 */

export const MARKETPLACE_INVITE_COOKIE = "marketplace_invite";
const ROLE_BYPASS = new Set([
  "ADMIN",
  "BACKOFFICE",
  "MANAGER",
  "INVESTOR",
  "VERIFIED_DEALER",
]);

function parseTokens(): Set<string> {
  const raw = process.env.MARKETPLACE_INVITE_TOKENS ?? "";
  return new Set(
    raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
  );
}

export function isValidInviteToken(token: string | null | undefined): boolean {
  if (!token) return false;
  const tokens = parseTokens();
  if (tokens.size === 0) return false;
  return tokens.has(token);
}

export function hasRoleBypass(role: string | null | undefined): boolean {
  if (!role) return false;
  return ROLE_BYPASS.has(role);
}

/** Jediný veřejný flag: pokud false, force Coming Soon UI. */
export function marketplaceGateOpen(opts: {
  queryToken?: string | null;
  cookieToken?: string | null;
  userRole?: string | null;
}): boolean {
  // Dev/preview bypass přes globální ENV flag
  if (process.env.MARKETPLACE_GATE_DISABLED === "true") return true;
  if (hasRoleBypass(opts.userRole)) return true;
  if (isValidInviteToken(opts.queryToken)) return true;
  if (isValidInviteToken(opts.cookieToken)) return true;
  return false;
}
