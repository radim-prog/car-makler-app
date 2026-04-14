/**
 * F-031: AuditLog helper — append-only zápis bezpečnostně/GDPR relevantních akcí.
 *
 * Použití:
 *   import { logAudit, AuditAction } from "@/lib/audit";
 *   await logAudit({ action: "LOGIN_SUCCESS", userId: user.id, request });
 *
 * Filozofie:
 *   - NIKDY neházet exception (audit nesmí rozbít business flow)
 *   - Pokud zápis selže, log do konzole + Sentry (pokud nakonfigurován)
 *   - IP a UA se extrahují z Request headers automaticky když je předán
 */

import { prisma } from "@/lib/prisma";

// Drží se ručně sync se schema.prisma `enum AuditAction`.
// Záměrně nepoužíváme `import type { AuditAction } from "@prisma/client"`,
// protože některé buildy klienta nezpřístupňují enum jako pojmenovaný export.
export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "EMAIL_VERIFIED"
  | "ACCOUNT_CREATED"
  | "ROLE_CHANGED"
  | "STATUS_CHANGED"
  | "ERASURE_REQUESTED"
  | "ERASURE_EXECUTED"
  | "ERASURE_DENIED"
  | "DATA_EXPORTED"
  | "LISTING_CREATED"
  | "LISTING_PUBLISHED"
  | "LISTING_DELETED"
  | "ADMIN_ACTION";

export type LogAuditParams = {
  action: AuditAction;
  userId?: string | null;       // subjekt akce (target)
  actorId?: string | null;       // kdo akci provedl (default = userId)
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  request?: Request | null;      // pro auto-extrakci IP/UA
};

export type LogAuditResult = { success: boolean; id?: string; error?: string };

/**
 * Zapíše audit záznam. Nikdy neháže — selhání jen zaloguje a vrátí success: false.
 */
export async function logAudit(params: LogAuditParams): Promise<LogAuditResult> {
  try {
    const { ipAddress, userAgent } = params.request
      ? extractClientInfo(params.request)
      : { ipAddress: params.ipAddress ?? null, userAgent: params.userAgent ?? null };

    const record = await prisma.auditLog.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        action: params.action as any,
        userId: params.userId ?? null,
        actorId: params.actorId ?? params.userId ?? null,
        entityType: params.entityType ?? null,
        entityId: params.entityId ?? null,
        metadata: (params.metadata ?? undefined) as never,
        ipAddress: params.ipAddress ?? ipAddress,
        userAgent: params.userAgent ?? userAgent,
      },
      select: { id: true },
    });

    return { success: true, id: record.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown audit error";
    console.error(`[AuditLog] Zápis selhal pro action=${params.action}:`, message);
    return { success: false, error: message };
  }
}

/**
 * Extrahuje IP a User-Agent z fetch Request objektu.
 * IP řeší x-forwarded-for (proxy/Vercel) → x-real-ip → fallback null.
 */
export function extractClientInfo(req: Request): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  const headers = req.headers;
  const xff = headers.get("x-forwarded-for");
  const ipAddress =
    xff?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    null;
  const userAgent = headers.get("user-agent");
  return { ipAddress, userAgent };
}

