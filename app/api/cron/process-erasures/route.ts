import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { executeErasure } from "@/lib/erasure";

/* ------------------------------------------------------------------ */
/*  GET /api/cron/process-erasures — F-032 GDPR Art. 17 worker        */
/*  Spouští se denně, zpracuje všechny erasure žádosti po cooling-off */
/* ------------------------------------------------------------------ */

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const due = await prisma.user.findMany({
      where: {
        erasureScheduledAt: { lte: now },
        deletedAt: null,
      },
      select: { id: true, email: true },
      take: 50, // safety cap per run
    });

    const results = {
      total: due.length,
      success: 0,
      blocked: 0,
      failed: 0,
      details: [] as Array<{ userId: string; status: string; error?: string }>,
    };

    for (const user of due) {
      const result = await executeErasure({
        userId: user.id,
        request,
      });

      if (result.success) {
        results.success++;
        results.details.push({ userId: user.id, status: "erased" });
      } else if (result.error?.includes("retenční překážka")) {
        results.blocked++;
        results.details.push({ userId: user.id, status: "blocked", error: result.error });
      } else {
        results.failed++;
        results.details.push({ userId: user.id, status: "failed", error: result.error });
      }
    }

    return NextResponse.json({ ok: true, ...results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("CRON process-erasures error:", message);
    return NextResponse.json({ error: "Interní chyba serveru" }, { status: 500 });
  }
}
