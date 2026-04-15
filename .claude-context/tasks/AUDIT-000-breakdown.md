# AUDIT-000 — Rozklad auditu kolegovy aplikace CarMakler (`cmklv2`)

**Datum:** 2026-04-14
**Autor:** Plánovač (team `carmakler-team`)
**Režim:** A — rozklad na tasky
**Cíl:** Systematický audit snapshotu, který na konci dá team-leadovi rozhodnutí **drobné opravy vs. zásadní rework**.
**Forma:** 23 AUDIT-XXX tasků. V této fázi NENÍ detailní plán — to přijde pro každý task v režimu B, až tě team-lead pošle s konkrétním AUDIT číslem.

---

## 0) Recon — co víme po 10 min čtení struktury

**Codebase signály (zdroje: `package.json`, `ls`, `wc -l`, `grep`, `git log`):**
- **Framework:** Next 16.1.7 (bleeding-edge; current GA je 15.x), React 19.2.3, TypeScript 5, Tailwind 4, Next --webpack build (ne turbopack — **důvod?**).
- **ORM:** Prisma **7.5** + `@prisma/adapter-pg` + `pg 8.20` — driver adapter na **PostgreSQL**, ne SQLite! Team-lead zmínil SQLite v prod — to je **konflikt**, nutno ověřit co sandbox/prod reálně provozuje (možná fallback `file:./dev.db` v `.env.example`, PG v produkci). Connection-pool exhaustion v commitu `99b6003` naznačuje, že to na něčem reálně běhá.
- **Auth:** NextAuth 4.24 + `@auth/prisma-adapter` + bcryptjs + password-reset + email-verification tokeny (Prisma modely existují).
- **Payments:** Stripe 20.4 + Stripe-Connect (knihovna `lib/stripe-connect.ts`, `stripe-connect-shared.ts`) — marketplace split payouts, sedí to s business modelem (makléř + partner + carmakler provize).
- **Obrázky:** Sharp 0.34 (lokální processing), Cloudinary klient ještě v `lib/cloudinary.ts` + migration skript `scripts/migrate-cloudinary.ts` → **migrace částečně dokončena**, obojí koexistuje.
- **AI:** `@anthropic-ai/sdk 0.80` (přechod z Gemini v planning docs → Claude v reálu), použito v `app/api/assistant/`, `app/api/ai` chybí → AI je jinde než v původní vizi.
- **PWA:** Serwist 9.5 (Service Worker), `idb 8.0`, ve struktuře `app/(pwa)/` a `app/(pwa-parts)/` — dvě oddělené PWA.
- **Monitoring:** Sentry 10.47 ve 3 configech (client, edge, server) + `instrumentation.ts`. Nasazeno, ale funkční?
- **Testy:** Vitest 4.1 (unit: `__tests__/lib`, `__tests__/validators`, `__tests__/middleware.test.ts`), Playwright 1.59 (e2e: 11 spec souborů včetně `comprehensive-batch-test.spec.ts`, `headed-all-flows.spec.ts`, `chrome-test-147-extras.spec.ts`).
- **Další:** Resend 6.9, jspdf 4.2, qrcode 1.5, framer-motion 12.38, zod 4, react-hook-form 7.71, dompurify pro XSS.

**Velikost systému:**
- **53 Prisma modelů** (`grep -c "^model " schema.prisma` = 53). Vysoké — mapuje 4 produkty + auth/platby/notifikace/audit. Schema 1806 řádků.
- **11 migrací** od 2026-04-05 do 2026-04-12 — celá historie je z posledních 10 dnů. Kolega **ne-inkrementálně přepsal schema** a udělal fresh migrations (`init` má datum `20260405065801`).
- **38+ API route skupin** v `app/api/` (admin, ares, assistant, auth, broker, buyer, cebia, contact, contracts, cron, csp-report, emails, escalations, favorites, feeds, invitations, inzerce, leads, listings, manager, marketplace, onboarding, orders, partner, partners, parts, payments, payouts, profile, reservations, revalidate, search, seller-notifications, sell-request, settings, sms, stripe, upload, uploads, vehicles, vin, watchdog) — per-role API (broker/buyer/manager/partner/admin), orchestrace subdomén, cron joby.
- **`app/(web)/` ~37 podsložek** — obrovská SEO plocha (chci-prodat, jak-prodat-auto, jak-to-funguje, kolik-stoji-moje-auto, obchodni-podminky, ochrana-osobnich-udaju, reklamacni-rad, zasady-cookies, a SEO landing pages per vozidlo/kategorie).
- **`app/prezentace/`** je samostatná route (ne v group) — co to je? Marketing/pitch deck?
- **`app/(partner)/`** — 5. route group, CLAUDE.md zmiňuje jen 4. Scope drift.
- **`lib/`** ~45 modulů (seo/, shipping/, pdf/, email-templates/, contract-templates/, validators/, hooks/, offline/, …). Separation-of-concerns vypadá disciplinovaně, ale velký povrch.
- **`middleware.ts` 374 řádků / 12 KB** — moc na middleware. Podezření: subdomain routing + auth gating + role-based redirects + security headers + CSP nonces v jednom souboru.
- **`TASK-QUEUE.md` v rootu má 276 KB** — obří. Podezření: historie tasků z doby kdy kolega neměl agent-command-center oddělený. Nebo export z jiného systému. Prozkoumat v AUDIT-022.
- **`MASTER-PLAN.md` 22 KB, `docs/CARMAKLER-FULL-SPEC.md`, `docs/PLAN-VYVOJE.md`, `docs/knowledge-base/` 13 tematických MD** — **extrémně bohatá dokumentace**. To je dobrá zpráva (máme kde porovnávat).

**Struktura `_planning/` (Radim, 12. 10. 2025):**
- Starší vize: 3 landing pages + CRM jako 4 samostatné Next.js apps (porty 3000-3003), Firebase auth, Raynet CRM, Gemini AI, Cebia, Signi eSign, Vercel deploy.
- Aktuální realita: 1 Next.js monorepo, NextAuth+Prisma, Claude API, Cebia zůstal, Signi zatím nevidět, pm2+VPS deploy místo Vercelu (tuto mikro-hypotézu ověřit v AUDIT-020).

**Git historie:**
- Pouze 2 commity — `Initial commit` a `Import cmklv2 snapshot`. **Žádná historie od kolegy v našem forku**, takže "commity 99b6003, 468ea55" existují v upstreamu `JevgOne/cmklv2`, ne lokálně — plánovač je číst NEMŮŽE. Budeme se muset spolehnout na to, co team-lead/kontrolor najde v GitHub API, nebo naklonovat upstream paralelně.

**Prioritní rámec:**
- **P0 — blokery provozu / bezpečnost / data** (musí se řešit nezávisle na rozhodnutí opravit/předělat)
- **P1 — kvalita, kompletnost, kvalita kódu** (bude potřeba v obou scénářích, ale dá se odložit o dny)
- **P2 — nice-to-have, UX polish, dokumentace** (jen pokud jdeme cestou oprav)

**Velikostní škála:** S = <2h čtení+analýza, M = 2-5h (obsáhlá oblast), L = 5+h (celý subsystém nebo vyžaduje smoke test v sandboxu).

---

## 1) Tasky — seznam

| # | Task | Priorita | Velikost | Dependencies | Primární executor |
|---|------|:--------:|:--------:|--------------|-------------------|
| AUDIT-001 | Prisma DB driver + connection pool + SQLite vs Postgres (root cause 71 restartů) | P0 | M | — | Plánovač→B, kontrolor smoke |
| AUDIT-002 | Bezpečnost: secrets, auth/NextAuth, RBAC, middleware, CSRF, rate-limit, CSP | P0 | L | AUDIT-001 (sdílí middleware) | Plánovač→B |
| AUDIT-003 | Produkční monitoring: Sentry funkční?, pm2 log root cause, crash pattern | P0 | M | AUDIT-001 | Kontrolor přímo (logs + curl) |
| AUDIT-004 | Datový model: 53 Prisma modelů — review vztahů, indexů, orphan rizik, soft-delete, N+1 | P0 | L | — | Plánovač→B |
| AUDIT-005 | Migrace historie + seeds + `dev.db.backup-*` + strategie rollbacku | P1 | S | AUDIT-004 | Plánovač→B |
| AUDIT-006 | Mapování `_planning/` vize → aktuální stav: co chybí/je jinak/je navíc, scope drift | P1 | M | — | Plánovač→B (čistě dokument) |
| AUDIT-007 | Kompletnost 4 produktů (makléřská síť, inzerce, eshop dílů, VIP marketplace) vs. `CLAUDE.md` a `docs/knowledge-base/*` | P1 | L | AUDIT-006 | Plánovač→B (čtení + mapování) |
| AUDIT-008 | `middleware.ts` 374 řádků — subdomain routing, auth gating, role redirects, security headers | P0 | M | AUDIT-002 | Plánovač→B |
| AUDIT-009 | `app/` struktura a route groups (5 grup + `prezentace/` + `app/api/` po rolích) — duplicity, dead routes | P1 | M | AUDIT-008 | Plánovač→B |
| AUDIT-010 | `lib/` — 45 modulů: coupling, dead code, duplicita (2× cart?/shipping), modulární čistota | P1 | M | — | Plánovač→B |
| AUDIT-011 | TypeScript strictness, ESLint errors, `any`/`@ts-ignore` hotspoty, typecheck průchozí? | P1 | S | — | Kontrolor přímo (`npm run typecheck && npm run lint`) |
| AUDIT-012 | Unit testy (Vitest): `__tests__/*`, pokrytí, zda projdou | P1 | S | — | Kontrolor přímo (`npm run test:run`) |
| AUDIT-013 | E2E (Playwright): 11 spec souborů — projdou na sandbox? co je pokryté, co chybí | P1 | M | Sandbox live | Kontrolor (`npm run test:e2e`) |
| AUDIT-014 | Platby: Stripe + Stripe-Connect split (makléř / partner / carmakler), webhooky, idempotence, testovací režim vs. prod | P0 | L | AUDIT-002 | Plánovač→B |
| AUDIT-015 | Upload pipeline: Cloudinary→Sharp migrace dokončená?, `migrate-cloudinary.ts`, security scan uploadů (MIME, ClamAV?), velikosti | P1 | M | — | Plánovač→B |
| AUDIT-016 | Externí integrace: Cebia VIN, `ares.ts`, Resend (email-templates), SMS, Pusher?, Mapy.cz?, AI (Claude `assistant`) — funkční klíče + fallbacky | P1 | M | — | Plánovač→B |
| AUDIT-017 | Branding & design systém: orange #F97316, Outfit font, `carmakler-design-system.html` (93 KB ref!), `lib/brand-styles.ts`, mobile tier 1/2 fixes | P2 | M | — | Designer-subagent nebo plánovač→B |
| AUDIT-018 | SEO: `sitemap.ts`, `robots.ts`, `llms.txt`, schema.org markup, meta tagy na (web)/37 stránkách, `seo-content` Prisma model, `generate-parts-seo-content.ts` skript | P2 | M | AUDIT-009 | Plánovač→B (SEO audit) |
| AUDIT-019 | Accessibility & Core Web Vitals, Lighthouse skóre, bundle size (`@next/bundle-analyzer` existuje — použít) | P2 | M | AUDIT-013 | Kontrolor (playwright + lighthouse) |
| AUDIT-020 | Build a deploy: `next build --webpack` (proč ne turbopack?), `vercel.json`, sandbox pm2 strategie, `.github/` workflows | P1 | S | — | Plánovač→B + kontrolor build |
| AUDIT-021 | Backup & recovery DB, `dev.db.backup-*`, postup obnovy, RPO/RTO strategie | P1 | S | AUDIT-001, AUDIT-004 | Plánovač→B |
| AUDIT-022 | Docs & on-ramp: `docs/knowledge-base/*` (13 souborů), `MASTER-PLAN.md` 22 KB, `docs/CARMAKLER-FULL-SPEC.md`, `docs/PLAN-VYVOJE.md`, `TASK-QUEUE.md` 276 KB (co to je?), `KONZULTANT.md` | P2 | S | AUDIT-006, AUDIT-007 | Plánovač→B |
| AUDIT-023 | **SYNTHESIS**: agregace všech nálezů → doporučení (opravy / rework / hybrid), risk-map, časová náročnost, roadmapa | P0 | M | **všechny předchozí** | Plánovač→B (finální dokument pro Radima) |

---

## 2) Detaily tasků

### AUDIT-001 — DB driver + connection pool (P0, M) 🚨
- **Čemu chce odpovědět:** Proč pm2 restartuje 71× / 42h. Je root cause connection-pool exhaustion? Běží prod na SQLite nebo Postgres? Driver config sedí? Existují orphan klienti, nevracené connection, leak v Server Components / route handlerech?
- **Zdroje:** `package.json` (`@prisma/adapter-pg`, `pg`, `prisma`), `prisma/schema.prisma` (`datasource`, `provider`, `url`), `prisma.config.ts`, `.env.example` (`DATABASE_URL`), `lib/prisma.ts` (singleton pattern?), všechny `app/api/*/route.ts` (zda volají `prisma.$disconnect()` nesprávně).
- **Externí:** GitHub commit `99b6003` v `JevgOne/cmklv2` — zjistit co kolega fixoval (přes WebFetch nebo team-lead získá diff).
- **Očekávaný výstup:** Verdikt + návrh fixu (pool size, PgBouncer, singleton, `--turbo` problematika, chyba v hot-reload dev vs. prod).
- **Executor:** Plánovač→B (analýza), kontrolor ověří v sandboxu `pm2 logs carmakler --lines 500` a `curl /api/health` (pokud existuje).

### AUDIT-002 — Bezpečnost celkově (P0, L)
- **Čemu chce odpovědět:** Je `.env` vyloučený? Nejsou secrety v Gitu? NextAuth má správné `secret`, session strategy, cookies `httpOnly/secure/sameSite`? Role guards v `lib/auth.ts` plus middleware hlídají všechny protected routes? CSRF ochrana v POST endpointech? Rate-limit (`lib/rate-limit.ts`) nasazen na login/forgot-password/public endpointech? CSP headers + `csp-report` endpoint skutečně něco reportuje? Admin endpoints nejsou dostupné bez role ADMIN?
- **Zdroje:** `.env.example`, `.gitignore`, `middleware.ts`, `lib/auth.ts`, `lib/rate-limit.ts`, `app/api/admin/*`, `app/api/auth/*`, `app/api/csp-report/route.ts`, `app/api/payments/*` (webhook signing), `next.config.ts` (security headers), `instrumentation.ts`.
- **Test scan:** `git log --all -p | grep -E "(SECRET|KEY|PASSWORD|TOKEN)="` v upstreamu (team-lead), `__tests__/middleware.test.ts`.
- **Očekávaný výstup:** Bezpečnostní heat-map (10 kategorií × stav ✅/⚠️/❌), seznam findings s CVSS-style priority.
- **Executor:** Plánovač→B, volitelně deleguj subagent `security-reviewer`.

### AUDIT-003 — Monitoring & crash root cause (P0, M)
- **Čemu chce odpovědět:** Sentry DSN nastavený a eventy přicházejí? Existují nedávné neviděné erory? pm2 logs ukazují na jeden opakující se stacktrace (typicky Prisma "Too many clients already")? Health-check endpoint? Uptime monitoring?
- **Zdroje:** `sentry.*.config.ts`, `instrumentation.ts`, `.env.example` (SENTRY_DSN?), Sentry web UI (team-lead/Radim), `pm2 logs carmakler`.
- **Očekávaný výstup:** Konkrétní stacktrace pro AUDIT-001, statistika error-rate, SLA čísla.
- **Executor:** Kontrolor přímo přes Bash v sandboxu + Sentry UI via team-lead.

### AUDIT-004 — Datový model (P0, L)
- **Čemu chce odpovědět:** Dává 53 modelů smysl? Není duplicitní `Lead` + `SellerContact` + `VehicleInquiry` + `Inquiry` + `PartnerLead`? Jak vzniká orphan data po smazání `User` (onDelete cascade/restrict)? Indexy na FK + queryovaných polích? Composite indexes pro listing search? Soft-delete strategie (žádný `deletedAt` — trvalé smazání)? Dlouhé `String` pole vs. Text? JSON pole nevalidovaná?
- **Zdroje:** `prisma/schema.prisma` (1806 řádků), `prisma/migrations/*`, `lib/search.ts`, `lib/listings.ts`, `lib/lead-management.ts`, příklady queries z `app/api/**`.
- **Očekávaný výstup:** ER graf na high-level (textový), seznam 20-30 zhoršení / doporučení (add-index, split-model, rename, drop-unused).
- **Executor:** Plánovač→B.

### AUDIT-005 — Migrace historie + seeds (P1, S)
- **Čemu chce odpovědět:** 11 migrací od 2026-04-05 — je to "squash after reset" nebo přirozený postupný vývoj? Seed skript (`prisma/seed.ts`, `prisma/seed-partners.ts`) pokrývají celý prostor? Co je v `prisma/data/`?
- **Zdroje:** `prisma/migrations/*/migration.sql`, `prisma/seed*.ts`, `prisma/data/`.
- **Očekávaný výstup:** Popis migration timeline + doporučení zda sloučit / rozsekat.
- **Executor:** Plánovač→B.

### AUDIT-006 — Scope drift `_planning/` → current (P1, M)
- **Čemu chce odpovědět:** Co z Radimovy vize z 12/10/2025 (PROJECT-SPECIFICATION.md, AI-CONTEXT.md, TECHNICAL-DECISIONS.md, PROGRESS-REPORT.md, MASTER-PLAN.md) je dnes v kódu, co chybí, co je navíc. Kde se stala pivot od původního plánu.
- **Zdroje:** `_planning/PROJECT-SPECIFICATION.md`, `_planning/TECHNICAL-DECISIONS.md`, `_planning/PROGRESS-REPORT.md`, `_planning/AI-CONTEXT.md`, `_planning/AI-CONTEXT-UPDATE.md`, `_planning/aplikace/README-aplikace-backup.md`, `MASTER-PLAN.md` (root — asi kolegův aktuální plán), `docs/CARMAKLER-FULL-SPEC.md`, `docs/PLAN-VYVOJE.md`.
- **Očekávaný výstup:** Tabulka "plánováno vs. stav" po tématech (branding, landing, CRM, PWA, AI, platby, SEO), s komentářem "proč se to změnilo" (kde lze z kódu vyčíst).
- **Executor:** Plánovač→B.

### AUDIT-007 — Kompletnost 4 produktů (P1, L)
- **Čemu chce odpovědět:** Každý z 4 produktů má endpointy / stránky / datový model / auth flow / PWA / platby? Co chybí k MVP každé části?
  1. Makléřská síť (nábor, onboarding quiz, PWA pro makléře, lead management, smlouvy, provize)
  2. Inzerce (podání inzerátu, feed import, export, správa, favourites, watchdog, reservations)
  3. Eshop dílů (parts katalog, PWA pro dodavatele, VIN search, košík, objednávky, shipping, returns)
  4. Marketplace (flip opportunities, investoři, dealer verifikace, payouts 40/40/20)
- **Zdroje:** `docs/knowledge-base/01-12*.md` (konkrétně 02-sprava-vozu-workflow, 04-provize-finance, 06-pwa-makleri, 10-marketplace-investice, 11-inzerce-shop, 12-shop-autodily), `app/(web)/*`, `app/(pwa)/makler/*`, `app/(pwa-parts)/parts/*`, `app/api/*`, Prisma modely.
- **Očekávaný výstup:** 4× MVP checklist ✅/⚠️/❌ + "missing work estimate".
- **Executor:** Plánovač→B. Lze rozdělit na AUDIT-007a/b/c/d pokud team-lead chce.

### AUDIT-008 — `middleware.ts` (P0, M)
- **Čemu chce odpovědět:** 374 řádků / 12 KB — co všechno dělá? Subdomain routing pro `inzerce/shop/marketplace.carmakler.cz` funguje i lokálně (host header)? Security headers + CSP nonces jsou konzistentní s `next.config.ts`? Role gating (ADMIN/BACKOFFICE/BROKER/…) odpovídá reálným route groups? `__tests__/middleware.test.ts` pokrývá kritické větve?
- **Zdroje:** `middleware.ts`, `__tests__/middleware.test.ts`, `next.config.ts`, `lib/subdomain.ts`, `lib/auth.ts`.
- **Očekávaný výstup:** Flowchart + kontrola všech větví + návrh rozdělení na menší matchery.
- **Executor:** Plánovač→B.

### AUDIT-009 — Route structure (P1, M)
- **Čemu chce odpovědět:** `app/(partner)/` (5. group — v CLAUDE.md není), `app/prezentace/` samostatně (proč ne group?), duplicitní cesty (`/prihlaseni` vs. `/login`, `/zapomenute-heslo` vs. `/reset-hesla` vs. `/overeni-emailu`), `/bazar` vs. `/inzerce`, `/dily` vs. `/shop`, `/makler` vs. `/makleri`. Route groups sedí se subdomain strategií?
- **Zdroje:** `app/**`.
- **Očekávaný výstup:** Mapa URL vs. subdomain + seznam duplicit/dead routes, návrh redirects.
- **Executor:** Plánovač→B.

### AUDIT-010 — `lib/` kvalita (P1, M)
- **Čemu chce odpovědět:** 45 modulů — je `listings.ts` × `listing-*.ts` (sla, quick-filters, flagging, export, import) rozumný rozklad nebo nekonzistentní? Singleton pattern v `prisma.ts` správně? Jsou validators/ používané všude nebo jen místy? Dead code (grep import × export).
- **Zdroje:** `lib/**`, scan reimportů `grep -r "from '@/lib/*"` .
- **Očekávaný výstup:** Seznam modulů k refaktoru / sloučení / smazání.
- **Executor:** Plánovač→B.

### AUDIT-011 — TS strictness & ESLint (P1, S)
- **Čemu chce odpovědět:** `npm run typecheck` projde bez chyb? `npm run lint` čisté? Kolik `any` / `@ts-ignore` / `eslint-disable`?
- **Zdroje:** `tsconfig.json`, `eslint.config.mjs`, výstup obou příkazů.
- **Očekávaný výstup:** Počet chyb, TOP 10 hotspotů.
- **Executor:** Kontrolor přímo, reportuje zpět plánovači.

### AUDIT-012 — Unit testy (P1, S)
- **Čemu chce odpovědět:** `npm run test:run` — kolik testů, kolik prochází, pokrytí? Testují se kritické validátory, rate-limit, middleware, auth?
- **Zdroje:** `__tests__/**`, `vitest.config.ts`.
- **Očekávaný výstup:** Report + seznam testů k doplnění.
- **Executor:** Kontrolor přímo.

### AUDIT-013 — E2E testy (P1, M)
- **Čemu chce odpovědět:** 11 spec souborů (včetně `comprehensive-batch-test` a `chrome-test-147-extras` — co to?), projdou proti sandboxu? Pokrývají 4 produkty?
- **Zdroje:** `e2e/**`, `playwright.config.ts`, sandbox URL.
- **Očekávaný výstup:** Pass/fail matrix, pokrytí per-product, návrh dalších testů.
- **Executor:** Kontrolor — spustí proti `https://car.zajcon.cz` jakmile poběží.

### AUDIT-014 — Platební tok (P0, L)
- **Čemu chce odpovědět:** Stripe-Connect platformový setup, webhook signing secret, idempotence klíče, split payout matematika (40/40/20 marketplace, 5%/min 25k makléř), `BrokerPayout`/`SellerPayout`/`PartnerCommissionLog` konzistence, test vs. prod Stripe klíče.
- **Zdroje:** `lib/stripe*.ts`, `app/api/payments/*`, `app/api/payouts/*`, `app/api/stripe/*`, Prisma modely `Payment`, `SellerPayout`, `BrokerPayout`, `Commission`, `PartnerCommissionLog`.
- **Očekávaný výstup:** Sekvenční diagram platby + risk map (replay attacks, orphan payouts, refund flow).
- **Executor:** Plánovač→B.

### AUDIT-015 — Upload pipeline (P1, M)
- **Čemu chce odpovědět:** Migrace Cloudinary→Sharp — je kompletní nebo jede paralelně? MIME validace, max size, ClamAV / hashbust, EXIF strip? Image variants?
- **Zdroje:** `lib/cloudinary.ts`, `lib/upload.ts`, `lib/image-utils.ts`, `scripts/migrate-cloudinary.ts`, `app/api/upload/*`, `app/api/uploads/*`.
- **Očekávaný výstup:** Stav migrace, bezpečnostní findings, storage cost odhad.
- **Executor:** Plánovač→B.

### AUDIT-016 — Externí integrace (P1, M)
- **Čemu chce odpovědět:** Cebia VIN klíč funkční (`lib/cebia.ts` + `app/api/cebia/*` + `app/api/vin/*`), ARES (`lib/ares.ts`), Resend email-templates všechny renderují, SMS gateway (`lib/sms.ts` + `app/api/sms/*`), AI `lib/knowledge-base.ts` + Claude assistant v `app/api/assistant/*`, Mapy.cz? Pusher? Všude fallback když API down.
- **Zdroje:** každý `lib/<integrace>.ts` + odpovídající `app/api/<integrace>/*`, `.env.example` pro seznam klíčů.
- **Očekávaný výstup:** Matice integrace × (klíč?, fallback?, retry?, timeout?, log?).
- **Executor:** Plánovač→B.

### AUDIT-017 — Brand & design systém (P2, M)
- **Čemu chce odpovědět:** `carmakler-design-system.html` (93 KB!) — co obsahuje, sedí s kódem? `lib/brand-styles.ts` konzistence, `globals.css`, Outfit font load (next/font?), orange #F97316 všude. Mobile tier 1/2 fixes (ty poslední 2 commity v upstreamu) — co se měnilo a je to dokončené? Dark mode?
- **Zdroje:** `carmakler-design-system.html`, `lib/brand-styles.ts`, `app/globals.css`, `components/**`, `tailwind.config.*`.
- **Očekávaný výstup:** Checklist ✅/⚠️/❌, designerova due-diligence, mobile regression risk.
- **Executor:** Plánovač→B nebo delegace na `designer` / `ui-designer` subagenta.

### AUDIT-018 — SEO (P2, M)
- **Čemu chce odpovědět:** `sitemap.ts` generuje všechny URL včetně subdomén? `robots.ts` sedí? `llms.txt` co obsahuje? Schema.org JSON-LD na stránkách? Meta tagy per page nebo generic? `SeoContent` Prisma model + `scripts/generate-parts-seo-content.ts` — jak se plní obsah?
- **Zdroje:** `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt`, `app/(web)/**/page.tsx` (metadata), `lib/seo/*`, `lib/seo.ts`, `lib/seo-data.ts`, Prisma `SeoContent`.
- **Očekávaný výstup:** SEO audit report + `marketolog` pohled na keywords fit (ref `_planning/docs/SEO-OPTIMIZATION.md`).
- **Executor:** Plánovač→B nebo `marketolog` subagent.

### AUDIT-019 — A11y + Core Web Vitals (P2, M)
- **Čemu chce odpovědět:** Lighthouse skóre (mobile), LCP/FID/CLS, bundle velikost (`@next/bundle-analyzer`), ARIA/semantic, kontrasty, focus trapy v PWA.
- **Zdroje:** `npm run analyze`, playwright + lighthouse report, axe-core.
- **Očekávaný výstup:** Skórecard + TOP 10 optimalizací.
- **Executor:** Kontrolor.

### AUDIT-020 — Build & deploy (P1, S)
- **Čemu chce odpovědět:** Proč `next build --webpack` (ne turbopack)? `vercel.json` (přestože zřejmě pm2)? `.github/workflows/*` — CI/CD pipeline? Sandbox pm2 vs. prod Vercel mismatch?
- **Zdroje:** `next.config.ts`, `vercel.json`, `.github/workflows/*`, `package.json` scripts, instrukce od team-lead pro sandbox.
- **Očekávaný výstup:** Stav buildu (pass/fail) + deploy strategie doporučení.
- **Executor:** Plánovač→B, kontrolor spustí build.

### AUDIT-021 — Backup & DR (P1, S)
- **Čemu chce odpovědět:** `dev.db.backup-*` existují — kdo to dělá, kdy, kam? Při přechodu na PG zůstává relevantní? Postup obnovy? Automatizace (cron)? Offsite?
- **Zdroje:** `scripts/`, `.github/`, kolegové pm2 ecosystem.config, cron joby na serveru (team-lead).
- **Očekávaný výstup:** Backup policy návrh s RPO/RTO.
- **Executor:** Plánovač→B.

### AUDIT-022 — Docs & on-ramp (P2, S)
- **Čemu chce odpovědět:** `docs/knowledge-base/*` (13 souborů) — jsou aktuální? `MASTER-PLAN.md` 22 KB — týká se starého nebo nového? `docs/CARMAKLER-FULL-SPEC.md` × `docs/PLAN-VYVOJE.md` — duplicita? `TASK-QUEUE.md` 276 KB v rootu — co je to za artefakt, patří sem? `KONZULTANT.md` — co to je? `AGENT-TEAM-WORKFLOW.md` v rootu (zkopírované z agent-command-center?).
- **Zdroje:** všechny výše.
- **Očekávaný výstup:** Seznam "ponechat / aktualizovat / archivovat / smazat".
- **Executor:** Plánovač→B.

### AUDIT-023 — Synthesis (P0, M, poslední) 🎯
- **Čemu chce odpovědět:** Po všech předchozích: Oprava nebo rework? Jestli oprava — seznam minimálních fixů + časový odhad. Jestli rework — které části zachovat, které přepsat, co vzít jako základ.
- **Vstupy:** Všechny předchozí task výstupy (`AUDIT-001-qa.md` … `AUDIT-022-qa.md`).
- **Očekávaný výstup:** `AUDIT-023-synthesis.md` — 3-5 stránkový dokument:
  1. **Executive summary** pro Radima (verdikt, 3 možnosti, doporučení)
  2. **Risk map** (blokery × P0/P1/P2)
  3. **Go-forward plán A — drobné opravy**: seznam, pořadí, odhad
  4. **Go-forward plán B — částečný rework**: co zachovat, co přepsat
  5. **Go-forward plán C — full rewrite**: kdy dává smysl, odhad
- **Executor:** Plánovač→B (finální task, dělá jen plánovač).

---

## 3) Doporučené pořadí pro team-lead

Batch 1 (paralelně, hned):
- AUDIT-001, AUDIT-003 (root cause 71 restartů — **akutní**)
- AUDIT-011, AUDIT-012 (rychlé kontrolorské taskey — běží samy)

Batch 2 (po Batch 1):
- AUDIT-002, AUDIT-008, AUDIT-004 (jádro bezpečnosti & modelu)
- AUDIT-020 (build stav — zda jde vůbec produkčně sestavit)

Batch 3 (paralelně, po Batch 2):
- AUDIT-005, AUDIT-006, AUDIT-007 (kompletnost & data kontinuita)
- AUDIT-013 (e2e — potřebuje sandbox)
- AUDIT-014, AUDIT-015, AUDIT-016 (platby, media, integrace)

Batch 4:
- AUDIT-009, AUDIT-010 (code quality deep-dive)
- AUDIT-017, AUDIT-018, AUDIT-019 (UI/SEO/CWV)
- AUDIT-021, AUDIT-022 (backup + docs)

Finále:
- AUDIT-023 (synthesis)

---

## 4) Otevřené otázky pro team-lead

Než půjdeme do režimu B na AUDIT-001, potřeboval bych potvrdit:

1. **Máme přístup k upstreamu `JevgOne/cmklv2`?** Bez git historie kolegy nevidím diffy commitů `99b6003` / `468ea55` lokálně. Buď naklonovat, nebo GitHub API přes team-lead.
2. **Sentry credentials pro AUDIT-003** — nebo kontrolor vezme jen pm2 logy ze sandboxu?
3. **Prod DATABASE_URL** — je to SQLite nebo Postgres? Potřebuji vědět reálný stav, ne jen `.env.example`.
4. **Sandbox `car.zajcon.cz`** — už je live? Může kontrolor spustit e2e proti němu?
5. **Chceš breakdown zachovat v 23 taskách, nebo rozdělit AUDIT-007 na 4 sub-tasky (per produkt)?**

---

## 5) Výstup — kam ukládat

- Detailní plán per task → `.claude-context/tasks/AUDIT-XXX-plan.md`
- Implementace (readonly audit → poznámky) → `.claude-context/tasks/AUDIT-XXX-impl.md` (pokud je co implementovat) nebo rovnou QA
- QA zjištění → `.claude-context/tasks/AUDIT-XXX-qa.md`
- Fix round → `.claude-context/tasks/AUDIT-XXX-fix-N.md`

**Finální report pro Radima** → `.claude-context/tasks/AUDIT-023-synthesis.md` + krátká verze v `TASK-LOG.md`.

---

**Plánovač → čeká na schválení / úpravu breakdownu od team-lead.**
