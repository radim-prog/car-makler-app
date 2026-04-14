import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cancelErasureRequest } from "@/lib/erasure";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Nepřihlášen" }, { status: 401 });
    }

    const result = await cancelErasureRequest({
      userId: session.user.id,
      request,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: "Žádost o smazání účtu byla zrušena.",
    });
  } catch (error) {
    console.error("POST /api/settings/erasure/cancel error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
