# LAUNCH CHECKLIST — CarMakléř

**Vlastník:** radim-kontrolor
**Datum založení:** 2026-04-14
**Účel:** Krátký, závazný checklist toho, co **MUSÍ** být splněno před příslušným milníkem. Aktualizuje se po každém commitu.
**Pravidlo:** dokud zůstává jakákoli položka 🔴 nebo 🟠 pro daný milník, **milník NELZE prohlásit za splněný.**

---

## ⚡ PROVOZNÍ PIVOT 2026-04-15 (Radim rozhodnutí)

> **Milestone 1** = `car.zajcon.cz` ve stavu „demonstrable complete" — aktivní cíl  
> **Milestone 2** = produkční deploy `carmakler.cz` — odloženo (AUDIT-033 pauza)  
> **carmakler.cz** = NETKNUTÁ (kolega's production). Žádný PR do `JevgOne/cmklv2`.

Tento checklist nyní sleduje **Milestone 1** (car.zajcon.cz). Hard blockers A7/B6/C1 platí pro M1.

---

## A) Bezpečnostní a infra blockers (🔴 = launch blocker)

| # | Položka | Status | F-ID / FIX-ID | Kdo |
|---|---------|--------|----------------|-----|
| A1 | Permissions-Policy povoluje camera + geolocation pro broker PWA | ✅ | F-005 → FIX-002 | impl |
| A2 | NextAuth cookie name shoda mezi `lib/auth.ts` a middleware (16/16 rout přístup) | ✅ | F-015 → FIX-005 | impl |
| A3 | PostgreSQL daily dump cron + retence 30d | ✅ | F-017 → FIX-007 | impl |
| A4 | PG pool má `connectionTimeoutMillis` + SIGTERM graceful shutdown | ✅ | F-001/F-002 → FIX-008 | ✅ load test 9k req/30s /api/listings, 0 err, 0 pm2 restarts (2026-04-14 post-rebuild retest) |
| A5 | CSP přechod z Report-Only na Enforcing (nebo vědomé rozhodnutí ponechat report-only po launchi) | ⏳ | F-003 → AUDIT-002 | — |
| A6 | Sentry v10 deprecations vyřešeny | ✅ | F-019 → FIX-009 | ✅ pm2 logs: 0 deprecation warnings |
| A7 | pm2 ecosystem.config.js (env vars persistovány po reboot serveru) | 🟠 M1 / 🔴 M2 | F-018 | M1 downgrade — sandbox `--update-env` stačí; zůstává 🔴 pro M2 produkce |
| A8 | Email service funguje — **Wedos SMTP JEDINÝ provider** (Radim rozhodnutí 2026-04-15 podruhé: „nebudeme používat resend") | 🔴 | ~~AUDIT-031~~ ✅ (3db417d Wedos pool + graceful shutdown) + **FIX-037 PENDING** (Resend demontáž) | **AUDIT-031 DONE** — pool:true, maxConnections:3, rate 5msg/s, closeWedosTransport wired do SIGTERM/SIGINT. **FIX-037 PENDING** — grep `resend\|Resend` v lib/+app/ stále 40+ hitů: `lib/resend.ts` exists, `lib/email.ts` L18 Resend import + L62-89 sendViaResend + L53 auto-default="resend" když RESEND_API_KEY existuje, 5 callerů stále `from "@/lib/resend"`, privacy policy L162 jmenuje Resend. **Radim:** Wedos mailbox + SMTP_USER/SMTP_PASSWORD/SMTP_FROM. |
| A9 | ANTHROPIC_API_KEY přítomen v pm2 env | 🔴 | **FIX-047a** (nový) | **AUDIT-015:** klíč zcela chybí → AI asistent makléře + generování popisů = 500. Radim přidat do pm2 (viz CREDS-SHOPPING-LIST) |
| A10 | STRIPE_SECRET_KEY platný (ne prázdný string) | 🔴 | **FIX-047b** (nový) | **AUDIT-015:** STRIPE_SECRET_KEY="" v pm2 env → `stripe.checkout.sessions.create()` throws `AuthenticationError`. Radim doplnit test-mode klíče (viz CREDS-SHOPPING-LIST) |
| A11 | Upload adresář existuje (`UPLOAD_DIR` + `/var/www/uploads/`) | 🟠 | **FIX-047e** (nový) | **AUDIT-015:** UPLOAD_DIR env chybí + `/var/www/uploads/` neexistuje → upload fotek crash. Fallback: Cloudinary klíče jsou v env — dočasný workaround. Fix: `mkdir -p /var/www/uploads/carmakler` + pm2 set UPLOAD_DIR |

## B) GDPR + právo (🔴 = launch blocker)

| # | Položka | Status | F-ID / FIX-ID | Kdo |
|---|---------|--------|----------------|-----|
| B1 | RoPA (záznam o zpracování čl. 30 GDPR) | ⏳ | AUDIT-024 | plánovač/Radim |
| B2 | Cookie consent banner (ZoKeS §89a) — funkční, granular | ✅ | AUDIT-024 | ✅ viditelný ve screenshotu (Přijmout vše / Pouze nutné / Nastavení) |
| B3 | Plausible analytics gated za consent | ✅ | F-034 → FIX-018 | ✅ curl / grep plausible = 0; consent guard active |
| B4 | Delete-account / Art. 17 erasure endpoint — reálná anonymizace | ✅ | F-032 → FIX-032 + FIX-031 GRANT | ✅ E2E ověřeno: request→cooling-off→cron→anonymizace+AuditLog; retention blocker 409 ✅ |
| B5 | Art. 15 export endpoint — úplný (AiConversation, Order, BrokerPayout, Listing, Lead) | 🟠 | F-033 → AUDIT-024 | impl (P2, po B4) |
| B6 | Marketplace legal posouzení (§1115 OZ spolumajitelský model) + waitlist gate zapnutý | 🔴 | F-012 / F-014 | Radim (extern. právník); kódový gate viz B7 |
| B7 | Marketplace „Coming Soon" gate (waitlist + `?invite=TOKEN`) zapnutý | ✅ | FIX-020 (commit 19f5b8e) | ✅ kontrolor 2026-04-15: bez tokenu → waitlist hero + signup form; MarketplaceWaitlist Prisma model + migrace + GRANT; gate logic podporuje invite token / cookie / role / ENV bypass. Minor: title `<title>` duplikuje " \| CarMakléř \| CarMakléř" → FIX-TBD |
| B8 | Pavel z Kolína — prominent disclaimer „Modelový scénář, ne reálný klient" | ⏳ | designer AUDIT-028c copy | designer + verify kontrolor |
| B9 | Shop záruka — copy „6 měsíců" odpovídá zákonu (spotřebitel 2 roky) NEBO copy přepsána | ⏳ | F-013 → AUDIT-007c | — |

## C) Brand + narrative (🔴 = launch blocker pro B2B akvizici)

| # | Položka | Status | F-ID / FIX-ID | Kdo |
|---|---------|--------|----------------|-----|
| C1 | Brand „CarMakléř" jednotně napříč všemi 4 produkty (žádné „Carmakler" v titulcích/hero/footer) | ✅ | rozhodnutí 0a, **F-046** → FIX-034c (commits fb0e17a + 556353a) | ✅ kontrolor 2026-04-15 post FIX-034c: detector regex opraven na `(Carmakler\|CarMakler\|carmakler)` alternation + 58 dodatečných souborů přepsáno. Final grep `\b(CarMakler\|Carmakler)\b` v app/components/lib filter technical = **0 výskytů**. 5-point re-verify ✅: invitations/payments emaily, SMS templates, PreviewStep contract PDF wire (`COMPANY_LEGAL_NAME`), live llms.txt, AI system prompt. Minor (non-blocker): `llms.txt` L8+L55 „Carmakleru" = české 6. pád, formálně `CarMakléři` — volba copy. |
| C2 | Hero homepage NENÍ leasing copy (žádné „Auto u nás dostane každý" + zaměstnanec/živnostník/důchodce) | ✅ | F-023 → FIX-010 | ✅ grep → 0 |
| C3 | Stránka `/pro-bazary` live (autobazar pitch — proč my, jak začít, modelový Pavel ROI) | ⏳ | F-020 → AUDIT-028c | designer copy → impl |
| C4 | Stránka `/pro-auticare` live (autíčkáři — Marketplace + Makléř kombinace) | ⏳ | F-020 → AUDIT-028c | designer copy → impl |
| C5 | Stránka `/pro-investory` live (Marketplace pre-launch waitlist + disclaimer + invite-only) | ⏳ | F-020 → AUDIT-028c | designer copy → impl |
| C6 | Stránka `/pro-makleri` live (kariéra makléře — provize, oblastní rozdělení) | ⏳ | F-020 → AUDIT-028c | designer copy → impl |
| C7 | Hlavní stránka vypráví ekosystém 4 produktů (Autíčkář→Marketplace→Makléř→Shop→Inzerce) | 🟡 | F-021 → AUDIT-028b | částečně (4× stats panel + "součást ekosystému"), vizuální cyklus chybí |
| C8 | Editorial design tokens v `app/globals.css` (midnight + Fraunces) + orange-500 CTA accent zachován | ✅ | F-022 → FIX-022 | ✅ 22× midnight token v globals.css + Fraunces/JetBrains_Mono importovány + orange-500 CTA zachován |
| C9 | Shop ikonky autodíl-specific (⚙️ gear, ne nákupní tašky) | ✅ | F-024 → FIX-011 | ✅ screenshot potvrzen |
| C10 | Recenze 8-12 různých s variabilitou (4-5★, různé profily, autentické detaily, B2B entry) | ✅ | F-025 → FIX-012 | ✅ 10 recenzentů, 7×5★+2×4.5★+1×4★ |
| C11 | „Top makléři" REFRAMOVÁNO na servisní vrstvu (NEodstraněno — VETO!) | ✅ | F-026 → FIX-013 | ✅ VETO compliance potvrzen kontrolorem |
| C12 | B2B PDF pitch deck (8-12 slidů, e-mailová příloha pro autobazary) | ⏳ | AUDIT-028d | designer outline → impl PDF |

## D) Funkční flow (🔴 = launch blocker)

| # | Položka | Status | F-ID / FIX-ID | Kdo |
|---|---------|--------|----------------|-----|
| D1 | Anon inzerát flow (vyplň → DRAFT → magic link → live) — Volba C | 🟠 | FIX-017 ✅ code | impl — kód + confirm page live ✅; závislost na email provideru (A8) |
| D2 | Marketplace waitlist signup funguje (e-mail do `MarketplaceWaitlist` modelu) | ✅ | FIX-020 | ✅ `app/api/marketplace/waitlist/route.ts` POST upsert + model v Prisma schema + migrace |
| D3 | Stripe Connect Express KYC — onboarding makléře dokončí účet | ⏳ | AUDIT-014 | plánovač + impl |
| D4 | E2E smoke test: 5 rolí × 16 rout → 16/16 PASS po každém major deployi | ✅ | AUDIT-013c | ✅ kontrolor 2026-04-14; **opakovat po každém deployi** |
| D5 | Load test: `autocannon -c 20 -d 30` na klíčové endpointy → ≥99 % success, 0 pm2 restartů | ✅ | FIX-008 | ✅ 8k req/30s -p10 /api/listings, 0 errors (100%), 0 pm2 restarts; uptime 12m post-rebuild ✅ |

## E) Operations (🟠 = launch soft blocker)

| # | Položka | Status | F-ID / FIX-ID | Kdo |
|---|---------|--------|----------------|-----|
| E1 | DNS subdomén `inzerce/shop/marketplace.carmakler.cz` produkce (mimo sandbox) | ⏸ M2 only | — | M2 scope, ne M1 |
| E2 | HTTPS certifikáty pro všechny 4 subdomény (produkce) | ⏸ M2 only | — | M2 scope, ne M1 |
| E3 | Robots.txt + sitemap pro každou subdoménu | ⏳ | AUDIT-022 | impl |
| E4 | Plausible analytics (po cookie consent) | ⏳ | FIX-018 | impl |
| E5 | Monitoring/alerting (Sentry alerty pro pm2 restart > 3/h, error rate > 1 %) | ⏳ | AUDIT-003 | plánovač + impl |
| E6 | Off-site backup (Hetzner Storage Box replication) | 🟠 fáze 2 | dokumentováno v CLAUDE.md | ops |

---

## Souhrn

**Aktuální stav (2026-04-15 po AUDIT-015 integration audit):**
- ✅ Hotovo: A1, A2, A3, A4, A6, B2, B3, B4, B7, **C1**, C2, C8, C9, C10, C11, D2, D4, D5 — **18 položek** (C1 brand RESOLVED 2026-04-15 FIX-034c)
- 🟠 In progress: B5 (export neúplný), D1 (závisí na email + stripe), A11 (upload dir — Cloudinary fallback dostupný)
- ⏳ Pending impl/design: A7 (pm2 ecosystem), B1, B8, B9, C3–C7, C12, D3, E1–E6
- 🔴 Hard blockers: **A8** (email zcela nefunkční — SMTP_* chybí), **A9** (ANTHROPIC_API_KEY chybí), **A10** (STRIPE_SECRET_KEY=""), **B6** (marketplace legal). C1 **DOWN** ✅.

**Launch verdikt pro M1 (car.zajcon.cz):** 🔴 **NELZE** — 4 hard blockers (**A8** email, **A9** AI API, **A10** Stripe key, **B6** marketplace legal). C1 brand VYŘEŠEN. Viz CREDS-SHOPPING-LIST.md pro řešení A8/A9/A10.

**Launch verdikt pro M2 (carmakler.cz produkce):** ⏸ **odloženo** — scope mimo aktivní práci; AUDIT-033-v2 reference.

**Eskalace na Radima (jen tyto):**
1. A8 — Wedos mailbox (`info@carmakler.cz`) zakoupit + dodat `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` (Resend ZRUŠEN 2026-04-15)
2. A9 — `ANTHROPIC_API_KEY` doplnit do pm2 (console.anthropic.com, pay-as-you-go ~$5/m pro demo)
3. A10 — `STRIPE_SECRET_KEY` + `STRIPE_PUBLISHABLE_KEY` doplnit (test-mode, dashboard.stripe.com, zdarma)
4. B6 — externí ČNB-ready právník pro marketplace posouzení
5. A11 — buď `mkdir -p /var/www/uploads/carmakler` + `pm2 set UPLOAD_DIR=...` nebo explicitně zapnout Cloudinary (klíče v env)

Vše ostatní řeší tým bez návratu k Radimovi.

---

## Historie revizí

| datum UTC | autor | změna |
|-----------|-------|-------|
| 2026-04-14 | radim-kontrolor | založení po finálních rozhodnutích team-lead 10:05 |
| 2026-04-14 | radim-kontrolor | update po verify FIX-010..014 + FIX-018: A4, A6, B2, B3, C2, C9, C10, C11, D5 → ✅; hard blockers: A7, B4, B6 |
| 2026-04-14 | radim-kontrolor | verify FIX-017/019/022/031/032 + load retest post-rebuild: C8 → ✅; B4 🔴→🟠 (erasure code ✅, FIX-031 GRANT bug ❌); D1 🟠 (code ✅, závisí email); D5 retest 9k/0err ✅; nový bug FIX-031 GRANT eskalován na impl; hard blockers: A7, B6 (B4 degradován na 🟠) |
| 2026-04-14 | radim-kontrolor | E2E verify F-031 (GRANT applied → LOGIN_SUCCESS ✅) + F-032 (register→delete→backdate→cron→anonymize→AuditLog 3 entries ✅ + retention blocker 409 ✅) + load test 8k/0err ✅: B4 → ✅; D5 retest ✅; hard blockers: A7, B6 |
| 2026-04-15 | radim-kontrolor | FIX-020 verified ✅: B7+D2 → ✅. Brand audit odhalil 🔴 C1 regresi: ~45× `CarMakler` + 3× `Carmakler` v 7 právních/content souborech → nový finding F-046. Minor title dup (CarMakléř 2×) na marketplace. Hard blockers nyní: A7, B6, **C1** (brand). |
| 2026-04-15 | radim-kontrolor | Brand audit F-046 DOKONČEN: 289× správně `CarMakléř` ✅, ale ~147× `CarMakler` + ~35× `Carmakler` ve ~40 souborech. Kritické: 4 právní stránky, 3 e-mail šablony, SMS šablona, smlouvy + 30+ SEO landing pages. BRAND-CONSISTENCY-audit.md zapsán s kategorií 1-6 + sed opravná strategie. C1 blocker přetrvává — čeká FIX-046 od implementátora. |
| 2026-04-15 | radim-kontrolor | **PROVOZNÍ PIVOT Radim** — launch target přesunut z carmakler.cz na dvoustupňový Milestone model. M1 = car.zajcon.cz launch-ready (aktivní), M2 = produkční deploy (odloženo). A7 downgrade 🔴→🟠 pro M1. E1/E2 reklasifikováno na „M2 only". LAUNCH-CHECKLIST hlavička + souhrn update. GO-NO-GO §0aa přidáno. Hard blockers M1: B6, C1 + A8 email nezbytný. |
| 2026-04-15 | radim-kontrolor | **PROVOZNÍ PIVOT:** Radim rozhodnutí — Milestone 1 = car.zajcon.cz „demonstrable complete"; carmakler.cz netknutá; AUDIT-033 pauza. Checklist header + GO-NO-GO-REPORT sekce 0b aktualizovány. Hard blockers A7/B6/C1 platí pro M1. |
| 2026-04-15 | radim-kontrolor | **FIX-046 retest PARTIAL PASS:** commits e2100fb + 3676833 = 103+~25 souborů opraveno (právní/email/SMS/partner/UI ✅), ALE retest grep `app,components,lib/**/*.{tsx,ts}` = **186× `CarMakler\|Carmakler` v 55 souborech**. Root cause: `scripts/brand-fix.sh` L18 file detector `grep -rlE '\b[Cc]armakler\b'` míjí soubory obsahující POUZE `CarMakler` (uppercase M) — 50 SEO landing pages `(web)/nabidka/*` + 5 komponent (`ModelLandingContent`, `BrandLandingContent`, `PriceCalculator`, `OrderForm`, `PartnerLayout`) + `zasady-cookies` + `kolik-stoji-moje-auto`. C1 zůstává 🔴. |
| 2026-04-15 | radim-kontrolor | **RESEND DEFINITIVNĚ OUT** — Radim 2× potvrdil: „nebudeme používat resend... koupíme si emaily normálně na wedosu". A8 přepsán — Wedos SMTP jediný provider. FIX-037 = demontáž Resend (uninstall npm, delete lib/resend.ts, rewrite lib/email.ts na nodemailer-only, .env.example cleanup). Eskalační bod #1 změněn z Resend key na Wedos mailbox + SMTP_* creds. Task #6 FIX-006 zrušen. |
| 2026-04-15 | radim-kontrolor | **AUDIT-015 DOKONČEN** — third-party integrations SSH recon + 15 smoke testů. Výsledek: 5 nových blockerů. Nové položky A9 (ANTHROPIC_API_KEY chybí → FIX-047a), A10 (STRIPE_SECRET_KEY="" → FIX-047b), A11 (UPLOAD_DIR chybí → FIX-047e). A8 upgrade 🟠→🔴 (SMTP_* zcela chybí, ne jen prázdné). Celkem 5 hard blockers M1. Výstupy: `reference/INTEGRATION-STATUS.md`, `reference/CREDS-SHOPPING-LIST.md`, `/root/.claude/secrets/carmakler-sandbox-env.md`. |
| 2026-04-15 | radim-kontrolor | **FIX-034c BRAND VERIFY ✅** — grep `\b(CarMakler\|Carmakler)\b` v app/components/lib (filter technical) = **0 výskytů**. Kategorie 1 (legal), 2 (email), 3 (SMS/contracts), 4 (SEO nabídka), 5 (komponenty) — vše čisté. Minor: `llms.txt` L8+L55 „Carmakleru" = české 6. pád (locative), formálně `CarMakléři` — non-blocker copy volba. C1 🔴→✅. Hard blockers M1: 5→**4** (A8, A9, A10, B6). |
| 2026-04-15 | radim-kontrolor | **AUDIT-031 VERIFY ✅ / FIX-037 PENDING** — commit 3db417d Wedos SMTP pool + graceful shutdown validován: `pool:true`, `maxConnections:3`, `maxMessages:50`, `rateLimit:5/s`, env overrides `WEDOS_SMTP_MAX_*`, `closeWedosTransport()` wired do `instrumentation.ts` SIGTERM/SIGINT. Kód-úroveň ✅, E2E čeká na Wedos creds. **FIX-037 stále otevřen** — grep `resend\|Resend` v lib/+app/ = 40+ hitů: `lib/resend.ts` exists, `lib/email.ts` Resend import + sendViaResend + auto-default="resend" branch, 5 callerů (`lib/listing-sla`, `lib/email-verification`, `lib/listing-confirm`, `app/api/marketplace/apply`, `app/api/payments/[id]/confirm`), privacy policy L162 Resend. Package `resend` stále v node_modules. A8 zůstává 🔴. |
