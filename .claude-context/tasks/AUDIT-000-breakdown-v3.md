# AUDIT-000 — Rozklad auditu (v3, finální)

**Datum:** 2026-04-14
**Verze:** v3 — revize po radim-kontrolor (REJECTED v2: chyběl GDPR/PWA/Email, 4 tasky potřebují rozšíření)
**Status:** Čeká na approval kontrolora → APPROVED → režim B.

**Diff vs v2:**
- **+3 nové tasky:** AUDIT-024 (GDPR, P0), AUDIT-025 (PWA/SW, P1), AUDIT-026 (Email deliverability, P1).
- **AUDIT-006** — doplněna explicitní 4-kategoriová matice pro scope drift.
- **AUDIT-007** — v hlavičce jasně označeno, že 007a je `_planning/`-native, 007b-d je SCOPE DRIFT.
- **AUDIT-008** — doplněn access matrix (11 rolí × 4 subdomény) + leak check.
- **AUDIT-014** — doplněn PCI DSS, SCA/3DS, DPH, faktury (Stripe Invoice vs. jsPDF), refund, Stripe Connect typ, escrow.

**Celkem:** 29 tasků (bylo 26).

---

## 0) Recon & potvrzené fakty

(Kompletní výčet viz `AUDIT-000-breakdown.md` / `AUDIT-000-breakdown-v2.md`.)

**Klíčové:**
- PG prod (`carmakler`) + PG sandbox (`carmakler_sandbox`), SQLite jen legacy.
- Next 16.1.7 / React 19.2.3 / Prisma 7.5 / Tailwind 4 (bleeding-edge lane).
- 53 Prisma modelů, 11 fresh migrací (2026-04-05 až 2026-04-12).
- Middleware 374 řádků = subdomain routing + auth + CSP.
- 5 route groups + `app/prezentace/`.
- Upstream `/root/Projects/cmklv2` HEAD `99b6003` dostupný.
- Commit `99b6003` = `fix: prisma pool exhaustion during build` z 12. 4., ale pm2 restarty začaly **po** něm → fix je buď nedostatečný, nebo vedlejší efekt.
- Sentry DSN aktivní, eventy tečou, ale 4 deprecation warnings (autoInstrumentMiddleware/AppDirectory/ServerFunctions + 4.).
- CSP violation `sw.js` → Unsplash `connect-src` block.

---

## 1) Tasky — seznam (v3, 29 položek)

| # | Task | Priorita | Velikost | Dependencies | Primární executor |
|---|------|:--------:|:--------:|--------------|-------------------|
| AUDIT-001 | Prisma pool + PG driver + root cause pm2 restartů (vs. `99b6003`) | P0 | M | — | Plánovač→B, kontrolor smoke |
| AUDIT-002 | Bezpečnost: secrets, NextAuth, RBAC, middleware, CSRF, rate-limit, CSP | P0 | L | 001 | Plánovač→B |
| AUDIT-003 | Monitoring: Sentry funkční?, deprecation fix, CSP/SW Unsplash root cause (↔ AUDIT-025), pm2 crash pattern | P0 | M | 001 | Kontrolor + plánovač→B |
| AUDIT-004 | Datový model: 53 modelů — vztahy, indexy, orphan rizika, soft-delete, N+1 | P0 | L | — | Plánovač→B |
| AUDIT-005 | Migrace historie + seeds + legacy SQLite backupy + rollback strategie | P1 | S | 004 | Plánovač→B |
| AUDIT-006 | Mapování `_planning/` ↔ aktuální stav — **4-kategoriová matice** (viz §2) | P1 | M | — | Plánovač→B |
| AUDIT-007a | Kompletnost: **Makléřská síť** — `_planning/`-native | P1 | M | 006 | Plánovač→B |
| AUDIT-007b | Kompletnost: **Inzerce** — **🚩 SCOPE DRIFT** | P1 | M | 006 | Plánovač→B |
| AUDIT-007c | Kompletnost: **E-shop dílů** — **🚩 SCOPE DRIFT** | P1 | M | 006 | Plánovač→B |
| AUDIT-007d | Kompletnost: **Marketplace investic** — **🚩 SCOPE DRIFT + REGULATORY FLAG** | P1 | M | 006 | Plánovač→B |
| AUDIT-008 | `middleware.ts` + **Access matrix** (11 rolí × 4 subdomény) + leak check | P0 | M | 002 | Plánovač→B |
| AUDIT-009 | `app/` struktura: 5 route groups + `prezentace/` + API per role — duplicity, dead routes | P1 | M | 008 | Plánovač→B |
| AUDIT-010 | `lib/` 45 modulů: coupling, dead code, duplicita | P1 | M | — | Plánovač→B |
| AUDIT-011 | TS strictness, ESLint, `any`/`@ts-ignore` hotspoty | P1 | S | — | Kontrolor přímo |
| AUDIT-012 | Unit testy (Vitest) — pokrytí, projdou? | P1 | S | — | Kontrolor přímo |
| AUDIT-013 | E2E (Playwright) s Basic Auth `httpCredentials` | P1 | M | sandbox ✅ | Kontrolor |
| AUDIT-014 | **Platby: Stripe + Connect + PCI DSS + SCA/3DS + DPH + faktury + refund + escrow** | P0 | L | 002 | Plánovač→B |
| AUDIT-015 | Upload pipeline: Cloudinary→Sharp migrace, security scan | P1 | M | — | Plánovač→B |
| AUDIT-016 | Externí integrace: Cebia, ARES, Resend, SMS, Claude assistant, Mapy.cz, Pusher | P1 | M | — | Plánovač→B |
| AUDIT-017 | Branding & design systém: #F97316, Outfit, `carmakler-design-system.html` | P2 | M | — | Plánovač→B / designer |
| AUDIT-018 | SEO: sitemap, robots, llms.txt, schema.org, `SeoContent` | P2 | M | 009 | Plánovač→B / marketolog |
| AUDIT-019 | A11y + CWV: Lighthouse, LCP/FID/CLS, bundle size | P2 | M | 013 | Kontrolor |
| AUDIT-020 | Build a deploy: `next build --webpack`, Vercel vs. pm2, CI/CD | P1 | S | — | Plánovač→B + kontrolor |
| AUDIT-021 | Backup & recovery (PG), archivace SQLite legacy, RPO/RTO | P1 | S | 001, 004 | Plánovač→B |
| AUDIT-022 | Docs & on-ramp: knowledge-base, MASTER-PLAN, FULL-SPEC, TASK-QUEUE.md 276 KB | P2 | S | 006, 007a-d | Plánovač→B |
| **AUDIT-024** | **🆕 GDPR / Ochrana osobních údajů (P0 BLOCKER)** | P0 | L | 002, 014, 016 | Plánovač→B |
| **AUDIT-025** | **🆕 PWA offline + Service Worker** (↔ root cause CSP Unsplash z AUDIT-003) | P1 | M | 003, 008 | Plánovač→B |
| **AUDIT-026** | **🆕 Email deliverability + flows** (DKIM/SPF/DMARC, Resend, katalog) | P1 | M | 016 | Plánovač→B |
| AUDIT-023 | **SYNTHESIS** — verdikt (opravy / rework / hybrid), risk-map, roadmapa | P0 | M | **vše předchozí** | Plánovač→B |

---

## 2) Rozšíření 4 stávajících tasků

### AUDIT-006 — 4-kategoriová matice (povinná šablona výstupu)

Výstup musí mít za každou feature/oblast tabulkovou položku:

| Oblast / feature | Je v kódu? | Je v `_planning/`? | Verdikt | Poznámka |
|------------------|:---------:|:-------------------:|---------|----------|
| Onboarding quiz | ✅ | ✅ | KONZISTENTNÍ | — |
| Inzerce feed import | ✅ | ❌ | **SCOPE DRIFT** | Kolega přidal, Radim má potvrdit |
| Firebase Auth | ❌ | ✅ | **MISSING vs. vize** | Nahrazen NextAuth (vědomý pivot?) |
| Blog content 8 článků Q1 | ❌ | ✅ | **MISSING vs. vize** | Plán z Fáze 3 |
| Google Analytics 4 | ❌ | ✅ | **MISSING vs. vize** | Ověřit |
| Partner modul | ✅ | ❌ | **SCOPE DRIFT** | 5. route group, Prisma Partner* modely |
| Reklamační řád | ✅ | ❌ | mimo scope | Legal-required |

Bez této matice Radim nemá rozhodovací vstupy. Matice bude minimálně **40-60 řádků** (každá větší feature = 1 řádek).

### AUDIT-007 — Hlavičkové označení

Každý pod-task začíná banner:

- **AUDIT-007a Makléřská síť:** ✅ `_planning/`-NATIVE — jediný produkt, který Radim v září/říjnu 2025 plánoval. Audit: kolik z MVP pokryto.
- **AUDIT-007b Inzerce:** 🚩 **SCOPE DRIFT** — v `_planning/` NENÍ, kolega přidal. Audit: kompletnost + zdůvodnění rozsahu.
- **AUDIT-007c E-shop dílů:** 🚩 **SCOPE DRIFT** — v `_planning/` NENÍ. Audit: kompletnost + zdůvodnění.
- **AUDIT-007d Marketplace investic:** 🚩 **SCOPE DRIFT + REGULATORY FLAG** — v `_planning/` NENÍ. Audit: kompletnost + **regulatorní due-diligence** (ČNB, investiční služby/půjčka, AML/KYC).

### AUDIT-008 — Access matrix (11 rolí × 4 subdomény)

Povinná výstupní tabulka:

| Role / Subdoména | `carmakler.cz` | `inzerce.*` | `shop.*` | `marketplace.*` |
|------------------|:--------------:|:-----------:|:--------:|:---------------:|
| anon (nepřihlášen) | ? | ? | ? | ? |
| BUYER | ? | ? | ? | ? |
| BROKER | ? | ? | ? | ? |
| MANAGER | ? | ? | ? | ? |
| REGIONAL_DIRECTOR | ? | ? | ? | ? |
| ADVERTISER | ? | ? | ? | ? |
| PARTS_SUPPLIER | ? | ? | ? | ? |
| INVESTOR | ? | ? | ? | ? |
| VERIFIED_DEALER | ? | ? | ? | ? |
| BACKOFFICE | ? | ? | ? | ? |
| ADMIN | ? | ? | ? | ? |

Hodnoty: `✅ full` / `🔒 auth-only` / `👁️ read-only` / `❌ blocked` / `🚫 redirect`.

**Leak check (aktivní pokusy):**
- Admin endpoint (`/api/admin/*`) reachable z `inzerce.carmakler.cz`? (nemá být)
- Email prodejce (PII) leakuje anonymovi skrze listing API?
- Session cookie scope — je set na `.carmakler.cz` nebo per-subdoméně? (subdomain cookie stealing)
- CORS na API — Access-Control-Allow-Origin wildcard nebo per-sub?

### AUDIT-014 — Platby rozšíření

Doplnit ke stávajícímu scope:

1. **PCI DSS scope minimization:** ověřit že neukládáme PAN/CVV; všechny card tokeny jdou přes Stripe Elements / Checkout; backendová API nikdy nevidí raw card data. Stripe.js je loadován pouze z `js.stripe.com` (ne self-hosted).
2. **SCA/3DS (EU):** `payment_intent.confirm` s `use_stripe_sdk` na klientu? Handling `requires_action` stavu? Test s 3DS test kartami.
3. **DPH:** 21% makléř (služba), 21% díly (zboží), marketplace provize (jaký sazba?), faktury s DPH rozpisem per item. Reverse charge pro B2B přes hranice?
4. **Invoicing:** Stripe Invoice API vs. jsPDF custom — která cesta? Duplicitní generování? Legal: paragon × faktura × daňový doklad.
5. **Refund workflow:** full refund vs. partial, webhook `charge.refunded`, zpětná úprava `Order.status`, vrácení DPH.
6. **Stripe Connect typ:** Standard / Express / Custom? KYC dealeři + makléři (`stripe_account.verification.status`), `stripe_account.requirements`. Platform liability.
7. **Marketplace 40/40/20 split:** implementováno jako `transfer_data[destination]` + `application_fee_amount`, nebo manuální transfers po úspěšné platbě? Escrow na Carmakler balance mezi nákupem a prodejem flipovaného auta?
8. **Webhook idempotence:** `stripe-signature` verification, replay protection přes `WebhookEvent` model (existuje?), handler musí být idempotentní.

---

## 3) Nové tasky (detaily)

### AUDIT-024 — GDPR / Ochrana osobních údajů (P0, L) 🚨 BLOCKER

**Proč P0:** bez GDPR compliance se nesmí jet produkce s reálnými uživateli. ÚOOÚ + pokuty až 4 % globálního obratu. Pro Marketplace + platby je to existenční podmínka.

**Scope:**

1. **Records of Processing Activities (RoPA)** — Art. 30 GDPR. Seznam všech zpracování (marketing, broker flow, payments, AI assistant logs, analytics), právní základ per zpracování (smlouva, souhlas, oprávněný zájem, zákonná povinnost).
2. **Retention policy** — jak dlouho držíme: user účet (až do smazání), transakční data (10 let kvůli daním), marketing (do odhlášení), AI konverzace (?), pm2/Sentry logy (30/90 dní?).
3. **Data subject rights endpoints:**
   - **Art. 15 (export)** — `/api/profile/export` nebo `/api/admin/gdpr/export/:userId`? Exportuje celý uživatelský footprint (User + Vehicle + Listing + Order + Contract + Commission + Notification + EmailLog + SmsLog + Lead + Inquiry + Favorite + Reservation + …).
   - **Art. 17 (erasure / pravo na zapomenutí)** — anonymizace? hard-delete? Co s navazujícími Commission/Payout (účetní legal hold 10 let)?
   - **Art. 16 (rectification)** — self-service v `/muj-ucet` nebo přes support?
   - **Art. 18 (restriction)**, **Art. 20 (portability — JSON export)**, **Art. 21 (objection).**
4. **DPA (Data Processing Agreements):** Stripe, Resend, Cebia (VIN = PII kombinace), Cloudinary, Anthropic (AI prompts obsahují PII?), Sentry (stack traces — scrub PII?). Každý processor musí mít uzavřenou DPA.
5. **Cookie consent banner + ZoKeS §89a:** musí být na `carmakler.cz`, sandboxu ne-li, splňuje strict opt-in pro analytics/marketing cookies, granularita (essential / analytics / marketing / preferences), persistence volby (365 dní), re-ask při změně policy.
6. **PII audit log:** existuje `AuditLog` Prisma model? Logujeme admin přístupy k User/Vehicle/Payment? Je to immutable?
7. **Breach notification process:** 72h na nahlášení ÚOOÚ (Art. 33) + případně datovým subjektům (Art. 34). Kontakty, šablona, runbook.
8. **DPIA (Data Protection Impact Assessment)** pro marketplace (investiční riziko + velká škála PII).
9. **DPO (Data Protection Officer)** — je jmenován? Povinný při large-scale PII processing.
10. **Třetí strany** — předání do USA (Stripe/Cloudinary/Anthropic) → SCCs nebo adekvátnost (DPF framework po Schrems II).

**Zdroje:**
- Kód: `app/(web)/ochrana-osobnich-udaju/page.tsx`, `app/(web)/zasady-cookies/page.tsx`, existující cookie banner komponenta, `lib/auth.ts` (session data), Prisma modely (User + vše PII), `app/api/profile/*`, email templates (musí mít unsubscribe + identifikaci správce).
- Externí: ověřit DPA status u všech 6 processorů (Stripe má default, ostatní případ od případu).
- Legal docs: aktuální text Zásad v `app/(web)/ochrana-osobnich-udaju/` — je v souladu s tím, co reálně zpracováváme?

**Očekávaný výstup:**
- GDPR gap analýza: ✅/⚠️/❌ per 10 kategorií.
- Seznam chybějících endpointů (export/erasure).
- Seznam chybějících DPA.
- Risk-severity per gap.
- Roadmap k "compliance-ready" stavu.

**Executor:** Plánovač→B. Případně delegace na `legal-advisor` nebo `data-privacy-engineer` subagenta.

---

### AUDIT-025 — PWA offline + Service Worker (P1, M)

**Proč existuje jako samostatný task:** Dvě PWA (broker + parts supplier), Serwist 9, idb 8, offline-first je klíčová UX vlastnost (makléř v terénu bez signálu, dodavatel na vrakovišti). SW má také bezpečnostní implikace (route hijack, cache poisoning) a komplikuje CSP.

**Scope:**

1. **Serwist config** — `app/sw.ts`, `next.config.ts` PWA wrapper, `public/manifest.json` × 2 (broker + parts) — oddělené scopy a start_url?
2. **Runtime caching strategie per route:**
   - static assets: cache-first
   - API reads (seznamy leadů, listings): SWR (stale-while-revalidate)
   - API writes (post-lead, post-photo): network-only + background sync queue
   - obrázky: cache-first s expiration
   - HTML shell: network-first s offline fallback
3. **Background sync + IndexedDB:** `lib/offline/*`, `idb 8`. Queue pending mutations (nahrání vozu offline), retry při online, konflikt resolution.
4. **CSP-compatible SW registration** — SW nesmí používat `eval`/`Function`, musí být na stejném originu. **🔥 Root cause Unsplash CSP violation** (viz AUDIT-003): grep v `app/sw.ts` + `public/` → buď hardcoded test URL (odstranit) nebo legitimate prefetch (rozšířit `connect-src` v CSP whitelist v `next.config.ts` / `middleware.ts`).
5. **Install prompt UX** — `beforeinstallprompt` event handling, custom banner pro broker PWA (v nativním UI iOS Safari to neexistuje, jen "Add to Home Screen").
6. **Manifest per PWA:** 2× `manifest.json`? Nebo 1 generický? Každá PWA potřebuje:
   - `name`, `short_name`, `start_url` (per role), `scope`, `display: standalone`, ikony 192/512/maskable, `theme_color` (#F97316), `background_color`, `shortcuts` pro rychlé akce.
7. **Push notifications** — nasazeno? VAPID klíče? `PushSubscription` uložená v Prisma? FCM nebo Web Push standard? Vs. Resend email + SMS.
8. **Offline fallback page** — `app/offline/page.tsx` existuje? Branding konzistentní.
9. **SW update flow** — `skipWaiting` + `clients.claim` nebo reload prompt? Prevent stuck stale SW.
10. **PWA in production:** pm2 na HTTP/2? SSL correct cert chain? SW requires `https://` (localhost výjimka).

**Zdroje:** `app/sw.ts`, `next.config.ts`, `public/manifest*.json`, `lib/offline/`, `components/PWAInstall*.tsx`, `app/(pwa)/layout.tsx`, `app/(pwa-parts)/layout.tsx`, `serwist` v package.json.

**Očekávaný výstup:**
- SW registrační audit ✅/⚠️/❌.
- Root cause Unsplash violation + fix plán.
- Install/update UX review.
- Push notifications stav (nasazeno / plán / nic).

**Executor:** Plánovač→B.

---

### AUDIT-026 — Email deliverability + flows (P1, M)

**Proč existuje jako samostatný task:** Transakční + marketing emaily jsou kritické pro broker flow, platby, marketplace. Špatná deliverability = ztracené leady, nezaplacené faktury, blacklist domény.

**Scope:**

1. **DNS setup** — `dig TXT carmakler.cz` pro:
   - **SPF** (v=spf1 include:resend.com ~all nebo -all)
   - **DKIM** — Resend per-domain key rotace
   - **DMARC** — `_dmarc.carmakler.cz` s `p=quarantine`/`reject` + `rua=` reporting mailbox
   - **MX** (pokud Carmakler přijímá mail)
   - **BIMI** (nice-to-have pro brand logo v Gmailu)
2. **Resend domain verification** — `resend.com/domains` panel, reputation skóre, bounce rate, complaint rate (<0.1 %).
3. **Email katalog:** kompletní seznam + audit per-mail:
   - Registrace (welcome)
   - Email verification token
   - Password reset token
   - Login alert (?)
   - Contract signed (PDF přiložen)
   - Payment received
   - Payout initiated/completed (makléř, partner, investor)
   - Order confirmation (shop)
   - Order shipped
   - Order returned/refunded
   - Marketplace investment opportunity
   - Marketplace investment sold / profit distribution
   - Marketing newsletter (opt-in only)
   - Admin notifications (breach, crash)
4. **Tone & branding** — všechny používají stejnou `lib/email-templates/` šablonu, barvy #F97316, logo, Outfit font, mobile-responsive (Outlook Windows = `<table>` fallback), dark-mode compatible.
5. **Unsubscribe** — transakční zpráva nemusí mít unsubscribe link (legal), marketing musí + jednoclickový (CAN-SPAM + GDPR).
6. **Bounce/complaint webhooks** — Resend posílá event, ukládáme do `EmailLog`? Blacklist adres po bounce/complaint.
7. **Queue/retry** — posíláme synchronně (blokuje request) nebo async queue? Retry na dočasné Resend selhání?
8. **Deliverability test** — Mail-Tester.com (score 10/10?), Gmail tab routing (primary/promotions/spam), Outlook, Seznam.cz.
9. **Transactional vs. marketing separation** — oddělené Resend "audiences" nebo domény? (`mail.carmakler.cz` transakční, `news.carmakler.cz` marketing)
10. **Legal ID in footer** — každý mail musí mít identifikaci správce (IČO, adresa, kontakt) podle ZoKeS a Obchodního zákoníku.

**Zdroje:** `lib/resend.ts`, `lib/email-templates/`, `.env.example` (`RESEND_API_KEY`, `RESEND_FROM_EMAIL`), `app/api/emails/*`, Prisma `EmailLog`, všechny callsites posílající email (grep `resend.emails.send` nebo `sendEmail(`).

**Externí ověření:** `dig TXT carmakler.cz`, `dig TXT _dmarc.carmakler.cz`, Mail-Tester.com.

**Očekávaný výstup:**
- DNS audit ✅/⚠️/❌.
- Resend config review.
- Email katalog vs. reality gap.
- Deliverability score.
- Legal compliance flags.

**Executor:** Plánovač→B + kontrolor (dig + Mail-Tester).

---

## 4) Doporučené pořadí batchů (v3)

**Batch 1 — akutní (paralelně, teď):**
- AUDIT-001 (DB pool)
- AUDIT-003 (monitoring)
- AUDIT-011, AUDIT-012 (rychlé kontrolorské) — **běží, kontrolor už pracuje**
- **+AUDIT-024 GDPR recon** start paralelně (dlouhý task, nezávislý na ostatních v B1)

**Batch 2 — jádro (po B1):**
- AUDIT-002 (bezpečnost)
- AUDIT-008 (middleware + access matrix)
- AUDIT-004 (data model)
- AUDIT-020 (build)

**Batch 3 — kompletnost & integrace (paralelně po B2):**
- AUDIT-005, AUDIT-006
- AUDIT-007a/b/c/d (4 paralelně, worktree safe)
- AUDIT-013 (e2e)
- AUDIT-014 (platby rozšířeno), AUDIT-015, AUDIT-016
- AUDIT-025 (PWA/SW), AUDIT-026 (email)

**Batch 4 — polish (paralelně):**
- AUDIT-009, AUDIT-010
- AUDIT-017, AUDIT-018, AUDIT-019
- AUDIT-021, AUDIT-022

**Finále:**
- AUDIT-023 synthesis (agreguje **28** task výstupů)

---

## 5) Výstup — kam ukládat (beze změny)

- Detailní plán → `.claude-context/tasks/AUDIT-XXX-plan.md`
- Implementace (u auditu „findings report") → `.claude-context/tasks/AUDIT-XXX-impl.md`
- QA → `.claude-context/tasks/AUDIT-XXX-qa.md`
- Fix rounds → `.claude-context/tasks/AUDIT-XXX-fix-N.md`
- Pre-recon poznámky → `.claude-context/tasks/AUDIT-XXX-recon-notes.md`
- **Finální report** → `.claude-context/tasks/AUDIT-023-synthesis.md`
- **Logs** → `.claude-context/logs/prod-carmakler-YYYY-MM-DD.log`, `car-zajcon-YYYY-MM-DD.log`
- **Secrets sample** → `.claude-context/secrets-sample.md`

---

**Plánovač → v3 připraven. Čekám na APPROVED od radim-kontrolora. Mezitím jdu do pre-reconu AUDIT-001.**
