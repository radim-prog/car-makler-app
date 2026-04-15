import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

const TOKEN_EXPIRY_HOURS = 24;

export type ListingConfirmResult =
  | { success: true; email: string; activatedListings: number }
  | { success: false; error: string };

/**
 * FIX-017 (Volba C): Odešle anonymnímu inzerentovi magic link na potvrzení e-mailu.
 * Reuse `EmailVerificationToken` modelu (žádná migrace), po confirm se zaktivuje user
 * + publikují všechny jeho DRAFT listings.
 */
export async function sendListingConfirmEmail(params: {
  email: string;
  firstName: string;
  listingTitle: string;
}): Promise<{ success: boolean; token?: string; error?: string }> {
  const { email, firstName, listingTitle } = params;

  // Invalidovat staré tokeny pro tento e-mail
  await prisma.emailVerificationToken.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRY_HOURS);

  await prisma.emailVerificationToken.create({
    data: { email, token, expiresAt },
  });

  const baseUrl = process.env.NEXTAUTH_URL || "https://carmakler.cz";
  const confirmUrl = `${baseUrl}/inzerce/potvrdit/${token}`;

  const result = await sendEmail({
    to: email,
    subject: "Potvrď inzerát — CarMakléř",
    html: `
      <div style="font-family: 'Outfit', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; padding: 16px 0 32px;">
          <img src="${baseUrl}/brand/logo-dark.png" alt="CarMakléř" height="40" />
        </div>
        <h1 style="font-size: 24px; color: #18181B; margin-bottom: 12px;">Dobrý den, ${firstName}!</h1>
        <p style="font-size: 16px; color: #52525B; line-height: 1.6;">
          Tvůj inzerát <strong>${listingTitle}</strong> jsme uložili jako koncept.
          Pro zveřejnění klikni na potvrzovací tlačítko níže — ověříme tím, že e-mail patří tobě.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${confirmUrl}" style="display: inline-block; background: linear-gradient(135deg, #F97316 0%, #EA580C 100%); color: white; padding: 14px 32px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Zveřejnit inzerát
          </a>
        </div>
        <p style="font-size: 14px; color: #71717A; line-height: 1.6;">
          Odkaz je platný 24 hodin. Pokud jsi inzerát nezadával(a) ty, e-mail prostě ignoruj — nic se nestane.
        </p>
        <p style="font-size: 14px; color: #71717A; line-height: 1.6;">
          Po potvrzení tě uvidí kupující a budeš dostávat poptávky přímo na e-mail. Pro správu inzerátů si můžeš nastavit heslo přes „Zapomenuté heslo".
        </p>
        <hr style="border: none; border-top: 1px solid #E4E4E7; margin: 32px 0;" />
        <p style="font-size: 12px; color: #A1A1AA; text-align: center;">
          CarMakléř s.r.o. | <a href="${baseUrl}" style="color: #F97316;">carmakler.cz</a>
        </p>
      </div>
    `,
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, token };
}

/**
 * Verifikuje token z magic linku, aktivuje user-a a publikuje všechny jeho DRAFT inzeráty.
 */
export async function confirmListingByToken(token: string): Promise<ListingConfirmResult> {
  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record) return { success: false, error: "Neplatný odkaz" };
  if (record.used) return { success: false, error: "Odkaz již byl použit" };
  if (record.expiresAt < new Date()) {
    return { success: false, error: "Odkaz vypršel — vytvoř inzerát znovu, pošleme nový." };
  }

  // Atomický update v transakci
  const result = await prisma.$transaction(async (tx) => {
    await tx.emailVerificationToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    const user = await tx.user.findUnique({ where: { email: record.email } });
    if (!user) return { activatedListings: 0 };

    await tx.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        status: "ACTIVE",
      },
    });

    // Publikuj všechny DRAFT inzeráty patřící tomuto user-ovi
    const publishResult = await tx.listing.updateMany({
      where: { userId: user.id, status: "DRAFT" },
      data: { status: "ACTIVE", publishedAt: new Date() },
    });

    return { activatedListings: publishResult.count };
  });

  return {
    success: true,
    email: record.email,
    activatedListings: result.activatedListings,
  };
}
