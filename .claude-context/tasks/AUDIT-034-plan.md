# AUDIT-034 — Plán: Integration test suite pro car.zajcon.cz

**Datum:** 2026-04-15
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (launch-readiness gate sandbox → „demonstrable complete")
**Odhadovaná práce:** 3-4 dny
**Depends on:** nic (infra existuje)
**Navazuje:** AUDIT-033 (budoucí prod deploy), AUDIT-024 verify (GDPR E2E)

---

## 0) Kontext & stav

**Nový cíl launch-readiness** (team-lead 2026-04-15): `car.zajcon.cz` = „demonstrable complete" Milestone 1. Produkční deploy (`carmakler.cz`) je Milestone 2, odloženo.

**Pro M1 potřebujeme integration test suite:**
- Zajistí že commit → sandbox deploy neprodukuje regrese
- Dokumentuje funkční kompletnost 4 produktů (makléř, inzerce, eshop, marketplace)
- Pokrývá GDPR/security edge cases (AUDIT-024, AUDIT-027)
- Běží nightly na deployed sandbox + per-PR v CI

**Existující infrastruktura:**
- `playwright.config.ts` — projects: chromium + mobile iPhone 14, webServer `npm run dev`, CI mode github reporter
- `e2e/` adresář (10 spec souborů): `auth`, `catalog`, `comprehensive-batch-test`, `contact`, `headed-all-flows`, `homepage`, `chrome-test-147-extras`, `listing`, `order-tracker`, `parts-wholesale`
- `.github/workflows/ci.yml` — 4 joby: lint, typecheck, unit test (Vitest), build (žádný E2E dnes)
- `vitest` + `@testing-library/react` installed, žádné unit testy v repu (TBD grep)

**Gap:**
- E2E v CI neběží (žádný Playwright job)
- Žádný nightly run na deployed sandbox
- Chybí coverage: GDPR erasure flow, admin approval, broker PWA camera, Stripe Connect (post-AUDIT-014), Wedos SMTP fallback, waitlist gate, Permissions-Policy header check
- Žádný visual regression (screenshot diff)
- Unit testy chybí úplně (jen knihovna `vitest` bez testů)

## 1) Cíle

1. **Smoke suite** — 16/16 rout, 200 OK, přes `car.zajcon.cz` (nightly)
2. **Critical flow coverage** — 12 P0 flowů (auth, GDPR export/erasure, vehicle listing, contact form, marketplace waitlist, eshop košík, broker PWA foto, atd.)
3. **Security header asserts** — CSP, Permissions-Policy, HSTS, Referrer-Policy na každém requestu
4. **Unit test baseline** — `lib/` coverage ≥ 40% (gdpr/contact, email provider factory, prisma helpers)
5. **Visual regression** — 20 klíčových screenů (homepage, B2B LPs, pitch deck preview, PWA dashboard, admin)
6. **CI gating** — PR nemůže merge bez green E2E suite (kromě `skip-e2e` label pro docs-only)
7. **Nightly run** — cron 03:00 CEST, alert on fail (e-mail přes Resend)

## 2) Task breakdown

### Fáze 1 — Audit existing E2E + cleanup (plánovač review, ~3h)

| ID | Task | Effort |
|----|------|--------|
| T-034-001 | Review 10 existujících spec souborů — identifikuj dead tests, outdated selectory, obsolete rout | 1h |
| T-034-002 | Klasifikace: KEEP (robust, relevant), FIX (broken selectors), DELETE (out-of-scope), EXTEND (rozšířit scope) | 30min |
| T-034-003 | Mapping matrix: spec → flow → current coverage gap | 1h |
| T-034-004 | Dokumentace `e2e/README.md` s file organization konvencí (per-route folder, shared fixtures) | 30min |

### Fáze 2 — Test infrastructure (~5h)

| ID | Task | Effort |
|----|------|--------|
| T-034-005 | `e2e/fixtures/auth.ts` — login helpers pro 11 rolí (ADMIN, BACKOFFICE, BROKER, INVESTOR, atd.) | 1.5h |
| T-034-006 | `e2e/fixtures/db-seed.ts` — seed test vehicles, users, listings před test run (cleanup after) | 1.5h |
| T-034-007 | `e2e/helpers/security-headers.ts` — helper pro assertion všech security hlaviček | 30min |
| T-034-008 | `e2e/helpers/visual.ts` — screenshot helper s snapshot dir `e2e/screenshots/{chromium,mobile}` | 45min |
| T-034-009 | Update `playwright.config.ts` — add `sandbox` project pointing na `https://car.zajcon.cz`, env-driven `PLAYWRIGHT_BASE_URL` | 30min |
| T-034-010 | Separate projects: `local` (npm run dev), `sandbox` (car.zajcon.cz remote), `visual` (screenshot tests only) | 30min |

### Fáze 3 — Critical flow specs (~10h)

Prioritized po P0/P1/P2:

**P0 — bez čehoho nelze launch:**

| ID | Spec | Flow | Effort |
|----|------|------|--------|
| T-034-011 | `e2e/auth/16-route-matrix.spec.ts` | 16 rout matrix z FIX-005 (ADMIN/BROKER/anon access) | 1h |
| T-034-012 | `e2e/gdpr/export-art15.spec.ts` | Art. 15 data export: login → /settings/privacy → request export → e-mail s JSON/CSV | 1.5h |
| T-034-013 | `e2e/gdpr/erasure-art17.spec.ts` | Art. 17 erasure: request → 7-day cooling-off banner → cancel / wait / cron trigger → SYSTEM_DELETED | 2h |
| T-034-014 | `e2e/security/headers.spec.ts` | CSP + Permissions-Policy (AUDIT-027) + HSTS + Referrer-Policy na 5 rout | 45min |
| T-034-015 | `e2e/broker/vehicle-listing.spec.ts` | Broker login → /makler/vehicles/new → VIN → photo upload → save → status=DRAFT | 1.5h |
| T-034-016 | `e2e/marketplace/waitlist-gate.spec.ts` | Anon visit /marketplace → blocked + waitlist form → submit → e-mail confirmation | 1h |

**P1 — core UX:**

| ID | Spec | Flow | Effort |
|----|------|------|--------|
| T-034-017 | `e2e/public/landing-to-contact.spec.ts` | Homepage → scroll → CTA → /kontakt → form submit | 1h |
| T-034-018 | `e2e/public/b2b-landing.spec.ts` | /pro-bazary, /pro-autickare, /pro-investory — hero, CTA, ROI kalkulačka fungují | 1.5h |
| T-034-019 | `e2e/eshop/catalog-to-cart.spec.ts` | /dily → search VIN → add to cart → checkout → order created | 1.5h |
| T-034-020 | `e2e/admin/approve-vehicle.spec.ts` | ADMIN login → /admin/vehicles → approve DRAFT → status=PUBLISHED | 1h |
| T-034-021 | `e2e/admin/gdpr-approval.spec.ts` | ADMIN → /admin/gdpr-requests → approve erasure → audit log zapsán | 1h |
| T-034-022 | `e2e/email/wedos-fallback.spec.ts` | Set EMAIL_PROVIDER=wedos env → trigger test e-mail → check sent via Wedos (mock SMTP) | 1.5h |

**P2 — nice-to-have:**

| ID | Spec | Flow | Effort |
|----|------|------|--------|
| T-034-023 | `e2e/pwa/offline-sync.spec.ts` | Broker PWA offline → create draft → online → background sync submits | 2h |
| T-034-024 | `e2e/pwa/camera-permission.spec.ts` | Permissions-Policy `camera=(self)` allows `getUserMedia` without SecurityError | 45min |
| T-034-025 | `e2e/notifications/push.spec.ts` | Broker subscribe → admin approves vehicle → push received | 2h |
| T-034-026 | `e2e/pitch-deck/generate.spec.ts` | POST /api/pitch-deck/generate → URL → PDF má 10 stránek, size < 2 MB (post-AUDIT-029) | 1h |

### Fáze 4 — Unit test baseline (~6h)

| ID | Target | Effort |
|----|--------|--------|
| T-034-027 | `lib/gdpr/contact.ts` — `getGdprContactEmail()` helper unit test | 15min |
| T-034-028 | `lib/email/provider.ts` — `getEmailProvider()` auto-detect logika (všech 5 větví) | 1h |
| T-034-029 | `lib/email/wedos.ts` — transport config, retry on rate limit, htmlToText fallback | 1.5h |
| T-034-030 | `lib/audit-log.ts` — `logAuditEvent()` helper + FK handling na SYSTEM_DELETED | 1h |
| T-034-031 | `lib/prisma.ts` — singleton pattern, graceful disconnect | 30min |
| T-034-032 | `lib/vin/decode.ts` — NHTSA fallback logic, normalization | 45min |
| T-034-033 | `lib/price.ts` — Czech crown formatting, provize calc 5% (min 25 000 Kč) | 30min |
| T-034-034 | `lib/validation/*.ts` — všechny Zod schemata regression testy (invalid inputs) | 1h |

### Fáze 5 — Visual regression (~4h)

| ID | Task | Effort |
|----|------|--------|
| T-034-035 | Baseline screenshoty 20 screenů (homepage desktop/mobile, B2B LPs, pitch deck, PWA, admin) v `e2e/screenshots/baseline/` | 2h |
| T-034-036 | `e2e/visual/homepage.spec.ts` + `e2e/visual/b2b-lps.spec.ts` — Playwright `toHaveScreenshot()` s threshold 0.2% | 1h |
| T-034-037 | Update `.gitignore`: NE ignorovat `e2e/screenshots/baseline/`, ale ignorovat `e2e/screenshots/diff/` + `test-results/` | 15min |
| T-034-038 | CI artifact upload při fail: diff screenshots → Actions artifact | 45min |

### Fáze 6 — CI/CD integrace (~3h)

| ID | Task | Effort |
|----|------|--------|
| T-034-039 | Nový CI job `e2e-local` v `.github/workflows/ci.yml` — spustí Playwright chromium + mobile proti `npm run dev` v CI | 1h |
| T-034-040 | Nová CI job `e2e-visual` — visual regression na homepage + B2B LPs (separate kvůli runtime) | 30min |
| T-034-041 | Update `build` job: `needs: [lint, typecheck, test, e2e-local]` | 15min |
| T-034-042 | Nový workflow `.github/workflows/nightly.yml` — cron 03:00 CEST, spustí Playwright proti `car.zajcon.cz` + e-mail notifikace fail (Resend API) | 1.5h |

### Fáze 7 — Monitoring + reporting (~2h)

| ID | Task | Effort |
|----|------|--------|
| T-034-043 | Playwright `html` report upload do CI artifacts (trvá 30 dní) | 30min |
| T-034-044 | README badge: CI status, nightly status, E2E pass rate | 30min |
| T-034-045 | Slack webhook alert (pokud dostupné) — nightly fail → Slack channel | 1h |

## 3) Směrnice pro test design

### 3.1 Selector strategy

**Preferovaný:** `data-testid="brand-logo"` nad text matchem (odolné proti copy změnám)

**Přijatelný fallback:** `getByRole()` + accessible name (sémantický, odolnější než CSS selectors)

**Zakázaný:** hardcoded CSS selectory typu `.css-1abc2def` (Tailwind JIT + migrace tříd rozbijí)

### 3.2 Flaky test prevention

- **Žádné `page.waitForTimeout()`** — používej `expect().toBeVisible()` nebo `waitForResponse()`
- **Retry 2× v CI**, 0× lokálně (chyba musí být reprodukovatelná)
- **Cleanup po testu** — DB seed fixture `test.afterEach` mazání test dat
- **Isolované test data** — každý test vytvoří vlastní uživatele `test-${Date.now()}@e2e.local`

### 3.3 Test data management

**Strategie:** **Per-test isolated seed** (žádný shared fixture state).

**Důvody:**
- Paralelizace: `fullyParallel: true` v playwright config → shared state = race condition
- Debugovatelnost: fail test může být spuštěn samostatně bez závislosti
- Cleanup: `beforeEach` create, `afterEach` delete

**Helper `e2e/fixtures/db-seed.ts`:**

```ts
export async function createTestUser(role: UserRole = 'BROKER') {
  const email = `test-${role.toLowerCase()}-${Date.now()}@e2e.local`;
  return await prisma.user.create({
    data: { email, name: 'E2E Test', role, passwordHash: await hash('test123') },
  });
}

export async function cleanupTestUsers() {
  await prisma.user.deleteMany({ where: { email: { endsWith: '@e2e.local' } } });
}
```

### 3.4 Sandbox vs local baseURL

```ts
// playwright.config.ts (nový layout)
projects: [
  { name: 'local-chromium', use: { baseURL: 'http://localhost:3000', ...devices['Desktop Chrome'] } },
  { name: 'local-mobile', use: { baseURL: 'http://localhost:3000', ...devices['iPhone 14'] } },
  { name: 'sandbox-chromium', use: { baseURL: 'https://car.zajcon.cz', ...devices['Desktop Chrome'] } },
  { name: 'visual', use: { baseURL: 'http://localhost:3000', ...devices['Desktop Chrome'] }, testMatch: /visual/ },
]
```

**Commands:**
- `npm run test:e2e` → default (local)
- `npm run test:e2e:sandbox` → `npx playwright test --project=sandbox-chromium`
- `npm run test:e2e:visual` → `npx playwright test --project=visual`

### 3.5 Timeouts

- **Default test timeout:** 30s (generous pro slow sandbox)
- **Navigation timeout:** 15s
- **Action timeout:** 10s (click, fill)
- **Global timeout:** 30 min pro celou suite (prevence zaseknutých CI runů)

## 4) Acceptance criteria

### Test coverage

- [ ] Všechny P0 spec files (6×) existují a passing
- [ ] Všechny P1 spec files (6×) existují a passing
- [ ] Unit test coverage ≥ 40% v `lib/` (vitest `--coverage`)
- [ ] Visual regression baseline pro 20 screenů

### Quality

- [ ] 0 flaky testů (3 po sobě jdoucí green runs před merge)
- [ ] Žádný `page.waitForTimeout()` v kódu (grep blockuje v CI)
- [ ] Test execution time ≤ 10 min (local), ≤ 20 min (CI sandbox)

### CI/CD

- [ ] `e2e-local` job blokuje PR merge pokud red
- [ ] `nightly.yml` běží 03:00 CEST, e-mail alert na fail
- [ ] Playwright HTML report v CI artifacts (retention 30 dní)
- [ ] README badges: CI, nightly, E2E pass rate

### Docs

- [ ] `e2e/README.md` s konvencemi, quick start, debugging
- [ ] `LAUNCH-CHECKLIST.md` update: all P0 flows covered

## 5) Risks & mitigation

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R1 | E2E testy pomalé → CI time 30+ min blokuje dev | Medium | Parallel projects (chromium+mobile), sharding, cache Playwright browsers |
| R2 | Sandbox flakiness (network, deploy race) → nightly falešné poplachy | Medium | Retry 3× v nightly, fail only after 3 retries |
| R3 | Visual regression false positives (font anti-alias, subpixel) | Medium | Threshold 0.2%, mask dynamic regions (date, random IDs), disable animations |
| R4 | Test DB cleanup selže → prod-like sandbox se zanese testovacími účty | Low | `afterAll` suite cleanup + týdenní `DELETE WHERE email LIKE '%@e2e.local'` cron |
| R5 | Playwright version upgrades break tests | Low | Pin exact version v package.json, upgrade per AUDIT cycle |
| R6 | CI secrets leak (SEED_ADMIN_PASSWORD v nightly logs) | High | GitHub Actions secrets, `::add-mask::` pro dynamic values |
| R7 | Sandbox login rate limits — E2E běžně generuje login | Low | Extend rate limit whitelist pro `e2e-runner@carmakler.cz` IP |
| R8 | E2E disrupts manuální testing (data noise) | Low | Namespace `@e2e.local` domain, separátní DB schema pro CI (optional) |

## 6) Out of scope

- ❌ **Load testing** — patří do AUDIT-001 (autocannon/k6)
- ❌ **Security scanning** (OWASP ZAP) — AUDIT-002 scope
- ❌ **Accessibility audit** (axe-core) — AUDIT-036 (budoucí backlog task)
- ❌ **Contract testing API** (Pact) — post-MVP
- ❌ **Fuzz testing** — post-MVP
- ❌ **Mutation testing** (Stryker) — post-MVP
- ❌ **Real-device testing** (BrowserStack) — Chrome desktop + iPhone 14 emulace stačí pro MVP

## 7) Interakce s ostatními AUDITy

- **AUDIT-024 GDPR erasure:** T-034-013 E2E spec pokrývá cooling-off flow
- **AUDIT-027 Permissions-Policy:** T-034-014 security headers spec
- **AUDIT-028 ekosystém LP:** T-034-018 B2B landing spec + T-034-036 visual regression
- **AUDIT-029 Pitch Deck:** T-034-026 generate + validate PDF spec (post-029 implementace)
- **AUDIT-031 Wedos SMTP:** T-034-022 fallback spec
- **AUDIT-003 pm2 ecosystem:** SIGTERM graceful shutdown test (budoucí T-034-046, pokud relevant)

## 8) Execution sequencing

**Optimální pořadí pro implementátora:**

1. **Fáze 1** (audit existing) → **Fáze 2** (infrastructure) paralelně s dalšími AUDIT implementation
2. **Fáze 3 P0** (6 specs) — kritické pre-launch
3. **Fáze 6 CI integrace** — jakmile P0 green, blokuj regrese
4. **Fáze 3 P1** + **Fáze 4 unit testy** paralelně
5. **Fáze 5 visual** + **Fáze 3 P2** finale
6. **Fáze 7 monitoring** finalizace

**Paralelizace:** Fáze 3 P0 (6 specs) lze paralelně rozdělit 6 implementátor worktrees (každý spec samostatný soubor).

## 9) Post-completion maintenance

- **Každý nový AUDIT/FIX** — add/update relevant E2E spec (DoD v PR template)
- **Týdně** — review `test-results/` za nightly failures, triage
- **Měsíčně** — refresh visual baselines (pokud design tokens / copy změna)
- **Quarterly** — review test-to-production flow mapping

---

**Verdict plánovače:** AUDIT-034 je **vysoká páka pro M1 „demonstrable complete"** — bez E2E gate každý commit je risk regrese. 3-4 dny práce přinese 6 měsíců úspory v debuggingu + jistotu pro Radima při showcase. Fáze 1-3 (P0) je absolutní MVP minimum, zbytek iterativně přidávat.

**Kritický první krok:** T-034-001 (audit existing 10 specs) — pokud jsou tam zmrazené/broken, je potřeba nejdřív cleanup než stavba nového. Implementátor začíná tam.
