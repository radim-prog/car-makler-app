import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { requestErasure } from "@/lib/erasure";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const userName = session.user.name || session.user.email;

    const result = await requestErasure({
      userId: session.user.id,
      request,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          blockers: result.blockers,
        },
        { status: 409 }
      );
    }

    // Notifikace adminům (parallel side-effect — nepřerušit flow při selhání)
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ["ADMIN", "BACKOFFICE"] },
        status: "ACTIVE",
      },
      select: { id: true },
    });

    await Promise.allSettled(
      admins.map((admin) =>
        createNotification({
          userId: admin.id,
          type: "SYSTEM",
          title: "Žádost o smazání účtu (GDPR Art. 17)",
          body: `Uživatel ${userName} žádá o smazání účtu. Naplánováno na ${result.scheduledAt.toISOString().slice(0, 10)}.`,
          link: `/admin/users/${session.user.id}`,
        })
      )
    );

    return NextResponse.json({
      message: `Žádost o smazání přijata. Účet bude smazán ${result.scheduledAt.toISOString().slice(0, 10)} (${result.coolingOffDays}-denní cooling-off). Do té doby můžete žádost zrušit.`,
      scheduledAt: result.scheduledAt,
      coolingOffDays: result.coolingOffDays,
    });
  } catch (error) {
    console.error("POST /api/settings/delete-account error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
