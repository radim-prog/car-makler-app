/**
 * F-032: GDPR Art. 17 erasure flow — orchestrace anonymizace user dat.
 *
 * Workflow:
 *   1. requestErasure(userId)  — uloží žádost, nastaví 7-day cooling-off
 *   2. cancelErasureRequest()  — uživatel během cooling-off zruší
 *   3. executeErasure(userId)  — po cooling-off provede anonymizaci
 *
 * Dodržení Art. 17/3: 30-dní lhůta od žádosti.
 *   - 7 dní cooling-off (anti-impulse, anti-takeover)
 *   - +1-3 dny cron processing margin
 *   = vždy uvnitř 30-dní window
 *
 * Retention exceptions (Art. 17/3/b — legal obligation):
 *   - Aktivní investice (NOT REFUNDED)            → §35d AML 5y
 *   - Komise mladší 10 let                         → §89/4 DPH
 *   - Placená objednávka mladší 10 let             → §35 ZoÚ + reklamace
 *   - Smlouva ve sporu (status DISPUTED)           → arbitráž / soudní spor
 *
 * Pokud BLOCK → záznam ERASURE_DENIED + email user-ovi s odůvodněním.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

export const SYSTEM_DELETED_USER_ID = "system-deleted-user";
const COOLING_OFF_DAYS = 7;
const FINANCIAL_RETENTION_YEARS = 10;

export type ErasureBlocker = {
  reason:
    | "ACTIVE_INVESTMENT"
    | "RECENT_COMMISSION"
    | "RECENT_PAID_ORDER"
    | "ACTIVE_CONTRACT_DISPUTE";
  detail: string;
  blockedUntil?: Date;
};

export type ErasureCheckResult =
  | { canErase: true; blockers: [] }
  | { canErase: false; blockers: ErasureBlocker[] };

/* ------------------------------------------------------------------ */
/*  1) Pre-flight check — retention exceptions                        */
/* ------------------------------------------------------------------ */

export async function checkErasureBlockers(
  userId: string
): Promise<ErasureCheckResult> {
  const blockers: ErasureBlocker[] = [];

  // Aktivní investice (NOT REFUNDED)
  const activeInvestment = await prisma.investment.findFirst({
    where: {
      investorId: userId,
      paymentStatus: { not: "REFUNDED" },
    },
    select: { id: true, paymentReference: true, createdAt: true },
  });
  if (activeInvestment) {
    blockers.push({
      reason: "ACTIVE_INVESTMENT",
      detail: `Investice ${activeInvestment.id} (${activeInvestment.paymentReference ?? "bez ref."}) — AML §35d 5 let od refundu`,
    });
  }

  // Komise mladší 10 let (DPH §89/4)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - FINANCIAL_RETENTION_YEARS);
  const recentCommission = await prisma.commission.findFirst({
    where: { brokerId: userId, createdAt: { gte: tenYearsAgo } },
    select: { id: true, createdAt: true, commission: true },
  });
  if (recentCommission) {
    const earliestEraseAt = new Date(recentCommission.createdAt);
    earliestEraseAt.setFullYear(earliestEraseAt.getFullYear() + FINANCIAL_RETENTION_YEARS);
    blockers.push({
      reason: "RECENT_COMMISSION",
      detail: `Komise ${recentCommission.id} z ${recentCommission.createdAt.toISOString().slice(0, 10)} (${recentCommission.commission} Kč) — DPH §89/4 10 let`,
      blockedUntil: earliestEraseAt,
    });
  }

  // Placená objednávka mladší 10 let
  const recentPaidOrder = await prisma.order.findFirst({
    where: {
      buyerId: userId,
      paymentStatus: "PAID",
      createdAt: { gte: tenYearsAgo },
    },
    select: { id: true, orderNumber: true, createdAt: true },
  });
  if (recentPaidOrder) {
    const earliestEraseAt = new Date(recentPaidOrder.createdAt);
    earliestEraseAt.setFullYear(earliestEraseAt.getFullYear() + FINANCIAL_RETENTION_YEARS);
    blockers.push({
      reason: "RECENT_PAID_ORDER",
      detail: `Objednávka ${recentPaidOrder.orderNumber} — reklamační lhůta 10 let`,
      blockedUntil: earliestEraseAt,
    });
  }

  // Aktivní spor o smlouvu (Contract.status DISPUTED — pokud schema neumožňuje, řešit přes status="TERMINATED" + violationReported)
  const disputedContract = await prisma.contract.findFirst({
    where: {
      brokerId: userId,
      OR: [{ status: "DISPUTED" }, { violationReported: true }],
    },
    select: { id: true, status: true, violationReported: true },
  });
  if (disputedContract) {
    blockers.push({
      reason: "ACTIVE_CONTRACT_DISPUTE",
      detail: `Smlouva ${disputedContract.id} (status=${disputedContract.status}, violation=${disputedContract.violationReported}) — vyřešit nejdříve`,
    });
  }

  return blockers.length === 0
    ? { canErase: true, blockers: [] }
    : { canErase: false, blockers };
}

/* ------------------------------------------------------------------ */
/*  2) Request erasure (sets cooling-off window)                      */
/* ------------------------------------------------------------------ */

export type RequestErasureResult =
  | {
      success: true;
      scheduledAt: Date;
      coolingOffDays: number;
    }
  | {
      success: false;
      error: string;
      blockers?: ErasureBlocker[];
    };

export async function requestErasure(params: {
  userId: string;
  request?: Request;
}): Promise<RequestErasureResult> {
  const { userId, request } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      erasureRequestedAt: true,
      erasureScheduledAt: true,
      deletedAt: true,
    },
  });

  if (!user) return { success: false, error: "Uživatel nenalezen" };
  if (user.deletedAt) {
    return { success: false, error: "Účet už byl smazán" };
  }
  if (user.erasureRequestedAt && user.erasureScheduledAt && user.erasureScheduledAt > new Date()) {
    return {
      success: false,
      error: `Žádost už čeká — naplánováno na ${user.erasureScheduledAt.toISOString().slice(0, 10)}`,
    };
  }

  const check = await checkErasureBlockers(userId);
  if (!check.canErase) {
    await logAudit({
      action: "ERASURE_DENIED",
      userId,
      entityType: "User",
      entityId: userId,
      metadata: { blockers: check.blockers },
      request,
    });
    return {
      success: false,
      error: "Účet nelze smazat kvůli zákonné retenční lhůtě",
      blockers: check.blockers,
    };
  }

  const now = new Date();
  const scheduledAt = new Date(now);
  scheduledAt.setDate(scheduledAt.getDate() + COOLING_OFF_DAYS);

  await prisma.user.update({
    where: { id: userId },
    data: {
      erasureRequestedAt: now,
      erasureScheduledAt: scheduledAt,
    },
  });

  await logAudit({
    action: "ERASURE_REQUESTED",
    userId,
    entityType: "User",
    entityId: userId,
    metadata: { scheduledAt, coolingOffDays: COOLING_OFF_DAYS },
    request,
  });

  return { success: true, scheduledAt, coolingOffDays: COOLING_OFF_DAYS };
}

/* ------------------------------------------------------------------ */
/*  3) Cancel during cooling-off                                      */
/* ------------------------------------------------------------------ */

export async function cancelErasureRequest(params: {
  userId: string;
  request?: Request;
}): Promise<{ success: boolean; error?: string }> {
  const { userId, request } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { erasureRequestedAt: true, erasureScheduledAt: true, deletedAt: true },
  });
  if (!user) return { success: false, error: "Uživatel nenalezen" };
  if (user.deletedAt) return { success: false, error: "Účet už byl smazán" };
  if (!user.erasureRequestedAt) {
    return { success: false, error: "Žádná aktivní žádost" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { erasureRequestedAt: null, erasureScheduledAt: null },
  });

  await logAudit({
    action: "ADMIN_ACTION",
    userId,
    entityType: "User",
    entityId: userId,
    metadata: { action: "ERASURE_CANCELLED" },
    request,
  });

  return { success: true };
}

/* ------------------------------------------------------------------ */
/*  4) Execute erasure (atomic — anonymizace + hard-delete)           */
/* ------------------------------------------------------------------ */

const ANON_EMAIL_DOMAIN = "deleted.carmakler.local";

function anonEmail(userId: string): string {
  return `deleted-${userId}@${ANON_EMAIL_DOMAIN}`;
}

/**
 * Provede skutečnou anonymizaci. Předpokládá, že retention check už proběhl
 * (volat až po requestErasure). Idempotentní: opakované volání pro již-deleted
 * usera vrací success bez akce.
 */
export async function executeErasure(params: {
  userId: string;
  actorId?: string | null;
  request?: Request;
}): Promise<{ success: boolean; error?: string; tablesAffected?: number }> {
  const { userId, actorId, request } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, deletedAt: true, email: true },
  });
  if (!user) return { success: false, error: "Uživatel nenalezen" };
  if (user.deletedAt) {
    return { success: true, tablesAffected: 0 }; // idempotent
  }

  // Re-check retention blockers (mohly se mezitím změnit)
  const check = await checkErasureBlockers(userId);
  if (!check.canErase) {
    await logAudit({
      action: "ERASURE_DENIED",
      userId,
      actorId,
      entityType: "User",
      entityId: userId,
      metadata: { blockers: check.blockers, phase: "execute" },
      request,
    });
    return { success: false, error: "Mezitím vznikla retenční překážka — execution zablokována" };
  }

  let tablesAffected = 0;
  const SYSTEM = SYSTEM_DELETED_USER_ID;

  await prisma.$transaction(async (tx) => {
    // === Phase 1: HARD DELETE — PII bez legal důvodu ===
    await tx.notification.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.aiConversation.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.favorite.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.watchdog.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.userAchievement.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.notificationPreference.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.listingFeedConfig.deleteMany({ where: { userId } }); tablesAffected++;
    await tx.partsFeedConfig.deleteMany({ where: { supplierId: userId } }); tablesAffected++;
    await tx.sellerCommunication.deleteMany({ where: { brokerId: userId } }); tablesAffected++;
    await tx.escalation.deleteMany({ where: { brokerId: userId } }); tablesAffected++;
    await tx.passwordResetToken.deleteMany({ where: { email: user.email } }); tablesAffected++;
    await tx.emailVerificationToken.deleteMany({ where: { email: user.email } }); tablesAffected++;

    // === Phase 2: ANONYMIZE — PII fields scrub, FK preserve ===
    await tx.listing.updateMany({
      where: { userId },
      data: {
        contactName: "Smazaný uživatel",
        contactPhone: "",  // schema NOT NULL
        contactEmail: null,
        status: "INACTIVE",
      },
    }); tablesAffected++;

    await tx.inquiry.deleteMany({ where: { senderId: userId } }); tablesAffected++;
    await tx.sellerContact.deleteMany({ where: { brokerId: userId } }); tablesAffected++;

    // === Phase 3: REASSIGN to SYSTEM_DELETED ===
    await tx.commission.updateMany({
      where: { brokerId: userId },
      data: { brokerId: SYSTEM },
    }); tablesAffected++;
    await tx.brokerPayout.updateMany({
      where: { brokerId: userId },
      data: { brokerId: SYSTEM },
    }); tablesAffected++;
    await tx.partnerActivity.updateMany({
      where: { userId },
      data: { userId: SYSTEM },
    }); tablesAffected++;
    await tx.damageReport.updateMany({
      where: { reportedById: userId },
      data: { reportedById: SYSTEM },
    }); tablesAffected++;

    // === Phase 4: ANONYMIZE legal records ===
    await tx.contract.updateMany({
      where: { brokerId: userId },
      data: {
        brokerId: SYSTEM,
        brokerSignature: null,
      },
    }); tablesAffected++;

    await tx.order.updateMany({
      where: { buyerId: userId },
      data: {
        buyerId: SYSTEM,
        deliveryName: "Smazaný uživatel",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: "",
        deliveryCity: "",
        deliveryZip: "",
        note: null,
      },
    }); tablesAffected++;

    await tx.investment.updateMany({
      where: { investorId: userId },
      data: { investorId: SYSTEM },
    }); tablesAffected++;

    // === Phase 5: User row anonymize (NEMAZAT — keep id pro FK) ===
    await tx.user.update({
      where: { id: userId },
      data: {
        email: anonEmail(userId),
        phone: null,
        passwordHash: "",
        firstName: "Smazaný",
        lastName: "uživatel",
        avatar: null,
        bio: null,
        slug: null,
        bankAccount: null,
        documents: null,
        ico: null,
        companyName: null,
        logo: null,
        specializations: null,
        cities: null,
        brokerSignature: null,
        brokerContractUrl: null,
        status: "INACTIVE",
        deletedAt: new Date(),
        erasureRequestedAt: null,
        erasureScheduledAt: null,
      },
    }); tablesAffected++;
  }, { timeout: 30000 });

  await logAudit({
    action: "ERASURE_EXECUTED",
    userId,
    actorId,
    entityType: "User",
    entityId: userId,
    metadata: { tablesAffected, executedAt: new Date() },
    request,
  });

  return { success: true, tablesAffected };
}
