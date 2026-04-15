import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { logAudit } from "./audit";
import { rateLimit } from "./rate-limit";

function getHeader(headers: unknown, name: string): string | null {
  if (!headers || typeof headers !== "object") return null;

  if (headers instanceof Headers) {
    return headers.get(name);
  }

  const record = headers as Record<string, string | string[] | undefined>;
  const value = record[name] ?? record[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function getClientIp(headers: unknown): string {
  const forwardedFor = getHeader(headers, "x-forwarded-for");
  const realIp = getHeader(headers, "x-real-ip");
  return forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Heslo", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = credentials.email.trim().toLowerCase();
        const ip = getClientIp(request.headers);
        const loginLimit = rateLimit(`login:${ip}:${email}`, 10, 15 * 60 * 1000);

        if (!loginLimit.success) {
          await logAudit({
            action: "LOGIN_FAILED",
            metadata: { email, reason: "rate_limited", ip },
          });
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          await logAudit({
            action: "LOGIN_FAILED",
            metadata: { email, reason: "user_not_found" },
          });
          return null;
        }

        // F-017 hybrid: blokuj přihlášení pro anon DRAFT účty (passwordHash="" — vznikly přes magic-link flow)
        if (!user.passwordHash || user.passwordHash === "") {
          await logAudit({
            action: "LOGIN_FAILED",
            userId: user.id,
            metadata: { email, reason: "no_password_set" },
          });
          return null;
        }

        // Povolit přihlášení pro ACTIVE a ONBOARDING (makléři v onboarding procesu)
        if (user.status !== "ACTIVE" && user.status !== "ONBOARDING") {
          await logAudit({
            action: "LOGIN_FAILED",
            userId: user.id,
            metadata: { email, reason: `status_${user.status}` },
          });
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) {
          await logAudit({
            action: "LOGIN_FAILED",
            userId: user.id,
            metadata: { email, reason: "bad_password" },
          });
          return null;
        }

        await logAudit({
          action: "LOGIN_SUCCESS",
          userId: user.id,
          entityType: "User",
          entityId: user.id,
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          status: user.status,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar ?? null,
          accountType: user.accountType ?? null,
          onboardingStep: user.onboardingStep,
          onboardingCompleted: user.onboardingCompleted,
          isEmailVerified: !!user.emailVerified,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      // V HTTPS (produkce) NextAuth standard čte/zapisuje `__Secure-next-auth.session-token`,
      // middleware `getToken()` bez cookieName očekává totéž. V dev (HTTP) oba strany čtou `next-auth.session-token`.
      // Fixes F-013 (cookie name mismatch blokuje chráněné routy).
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NEXTAUTH_COOKIE_DOMAIN || undefined,
      },
    },
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.avatar = user.avatar;
        token.accountType = user.accountType;
        token.onboardingStep = user.onboardingStep;
        token.onboardingCompleted = user.onboardingCompleted;
        token.isEmailVerified = user.isEmailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "";
        session.user.status = (token.status as string) ?? "";
        session.user.firstName = (token.firstName as string) ?? "";
        session.user.lastName = (token.lastName as string) ?? "";
        session.user.avatar = (token.avatar as string | null) ?? null;
        session.user.accountType = (token.accountType as string | null) ?? null;
        session.user.onboardingStep = (token.onboardingStep as number) ?? 1;
        session.user.onboardingCompleted = (token.onboardingCompleted as boolean) ?? false;
        session.user.isEmailVerified = (token.isEmailVerified as boolean) ?? false;
      }
      return session;
    },
  },
};
