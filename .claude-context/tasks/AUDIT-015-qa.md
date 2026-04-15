# AUDIT-015 — QA: Third-party integrations status (code-based)

**Datum:** 2026-04-15 (rev 2026-04-15b — Resend demontáž po FIX-037)
**Autor:** Plánovač (READ-ONLY — code audit, bez SSH smoke testů)
**Priorita:** P0 (odhaluje missing creds pro M1 launch)
**Metoda:** statická analýza kódu + grep `process.env.` napříč `app/`, `lib/`, `components/`, `scripts/`, `next.config.ts`, `middleware.ts`

**Pozn.:** Live smoke testy na sandboxu patří implementátorovi (SSH, `pm2 env`, Stripe CLI). Tento report = **code-level truth** + **predikce stavu**. Sloupec "Sandbox stav" je `?` kdekoliv nelze bez pm2 env ověřit — doplní implementátor v follow-up.

> 🛑 **UPDATE 2026-04-15b (po Radimově rozhodnutí):** RESEND je úplně vypuštěn z architektury Carmakleru. Jediný email provider = **Wedos SMTP** (`smtp.wedos.net:587`, mailbox `info@carmakler.cz`). FIX-037 v implementaci (`npm uninstall resend` + smazat `lib/resend.ts` + přepsat `lib/email.ts` na nodemailer-only). Všechny sekce níže o Resend jsou **obsolete/historical** — po FIX-037 merge se matrix sám opraví.

---

## 1) Executive summary pro team-leada

**Code-based klasifikace (28 integrací):**
- ✅ **Plná graceful fallback implementace (no key = OK):** 9 (Cebia, VIN decoder, Cloudinary, 5× shipping carriers, SMS)
- ⚠️ **Throw-on-use (missing key = 500 error):** 3 (Stripe Checkout, Stripe Connect, Anthropic)
- ✅ **Crash-on-boot (missing key = proces nenabootuje):** 2 (Prisma, NextAuth)
- ✅ **Optional / `enabled: false` flag:** 3 (Sentry, Plausible/GA, Site password)
- ✅ **Fallback chain (single-provider + log):** 2 (Email: Wedos SMTP → dev-log; SMS: GoSMS → Twilio → log)
- ❌ **Neimplementováno v kódu:** 3 (Pusher, Mapy.cz, OAuth providers)
- ⚠️ **LEGACY (zdeprekováno):** 1 (Cloudinary — self-hosted upload je primární path)
- ➕ **Infrastruktura (cron, revalidate, leads API):** 4

**TOP-5 missing keys pro M1 launch (escalate to Radim):**

| # | Co | Typ | Kde získat | Cena | M1 blocker? |
|---|----|-----|-----------|------|-------------|
| 1 | **SMTP_USER + SMTP_PASSWORD + SMTP_FROM** (Wedos mailbox `info@carmakler.cz`) + SPF/DKIM/DMARC DNS na `carmakler.cz` | Transactional email (Wedos-only, FIX-037) | wedos.cz admin — mailbox + password | V ceně hostingu (~50 Kč/měsíc) | ✅ |
| 2 | **STRIPE_SECRET_KEY + PUBLISHABLE_KEY + WEBHOOK_SECRET** (test mode pro M1) | Platby | dashboard.stripe.com → Developers → API keys | Free test mode | ✅ pro eshop + inzerce-boost |
| 3 | **CRON_SECRET** = `openssl rand -hex 16` | Auth pro 6× cron endpointů | generuj lokálně | — | ✅ |
| 4 | **ANTHROPIC_API_KEY** | AI asistent | console.anthropic.com → API keys | Pay-as-go (~$3/1M tokens) | ⚠️ broker PWA nice-to-have (bez = 500) |
| 5 | **SENTRY_DSN + NEXT_PUBLIC_SENTRY_DSN + SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT** | Error tracking | sentry.io → new project "carmakler" | Free do 5k events/měsíc | ⚠️ doporučeno — bez něj letíme naslepo |

**🛑 RESEND = vypuštěno. Žádná Resend zmínka v P0/P1/P2. FIX-037 odstraňuje `lib/resend.ts`, `npm uninstall resend`, `lib/email.ts` → nodemailer-only.**

**Nice-to-have M1:**
6. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — plausible.io přidat doménu (cena: $9/mo nebo self-host)
7. `VINDECODER_API_KEY + VINDECODER_API_SECRET` — vindecoder.eu (cca $50/měsíc) — **BEZ NICH funguje NHTSA fallback, ale má horší CZ data**
8. `NEXT_PUBLIC_ZASILKOVNA_API_KEY + ZASILKOVNA_API_PASSWORD + ZASILKOVNA_SENDER_LABEL` — admin.zasilkovna.cz po podpisu smlouvy

**Post-M1 (neodkládat, ale nejsou launch blocker):**
9. Stripe Connect Express — funguje na stejných Stripe creds, ale vyžaduje aktivaci Connect v dashboardu + business profile setup
10. CEBIA_API_KEY — B2B smlouva s Cebia, cca 50 Kč/dotaz; do té doby `dev-mock` pattern (`lib/cebia.ts:26`)
11. Shipping (DPD, PPL, GLS, Česká pošta) — 4 další smlouvy; dry-run stačí do prvního eshop prodeje
12. SMS (GoSMS nebo Twilio) — v M1 flows není SMS povinná (2FA je email)
13. Pusher — není v kódu, implementace = AUDIT-X feature task
14. Mapy.cz — není v kódu, implementace = AUDIT-X feature task

---

## 2) Full matrix — 28 integrací (code-level)

### 2.1 Core infrastruktura (launch crash pokud chybí)

#### DB-01 — Prisma / PostgreSQL
- **File:** `lib/prisma.ts:11`, `prisma.config.ts:5-12`
- **Env:** `DATABASE_URL` (povinné), `PG_POOL_MAX` (default 5), `PG_CONNECTION_TIMEOUT_MS`, `PG_IDLE_TIMEOUT_MS`
- **Fallback:** ❌ crash-on-boot — `prisma.config.ts` má explicit throw: `if (!process.env.DATABASE_URL) throw`
- **Sandbox stav (predikce):** ✅ LIVE (jinak by pm2 proces nenabootoval)
- **Radim action:** — (funguje)

#### AUTH-01 — NextAuth
- **File:** `lib/auth.ts:1-107`, `middleware.ts:178-353`
- **Env:** `NEXTAUTH_SECRET` (povinné), `NEXTAUTH_URL`, `NEXTAUTH_COOKIE_DOMAIN`
- **Providers:** jen `CredentialsProvider` (email + bcrypt password) — **žádný Google/GitHub OAuth**
- **Fallback:** ❌ crash-on-boot bez `NEXTAUTH_SECRET`
- **Sandbox stav:** ✅ LIVE
- **Cookie:** production = `__Secure-next-auth.session-token`, dev = `next-auth.session-token` (FIX-013)
- **Radim action:** — (funguje). OAuth přidat pokud bude požadavek (post-M1).

### 2.2 Platby (Stripe)

#### STRIPE-01 — Stripe Checkout (eshop + inzerce boost)
- **File:** `lib/stripe.ts:10-21`, `app/api/orders/route.ts:167`, `app/api/listings/[id]/{extend,promote,reserve}/route.ts`
- **Env:** `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY` (client)
- **API version:** `2026-02-25.clover` (moderní)
- **Fallback:** ⚠️ Lazy init — `getStripe()` throw `Error("STRIPE_SECRET_KEY is not set")` při prvním volání. Build passes bez key; první checkout = generic 500.
- **Sandbox stav:** ❓ Radim potvrdí `sk_test_*` vs `sk_live_*` prefix
- **Risk:** pokud je live key omylem → reálné transakce při smoke testech
- **Radim action:** test keys z dashboard.stripe.com → Developers → API keys (test mode)

#### STRIPE-02 — Stripe Connect Express (partners — payout recipients)
- **File:** `lib/stripe-connect.ts:76-113`
- **Config:** `type: "express"`, `country: "CZ"`, `capabilities.transfers.requested` (NO card_payments), `mcc: "5533"` (Motor vehicle supplies)
- **Used by:** `components/admin/partners/StripeOnboardingCard.tsx`, `app/api/stripe/*` webhook handler (AUDIT-014 scope)
- **Sandbox stav:** ❓ pravděpodobně v testu (partner onboarding zatím unused)
- **Permissions-Policy blocker:** `payment=(self)` chybí v `next.config.ts:112` → Stripe Elements iframe selže. Řeší **AUDIT-027** (plán hotov).
- **Radim action:** v Stripe Dashboard → Connect → Enable Express (po aktivaci test keys funguje same)

### 2.3 AI (Anthropic Claude)

#### AI-01 — Claude API (asistent + popisy)
- **Files:**
  - `app/api/assistant/chat/route.ts:131` — `new Anthropic()` (SDK čte `ANTHROPIC_API_KEY` env auto)
  - `app/api/assistant/generate-description/route.ts` — same pattern
  - Reference v `app/(web)/ochrana-osobnich-udaju/page.tsx` — jen text o AI
- **Model:** `claude-sonnet-4-6-20250514` (hardcoded — **stale**, pozor Sonnet 4.6 je `claude-sonnet-4-6`; current code má legacy suffix)
- **System prompt:** česky, knowledge-base z `lib/knowledge-base.ts`, rate-limit 50 req/h/user (DB-backed)
- **Fallback:** ⚠️ žádný explicit graceful. Try-catch → `"Chyba při komunikaci s AI"` (500) — user-facing, ne 503 s jasnou chybou
- **Sandbox stav:** ❓ bez sandbox env nelze říct. Pokud chybí klíč, každý broker click na "AI pomoc" vrátí 500.
- **Recommendation:** Přidat `if (!process.env.ANTHROPIC_API_KEY) return 503 s explicit body` (FIX-047a v plánu AUDIT-015)
- **Radim action:** console.anthropic.com → Settings → API Keys → Create. Nastavit billing (pay-as-go, levné: ~$3/M tokens, odhad $5-20/měsíc pro brokery).

### 2.4 Vehicle data

#### VIN-01 — VIN Decoder (vindecoder.eu + NHTSA)
- **File:** `lib/vin-decoder.ts:14-30`
- **Env:** `VINDECODER_API_KEY`, `VINDECODER_API_SECRET`
- **Fallback chain:**
  1. Pokud `apiKey && apiSecret` existují → `vindecoder.eu` SHA-1 signed API (10s timeout)
  2. Pokud selže nebo chybí → `NHTSA vPIC` (free, no key, US-focused)
- **Sandbox stav:** ❓ pravděpodobně NHTSA fallback (Radim nezmínil vindecoder.eu účet)
- **Impact bez vindecoder.eu:** NHTSA má slabá data pro evropské značky (Škoda/Seat — OK, ale detaily jako VIN pozice #10 year decoding je nepřesné). Broker quick flow bude pracovat se zkreslenými daty.
- **Radim action:** vindecoder.eu subscription (~$50/měsíc, API v 3.2). M1 MVP lze odložit do prvních stížností brokerů.

#### CEBIA-01 — Cebia B2B (historie vozidla)
- **File:** `lib/cebia.ts:19-100`
- **Env:** `CEBIA_API_URL` (default `https://api.cebia.cz/b2b/v1`), `CEBIA_API_KEY`
- **Fallback:** ✅ **vzorový graceful** — `isCebiaConfigured()` = `apiKey && apiKey !== "dev-mock"` → mock report s randomizovanými flags
- **Sandbox stav:** ❓ pravděpodobně `dev-mock` (Cebia smlouva není v Radimových messages)
- **Impact:** BO proces ověřuje mock — OK pro M1 MVP, ale real customer purchase bez Cebia ≠ důvěryhodné → M2 priority
- **Radim action:** B2B smlouva s Cebia (~50 Kč/dotaz). Post-M1.

### 2.5 E-mail (po FIX-037: Wedos-only, žádný Resend)

#### EMAIL-01 — Wedos SMTP (jediný provider, FIX-037)
- **File (po FIX-037):** `lib/email.ts` — nodemailer-only
- **Env (po FIX-037 rename):** `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_HOST` (default `smtp.wedos.net`), `SMTP_PORT` (default 587)
- **Starý env (pre-FIX-037):** `WEDOS_SMTP_USER/PASSWORD/HOST/PORT`, `RESEND_*` — mají se vymazat při FIX-037 migraci
- **Config:** nodemailer createTransport, STARTTLS na port 587
- **Fallback chain (2-tier po FIX-037):**
  1. SMTP creds existují → Wedos SMTP
  2. chybí → log `[EMAIL:NOT_CONFIGURED]` (clean message, žádný mock "dev send")
- **Sandbox stav:** ❓ Radim potvrdil že mailbox kupuje u Wedosu, creds dodá
- **Radim action:** wedos.cz admin → vytvořit mailbox `info@carmakler.cz` + password → poskytnout do pm2 env
- **DNS action:** SPF/DKIM/DMARC records pro `carmakler.cz` dle Wedos návodu (jinak maily do spamu)

#### EMAIL-02 — ~~Resend~~ (ZRUŠENO)

- **Status:** ❌ ZRUŠENO 2026-04-15. Radim 2× explicitně odmítl Resend: *"nebudeme používat resend ... koupíme si emaily normálně na wedosu"*
- **Implementace:** FIX-037 provádí `npm uninstall resend` + `rm lib/resend.ts` + přepsání `lib/email.ts`
- **`.env.example` úklid:** smazat `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `EMAIL_PROVIDER` (už není potřeba, jen jeden provider)
- **Grep acceptance:** po FIX-037 `grep -r "resend\|Resend\|RESEND" lib/ app/ components/` = 0 výskytů (kromě komentáře "migrated away from Resend 2026-04-15" pokud chceš v CHANGELOG)

### 2.6 Upload / media

#### UPLOAD-01 — Self-hosted /var/www/uploads (PRIMARY)
- **File:** `lib/upload.ts:15-16`
- **Env:** `UPLOAD_DIR` (produkce `/var/www/uploads`), `UPLOAD_BASE_URL` (produkce `https://files.carmakler.cz`)
- **Fallback:** bez env → placehold.co placeholder (dev)
- **Sandbox stav:** ❓ pravděpodobně LIVE pokud pm2 env má nastavené (nginx musí servírovat `/var/www/uploads` na `files.zajcon.cz`)
- **Radim action:** — pokud funguje, file server setup už hotový (kolegovo prod má)

#### UPLOAD-02 — Cloudinary (LEGACY)
- **File:** `lib/cloudinary.ts:38-48`, `scripts/migrate-cloudinary.ts`
- **Env:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Status:** LEGACY — jen pro migraci historických fotek ze staré platformy. Nový upload jde vždy do `lib/upload.ts`.
- **Fallback:** ✅ graceful (placehold.co pokud missing)
- **Radim action:** NIC, můžeme i vyřadit pokud migrace skončila. `scripts/migrate-cloudinary.ts` by měla být jednorázová.

### 2.7 Observability

#### MON-01 — Sentry (error tracking)
- **Files:** `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts:167-176`
- **Env:** `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`
- **Config:** `enabled: process.env.NODE_ENV === "production"` + `disable: !process.env.SENTRY_AUTH_TOKEN` pro sourcemaps
- **Traces sample rate:** 10% prod, 100% dev; replays 1.0 on error, 0 session
- **Sandbox stav:** ❓ pokud DSN chybí, Sentry silent-skip (no errors). Build nezavádí sourcemaps bez AUTH_TOKEN.
- **Radim action:** sentry.io → Create project "carmakler" (Next.js template) → zkopírovat DSN + Auth token. Free do 5k events/měsíc.

#### MON-02 — Plausible / GA4 (analytics)
- **File:** `components/web/Analytics.tsx:7`
- **Env:** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (preferred) NEBO `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (fallback)
- **Fallback:** `render null` pokud chybí
- **Cookie consent:** FIX-018 (už implementováno)
- **Sandbox stav:** ❓
- **Radim action:** plausible.io → Add site `car.zajcon.cz` ($9/měsíc nebo self-host). ALT: Google Analytics 4 (free).

### 2.8 Shipping (5 carriers)

#### SHIP-01..05 — Zásilkovna, DPD, PPL, GLS, Česká pošta
- **Files:** `lib/shipping/carriers/{zasilkovna,dpd,ppl,gls,ceska-posta}.ts`, `components/web/ZasilkovnaWidget.tsx`
- **Common pattern:** každý má `process.env.XXX_API_USERNAME/PASSWORD/CUSTOMER_*` s `?? ""` fallback → **dry-run mode** (fake tracking, console log)
- **Zásilkovna-specific:** `NEXT_PUBLIC_ZASILKOVNA_API_KEY` pro widget (client-side pickup point picker)
- **Sandbox stav:** ❓ všech 5 pravděpodobně dry-run (kolegův prod `2bf0657` je pravděpodobně taky bez smluv)
- **Radim action:**
  - **Zásilkovna PRVNÍ** (cheapest, most popular): admin.zasilkovna.cz → smlouva (free) → API key + sender label
  - Ostatní 4 dle objemu: DPD / PPL / GLS / ČP = post-M1
- **Impact bez creds:** eshop checkout UI nabídne carriery, ale label generation = mock QR. Kurýr nepřijde pro balíček.

### 2.9 SMS

#### SMS-01 — GoSMS + Twilio fallback
- **File:** `lib/sms.ts:28-39`
- **Env:** `GOSMS_API_KEY`, `GOSMS_CHANNEL_ID`, `TWILIO_ACCOUNT_SID/AUTH_TOKEN/PHONE_NUMBER`
- **Resolution:** first GoSMS → then Twilio → log (dev)
- **Používá se kde:** TBD — SMS není v M1 critical path (2FA je email)
- **Radim action:** Post-M1. Pro ČR **GoSMS levnější** (~1 Kč/SMS). Twilio: 5 Kč/SMS mezinárodně.

### 2.10 Neimplementováno v kódu

#### NOT-01 — Pusher (real-time)
- **Status:** ❌ CLAUDE.md zmiňuje, ale **žádný `process.env.PUSHER*` ani import `pusher`** v kódu
- **Predikce:** plánováno, ale odložené. Push notifications zatím přes Service Worker (PWA).
- **Action:** feature task (AUDIT-X), NE pro M1

#### NOT-02 — Mapy.cz
- **Status:** ❌ jen v `docs/07-integrace-externi.md:218`. Žádný kód.
- **Použití potenciálně:** lokace makléřů (mapa), pickup points eshop, pohledové mapy auto lokalit
- **Action:** feature task, post-M1

#### NOT-03 — OAuth providers (Google/GitHub/Apple)
- **Status:** ❌ `lib/auth.ts` má jen CredentialsProvider
- **Action:** NE pro M1 (emailové registrace funguje)

### 2.11 Security / cron secrets

#### SEC-01 — CRON_SECRET
- **Files:** `app/api/cron/{listing-expiry,process-erasures,exclusive-expiry,feed-import,sla-check,watchdog-match}/route.ts`
- **Protect mechanism:** `authHeader !== Bearer ${process.env.CRON_SECRET}` → 401
- **Sandbox stav:** ❓ CRITICAL — pokud chybí, cron endpointy jsou veřejně trigger-able (DoS, data mess)
- **Radim action:** `openssl rand -hex 16` → nastavit v pm2 env + cron jobs

#### SEC-02 — REVALIDATE_SECRET
- **File:** `app/api/revalidate/parts/route.ts:109`
- **Protect:** constant-time compare
- **Sandbox stav:** ❓
- **Radim action:** `openssl rand -hex 16` → pm2 env

#### SEC-03 — LEADS_API_KEY
- **File:** external inbound API (TBD cesta)
- **Radim action:** post-M1

#### SEC-04 — SITE_PASSWORD
- **File:** `middleware.ts:143`
- **Fallback:** `null` = veřejný web
- **Sandbox stav:** Radim zmínil že sandbox byl passwordem (Admin2026) — možná stále aktivní
- **Radim action:** rozhodnutí dle launch strategy — "hod to na car.zajcon.cz" = pravděpodobně zůstane password

#### SEC-05 — MARKETPLACE_INVITE_TOKENS / MARKETPLACE_GATE_DISABLED
- **File:** `lib/marketplace-gate.ts:23-51`
- **Fallback:** waitlist-only (FIX-020)
- **Sandbox stav:** ✅ waitlist mode je default — M1 OK

#### SEC-06 — Bankovní údaje Carmakléř
- **File:** `lib/stripe.ts:27-32`
- **Env:** `CARMAKLER_BANK_ACCOUNT`, `CARMAKLER_IBAN`, `CARMAKLER_BIC` (default "KOMBCZPP"), `CARMAKLER_BANK_NAME` (default "Komerční banka")
- **Used for:** fallback manual payout když Stripe Connect není setup pro partnery (faktury pro brokery / prodejce)
- **Radim action:** vyplnit reálné IBAN/číslo účtu CarMakléř s.r.o. v pm2 env

---

## 3) CREDS-SHOPPING-LIST pro Radima (prioritizovaný, batch escalation)

**Doporučený jediný message Radimovi:**

> Radime, pro M1 launch na `car.zajcon.cz` potřebuji tyto credentials. Prosím o **vyplnění v tomto pořadí** (priorita shora):
>
> ### P0 — blockery M1 launch:
> 1. **Email (Wedos-only, po FIX-037):** `SMTP_USER` + `SMTP_PASSWORD` + `SMTP_FROM` — Wedos mailbox `info@carmakler.cz` (nebo podobný). Získat: wedos.cz → admin → Mailboxy → create. **Dodat také DNS úkol:** SPF (`v=spf1 include:_spf.wedos.com ~all`) + DKIM (Wedos vygeneruje TXT) + DMARC (`v=DMARC1; p=quarantine; rua=mailto:info@carmakler.cz`) pro doménu `carmakler.cz`. Bez DNS = maily v spamu.
> 2. **Platby (test mode):** STRIPE_SECRET_KEY (`sk_test_*`) + STRIPE_PUBLISHABLE_KEY (`pk_test_*`) + STRIPE_WEBHOOK_SECRET — dashboard.stripe.com → Developers → API keys (Test mode)
> 3. **CRON_SECRET:** `openssl rand -hex 16` (přes terminál → pm2 env carmakler-sandbox)
> 4. **Error tracking:** SENTRY_DSN + NEXT_PUBLIC_SENTRY_DSN + SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT — sentry.io → new Next.js project
> 5. **CarMakléř bank údaje:** IBAN + číslo účtu s.r.o. (pro seller payouts)
>
> ### P1 — doporučené pro M1:
> 6. **AI asistent:** ANTHROPIC_API_KEY — console.anthropic.com (odhad $5-20/měsíc)
> 7. **Analytics:** NEXT_PUBLIC_PLAUSIBLE_DOMAIN + site v plausible.io ($9/měsíc)
> 8. **Zásilkovna:** ZASILKOVNA_API_PASSWORD + ZASILKOVNA_SENDER_LABEL + NEXT_PUBLIC_ZASILKOVNA_API_KEY — admin.zasilkovna.cz (free smlouva)
> 9. **VIN decoder:** VINDECODER_API_KEY + VINDECODER_API_SECRET — vindecoder.eu (~$50/měsíc) *[lze odložit — NHTSA fallback funguje pro EU značky s horší přesností]*
>
> ### P2 — post-M1 (tento týden nutné NENÍ):
> 10. CEBIA_API_KEY — Cebia B2B smlouva (50 Kč/dotaz)
> 11. REVALIDATE_SECRET — `openssl rand -hex 16`
> 12. 4 další carriers (DPD/PPL/GLS/ČP) — dle objemu eshop
> 13. GoSMS API key — post-M1 SMS flows
> 14. Stripe Connect aktivace — když začnou partneři
>
> **Čas potřebný od tebe:** P0 cca 30 min (registrace + copy paste), P1 cca 60 min, P2 dny (smlouvy).

---

## 4) Follow-up implementační FIXy (plán pro implementátora)

Tyto nevyžadují Radimovu akci — jen doladění graceful degradation v kódu:

- **FIX-047a** (Anthropic 503): `app/api/assistant/{chat,generate-description}/route.ts` — přidat pre-check `if (!process.env.ANTHROPIC_API_KEY) return 503` s cz zprávou "AI asistent je dočasně nedostupný". **Effort: 15 min.**
- **FIX-047b** (Claude model ID update): `app/api/assistant/chat/route.ts:133` aktuálně `claude-sonnet-4-6-20250514`. Správné je `claude-sonnet-4-6` (bez legacy date suffix, Anthropic deprecoval dateformat). **Effort: 5 min.**
- **FIX-047c** (Cloudinary purge): pokud migrace historických fotek už proběhla, odstranit `lib/cloudinary.ts` import z live paths (jen `scripts/migrate-cloudinary.ts` zůstane jako one-off). **Effort: 30 min + grep import audit.**
- **FIX-047d** (Pusher cleanup): odstranit Pusher zmínku z `CLAUDE.md` stack seznamu (řádek "Real-time: Pusher") — aktuálně misleading, není v kódu. **Effort: 5 min.**
- **FIX-047e** (env preflight check at boot): volitelný preflight check při `instrumentation.ts` register, který loguje varování pokud kritické keys chybí (SMTP_USER/Stripe/Anthropic/CRON_SECRET). Ne crash, jen warning do Sentry. **Effort: 45 min.**

---

## 5) Co chtěl team-lead explicit (mapování na zadání)

| Team-lead čekal | Tady najde |
|-----------------|-----------|
| Stripe: test vs live keys, Connect Express, webhook | STRIPE-01, STRIPE-02 |
| Claude API: key + usage flows + rate limit | AI-01 (rate limit 50 req/h/user DB-backed) |
| Cebia: API + fallback | CEBIA-01 (explicit `dev-mock` pattern) |
| VIN Decoder | VIN-01 |
| Mapy.cz | NOT-02 (neimplementováno) |
| Pusher | NOT-01 (neimplementováno) |
| Cloudinary: migrace stav | UPLOAD-02 (LEGACY, self-host je primary) |
| Email provider (Wedos-only po FIX-037) | EMAIL-01 (aktivní), EMAIL-02 (Resend ZRUŠENO) |
| 5× Carriers | SHIP-01..05 |
| Sentry | MON-01 |
| Plausible + cookie consent | MON-02 |
| NextAuth providers | AUTH-01 (jen CredentialsProvider) |
| **Konsolidovaný seznam missing creds** | **Sekce 3 CREDS-SHOPPING-LIST** |

---

## 6) Limity tohoto auditu (co nemůže říct bez sandbox SSH)

- **Skutečný stav env vars v `pm2 env car-zajcon`** — jen Radim/implementátor může dump
- **Zda Stripe keys v sandboxu jsou test vs live** (důležité — při live testech = reálné transakce)
- **Zda `carmakler.cz` má SPF/DKIM/DMARC DNS records** pro Wedos SMTP (bez toho maily do spamu)
- **Zda Plausible site existuje** v dashboard
- **Které env vars fyzicky missing / placeholder / dev-mock**

**Follow-up pro implementátora:** T-015-001 (SSH recon) z plánu `AUDIT-015-plan.md` — ~20 min → doplní sloupec "Sandbox stav" v matrixu výše.

---

**Verdict plánovače:**
- M1 launch potřebuje **5 P0 keys** (Email, Stripe, CRON, Sentry, Bank)
- Kód má **dobrou graceful degradation** v 9/28 integracích (Cebia, Upload, všichni carriers, SMS, Cloudinary) — vzor `isCebiaConfigured()` je replikovatelný
- **3 integrace throw-on-use** (Stripe Checkout, Anthropic, Stripe Connect) → FIX-047a vylepší UX Anthropic
- **3 integrace** (Pusher, Mapy.cz, OAuth) = neimplementované, **nepatří do M1 blocker seznamu**

Team-lead: máš vše pro **jeden konsolidovaný message** Radimovi. Doporučuji odeslat **P0 + P1 (9 položek)** najednou, P2 jako follow-up po launch.
