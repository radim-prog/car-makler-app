# AUDIT-013c: E2E Smoke — Celý Workflow Sandboxu
**Datum:** 2026-04-14
**Kontrolor:** kontrolor (sonnet)
**Sandbox:** https://car.zajcon.cz (bez Basic Auth)
**Metody:** curl + Playwright chromium headless

---

## EXECUTIVE SUMMARY

| Oblast | Status | Blocker? |
|--------|--------|----------|
| Veřejné routy | ✅ Všechny OK | Ne |
| Subdomény (Host header) | ✅ Správné tituly a obsah | Ne |
| Registrace | ✅ 201, platná odpověď | Ne |
| Login (autentizace) | ✅ Session se vytvoří | Ne |
| Admin panel přístup | 🔴 **NEDOSTUPNÝ** | **ANO** |
| Broker PWA přístup | 🔴 **NEDOSTUPNÝ** | **ANO** |
| User profil | 🔴 **NEDOSTUPNÝ** | **ANO** |
| PostgreSQL zálohy | 🔴 **NEEXISTUJÍ** | **ANO** |
| Email (Resend) | ⚠️ DEV mode (RESEND_API_KEY chybí) | Ano pro produkci |
| pm2 env persistence | ⚠️ Ztratí se po reboot | Ano pro produkci |

---

## 1. Veřejné routy (bez přihlášení)

| Routa | Status | Verdict |
|-------|--------|---------|
| `/` | 200 | ✅ |
| `/prihlaseni` | 200 | ✅ |
| `/registrace` | 200 | ✅ |
| `/zapomenute-heslo` | 200 | ✅ |
| `/admin` | 307 → `/login?callbackUrl=/admin` | ✅ Správně chrání |
| `/makler` | 307 → login | ✅ |
| `/dily` | 200 | ✅ |
| `/inzerce` | 200 | ✅ |
| `/marketplace` | 200 | ✅ |
| `/nabidka` | 200 | ✅ |
| `/sitemap.xml` | 200 | ✅ |
| `/robots.txt` | 200 | ✅ |
| `/sw.js` | 200 | ✅ |

**Veřejný obsah je přístupný. API endpointy vrací reálná DB data.**

---

## 2. Subdomény (via Host header)

| Subdoména | HTTP | Page Title | Verdict |
|-----------|------|-----------|---------|
| `inzerce.car.zajcon.cz` | 200 | **"Inzerce — vložte inzerát zdarma \| CarMakléř"** | ✅ Správný obsah |
| `shop.car.zajcon.cz` | 200 | **"Shop — autodíly a příslušenství \| CarMakléř"** | ✅ Správný obsah |
| `marketplace.car.zajcon.cz` | 200 | **"Marketplace \| Investiční platforma pro flipping aut \| CarMakléř"** | ✅ Správný obsah |

**Subdomain middleware routing funguje korektně.** Každá subdoména zobrazuje správný produkt.

**Poznámka:** Nginx má nakonfigurováno pouze `car.zajcon.cz`. Skutečné subdomény (`inzerce.`, `shop.`, `marketplace.`) nejsou zatím v nginx — fungují pouze přes `Host` header trick. Až DNS propaguje, nutno přidat nginx server bloky.

⚠️ **NEXTAUTH_COOKIE_DOMAIN**: Env var `NEXT_PUBLIC_INZERCE_URL`, `NEXT_PUBLIC_SHOP_URL`, `NEXT_PUBLIC_MARKETPLACE_URL` jsou nastaveny na `https://car.zajcon.cz` místo skutečných subdomain URL. Nutno opravit až budou subdomény live.

---

## 3. Registrace

```
POST /api/auth/register
Body: { firstName, lastName, email, phone, password, role:"BUYER" }
Response 201:
{
  "user": { "id": "cmnydp8mu...", "email": "kontrolor-test@carmakler.cz",
            "role": "BUYER", "status": "ACTIVE", "createdAt": "2026-04-14T..." },
  "emailVerificationRequired": true
}
```

✅ **Registrace funguje.** Uživatel vytvořen v DB, odpověď správná.

Registrační formulář má správná pole: `firstName`, `lastName`, `email`, `phone`, `password`, `passwordConfirm` ✅

⚠️ `emailVerificationRequired: true` — ověřovací email se posílá přes Resend. Ale:
```
[Email:DEV] RESEND_API_KEY not set. Would send to: kontrolor-test@carmakler.cz,
            subject: "Ověřte svůj email — CarMakléř"
```
**Email se neodesílá** — `RESEND_API_KEY` není nastavený v sandbox `.env`. Nový uživatel si nemůže ověřit email, ale login to neblokuje (viz auth.ts — emailVerified není podmínkou přihlášení).

---

## 4. Login / Session

**Playwright test** (headless Chromium):

```
Email:    radim@carmakler.cz
Heslo:    Ht7#jLs5bN8wYx (seed credentials)

Session po přihlášení:
{
  "user": {
    "name": "Radim Novák",
    "email": "radim@carmakler.cz",
    "role": "ADMIN",
    "status": "ACTIVE",
    "isEmailVerified": false,
    "onboardingCompleted": false
  },
  "expires": "2026-05-14T08:50:58.580Z"
}
```

✅ **Autentizace funguje** — JWT session se správně vytvoří.

⚠️ Password reset flow funguje (200, správná hlášení). Ale email se neodesílá (RESEND_API_KEY chybí).

---

## 5. 🔴 KRITICKÁ CHYBA: Admin panel / Broker PWA / User profil — NEDOSTUPNÉ

### Symptom

Po úspěšném přihlášení jsou VŠECHNY chráněné routy nedostupné:

```
/admin          → /login?callbackUrl=%2Fadmin
/admin/dashboard → /login?callbackUrl=%2Fadmin%2Fdashboard
/makler         → /login?callbackUrl=%2Fmakler%2Fdashboard
/muj-ucet       → /login?callbackUrl=%2Fmuj-ucet
```

Přestože `GET /api/auth/session` vrací platnou session s ADMIN rolí.

### Root Cause: Cookie Name Mismatch

**`lib/auth.ts` (řádek 50-59):**
```js
cookies: {
  sessionToken: {
    name: "next-auth.session-token",   // ← hardcoded bez __Secure- prefixu
    options: {
      secure: process.env.NODE_ENV === "production",  // true v produkci
    },
  },
},
```

**`middleware.ts` (řádek 176-179):**
```js
const token = await getToken({
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
  // ← CHYBÍ: cookieName: "next-auth.session-token"
});
```

**Mechanismus selhání:**
1. `lib/auth.ts` nastavuje cookie s názvem `"next-auth.session-token"` a `secure: true`
2. `getToken()` v middleware bez explicitního `cookieName` hledá v produkci výchozí `"__Secure-next-auth.session-token"` (NextAuth konvence pro HTTPS)
3. Cookie s tímto názvem **neexistuje** → `getToken()` vrátí `null`
4. Middleware přesměruje na `/login`

**Důsledek:** Žádný uživatel (ADMIN ani ostatní) nemůže přistoupit k chráněným routám v produkci/sandboxu.

### Fix (2 varianty)

**Varianta A — Opravit middleware (minimální změna):**
```ts
// middleware.ts — přidat cookieName do KAŽDÉHO getToken() volání
const token = await getToken({
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
  cookieName: "next-auth.session-token",  // ← přidat toto
});
```

**Varianta B — Opravit auth.ts (doporučeno):**
```ts
// lib/auth.ts — odstranit přepsání cookie name, nechat NextAuth výchozí chování
// (Next.js automaticky použije __Secure- prefix v produkci)
// Nebo explicitně:
name: process.env.NODE_ENV === "production"
  ? "__Secure-next-auth.session-token"
  : "next-auth.session-token",
```

**Doporučení:** Varianta B je čistší — aligns s NextAuth konvencemi.

---

## 6. Admin uživatelé v DB

```
Sandbox DB (carmakler_sandbox):
email                 | role  | status | emailVerified
----------------------+-------+--------+--------------
admin@carmakler.cz    | ADMIN | ACTIVE | NULL
jevgenij@carmakler.cz | ADMIN | ACTIVE | NULL
radim@carmakler.cz    | ADMIN | ACTIVE | NULL
```

Admin účty existují a jsou ACTIVE. Přihlášení funguje na session úrovni. Blokuje pouze middleware bug.

---

## 7. 🔴 KRITICKÉ: Žádná záloha PostgreSQL

```bash
# Cron jobs na serveru:
0 4 * * * /usr/bin/python3 /root/Projects/gmail-agent-v2/scripts/generate_patterns.py
0 9 * * * /root/NotificationSystem/run-cron.sh

# Žádný pg_dump cron!
# /var/backups/ — pouze systémové dpkg zálohy, žádný DB dump
# /root/backups/ — neexistuje
```

SQLite legacy soubory (z původní verze): `/var/www/carmakler/dev.db` + backup z 2026-04-06. Toto jsou STARÝ artefakty, nejsou relevantní pro aktuální PG.

**PostgreSQL `carmakler_sandbox` nemá žádnou zálohovací strategii.** Ztráta serveru = ztráta dat.

**Doporučená minimální záloha:**
```bash
# /etc/cron.d/carmakler-backup
0 3 * * * postgres pg_dump carmakler_sandbox | gzip > /var/backups/carmakler-$(date +%Y%m%d).sql.gz
# Rotace: ponechat posledních 7 dní
```

---

## 8. Sentry Deprecated Config

```
[@sentry/nextjs] DEPRECATION WARNING: autoInstrumentServerFunctions is deprecated
[@sentry/nextjs] DEPRECATION WARNING: autoInstrumentMiddleware is deprecated
[@sentry/nextjs] DEPRECATION WARNING: autoInstrumentAppDirectory is deprecated
```

Opakuje se při každém restartu. Je to pouze warning, neblokuje funkčnost. Fix: přejít na `webpack.*` varianty v `next.config.js`.

---

## 9. pm2 env persistence (caveat)

Env vars (včetně `DATABASE_URL`, `NEXTAUTH_SECRET`) se ztratí po `pm2 resurrect` nebo restartu serveru. Nutno přidat `ecosystem.config.js`.

---

## Závěrečná Go/No-Go Tabulka

| Oblast | Go? | Poznámka |
|--------|-----|----------|
| Veřejný web | ✅ GO | Funguje plně |
| Subdomény (middleware) | ✅ GO | Logika OK, nginx pending |
| Registrace | ✅ GO | Funguje |
| Přihlášení (auth vrstva) | ✅ GO | JWT session OK |
| Admin panel | 🔴 NO-GO | Cookie mismatch bug — fix nutný |
| Broker PWA | 🔴 NO-GO | Stejný bug |
| User profil/moje-inzeraty | 🔴 NO-GO | Stejný bug |
| Emailing (Resend) | 🔴 NO-GO | RESEND_API_KEY chybí — žádné emaily |
| DB zálohy | 🔴 NO-GO | Nulová zálohovací strategie |
| pm2 env persistence | ⚠️ RIZIKO | ecosystem.config.js chybí |
| Sentry config | ⚠️ WARN | Deprecated, neblokující |

### Odpověď na Radimovu otázku: „Jsme hotoví, jít do světa?"

**NE** — 3 blokery musí být vyřešeny před produkčním nasazením:

1. 🔴 **P0 — Cookie mismatch v middleware** — žádný uživatel se nedostane za login (2 řádky kódu)
2. 🔴 **P0 — Resend API key** — bez emailů nefunguje: ověření emailu, reset hesla, notifikace
3. 🔴 **P0 — PostgreSQL zálohy** — data bez ochrany

Po těchto fixech: architektura, subdomény, DB vrstva a veřejný web jsou produkčně ready.

---

## v2 — Full E2E po FIX-004, FIX-005, FIX-007 (2026-04-14)

**Metoda:** curl cookie injection → Playwright context (obchází React controlled form issue s `+` v emailu)

### 10. FIX-005 verify (Cookie mismatch fix)

Cookie po loginu: `__Secure-next-auth.session-token` (HTTPS prefix správný) ✅
Přihlášení přes API potvrzeno pro všech 5 rolí. Middleware `getToken()` token čte.

### 11. Chráněné routy — 5 rolí × 16 rout = 16/16 PASS

| Role | Status | Route | Výsledek | URL |
|------|--------|-------|----------|-----|
| ADMIN | ACTIVE | `/admin` | ✅ | https://car.zajcon.cz/admin |
| ADMIN | ACTIVE | `/admin/dashboard` | ✅ | https://car.zajcon.cz/admin/dashboard |
| ADMIN | ACTIVE | `/admin/users` | ✅ | https://car.zajcon.cz/admin/users |
| ADMIN | ACTIVE | `/admin/vehicles` | ✅ | https://car.zajcon.cz/admin/vehicles |
| BROKER | ONBOARDING | `/makler` | ✅ | https://car.zajcon.cz/makler |
| BROKER | ONBOARDING | `/makler/dashboard` | ✅ → onboarding | https://car.zajcon.cz/makler/onboarding/profile |
| BROKER | ONBOARDING | `/makler/vozidla/nova-nabidka` | ✅ | https://car.zajcon.cz/makler/vozidla/nova-nabidka |
| BROKER | ONBOARDING | `/makler/stats` | ✅ → onboarding | https://car.zajcon.cz/makler/onboarding/profile |
| BUYER | ACTIVE | `/muj-ucet` | ✅ | https://car.zajcon.cz/muj-ucet |
| BUYER | ACTIVE | `/muj-ucet/objednavky` | ✅ | https://car.zajcon.cz/muj-ucet/objednavky |
| ADVERTISER | ACTIVE | `/muj-ucet` | ✅ | https://car.zajcon.cz/muj-ucet |
| ADVERTISER | ACTIVE | `/muj-ucet/inzeraty` | ✅ | https://car.zajcon.cz/muj-ucet/inzeraty |
| ADVERTISER | ACTIVE | `/inzerce/pridat` | ✅ | https://car.zajcon.cz/inzerce/pridat |
| INVESTOR | ACTIVE | `/muj-ucet` | ✅ | https://car.zajcon.cz/muj-ucet |
| INVESTOR | ACTIVE | `/marketplace` | ✅ | https://car.zajcon.cz/marketplace |
| INVESTOR | ACTIVE | `/marketplace/investice` | ✅ | https://car.zajcon.cz/marketplace/investice |

**Pozn.:** BROKER s `ONBOARDING` statusem správně přesměrován na `/makler/onboarding/profile` pro route `/makler/dashboard` a `/makler/stats` — to je záměrné chování, ne bug.

### 12. FIX-007 verify (PG zálohy)

```
/root/db-backups/:
carmakler-2026-04-14.sql.gz   31K  ← prod dump ✅
sandbox-2026-04-14.sql.gz     32K  ← sandbox dump ✅
pre-deploy-20260406-174639.dump     ← starý artefakt (OK)

/etc/cron.d/pg-backup-carmakler:
03:00 UTC — pg_dump carmakler (prod)
03:15 UTC — pg_dump carmakler_sandbox
04:00 UTC — retence 30 dní
```

✅ Zálohovací strategie aktivní. Oba dumpy manuálně ověřeny (validní SQL header).

### 13. FIX-004 verify (Deploy script)

`scripts/deploy-sandbox.sh` existuje, spustitelný, obsahuje retry loop 10×/2s ✅

### 14. FIX-006 (RESEND) — BLOCKED

`RESEND_API_KEY` není nastaven na sandboxu. Všechny emaily jsou DEV-only logované. Eskalováno Radimovi.
Email testy **přeskočeny** — NETESTOVÁNO dokud klíč není dodán.

---

## v2 Závěrečná tabulka (po fixech)

| Oblast | Go? | Změna | Poznámka |
|--------|-----|-------|----------|
| Veřejný web | ✅ GO | = | Beze změny |
| Subdomény | ✅ GO | = | |
| Registrace | ✅ GO | = | |
| Přihlášení (auth) | ✅ GO | ✅ opraven | FIX-005 — cookie fix |
| **Admin panel** | **✅ GO** | **🔴→✅** | **FIX-005 opravil** |
| **Broker PWA** | **✅ GO** | **🔴→✅** | **FIX-005 + onboarding flow OK** |
| **User profil** | **✅ GO** | **🔴→✅** | **FIX-005 opravil** |
| **Advertiser/Investor** | **✅ GO** | **nové** | **16/16 rout přístupných** |
| **DB zálohy** | **✅ GO** | **🔴→✅** | **FIX-007 — denní pg_dump aktivní** |
| Emailing (Resend) | 🔴 NO-GO | = | FIX-006 čeká na Radima |
| pm2 env persistence | ⚠️ RIZIKO | = | ecosystem.config.js chybí |
| Sentry config | ⚠️ WARN | = | Deprecated, neblokující |

### Aktualizovaná odpověď: „Jsme hotoví?"

**Blíže — 1 zbývající P0 blocker:**

1. ✅ ~~Cookie mismatch~~ — FIX-005 nasazen a ověřen
2. ✅ ~~PostgreSQL zálohy~~ — FIX-007 nasazen a ověřen
3. 🔴 **P0 — RESEND_API_KEY** — bez emailů nefunguje verifikace, reset hesla, notifikace (čeká na Radima)

Po přidání RESEND_API_KEY: veřejný web, auth, 4 produkty, chráněné routy, DB zálohy — vše produkčně ready pro soft launch.
