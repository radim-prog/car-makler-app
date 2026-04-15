# AUDIT-000 — Rozklad auditu (v4, finální)

**Datum:** 2026-04-14
**Verze:** v4 — po APPROVED radim-kontrolor s 3 podmínkami + Radimův paradigm shift
**Status:** APPROVED, full power. Plánovač + implementátor + kontrolor paralelně.

---

## Diff vs v3

1. **🔄 PARADIGM SHIFT (Radim přímo):** 4 produkty (makléř, inzerce, shop, marketplace) = **Radimův současný záměr**, NE scope drift. Stará matice SCOPE DRIFT / MISSING / KONZISTENTNÍ **zrušena**. Nová matice = HOTOVO / FIX NEEDED / CHYBÍ / ZBYTEČNÉ (viz §2).
2. **🆕 AUDIT-027 Permissions-Policy (P0, S)** — nový samostatný task, přidán **nad AUDIT-025**.
3. **AUDIT-016 rozšíření** o shipping pipeline (5 carrier integrací, webhook tracking, label generation, returns flow cross-link s AUDIT-014).
4. **AUDIT-001 potvrzeno** — plán obsahuje **live load test** (autocannon/k6 na sandboxu) jako acceptance podmínku.
5. **AUDIT-006, AUDIT-007a-d headers** — odstraněny SCOPE DRIFT bannery.
6. **Batch 1 kadence** — green light paralelně: AUDIT-001 / 003 / 024 / 007a-d.

**Celkem:** 30 tasků (bylo 29).

---

## 0) Recon & potvrzené fakty (aktualizováno)

**Technický stav (stabilní):**
- PG prod (`carmakler`) + sandbox (`carmakler_sandbox`). Pool max=5 × 1 pm2 fork = 5/100 conn = 5 % využití, obrovská rezerva.
- 43 h pm2 uptime, 0 unstable restarts. 71 historických restartů = deploy chaos, ne runtime.
- Upstream commit `99b6003` řeší jen build-time pool exhaustion (static generation), runtime latent bomb zůstává (`connectionTimeoutMillis: 0` default).
- Next 16.1.7 / React 19.2.3 / Prisma 7.5 bleeding edge lane.
- 53 Prisma modelů, 11 fresh migrací (2026-04-05 až 2026-04-12).
- Middleware 374 řádků — subdomain routing 4 produkty OK.
- Sandbox `car.zajcon.cz` živě, **bez Basic Auth** (odemčeno 2026-04-14).

**Produktová vize (Radim potvrzeno):**
- Carmakler = 4-produktový ekosystém pod jednou značkou:
  - **Makléřská síť** (`carmakler.cz`) — core, `_planning/` aligned
  - **Inzerce** (`inzerce.*`) — bezplatný Bazoš-like, NE paid
  - **Shop dílů** (`shop.*`) — katalogizace dle značky/modelu/roku + VIN, distributor AutoKelly/AP Partner (roadmap)
  - **Marketplace investic** (`marketplace.*`) — investor × „autíčkář", short-term flipping, 40/40/20 split, **regulatorně kritický**
- `_planning/` (říjen 2025) = zastaralá vize (jen 1. produkt + Firebase/Gemini/Raynet/Signi). Kód + CLAUDE.md = aktuální vize.

**Kritické findings (mimo routine audit):**
- **CSP Report-Only** (neblokující): Unsplash není **jen SW issue**, static HTML používá `photo-1606664515524-*` přímo. **Systémový** nález.
- **Perplexity CDN** (`r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2`) se objevuje v CSP log na produkci 2026-04-14 08:39 UTC. **Security flag** — neznámý 3rd party.
- **Sentry v10 deprecation** potvrzeno `next.config.ts:141-144`.
- **`turbopack: {}` × `next build --webpack`** rozpor v build configu.
- **`Permissions-Policy: camera=(), microphone=()`** blokne broker PWA foto → AUDIT-027.

---

## 1) Tasky — seznam (v4, 30 položek)

| # | Task | Priorita | Velikost | Depends on | Primární executor |
|---|------|:--------:|:--------:|------------|-------------------|
| AUDIT-001 | Prisma pool hardening + graceful shutdown + **live load test** | P1 | M | — | **Plánovač ✅ plan** → implementátor |
| AUDIT-002 | Bezpečnost: secrets, NextAuth, RBAC, CSRF, rate-limit, CSP enforcement | P0 | L | 001 | Plánovač→B |
| AUDIT-003 | Monitoring: Sentry v10 migration, CSP audit (Perplexity + Unsplash), pm2 ecosystem.config.js | P0 | M | 001 | **Plánovač → plan** |
| AUDIT-004 | Datový model: 53 modelů — vztahy, indexy, orphan rizika, soft-delete, N+1 | P0 | L | — | Plánovač→B |
| AUDIT-005 | Migrace + seeds + legacy SQLite backups + rollback strategie | P1 | S | 004 | Plánovač→B |
| AUDIT-006 | Kompletnost vs. Radimova vize — **nová 4-kategoriová matice** (§2) | P1 | M | — | Plánovač→B |
| AUDIT-007a | Kompletnost: **Makléřská síť** | P1 | M | 006 | **Plánovač ✅ plan** |
| AUDIT-007b | Kompletnost: **Inzerce** (bezplatný Bazoš-like) | P1 | M | 006 | **Plánovač ✅ plan** |
| AUDIT-007c | Kompletnost: **Shop dílů** (katalogizace + distributor API) | P1 | M | 006 | **Plánovač ✅ plan** |
| AUDIT-007d | Kompletnost: **Marketplace investic** (**🔴 regulatorní P0**) | P0 | L | 006 | **Plánovač ✅ plan** |
| AUDIT-008 | Middleware + **Access matrix** (11 rolí × 4 subdomény) + leak check | P0 | M | 002 | Plánovač→B |
| AUDIT-009 | `app/` struktura: route groups, duplicity, dead routes | P1 | M | 008 | Plánovač→B |
| AUDIT-010 | `lib/` moduly: coupling, dead code, duplicita | P1 | M | — | Plánovač→B |
| AUDIT-011 | TS strictness, ESLint, `any`/`@ts-ignore` hotspoty | P1 | S | — | Kontrolor |
| AUDIT-012 | Unit testy (Vitest) — pokrytí, passing | P1 | S | — | Kontrolor |
| AUDIT-013 | E2E (Playwright), 013c = sandbox smoke **bez Basic Auth** | P1 | M | sandbox ✅ | Kontrolor |
| AUDIT-014 | **Platby: Stripe + Connect + PCI DSS + SCA/3DS + DPH + faktury + refund + escrow** | P0 | L | 002 | Plánovač→B |
| AUDIT-015 | Upload pipeline: Cloudinary→Sharp migrace, security scan | P1 | M | — | Plánovač→B |
| AUDIT-016 | **Externí integrace + shipping pipeline** (5 carriers) — rozšířeno (§3) | P1 | M | — | Plánovač→B |
| AUDIT-017 | Branding & design systém: #F97316, Outfit, design-system.html | P2 | M | — | Designer |
| AUDIT-018 | SEO: sitemap (dynamic), robots, llms.txt, schema.org, `SeoContent` | P2 | M | 009 | Plánovač→B / marketolog |
| AUDIT-019 | A11y + CWV: Lighthouse, LCP/FID/CLS, bundle size | P2 | M | 013 | Kontrolor |
| AUDIT-020 | Build & deploy: `turbopack: {}` × `--webpack` rozpor, Vercel vs. pm2, CI/CD | P1 | S | — | Plánovač→B + kontrolor |
| AUDIT-021 | Backup & recovery (PG pg_dump cron), archivace SQLite legacy, RPO/RTO | P1 | S | 001, 004 | Plánovač→B |
| AUDIT-022 | Docs & on-ramp: knowledge-base, MASTER-PLAN, TASK-QUEUE.md | P2 | S | 006, 007a-d | Plánovač→B |
| AUDIT-024 | **GDPR / ZoKeS** (RoPA, Art. 15/17, DPA × 6, cookie consent, AuditLog, DPIA, DPO, SCCs) | P0 | L | 002, 014, 016 | **Plánovač → plan** |
| AUDIT-025 | **PWA offline + Service Worker** (Serwist, IDB, background sync, CSP) | P1 | M | 003, 008, 027 | Plánovač→B |
| AUDIT-026 | **Email deliverability + flows** (DKIM/SPF/DMARC, Resend, katalog) | P1 | M | 016 | Plánovač→B |
| **AUDIT-027** | **🆕 Permissions-Policy audit** (camera, geolocation, microphone → broker PWA) | P0 | S | — | Plánovač→B |
| AUDIT-023 | **SYNTHESIS** — verdikt, risk-map, roadmapa pro Radima | P0 | M | **vše ostatní** | Plánovač→B |

**Legenda:**
- **✅ plan** = plán hotový, čeká na implementátora / nebo halt
- **→ plan** = plánovač píše teď
- **→B** = bude psáno v režimu B když přijde na řadu

---

## 2) AUDIT-006 — Nová 4-kategoriová matice (nahradí v3 variantu)

**Za každou feature / oblast:**

| Oblast / feature | V kódu? | Očekáváno Radimem? | Verdikt | Poznámka / priorita fixu |
|---|:---:|:---:|---|---|
| Broker PWA onboarding 5 kroků | ✅ | ✅ | **HOTOVO** | — |
| Broker workflow UI 28 kroků | ⚠️ | ✅ | **FIX NEEDED** | JSON placeholder bez frontendu, AUDIT-007a |
| Inzerce auto-moderation | ✅ | ✅ | **HOTOVO** | — |
| Inzerce dynamic sitemap | ❌ | ✅ | **CHYBÍ** | SEO gap, AUDIT-007b |
| Shop distributor API | ❌ | ✅ | **CHYBÍ** | AutoKelly/AP Partner greenfield, AUDIT-007c post-launch |
| Shop Zásilkovna widget | ❌ | ✅ | **CHYBÍ** | 2h práce, AUDIT-007c |
| Marketplace deal pipeline | ✅ | ✅ | **HOTOVO** (technicky) | — |
| Marketplace KYC/AML | ❌ | ✅ (compliance) | **CHYBÍ** | P0 BLOCKER, AUDIT-007d |
| Marketplace escrow | ❌ | ✅ | **CHYBÍ** | P0 BLOCKER, AUDIT-007d |
| Cloudinary legacy | ✅ | ❌ (odpojit) | **ZBYTEČNÉ** (postupně vyřadit) | AUDIT-015 |
| Firebase Auth | ❌ | ❌ (pivot na NextAuth) | **NEROZDÍL** — `_planning/` stará vize | — |

**Vzor výstupu:** ~50 řádků, jedna položka = jedna feature. Priorita každého **CHYBÍ** nebo **FIX NEEDED** → Radimův rozhodovací vstup.

---

## 3) AUDIT-016 — Rozšíření scope (Podmínka 2)

**Stávající scope:** Cebia, ARES, Resend, SMS, Claude assistant, Mapy.cz, Pusher.

**Doplnit:**

1. **5 carrier shipping integrací** (status + stav):
   - Zásilkovna: widget frontend CHYBÍ, backend client MOCK (throw)
   - DPD: stub v `lib/shipping/carriers/dpd.ts`, real API CHYBÍ
   - PPL: stub, real API CHYBÍ
   - GLS: stub, real API CHYBÍ
   - Česká pošta: stub, real API CHYBÍ
   - V `.env.example` definovány klíče (dry-run mode defaulty OK)
2. **Webhook status** per carrier:
   - Tracking number update (webhook endpoint?)
   - Label PDF generation (stored kam? S3, /var/www/labels, Resend attach?)
   - Delivery confirmation (email trigger)
3. **Shipping calculator** — `lib/shipping/prices.ts` obsahuje fixní ceny dle metody. **Gap:** žádný dynamic price by weight/zone. Flag pro AUDIT-016-plan.
4. **Returns flow / reverzní zásilka**:
   - Customer iniciuje `ReturnRequest`
   - Shop vygeneruje return label (který carrier?)
   - Po doručení zpět → refund (cross-link AUDIT-014 refund webhook)
   - `ReturnRequest.status: RECEIVED` triggeruje Stripe refund
5. **Carrier liability** — pojištění zásilky, co když carrier ztratí? Support workflow.

**Výstup AUDIT-016:** per-carrier launch-readiness matrix (✅/⚠️/❌ per feature × 5 carriers).

---

## 4) AUDIT-027 — Permissions-Policy audit (NEW P0, S) — Podmínka 1

**Proč P0:** `next.config.ts` má `Permissions-Policy: camera=(), microphone=(), geolocation=(), ...` = **všechny Web APIs zakázány**. Broker PWA potřebuje kameru pro foto auta, geolokaci pro navigaci. Bez fixu = **core UX blocker** v terénu.

**Scope:**

1. **Audit current header** v `next.config.ts` — seznam všech `()` direktiv (camera, microphone, geolocation, payment, usb, magnetometer, accelerometer, gyroscope, ambient-light-sensor, battery, display-capture, document-domain, execution-while-not-rendered, execution-while-out-of-viewport, fullscreen, gamepad, hid, idle-detection, local-fonts, midi, otp-credentials, picture-in-picture, publickey-credentials-get, screen-wake-lock, serial, speaker-selection, sync-xhr, web-share, xr-spatial-tracking)
2. **Inventář používaných Web APIs:**
   - Broker PWA foto upload — `navigator.mediaDevices.getUserMedia({ video: true })` → **camera=(self)** nutné
   - Broker geolokace navigace (možná) — `navigator.geolocation.*` → **geolocation=(self)**
   - Parts PWA — kamera pro foto dílu → **camera=(self)**
   - Pusher / WebRTC? — nepoužíváme (Pusher je WebSocket)
   - Voice notes? — zatím ne, `microphone=()` zachovat
   - Stripe Payment Request API — **payment=(self)** pro Apple Pay / Google Pay
3. **Live prod test na sandboxu:**
   - Open `https://car.zajcon.cz/makler/vehicles/new` v mobile browseru (nebo Chrome DevTools → Devices → Pixel 5)
   - Kliknout „Přidat fotku" → triggeruje `getUserMedia({ video: true })`
   - Ověřit console: pokud `NotAllowedError: Permissions policy violation` → bug potvrzen
4. **Fix:**
   ```ts
   // next.config.ts
   "Permissions-Policy": [
     "camera=(self)",        // PWA foto
     "geolocation=(self)",   // PWA navigace
     "microphone=()",        // zatím nepoužívané
     "payment=(self)",       // Stripe Payment Request
     // ostatní: zachovat () pro security
   ].join(", ")
   ```
5. **Konzistentní cross-check** s `(self)` hodnotami v CSP (frame-src, form-action) — jednotný přístup.
6. **Následky pro AUDIT-025** (PWA): bez fixu AUDIT-027 nelze smysluplně testovat PWA foto workflow.

**Velikost:** S (1 soubor, ~15 řádků config diff, live test 10 min).

**Depends on:** — (self-contained). Nedbá na ostatní AUDIT.

**Executor:** plánovač → plán → implementátor může fixovat rovnou (micro-fix, FIX-LOG kandidát).

---

## 5) Batch pořadí (v4)

**Batch 1 — „launch readiness" (paralelně, now):**
- AUDIT-001 ✅ plan, implementátor může startovat
- AUDIT-003 → plánovač píše teď
- AUDIT-027 → plánovač píše teď (rychlé)
- AUDIT-024 GDPR → plánovač píše teď
- AUDIT-007a/b/c ✅ plans, čekají na Radimovy odpovědi
- AUDIT-007d ✅ plan, **HALT rekomendace**
- AUDIT-013c kontrolor sandbox smoke (probíhá)

**Batch 2 — „po launchi" / Radimův rozhodovací vstup:**
- AUDIT-002, AUDIT-004, AUDIT-008, AUDIT-020
- AUDIT-014 (platby)
- AUDIT-006 (matice)

**Batch 3 — polish & integrace:**
- AUDIT-005, AUDIT-009, AUDIT-010, AUDIT-011, AUDIT-012
- AUDIT-015, AUDIT-016 (rozšířeno), AUDIT-025, AUDIT-026

**Batch 4 — quality & docs:**
- AUDIT-017, AUDIT-018, AUDIT-019, AUDIT-021, AUDIT-022

**Finále:**
- AUDIT-023 synthesis (agreguje 29 task výstupů)

---

## 6) Výstup — kam ukládat (beze změny)

- Detailní plán → `.claude-context/tasks/AUDIT-XXX-plan.md`
- Implementace / findings → `.claude-context/tasks/AUDIT-XXX-impl.md`
- QA → `.claude-context/tasks/AUDIT-XXX-qa.md`
- Fix rounds → `.claude-context/tasks/AUDIT-XXX-fix-N.md`
- Pre-recon → `.claude-context/tasks/AUDIT-XXX-recon-notes.md`
- Fix-as-you-go log → `.claude-context/tasks/FIX-LOG.md` (nové, radim-kontrolor vede)
- Go/no-go report → `.claude-context/tasks/GO-NO-GO-REPORT.md` (nové, radim-kontrolor vede)
- Synthesis → `.claude-context/tasks/AUDIT-023-synthesis.md`

---

**v4 hotov. APPROVED od Radima + radim-kontrolora, full power start.**
