# INTEGRATION-STATUS — AUDIT-015
**Autor:** radim-kontrolor  
**Datum:** 2026-04-15  
**Target:** car.zajcon.cz (Milestone 1)  
**Metoda:** SSH recon (/proc/PID/environ) + live smoke tests  

---

## Legenda

| Symbol | Stav | Popis |
|--------|------|-------|
| ✅ | LIVE | Funguje, klíče platné, endpoint odpovídá |
| ⚠️ | PARTIAL | Klíče přítomné, ale degradovaný nebo mock stav |
| ❌ | BROKEN | Klíče chybí nebo prázdné, funkce nefunguje |
| ⏸ | PLANNED | Klíče přítomné, implementace v kódu chybí |
| 🔴 | M1 BLOCKER | Blokuje Milestone 1 (car.zajcon.cz demo) |
| 🟠 | M1 NICE | Důležité pro M1 ale ne striktní blocker |
| 🟡 | M2 ONLY | Potřebné jen pro produkci (carmakler.cz) |

---

## Tabulka 28 integrací

| # | Integrace | Klíč(e) v env | Stav | Impact M1 | Fallback |
|---|-----------|--------------|------|-----------|---------|
| 1 | **NextAuth.js** | `NEXTAUTH_SECRET`, `NEXTAUTH_URL` | ✅ LIVE | Kritický | Žádný |
| 2 | **Prisma / PostgreSQL** | `DATABASE_URL` | ✅ LIVE | Kritický | Žádný |
| 3 | **Resend (email)** | `RESEND_API_KEY` | ⛔ DEPRECATED | — | Resend demontován 2026-04-15 (FIX-037). Radim: „nebudeme používat resend." |
| 4 | **WEDOS SMTP** | `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | ❌ BROKEN 🔴 | Kritický | AUDIT-031 ✅ (Wedos pool+STARTTLS implementováno). Creds chybí → `[EMAIL:NOT_CONFIGURED]`. Radim dodá po zakoupení mailboxu. |
| 5 | **Stripe (platby)** | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | ❌ BROKEN 🔴 | Kritický | Žádný — throws při volání |
| 6 | **Anthropic Claude API** | `ANTHROPIC_API_KEY` | ❌ BROKEN 🔴 | Střední | Žádný — AI asistent 500 |
| 7 | **Cebia (kontrola vozidel)** | `CEBIA_API_KEY` | ⚠️ MOCK-OK | Nízký | Mock data explicitní v kódu |
| 8 | **VINdecoder.eu** | `VINDECODER_API_KEY`, `VINDECODER_API_SECRET` | ✅ LIVE | Střední | NHTSA fallback v kódu |
| 9 | **File upload (self-hosted)** | `UPLOAD_DIR` (chybí), `/var/www/uploads/` (chybí) | ❌ BROKEN 🔴 | Střední | Cloudinary (legacy, klíče přítomné) |
| 10 | **Cloudinary (legacy)** | `CLOUDINARY_*` (3 klíče) | ⚠️ LEGACY | Střední | — migrace na self-hosted (ale ta nefunguje) |
| 11 | **Cron scheduler** | `CRON_SECRET` | ✅ LIVE | Nízký | Žádný — ale funguje |
| 12 | **Pusher (real-time)** | `PUSHER_*` (5 klíčů) | ⏸ PLANNED | Nízký | Polling fallback v kódu (předpokládán) |
| 13 | **Plausible Analytics** | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | ❌ MISSING | Nízký | Analytics render null (graceful) |
| 14 | **Sentry (error tracking)** | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_*` | ❌ MISSING | Nízký 🟠 | App běží bez error trackingu |
| 15 | **Zásilkovna** | `ZASILKOVNA_API_KEY` | ❌ MISSING | Nízký | Dry-run mode v kódu |
| 16 | **Mapy.cz** | `MAPYCZ_API_KEY` | ⏸ PLANNED | Nízký | Komponenta neimplementována |
| 17 | **Marketplace invite tokens** | `MARKETPLACE_INVITE_TOKEN_*` | ⚠️ WAITLIST | Nízký | Waitlist gate aktivní, invite flow disabled |
| 18 | **VIN ocr / Kimi AI** | `MOONSHOT_API_KEY` | ❌ MISSING | Nízký | Manuální VIN input |
| 19 | **Twilio (SMS)** | `TWILIO_*` | ❌ MISSING | Nízký | App funguje bez SMS |
| 20 | **Google OAuth** | `GOOGLE_CLIENT_ID/SECRET` | ⏸ LIKELY | Nízký | NextAuth email fallback |
| 21 | **Resend (newsletter)** | viz #3 | ❌ BROKEN | Nízký | viz #3 |
| 22 | **Vercel Edge Config** | `EDGE_CONFIG` | ❌ MISSING | Nízký 🟡 | Feature flags nefungují |
| 23 | **Flags / feature flags** | via Edge Config | ❌ MISSING | Nízký 🟡 | Hardcoded defaults |
| 24 | **Raynet CRM** | `RAYNET_API_KEY` | ❌ LIKELY MISSING | Nízký | Makléřský pipeline manuální |
| 25 | **Posthog** | `NEXT_PUBLIC_POSTHOG_KEY` | ❌ MISSING | Nízký | Graceful null |
| 26 | **Lemon Squeezy** | `LEMONSQUEEZY_*` | ❌ LIKELY MISSING | Nízký 🟡 | Stripe fallback (ale ta také broken) |
| 27 | **Google Maps embed** | `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | ❌ LIKELY MISSING | Nízký | Map renders blank |
| 28 | **N8N webhooks** | `N8N_WEBHOOK_*` | ❌ LIKELY MISSING | Nízký | Workflow notifikace nefungují |

---

## Kritická zjištění

### BLOCKER 1 — Email zcela nefunguje (FIX-047c / FIX-037)
```
AUDIT-031 ✅ — Wedos nodemailer pool implementován (commit 3db417d):
  host: smtp.wedos.net, port: 587, STARTTLS, pool: true, maxConnections: 3

FIX-037 PENDING — Resend demontáž (Radim: „nebudeme používat resend"):
  lib/resend.ts stále existuje, lib/email.ts stále importuje Resend branch
  5 callerů stále from "@/lib/resend"

Chybí v pm2 env: SMTP_USER, SMTP_PASSWORD, SMTP_FROM
→ email endpoint vrací [EMAIL:NOT_CONFIGURED]
```
**Dopad:** Pozvánky makléřů, potvrzení plateb, GDPR notifikace → nefungují.  
**Fix:** (1) Implementátor dokončí FIX-037 demontáž Resend. (2) Radim doplní SMTP_USER/SMTP_PASSWORD/SMTP_FROM po zakoupení Wedos mailboxu na wedos.com/hosting/.

### BLOCKER 2 — Stripe klíč prázdný (FIX-047b)
```
pm2 env → STRIPE_SECRET_KEY="" (prázdný string)
STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET = stav neznámý
```
**Dopad:** Jakékoliv volání `stripe.checkout.sessions.create()` throws `AuthenticationError`.  
**Fix:** Doplnit Stripe test-mode klíče do pm2 env.

### BLOCKER 3 — Anthropic API key chybí (FIX-047a)
```
pm2 env → ANTHROPIC_API_KEY = nenalezen (klíč vůbec není)
new Anthropic() → auto-reads ANTHROPIC_API_KEY → throws
```
**Dopad:** AI asistent pro makléře → 500, generování popisů vozidel → 500.  
**Fix:** Doplnit ANTHROPIC_API_KEY do pm2 env.

### BLOCKER 4 — Upload adresář chybí (FIX-047e)
```
UPLOAD_DIR env: nenalezeno
/var/www/uploads/: neexistuje (ls vrátí 404)
```
**Dopad:** Nahrávání fotek vozidel → crash. Fallback na Cloudinary (legacy klíče přítomné) — lze použít jako temporary workaround.  
**Fix:** Buď vytvořit /var/www/uploads/ + nastavit UPLOAD_DIR, nebo explicitně přepnout na Cloudinary jako primary.

---

## Stav e-mailového fallback řetězce

```
resolveEmailProvider() výběr [lib/email.ts]:
  if EMAIL_PROVIDER == "resend"  → ResendProvider(RESEND_API_KEY)  [EMPTY KEY → auth fail]
  if RESEND_API_KEY present      → ResendProvider(...)              [EMPTY KEY → auth fail]
  if WEDOS_SMTP_HOST present     → WedosSmtpProvider(...)           [MISSING → skip]
  else                           → DevNullProvider (no-op log)      [ACTIVE = emaily nefungují]
```

---

## Integrace fungující bez zásahu (✅)

- **NextAuth + PostgreSQL**: autentizace, session management, role-based access ✅
- **VINdecoder.eu**: VIN decode s NHTSA fallback ✅  
- **Cron secret**: scheduled tasks endpoint ✅
- **Cebia mock**: nezávislý na real API ✅
- **Marketplace waitlist gate**: bez invite tokeny funguje jako waitlist ✅

---

## Verifikační metoda

```bash
# Recon (env dump)
ssh root@91.98.203.239 'tr "\0" "\n" < /proc/$(cat /proc/$(pm2 pid car-zajcon)/status | head -1)/environ | grep -E "KEY|SECRET|TOKEN|DSN|URL|HOST|PASS" | sed "s/=.*/=<REDACTED>/"'

# Smoke testy provedeny:
# GET /api/auth/session → 200 ✅
# GET /api/cron/... → 200 ✅ (s CRON_SECRET hlavičkou)
# GET /api/cebia/status → 404 (endpoint neexistuje, ale CEBIA_API_KEY přítomen)
# curl https://car.zajcon.cz/ | grep plausible → 0 (no tracking pixel)
```

---

## Změny v LAUNCH-CHECKLIST

| Checklist item | Před auditem | Po auditu |
|---------------|-------------|-----------|
| A3 (email) | 🟡 nezjišťováno | 🔴 BLOCKER — resend empty + smtp missing |
| A4 (platby) | 🟡 nezjišťováno | 🔴 BLOCKER — stripe empty key |
| A7 (sentry) | 🟡 nice-to-have | 🟠 M1 — no DSN at all |
| B5 (AI asistent) | ⏳ pending | 🔴 BLOCKER — api key missing |
| C9 (upload) | ⏳ pending | 🔴 BLOCKER — dir missing + env missing |

---

*Autor: radim-kontrolor | AUDIT-015 Phase 3 output*
