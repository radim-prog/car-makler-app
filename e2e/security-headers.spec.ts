import { test, expect } from "@playwright/test";

/**
 * AUDIT-010 Phase 1 — Security headers verification (AUDIT-034 Ph2).
 *
 * Ověřuje:
 * - T-010-001: X-XSS-Protection ABSENT (deprecated, odstraněn)
 * - T-010-002: CSP obsahuje `upgrade-insecure-requests` + `report-uri /api/csp-report`
 * - T-010-007: Cache-Control matchers pro /_next/static (immutable), /sw.js (no-cache), /api (no-store)
 * - Legacy headers: HSTS 2y+preload+includeSubDomains, X-Frame-Options DENY,
 *   X-Content-Type-Options nosniff, Permissions-Policy camera=(self), No X-Powered-By
 *
 * Spustitelné proti libovolnému baseURL (PLAYWRIGHT_BASE_URL).
 */

test.describe("AUDIT-010 — Security headers", () => {
  test("homepage — HSTS 2y + preload + includeSubDomains", async ({ request }) => {
    const res = await request.get("/");
    const hsts = res.headers()["strict-transport-security"];
    expect(hsts).toBeTruthy();
    expect(hsts).toContain("max-age=63072000");
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });

  test("homepage — X-XSS-Protection ABSENT (T-010-001)", async ({ request }) => {
    const res = await request.get("/");
    expect(res.headers()["x-xss-protection"]).toBeUndefined();
  });

  test("homepage — X-Frame-Options DENY + X-Content-Type-Options nosniff", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.headers()["x-frame-options"]).toBe("DENY");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  });

  test("homepage — CSP obsahuje upgrade-insecure-requests + report-uri (T-010-002)", async ({
    request,
  }) => {
    const res = await request.get("/");
    const csp =
      res.headers()["content-security-policy-report-only"] ||
      res.headers()["content-security-policy"] ||
      "";
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).toContain("report-uri /api/csp-report");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
  });

  test("homepage — Permissions-Policy allows camera=(self) + deny unused sensors", async ({
    request,
  }) => {
    const res = await request.get("/");
    const pp = res.headers()["permissions-policy"] || "";
    expect(pp).toContain("camera=(self)");
    expect(pp).toContain("geolocation=(self)");
    expect(pp).toContain("payment=(self)");
    expect(pp).toContain("microphone=()");
    expect(pp).toContain("usb=()");
  });

  test("homepage — Referrer-Policy strict-origin-when-cross-origin", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });

  test("homepage — NO X-Powered-By header (information disclosure)", async ({
    request,
  }) => {
    const res = await request.get("/");
    expect(res.headers()["x-powered-by"]).toBeUndefined();
  });

  test("/sw.js — Cache-Control no-cache, no-store, must-revalidate (T-010-007 PWA)", async ({
    request,
  }) => {
    const res = await request.get("/sw.js");
    expect(res.status()).toBe(200);
    const cc = res.headers()["cache-control"] || "";
    expect(cc).toContain("no-cache");
    expect(cc).toContain("no-store");
    expect(cc).toContain("must-revalidate");
  });

  test("/_next/static/*.css — Cache-Control public, max-age=31536000, immutable (T-010-007)", async ({
    request,
    baseURL,
  }) => {
    // Extract real CSS path from homepage HTML
    const html = await (await request.get("/")).text();
    const match = html.match(/\/_next\/static\/[^"]+\.css/);
    test.skip(!match, "No /_next/static CSS found in homepage HTML");
    const cssPath = match![0];
    const res = await request.get(cssPath);
    expect(res.status()).toBe(200);
    const cc = res.headers()["cache-control"] || "";
    expect(cc).toContain("public");
    expect(cc).toContain("max-age=31536000");
    expect(cc).toContain("immutable");
  });

  test("/api/auth/session — Cache-Control no-store (T-010-007)", async ({ request }) => {
    const res = await request.get("/api/auth/session");
    const cc = res.headers()["cache-control"] || "";
    expect(cc).toContain("no-store");
  });
});
