# AUDIT-015 — Plán: Third-party integrations audit (M1 launch readiness)

**Datum:** 2026-04-15 (rev 2026-04-15b — Resend demontáž po FIX-037)
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P0 (odhalí chybějící creds od Radima = blocker pro M1)
**Odhadovaná práce implementátora:** 4-6 hodin (recon + smoke testy + PR)
**Depends on:** — (nezávislý, paralelní k AUDIT-028/031/034)
**Navazuje:** AUDIT-014 (Stripe Connect), FIX-037 (Resend úplné odstranění → Wedos SMTP only). FIX-006 (Resend key na sandboxu) = **ZRUŠENO**.

> 🛑 **UPDATE 2026-04-15b:** Radim definitivně odmítl Resend (*"nebudeme používat resend ... koupíme si emaily normálně na wedosu"*). Jediný email provider = Wedos SMTP (`smtp.wedos.net:587`, mailbox `info@carmakler.cz`). Všechny Resend tasky níže jsou přepsány / zrušeny.

---

## 0) Motivace

Před M1 launchem na `car.zajcon.cz` musíme vědět **co funguje reálně vs. co běží v mock/dev módu**. Kód odkazuje na ~20 externích služeb; některé mají graceful fallback (Cebia `dev-mock`, shipping dry-run), jiné tiše selžou bez error hlášky (Anthropic, VIN decoder, Stripe). Email po FIX-037 = Wedos SMTP only, bez fallback na druhý provider.

**Cíl auditu:**
1. Inventarizovat všech 20 integrací: jaký env var, kde v kódu, jaký fallback, co se stane při chybějícím klíči
2. Spustit smoke testy na sandboxu (`car.zajcon.cz`) a identifikovat LIVE vs. MOCK
3. Produkovat **shopping list pro Radima** — jaké creds musí dodat před launch, jaké lze odložit

Out: změny v implementaci (kromě drobných dev log vylepšení). Deep-dive fixy = samostatné FIX tasky.

## 1) Inventory matrix (known ahead-of-time)

| # | Služba | Env var(s) | Soubor | Fallback | M1 kritický? |
|---|--------|-----------|--------|----------|--------------|
| 1 | **NextAuth** | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_COOKIE_DOMAIN` | `lib/auth.ts`, `middleware.ts` | ❌ crash (wouldn't start) | ✅ |
| 2 | **Prisma/Postgres** | `DATABASE_URL`, `PG_POOL_MAX` | `lib/prisma.ts`, `prisma.config.ts` | ❌ crash | ✅ |
| 3 | ~~Resend~~ | ZRUŠENO (FIX-037) | `lib/resend.ts` smazat, `npm uninstall resend` | — | ❌ vyřazeno |
| 4 | **Wedos SMTP** (jediný email provider) | `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_HOST` (default `smtp.wedos.net`), `SMTP_PORT` (587) | `lib/email.ts` (post-FIX-037, nodemailer-only) | → log `[EMAIL:NOT_CONFIGURED]` | ✅ P0 M1 |
| 5 | **Stripe Checkout** | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY` | `lib/stripe.ts`, `app/api/orders/route.ts`, `app/api/listings/*/extend|promote|reserve` | ⚠️ throw při absence při volání | ✅ (eshop + inzerce-boost) |
| 6 | **Stripe Connect** | (stejné creds + partner onboarding flow) | `lib/stripe-connect.ts`, `components/admin/partners/StripeOnboardingCard.tsx` | — | ❌ FÁZE 2 |
| 7 | **Anthropic (Claude API)** | `ANTHROPIC_API_KEY` | `app/api/assistant/chat/route.ts`, `app/api/assistant/generate-description/route.ts` | ⚠️ fail silent (500) | ⚠️ nice-to-have |
| 8 | **Cebia** | `CEBIA_API_KEY`, `CEBIA_API_URL` | `lib/cebia.ts` | ✅ dev-mock (explicit) | ⚠️ M1 mock OK, real v M2 |
| 9 | **VIN decoder** (vindecoder.eu) | `VINDECODER_API_KEY`, `VINDECODER_API_SECRET` | `lib/vin-decoder.ts` | NHTSA API fallback | ✅ (broker flow) |
| 10 | **Cloudinary** (LEGACY) | `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | `lib/cloudinary.ts`, `scripts/migrate-cloudinary.ts` | → self-hosted `/var/www/uploads` | ❌ legacy, skip |
| 11 | **Self-hosted upload** | `UPLOAD_DIR`, `UPLOAD_BASE_URL` | `lib/upload.ts` | placehold.co (dev) | ✅ (produkční fotky) |
| 12 | **Sentry** | `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG/PROJECT` | `sentry.{client,server,edge}.config.ts`, `next.config.ts:167-176` | `enabled: false` v dev | ⚠️ doporučeno |
| 13 | **Pusher (real-time)** | — | **NENÍ V KÓDU** | — | ❌ plánováno, ne M1 |
| 14 | **Mapy.cz** | `MAPY_CZ_API_KEY` (docs only) | **jen v `docs/07-integrace-externi.md:218`** | — | ❌ není implementace |
| 15 | **Zásilkovna (Packeta)** | `NEXT_PUBLIC_ZASILKOVNA_API_KEY`, `ZASILKOVNA_API_PASSWORD`, `ZASILKOVNA_SENDER_LABEL` | `lib/shipping/carriers/zasilkovna.ts`, `components/web/ZasilkovnaWidget.tsx` | dry-run (fake tracking) | ✅ (eshop checkout) |
| 16 | **DPD** | `DPD_API_USERNAME/PASSWORD/CUSTOMER_NUMBER` | `lib/shipping/carriers/dpd.ts` | dry-run | ⚠️ M1 volitelný |
| 17 | **PPL** | `PPL_API_USERNAME/PASSWORD/CUSTOMER_ID` | `lib/shipping/carriers/ppl.ts` | dry-run | ⚠️ M1 volitelný |
| 18 | **GLS** | `GLS_API_USERNAME/PASSWORD_SHA512/CLIENT_NUMBER` | `lib/shipping/carriers/gls.ts` | dry-run | ⚠️ M1 volitelný |
| 19 | **Česká pošta** | `CESKA_POSTA_API_USERNAME/PASSWORD/CUSTOMER_ID` | `lib/shipping/carriers/ceska-posta.ts` | dry-run | ⚠️ M1 volitelný |
| 20 | **GoSMS** | `GOSMS_API_KEY`, `GOSMS_CHANNEL_ID` | `lib/sms.ts:38` | → Twilio → log | ❌ M2 (SMS not in M1 flows) |
| 21 | **Twilio SMS** | `TWILIO_ACCOUNT_SID/AUTH_TOKEN/PHONE_NUMBER` | `lib/sms.ts:73` | → log-only | ❌ M2 |
| 22 | **Plausible / GA4** | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` nebo `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `components/web/Analytics.tsx` | render null | ⚠️ doporučeno M1 |
| 23 | **Google Places (enrich)** | `GOOGLE_PLACES_API_KEY` | `prisma/data/enrich-partners.mjs` | manual fallback | ❌ one-off script |
| 24 | **Cron secret** | `CRON_SECRET` | `app/api/cron/*/route.ts` | reject 401 | ✅ (listing-expiry, erasure, sla) |
| 25 | **Revalidate secret** | `REVALIDATE_SECRET` | `app/api/revalidate/parts/route.ts` | reject 401 | ⚠️ eshop cache |
| 26 | **Leads API** | `LEADS_API_KEY` | external inbound | reject 401 | ❌ M2 |
| 27 | **Site password** | `SITE_PASSWORD` | `middleware.ts:143` | veřejný web | ⚠️ dle launch strategy |
| 28 | **Marketplace gate** | `MARKETPLACE_INVITE_TOKENS`, `MARKETPLACE_GATE_DISABLED` | `lib/marketplace-gate.ts` | waitlist-only (FIX-020) | ✅ |

**Shrnutí:** 28 env-řízených služeb, **8 kritických pro M1**, 6 warning, 14 nepovinných/M2.

## 2) Task breakdown

### Phase 1 — Recon (READ-ONLY, 1h)

| ID | Task | Effort | Owner |
|----|------|--------|-------|
| T-015-001 | SSH na sandbox server `91.98.203.239`, `pm2 env car-zajcon`, zaznamenat **reálné env vars** do soukromého secret souboru `/root/.claude/secrets/carmakler-sandbox-env.md` (mode 600) | 20 min | implementátor |
| T-015-002 | Porovnat sandbox env vs. `.env.example` — identifikovat: **missing (chybí)**, **present (mámě)**, **dev-placeholder** (např. `"dev-mock"`) | 15 min | implementátor |
| T-015-003 | Grep `process.env.` napříč `lib/`, `app/`, `components/` → confirm 28 položek matrixu, hledat **nové/nedokumentované** env vars | 20 min | implementátor |
| T-015-004 | Zkontrolovat `docs/07-integrace-externi.md` — stále-plánované integrace bez kódu (Pusher, Mapy.cz) → označit jako "future" | 10 min | implementátor |

### Phase 2 — Live smoke testy na sandboxu (2h)

Pro každou integraci typu ✅ M1-kritický nebo ⚠️ M1-doporučený:

| ID | Test | Expected | Smoke metoda |
|----|------|----------|--------------|
| T-015-010 | **Wedos SMTP connect:** `openssl s_client -starttls smtp -connect smtp.wedos.net:587` ověří STARTTLS handshake + `EHLO` | 220 ready, STARTTLS advertised, auth login OK s `SMTP_USER`/`SMTP_PASSWORD` | CLI smoke (nebo `scripts/smtp-smoke.ts` pokud vytvořený) |
| T-015-011 | **Wedos send test:** trigger verify-email flow na sandboxu s novým účtem → e-mail přijde přes Wedos SMTP | e-mail v inboxu do 30s, `From: info@carmakler.cz`, SPF/DKIM pass v headeru | UI signup → inbox check (+ `Show Original` v Gmail pro SPF/DKIM verdict) |
| T-015-012 | **Stripe Checkout:** vytvořit testovací order na `/shop/kosik` → redirect na Stripe Checkout | Test mode `cs_test_*` session ID, success_url funguje | Stripe Dashboard → Events |
| T-015-013 | **Stripe webhook:** trigger `checkout.session.completed` přes Stripe CLI `stripe trigger` na webhook endpoint | `Order.status` posune na `PAID`, audit log zápis | `stripe trigger checkout.session.completed` |
| T-015-014 | **Anthropic:** trigger `/api/assistant/generate-description` z broker PWA (nabírací flow) | stream chunks, generated copy < 500 chars, API usage v Anthropic console | UI / curl POST |
| T-015-015 | **Cebia:** trigger VIN check flow s `CEBIA_API_KEY` set vs. unset | real report JSON vs. mock object se stolen/mileageOk | broker nabírací flow |
| T-015-016 | **VIN decoder:** broker scan VIN → expect vindecoder.eu response; unset creds → expect NHTSA fallback | vindecoder: brand/model/year ze komerční DB; NHTSA: USA-focused data | `POST /api/vin/decode` |
| T-015-017 | **Zásilkovna widget:** `/shop/kosik` → vybrat pobočku → widget renderuje | widget OK, callback zapíše pobočku do orderu | browser test |
| T-015-018 | **Sentry:** vyvolat intentional `throw new Error("sentry-smoke")` v dev endpointu | Sentry event v `sentry.io → carmakler → Issues` | server + client |
| T-015-019 | **Cron secret:** `curl /api/cron/listing-expiry` bez authu → 401; se správným tokenem → 200 | reject/accept | curl |
| T-015-020 | **Marketplace gate:** `/marketplace/investor/apply` bez invite token → waitlist; s validním tokenem → registration | render waitlist vs. form | browser |
| T-015-021 | **Upload self-hosted:** broker fotí auto → fotka se uloží do `/var/www/uploads/...`, file accessible na `https://files.car.zajcon.cz/...` | HTTP 200, image MIME | PWA test |
| T-015-022 | **Analytics Plausible:** ověřit event počítán v `plausible.io/car.zajcon.cz` dashboard | pageview event ≤ 5 min delay | dashboard check |

### Phase 3 — Reporting (1h)

| ID | Task | Output |
|----|------|--------|
| T-015-030 | Aktualizovat `.env.example` podle recon — přidat chybějící keys, vyčistit stale | Commit |
| T-015-031 | Vytvořit **`INTEGRATION-STATUS.md`** v `.claude-context/reference/` — matrix s LIVE/MOCK/MISSING stavem, poslední ověření datum | Nový doc |
| T-015-032 | Vytvořit **`CREDS-SHOPPING-LIST.md`** — pro Radima: seznam co dodat (Anthropic, Stripe live, Resend domain verify, Sentry DSN, Plausible site, Zásilkovna smlouva, ...) | Nový doc, soukromý |
| T-015-033 | Aktualizovat `LAUNCH-CHECKLIST.md` blok "Integrations" s aktuálním stavem | Update |
| T-015-034 | Send report team-leadovi: "M1 blocker keys = X" (kritická TOP-N), "M1 doporučené = Y", "Post-M1 = Z" | SendMessage |

### Phase 4 — Follow-up FIXy (varianta, jen plán)

Pokud Phase 2 odhalí **chybějící/rozbité**:
- FIX-047a: Anthropic key missing → Radim dodá; bez key se `/api/assistant/*` vrací 503 s jasnou chybou (ne 500)
- FIX-047b: Stripe test mode stále live na sandboxu? → přepnout na `sk_test_*` pokud není
- FIX-047c: Sentry DSN missing → Radim create project v sentry.io
- FIX-047d: Plausible domain add → Radim v plausible.io admin
- FIX-047e: SPF/DKIM/DMARC pro `carmakler.cz` chybí → Radim přidá DNS records (Wedos návod)

## 3) Acceptance criteria

- [ ] `INTEGRATION-STATUS.md` obsahuje 28 položek s jedním z: `LIVE`, `MOCK-OK` (explicit fallback akceptovaný), `MOCK-UNINTENDED` (fallback se spustil ale nemá být), `MISSING` (blocker), `PLANNED` (Pusher/Mapy.cz)
- [ ] `CREDS-SHOPPING-LIST.md` má prioritizované pořadí pro Radima s odhadem ceny + link na registraci
- [ ] Každý M1-kritický řádek má smoke-test screenshot nebo log snippet jako důkaz
- [ ] `.env.example` je synced s reality (žádné zmatené názvy)
- [ ] Report team-leadovi obsahuje TOP-3 blocker keys

## 4) Risks & rollback

### R1 (low): Secret leak do repa

Pokud implementátor omylem commitne `carmakler-sandbox-env.md` nebo `CREDS-SHOPPING-LIST.md` s reálnými hodnotami → git history kontaminace.

**Mitigation:** Oba soubory patří do `.gitignore` + `/root/.claude/secrets/` mimo repo. Pre-commit hook: `git status` check před každým `git add`.

### R2 (low): Smoke test spustí reálné platby

`T-015-012` (Stripe Checkout smoke) musí používat **TEST mode** (`sk_test_*` + `pk_test_*`). Pokud má sandbox omylem live keys → real transaction.

**Mitigation:** T-015-001 recon musí zaznamenat `STRIPE_SECRET_KEY` prefix (`sk_test_` vs `sk_live_`) a v Phase 2 explicitně abortovat pokud je live.

### R3 (medium): Auditor změní chování aplikace

Re-spuštění pm2 s přepnutými env vars (smoke testy) může narušit běžící uživatelské sessions.

**Mitigation:** Test mimo špičku (noc/ráno), cca 2-min window, vrátit original env vars po testu.

### R4 (medium): `carmakler.cz` nemá SPF/DKIM/DMARC → maily do spamu

Wedos SMTP odesílá jako `info@carmakler.cz`, ale pokud chybí DNS auth (SPF `v=spf1 include:_spf.wedos.com ~all`, DKIM TXT z Wedos admin, DMARC `v=DMARC1; p=quarantine; rua=mailto:info@carmakler.cz`) → Gmail/Seznam označí jako spam nebo reject.

**Mitigation:** T-015-011 Gmail `Show Original` ověří SPF=pass, DKIM=pass, DMARC=pass. Pokud fail, přidat do CREDS-SHOPPING-LIST (DNS admin úkol pro Radima). Wedos má oficiální návod pro SPF/DKIM setup domény.

## 5) Out of scope

- ❌ Implementace Pusher/Mapy.cz (budoucí feature tasky)
- ❌ Stripe Connect full rollout (AUDIT-014)
- ❌ Shipping carriers real integration (vyžaduje smlouvy = business task)
- ❌ SMS provider decision GoSMS vs Twilio (M2)
- ❌ Deep perf/security audit integrací (AUDIT-010, AUDIT-019)

## 6) Reference soubory

- `.env.example` (150 řádků, source of truth názvosloví)
- `lib/email.ts` (po FIX-037: nodemailer-only Wedos SMTP)
- `lib/cebia.ts:24-27` (dev-mock pattern jako vzor pro ostatní)
- `lib/shipping/carriers/*.ts` (dry-run pattern)
- `docs/07-integrace-externi.md` (budoucí plány Pusher/Mapy)

## 7) Interakce s ostatními AUDITy

- **AUDIT-014 (Stripe Connect):** AUDIT-015 odhalí zda je Stripe živá; AUDIT-014 rozjede Connect flow
- **AUDIT-027 (Permissions-Policy):** `payment=(self)` už v plánu → unblock pro Stripe Elements
- **AUDIT-031 (Wedos finalizace):** T-015-010 + T-015-011 sdílí SMTP smoke testy; AUDIT-031 pokrývá hlubší retry/bounce handling.
- **AUDIT-034 (E2E suite):** Phase 2 smoke testy = input pro e2e specs (`tests/integration/*.spec.ts`)
- **FIX-037 (Resend demontáž):** AUDIT-015 potvrzuje 0 Resend výskytů v kódu po merge (grep acceptance). FIX-006 je zrušeno.

---

**Verdict plánovače:** Ne-invazivní audit s vysokou hodnotou pro Radima (shopping list) a pro team (wiring grep). Po tomto auditu přesně víme **kdo v M1 běží na mocku, kdo live, a co chybí**. 4-6h.

Implementátor: start T-015-001 na sandbox SSH. Paralelně s AUDIT-028 Fáze 1-2.
