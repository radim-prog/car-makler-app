import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { extractClientInfo } from "@/lib/audit";

const schema = z.object({
  email: z.string().email("Neplatný email"),
  name: z.string().max(120).optional(),
  phone: z.string().max(40).optional(),
  role: z.enum(["INVESTOR", "DEALER", "BOTH"]).default("INVESTOR"),
  message: z.string().max(1000).optional(),
  source: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Neplatná data" },
        { status: 400 }
      );
    }

    const { email, name, phone, role, message, source } = parsed.data;
    const { ipAddress, userAgent } = extractClientInfo(request);

    // Upsert — re-signup jen obnoví poslední update
    await prisma.marketplaceWaitlist.upsert({
      where: { email },
      update: { name, phone, role, message, source },
      create: {
        email,
        name,
        phone,
        role,
        message,
        source,
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Děkujeme. Ozveme se, jakmile spustíme další vlnu.",
    });
  } catch (error) {
    console.error("POST /api/marketplace/waitlist error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru" },
      { status: 500 }
    );
  }
}
