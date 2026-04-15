# AUDIT-000 — Rozklad auditu (v2, schválený)

**Datum:** 2026-04-14
**Verze:** v2 (AUDIT-007 rozsekán na a/b/c/d, doplněny nálezy z pm2 log dumpu)
**Status:** SCHVÁLENO team-lead, čekající na schválení kontrolora (shoda s Radimovým zadáním)

**Diff vs v1:**
- AUDIT-007 → **AUDIT-007a/b/c/d** (4 pod-tasky per produkt)
- Doplněny konkrétní findings v AUDIT-003 (Sentry deprecation, CSP/SW Unsplash violation)
- AUDIT-001 potvrzen proti **PostgreSQL** (prod `carmakler` + sandbox `carmakler_sandbox`, SQLite `dev.db` jen legacy)
- Upstream `JevgOne/cmklv2` dostupný v **`/root/Projects/cmklv2`** (HEAD `99b6003`)
- AUDIT-013 poznámka: Playwright `httpCredentials` pro Basic Auth sandboxu

---

## 0) Recon — co víme po 10 min čtení struktury

**(Beze změny z v1, kompletní výčet viz `AUDIT-000-breakdown.md`.)**

Klíčové body:
- Next **16.1.7** (bleeding-edge), React **19.2.3**, Prisma **7.5** s **`@prisma/adapter-pg`** (potvrzeno: PostgreSQL).
- **53 Prisma modelů**, schema 1806 řádků, **11 fresh migrací** (2026-04-05 až 2026-04-12).
- **38+ API route skupin**, `app/(web)/` ~37 podsložek, 5 route groups + `app/prezentace/`.
- Middleware **374 řádků / 12 KB** — subdomain routing + auth + CSP.
- Sentry ve 3 configech, 11 Playwright spec, unit testy Vitest.
- **Cloudinary→Sharp migrace v half-state** (oboje koexistuje).
- Rozsáhlá dokumentace: `docs/knowledge-base/` (13 MD), `MASTER-PLAN.md` 22 KB, `CARMAKLER-FULL-SPEC.md`, `PLAN-VYVOJE.md`.
- `TASK-QUEUE.md` v rootu **276 KB** (neznámý artefakt — AUDIT-022).
- `carmakler-design-system.html` **93 KB** (living style guide — AUDIT-017).

**Potvrzené fakty od team-lead (2026-04-14):**
- **Prod DB = PostgreSQL** (`carmakler`), sandbox = `carmakler_sandbox`. SQLite `dev.db` v prod jsou legacy před migrací.
- **Commit `99b6003`** (`fix: prisma pool exhaustion during build`) je z 12. 4., **pm2 restarty začaly až po něm** → buď nestačí, nebo je jiný root cause.
- **Sentry DSN aktivní** v `/var/www/carmakler/.env`, eventy tečou do Sentry.
- **Sandbox `https://car.zajcon.cz` live** s Basic Auth.
- **Upstream `JevgOne/cmklv2`** cleklonován v `/root/Projects/cmklv2` (HEAD `99b6003`).

**Nové findings z pm2 log dumpu (doplňují AUDIT-003):**
1. **Sentry deprecation warnings (20+ per request):**
   - `autoInstrumentMiddleware`
   - `autoInstrumentAppDirectory`
   - `autoInstrumentServerFunctions`
   - → kolega používá starý Sentry API, musí přejít na `webpack.*` variantu (viz Sentry v9→v10 migration guide).
2. **CSP violation na `sw.js`:** `connect-src` blokuje `https://images.unsplash.com/photo-1494976388531-...`. Service Worker se snaží prefetchovat Unsplash obrázky, ale CSP whitelist to zakáže. Buď SW má hardcoded Unsplash URL (test data?), nebo CSP whitelist je nekompletní.

---

## 1) Tasky — seznam (v2)

| # | Task | Priorita | Velikost | Dependencies | Primární executor |
|---|------|:--------:|:--------:|--------------|-------------------|
| AUDIT-001 | Prisma pool + PG driver + restartový root cause (po `99b6003`) | P0 | M | — | Plánovač→B, kontrolor smoke |
| AUDIT-002 | Bezpečnost: secrets, auth/NextAuth, RBAC, middleware, CSRF, rate-limit, CSP | P0 | L | 001 | Plánovač→B |
| AUDIT-003 | Monitoring: Sentry funkční?, deprecation warnings fix, CSP/SW Unsplash violation, pm2 crash pattern | P0 | M | 001 | Kontrolor + plánovač→B |
| AUDIT-004 | Datový model: 53 Prisma modelů — review vztahů, indexů, orphan rizik, soft-delete, N+1 | P0 | L | — | Plánovač→B |
| AUDIT-005 | Migrace historie + seeds + `dev.db.backup-*` + strategie rollbacku | P1 | S | 004 | Plánovač→B |
| AUDIT-006 | Mapování `_planning/` vize → aktuální stav, scope drift | P1 | M | — | Plánovač→B |
| **AUDIT-007a** | **Kompletnost: Makléřská síť** (broker PWA, admin, onboarding, leady, smlouvy, provize) | P1 | M | 006 | Plánovač→B |
| **AUDIT-007b** | **Kompletnost: Inzerce** (`inzerce.carmakler.cz`, podání, feed import/export, favourites, watchdog, reservations) — **SCOPE DRIFT** | P1 | M | 006 | Plánovač→B |
| **AUDIT-007c** | **Kompletnost: E-shop dílů** (`shop.carmakler.cz`, parts katalog, PWA pro dodavatele, VIN search, košík, shipping, returns) — **SCOPE DRIFT** | P1 | M | 006 | Plánovač→B |
| **AUDIT-007d** | **Kompletnost: Marketplace investic** (`marketplace.carmakler.cz`, flip opportunities, investoři, dealer verifikace, 40/40/20 payouts) — **SCOPE DRIFT** | P1 | M | 006 | Plánovač→B |
| AUDIT-008 | `middleware.ts` 374 řádků — subdomain routing, auth gating, role redirects, security headers | P0 | M | 002 | Plánovač→B |
| AUDIT-009 | `app/` struktura: 5 route groups + `prezentace/` + `app/api/` po rolích — duplicity, dead routes | P1 | M | 008 | Plánovač→B |
| AUDIT-010 | `lib/` 45 modulů: coupling, dead code, duplicita, modulární čistota | P1 | M | — | Plánovač→B |
| AUDIT-011 | TS strictness, ESLint, `any`/`@ts-ignore` hotspoty, typecheck průchozí? | P1 | S | — | Kontrolor přímo |
| AUDIT-012 | Unit testy (Vitest): `__tests__/*`, pokrytí, zda projdou | P1 | S | — | Kontrolor přímo |
| AUDIT-013 | E2E (Playwright): 11 spec souborů — projdou na sandbox (Basic Auth přes `httpCredentials`)? pokrytí, chybějící testy | P1 | M | sandbox live ✅ | Kontrolor |
| AUDIT-014 | Platby: Stripe + Stripe-Connect split, webhooky, idempotence | P0 | L | 002 | Plánovač→B |
| AUDIT-015 | Upload pipeline: Cloudinary→Sharp migrace dokončená?, security scan uploadů | P1 | M | — | Plánovač→B |
| AUDIT-016 | Externí integrace: Cebia VIN, ARES, Resend, SMS, Claude assistant, Mapy.cz?, Pusher? | P1 | M | — | Plánovač→B |
| AUDIT-017 | Branding & design systém: #F97316, Outfit, `carmakler-design-system.html` (93 KB), mobile tier 1/2 | P2 | M | — | Plánovač→B / designer |
| AUDIT-018 | SEO: sitemap, robots, llms.txt, schema.org, meta, `SeoContent` model, parts SEO skript | P2 | M | 009 | Plánovač→B / marketolog |
| AUDIT-019 | A11y + CWV: Lighthouse, LCP/FID/CLS, bundle size | P2 | M | 013 | Kontrolor |
| AUDIT-020 | Build a deploy: `next build --webpack` (proč?), `vercel.json` vs. pm2, `.github/workflows/*` | P1 | S | — | Plánovač→B + kontrolor build |
| AUDIT-021 | Backup & recovery DB (PG), archivace `dev.db.backup-*` legacy, RPO/RTO | P1 | S | 001, 004 | Plánovač→B |
| AUDIT-022 | Docs & on-ramp: `docs/knowledge-base/*`, MASTER-PLAN.md, FULL-SPEC, PLAN-VYVOJE, `TASK-QUEUE.md` 276 KB (?), KONZULTANT.md | P2 | S | 006, 007a-d | Plánovač→B |
| **AUDIT-023** | **SYNTHESIS** — agregace, verdikt (opravy / rework / hybrid), risk-map, roadmapa | P0 | M | **všechny předchozí** | Plánovač→B |

**Celkem:** 26 tasků (bylo 23, +3 kvůli splitu 007a-d).

---

## 2) Detaily nově přidaných / změněných tasků

### AUDIT-001 — Prisma pool + PG driver (upřesněno)
- **Potvrzeno:** PG prod, PG sandbox, SQLite `dev.db` jen legacy.
- **Klíčové porovnání:** diff commit `99b6003` v `/root/Projects/cmklv2` vs. datum prvního pm2 restartu — pokud restarty začaly **po** `99b6003`, fix nestačí nebo přidal nový bug.
- **Zdroje (upřesněné):** `lib/prisma.ts` (singleton + `@prisma/adapter-pg`), `.env.example` (`DATABASE_URL` format), `prisma.config.ts`, `next.config.ts` (server externals Prisma?), runtime flags routů (`export const runtime = 'nodejs'` vs edge — edge nesmí Prisma).
- **Ověřovací příkazy (kontrolor):** `pm2 describe carmakler`, `pm2 env carmakler`, SQL `SELECT count(*) FROM pg_stat_activity WHERE datname='carmakler'`, `pgbouncer` existence.

### AUDIT-003 — Monitoring (doplněno)
- **Nové findings k potvrzení:**
  1. **Sentry deprecation warnings (4):** `autoInstrumentMiddleware`, `autoInstrumentAppDirectory`, `autoInstrumentServerFunctions`, (ověřit 4.) — migrace na `webpack.*` variantu Sentry v10 API. Zdroje: `sentry.client.config.ts`, `sentry.edge.config.ts`, `sentry.server.config.ts`, `instrumentation.ts`, `next.config.ts` (Sentry webpack plugin).
  2. **CSP violation `sw.js` → Unsplash:** buď SW má hardcoded test URL Unsplash (grep `unsplash` v `app/sw.ts` a `public/`), nebo CSP `connect-src` whitelist chybí `images.unsplash.com`. Rozhodnutí: pokud ty fetchy nejsou záměrné → **odstraň z SW**; pokud ano (jako placeholder) → rozšířit CSP v `next.config.ts` / `middleware.ts`.
- **Dodatečné zdroje:** `.claude-context/logs/prod-carmakler-*.log`, `.claude-context/logs/car-zajcon-*.log` (až je team-lead vyexportuje).
- **Executor:** Kontrolor (log agregace + grep stacktraces), plánovač→B (fix plán pro Sentry migration + CSP/SW dilema).

### AUDIT-007a — Makléřská síť (P1, M)
- **Proč samostatně:** `_planning/aplikace/` obsahuje původní plán pro CRM-jako-4.-app. Aktuální realita je integrovaný broker flow uvnitř monolitu.
- **Čemu odpovědět:**
  - Onboarding quiz (`lib/onboarding-quiz.ts`, `app/api/onboarding/*`) — pokrývá to, co `docs/knowledge-base/06-pwa-makleri.md` popisuje?
  - Lead management (`lib/lead-management.ts`, `app/api/leads/*`, `app/api/broker/*`) — plný workflow (nový lead → přijetí → kontakt → nabrat vůz → inzerát → prodej → provize)?
  - Smlouvy (`lib/contract-templates/`, `app/api/contracts/*`, PDF gen přes `jspdf`) — pokrývají standardní + reklamační typy?
  - Provize (`lib/commission-calculator.ts`, Prisma `Commission`, `BrokerPayout`) — sedí matematika s 5% / min. 25 000 Kč?
  - PWA (`app/(pwa)/makler/*`, `app/sw.ts`, Serwist config, `lib/offline/*`) — offline-first sync IndexedDB?
  - Regional hierarchy (Prisma `Region`, `Invitation` — makléř má MANAGER a REGIONAL_DIRECTOR?).
- **Zdroje (hlavní):** `docs/knowledge-base/02,03,04,06`, `_planning/aplikace/`, `_planning/README-aplikace-backup.md`, konkrétní files výše.
- **Očekávaný výstup:** MVP checklist + „missing work" estimate.

### AUDIT-007b — Inzerce (P1, M, **SCOPE DRIFT**)
- **Proč scope drift:** V původním `_planning/` inzertní platforma **není** zmíněna (vize byla makléřská síť + CRM + landing). V `CLAUDE.md` je to "2. produkt", a v kódu jsou rozsáhlé implementace (`app/(web)/inzerce/`, `app/(web)/bazar/`, `app/api/inzerce/*`, `app/api/listings/*`, `lib/listings.ts`, `listing-*.ts`).
- **Čemu odpovědět:**
  - Podání inzerátu (flow od registrace `ADVERTISER` role, upload fotek, VIN lookup, publish, platba/free tier?).
  - Správa inzerátů (`app/(web)/moje-inzeraty/`) — CRUD, foto edit, price reduction (Prisma `PriceReduction`).
  - Feed import (`lib/feed-import.ts`, `lib/listing-import.ts`, `FeedImportConfig/Log`) — odkud importujeme? Sauto XML? Custom?
  - Feed export (`lib/listing-export.ts`) — kam exportujeme?
  - Favourites (`Favorite`), Watchdog (`Watchdog`), Reservations (`Reservation`), SLA (`lib/listing-sla.ts`), Flagging (`lib/listing-flagging.ts`).
  - Subdomain `inzerce.carmakler.cz` middleware routing.
- **Očekávaný výstup:** MVP checklist + mapa feature-komplexity vs. plán („je to překrylečka Sauta nebo premium inzerce?").

### AUDIT-007c — E-shop dílů (P1, M, **SCOPE DRIFT**)
- **Proč scope drift:** Shop autodílů v `_planning/` **není** zmíněn, `CLAUDE.md` uvádí jako produkt 3. V kódu `app/(web)/shop/`, `app/(web)/dily/`, `app/(pwa-parts)/parts/`, `app/api/parts/*`, `app/api/orders/*`, `lib/parts-categories.ts`, `lib/shipping/`.
- **Čemu odpovědět:**
  - Parts katalog (hierarchie kategorií, VIN search, fulltext, filters).
  - PWA dodavatele (`app/(pwa-parts)/parts/*`) — nahrávání dílů, foto, cenotvorba, `PARTS_SUPPLIER` role.
  - Parts feed import (`lib/feed-import.ts` + `PartsFeedConfig/ImportLog`) — XML/CSV, mapping, cost tracking.
  - Košík + objednávka (`Order`, `OrderItem`, `ReturnRequest`), shipping (`lib/shipping/*` — kuriér, PPL, Zásilkovna?), returns (14-day).
  - Platba (Stripe — jednorázová platba, ne Connect split).
  - Subdomain `shop.carmakler.cz` routing.
- **Očekávaný výstup:** MVP checklist + odhad kolik je hotového vs. plán.

### AUDIT-007d — Marketplace investic (P1, M, **SCOPE DRIFT**)
- **Proč scope drift:** VIP Marketplace v `_planning/` **není** vůbec, `CLAUDE.md` popisuje jako VIP platformu. Citlivá oblast (investice, AML/KYC, firemní mechanika).
- **Čemu odpovědět:**
  - Flip opportunity lifecycle (`FlipOpportunity` model) — od submit dealerem po close.
  - Investment flow (`Investment` model) — kdo může investovat (`INVESTOR` role), KYC ověření, min částky.
  - Verifikace dealerů (`MarketplaceApplication`, `VERIFIED_DEALER` role) — workflow schválení.
  - 40/40/20 payout matematika — `SellerPayout`, `BrokerPayout`, `PartnerCommissionLog` — správná distribuce po prodeji.
  - Firemní entita — auto se kupuje na „firmu Carmakler". Kde se to v kódu projevuje (ARES lookup, fakturace, DPH)?
  - Subdomain `marketplace.carmakler.cz`.
  - Právní rizika: je to investice nebo půjčka? Potřebuje ČNB licenci? (AUDIT-023 synthesis to zmíní, ale nerozhoduje.)
- **Očekávaný výstup:** MVP checklist + **regulatorní flag** pro Radima.

### AUDIT-013 — E2E (upřesněno)
- **Sandbox:** `https://car.zajcon.cz` s Basic Auth. V `playwright.config.ts` přidat nebo ověřit:
  ```ts
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL,
    httpCredentials: {
      username: process.env.PLAYWRIGHT_HTTP_USER!,
      password: process.env.PLAYWRIGHT_HTTP_PASS!,
    }
  }
  ```
- Kontrolor najde konkrétní creds v `~/.claude/teams/carmakler-team/config.json`.

### AUDIT-023 — Synthesis (rozšířený rozsah)
- Bude agregovat **26 task výstupů**, ne 23.
- Doplněný scope drift matrix: kolik z 4 produktů bylo v původní vizi (AUDIT-007a) vs. kolik přibylo (007b-d). Pomůže Radimovi rozhodnout, jestli scope je pořád jeho záměr.

---

## 3) Doporučené pořadí batchů (v2)

**Batch 1 — akutní, hned (paralelně):**
- AUDIT-001 (DB pool — blokuje prod)
- AUDIT-003 (monitoring — ověří fix proti `99b6003`)
- AUDIT-011, AUDIT-012 (rychlé kontrolorské — běží samy)

**Batch 2 — jádro (paralelně po Batch 1):**
- AUDIT-002 (bezpečnost)
- AUDIT-008 (middleware)
- AUDIT-004 (data model)
- AUDIT-020 (build)

**Batch 3 — kompletnost & integrace (paralelně po Batch 2):**
- AUDIT-005, AUDIT-006
- AUDIT-007a, AUDIT-007b, AUDIT-007c, AUDIT-007d (4 paralelně, různé soubory — **možné i worktree**)
- AUDIT-013 (e2e, potřebuje sandbox)
- AUDIT-014, AUDIT-015, AUDIT-016

**Batch 4 — polish (paralelně):**
- AUDIT-009, AUDIT-010
- AUDIT-017, AUDIT-018, AUDIT-019
- AUDIT-021, AUDIT-022

**Finále:**
- AUDIT-023 synthesis

---

## 4) Otevřené otázky (zbývající)

Odpovědi od team-lead (2026-04-14) vyřešily 1-4 + split 007.

**Zbývá:**
- Potvrzení od **radim-kontrolora** (shoda s Radimovým zadáním).
- **Regulatorní rizika marketplace** (AUDIT-007d) — v synthesis jen flag, rozhodnutí patří Radimovi.

---

## 5) Výstup — kam ukládat (beze změny)

- Detailní plán → `.claude-context/tasks/AUDIT-XXX-plan.md`
- Implementace → `.claude-context/tasks/AUDIT-XXX-impl.md` (u auditu většinou „findings report")
- QA → `.claude-context/tasks/AUDIT-XXX-qa.md`
- Fix rounds → `.claude-context/tasks/AUDIT-XXX-fix-N.md`
- **Finální report** → `.claude-context/tasks/AUDIT-023-synthesis.md`
- **Logs sampling** → `.claude-context/logs/prod-carmakler-YYYY-MM-DD.log`, `car-zajcon-YYYY-MM-DD.log`
- **Secrets sample** (bez hodnot) → `.claude-context/secrets-sample.md`

---

**Plánovač → v2 připraven, čekám na schválení radim-kontrolora, pak jdu do režimu B na AUDIT-001.**
