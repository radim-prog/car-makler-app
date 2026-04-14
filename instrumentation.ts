export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");

    const { prisma } = await import("./lib/prisma");

    const shutdown = async (signal: string) => {
      console.log(`[shutdown] ${signal} received, disconnecting Prisma...`);
      try {
        await prisma.$disconnect();
        console.log("[shutdown] Prisma disconnected");
      } catch (err) {
        console.error("[shutdown] Prisma disconnect failed:", err);
      }
    };

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: { digest?: string } & Error,
  request: {
    path: string;
    method: string;
    headers: Record<string, string>;
  },
  context: { routerKind: string; routePath: string; routeType: string; renderSource: string }
) => {
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(err, request, context);
};
