# AUDIT-008 — Access Matrix (Security)

**Autor:** radim-kontrolor
**Datum:** 2026-04-14
**Metoda:** JWT injection (next-auth/jwt encode) + Playwright page.request.get() s maxRedirects:10
**Sandbox:** https://car.zajcon.cz
**Middleware zdroj:** `middleware.ts` (celý přečten + analyzován)

---

## 1) Konfigurace cookie scope (kritický kontext)

`NEXTAUTH_COOKIE_DOMAIN` **NENÍ nastaven** v `.env` → cookie `__Secure-next-auth.session-token` je scopovaný na **`car.zajcon.cz`** (přesný host, ne wildcard). Subdomény (`inzerce.car.zajcon.cz`, `shop.car.zajcon.cz`, `marketplace.car.zajcon.cz`) **nevidí session cookie** → všichni uživatelé na subdoménách jsou anonymous vůči NextAuth getToken().

> **Dopad:** Pokud subdoména rewrite zachová protected route (viz §2), user je anonymous a může být neautorizovaný. Zatím není problém (chráněné routy jsou na main hostu), ale je to riziko pro budoucí subdomain-specific auth.

---

## 2) Middleware role matrix

Přečtené role arrays z `middleware.ts`:

| Array | Role | Použito pro |
|---|---|---|
| `ADMIN_ROLES` | ADMIN, BACKOFFICE, MANAGER, REGIONAL_DIRECTOR | `/admin/*` |
| `MAKLER_ROLES` | BROKER, MANAGER, REGIONAL_DIRECTOR, ADMIN | `/makler/dashboard`, `/makler/stats`, atd. + `/makler/onboarding` |
| `INZERENT_ROLES` | ADVERTISER, ADMIN, BACKOFFICE | **⚠️ DEFINED BUT NEVER USED** |
| `BUYER_ROLES` | BUYER, ADVERTISER, ADMIN, BACKOFFICE | **⚠️ DEFINED BUT NEVER USED** |
| `PARTS_SUPPLIER_ROLES` | PARTS_SUPPLIER, WHOLESALE_SUPPLIER, PARTNER_VRAKOVISTE, ADMIN, BACKOFFICE | `/parts` |
| `MARKETPLACE_DEALER_ROLES` | VERIFIED_DEALER, ADMIN, BACKOFFICE | `/marketplace/dealer` |
| `MARKETPLACE_INVESTOR_ROLES` | INVESTOR, ADMIN, BACKOFFICE | `/marketplace/investor` |
| `PARTNER_ROLES` | PARTNER_BAZAR, PARTNER_VRAKOVISTE, ADMIN, BACKOFFICE | `/partner` |

### Protected paths summary

| Prefix | Auth required | Role check |
|---|---|---|
| `/admin` | ✅ | ADMIN_ROLES |
| `/makler/onboarding` | ✅ | MAKLER_ROLES |
| `/makler/dashboard`, `/makler/vehicles`, atd. (explicit list) | ✅ | MAKLER_ROLES; ONBOARDING→redirect |
| `/parts` | ✅ | PARTS_SUPPLIER_ROLES |
| `/marketplace/dealer` | ✅ | MARKETPLACE_DEALER_ROLES |
| `/marketplace/investor` | ✅ | MARKETPLACE_INVESTOR_ROLES |
| `/partner` | ✅ | PARTNER_ROLES |
| `/muj-ucet`, `/moje-inzeraty`, `/shop/moje-objednavky`, `/dily/moje-objednavky` | ✅ | any auth (no role check) |
| `/inzerce/*` | ❌ **MISSING** | — |
| `/marketplace/investice` | ❌ **ROUTE NEEXISTUJE** | — |

---

## 3) Access Matrix — výsledky

### Legenda
- ✅ YES = přistup povolen (200, obsah na cílové routě nebo korektní alternate)
- ❌ NO = přístup zamítnut (redirect login / home / apply)
- ✅ ONBOARDING = korektní redirect na onboarding flow
- ⚠️ = viz poznámka

| Role | /admin/dashboard | /admin/users | /makler/dashboard | /makler/stats | /marketplace/investor | /marketplace/dealer | /marketplace/investice | /muj-ucet | /inzerce/pridat |
|---|---|---|---|---|---|---|---|---|---|
| **anon** | ❌ →/login | ❌ →/login | ❌ →/login | ❌ →/login | ❌ →/apply | ❌ →/apply | ❌ 404 | ❌ →/login | **⚠️ ✅ VOLNÝ PŘÍSTUP** |
| **BUYER** | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/marketplace | ❌ →/marketplace | ❌ 404 | ✅ | **⚠️ ✅ VOLNÝ PŘÍSTUP** |
| **BROKER (ACTIVE)** | ❌ →/ | ❌ →/ | ✅ | ✅ | ❌ →/marketplace | ❌ →/marketplace | ❌ 404 | ✅ | **⚠️ ✅ VOLNÝ PŘÍSTUP** |
| **BROKER (ONBOARDING)** | ❌ →/ | ❌ →/ | ✅ ONBOARDING | ✅ ONBOARDING | ❌ →/marketplace | ❌ →/marketplace | ❌ 404 | ✅ | **⚠️ ✅ VOLNÝ PŘÍSTUP** |
| **ADVERTISER** | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/marketplace | ❌ →/marketplace | ❌ 404 | ✅ | ✅ (expected) |
| **INVESTOR** | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/ | ✅ | ❌ →/marketplace | ❌ 404 | ✅ | **⚠️ ✅ VOLNÝ PŘÍSTUP** |
| **VERIFIED_DEALER** | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/ | ❌ →/marketplace | ✅ | ❌ 404 | ✅ | **⚠️ ✅ VOLNÝ PŘÍSTUP** |
| **BACKOFFICE** | ✅ | ✅ | ❌ →/ | ❌ →/ | ✅ | ✅ | ❌ 404 | ✅ | ✅ (expected) |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ 404 | ✅ | ✅ (expected) |

### Poznámky k "false positive" anomáliím

1. **`/marketplace/investor|dealer` → `/marketplace?reason=not_authorized`**: Správné UX chování — uživatel vidí marketplace landing s chybovou zprávou, NEVIDÍ investorský/dealerský obsah. Redirect 200 na landing page = záměrný design.

2. **BACKOFFICE odmítnut z `/makler/dashboard`**: Správně — BACKOFFICE není v `MAKLER_ROLES`. BACKOFFICE pracuje přes `/admin`, ne přes broker PWA. By design.

---

## 4) Findings

### F-A008-01 — `/inzerce/pridat` dostupné anonymně ❌ [P1]

**Popis:** `INZERENT_ROLES` je definováno v `middleware.ts` ale **nikdy se nepoužívá** v žádném `if (pathname.startsWith(...))` bloku. Výsledek: `/inzerce/pridat` (přidání inzerátu), a pravděpodobně všechny ostatní `/inzerce/*` routy (editace, mazání inzerátu), jsou **přístupné bez autentizace a bez ověření role**.

**Test:** `anon → /inzerce/pridat` → HTTP 200, final URL `/inzerce/pridat` (žádný redirect).

**Dopad:** Anonymní uživatel může podat inzerát. Pokud API endpoint `/api/inzerce/create` (nebo podobný) není chráněn na úrovni API route handler, je to **privilege escalation** — cizí obsah v databázi bez registrace.

**Pozn.:** Ochrana může existovat i na úrovni serveru (API route handler ověřuje session před zápisem do DB). Nutno ověřit `/api/inzerce/` handlery.

**Návrh FIX:** Přidat do middleware:
```typescript
if (pathname.startsWith('/inzerce/pridat') || pathname.startsWith('/moje-inzeraty')) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.redirect(new URL('/login', request.url));
  if (!INZERENT_ROLES.includes(token.role as string)) return NextResponse.redirect(new URL('/', request.url));
}
```

**Závažnost:** 🟠 P1 — záleží na tom, zda API handler je chráněn. Pokud ano: UI-level bypass (nízké riziko). Pokud ne: **write access bez auth** (vysoké riziko).

---

### F-A008-02 — `BUYER_ROLES` definováno, nikdy nepoužito [P2]

**Popis:** `BUYER_ROLES = ["BUYER", "ADVERTISER", "ADMIN", "BACKOFFICE"]` definováno v middleware ale žádná route není tímto chráněna. Pravděpodobně bylo plánováno pro buyer-specific routy (`/muj-ucet/objednavky`, `/kosik`, atd.) ale ochrana nebyla implementována.

**Dopad:** Nižší než F-A008-01 — `/muj-ucet` je chráněno pro "any auth" (bez role check). Pokud existují buyer-specific API endpointy, ty mohou být expozovány jiným rolím.

**Návrh:** Audit API routes `/api/buyer/*` nebo `/api/shop/*` zda mají session check.

**Závažnost:** 🟡 P2 — informační, závisí na API handler implementaci.

---

### F-A008-03 — `/marketplace/investice` vrací 404 pro všechny [INFO]

**Popis:** Route `/marketplace/investice` neexistuje (404) pro všechny role včetně ADMIN a INVESTOR. Route `/marketplace/investor` existuje a je správně chráněna.

**Možné příčiny:**
- Plánovaná route z dokumentace, která nebyla implementována
- Přejmenována z `/investice` na `/investor`
- Zbytková reference v navigaci/dokumentaci

**Dopad:** Pokud je `/marketplace/investice` odkazována z navigace nebo emailů, uživatelé dostanou 404. **Nesecurityní problém — UX bug.**

**Závažnost:** 🟢 INFO — ověřit zda route je odkazována odkudkoli; pokud ne, irelevantní.

---

### F-A008-04 — Cookie scope: subdomény bez session [RIZIKO]

**Popis:** `NEXTAUTH_COOKIE_DOMAIN` není nastaven → session token scopován na `car.zajcon.cz`. Uživatelé na `inzerce.car.zajcon.cz`, `shop.car.zajcon.cz`, `marketplace.car.zajcon.cz` jsou z pohledu NextAuth **anonymní**.

**Aktuální dopad:** Middleware auth checks pro `/inzerce/*`, `/shop/*` (`/shop/moje-objednavky`), `/marketplace/*` běží na main doméně (subdomain rewrite přejde na main app, token se čte z main cookie). Pro aktuální single-host setup to funguje správně.

**Budoucí riziko:** Pokud by subdomény přešly na vlastní Next.js instance, cookie by přestala fungovat a uživatelé by byli trvale anonymous.

**Dopad nyní:** 🟢 NÍZKÝ — single host, rewrite funguje. Pro produkci s `carmakler.cz` doporučit nastavit `NEXTAUTH_COOKIE_DOMAIN=.carmakler.cz`.

---

## 5) Subdomain access test (bonus)

Testovány 4 hosty — zda admin endpoint projde přes subdomain URL:

| Host | Path | Výsledek |
|---|---|---|
| car.zajcon.cz | /admin/dashboard | ❌ →/login (bez cookie) ✅ →/admin/dashboard (s ADMIN cookie) |
| inzerce.car.zajcon.cz | /admin | `/admin` je v SKIP_REWRITE_PREFIXES → rewrite přeskočen → auth check proběhne → ❌ redirect (cookie není na subdoméně) |
| marketplace.car.zajcon.cz | /admin | Stejně jako inzerce — SKIP_REWRITE → ❌ redirect |

**Výsledek:** Admin panel je chráněn i na subdoménách. Cookie scope je bezpečný v aktuální architektuře (single host). ✅

---

## 6) Souhrn findings

| # | Finding | Závažnost | Dopad |
|---|---|---|---|
| F-A008-01 | `/inzerce/pridat` přístupné bez auth (INZERENT_ROLES unused) | 🟠 P1 | Závisí na API handler — nutno ověřit |
| F-A008-02 | `BUYER_ROLES` definovano, nikdy nepoužito | 🟡 P2 | Informační, API handler audit |
| F-A008-03 | `/marketplace/investice` → 404 pro všechny | 🟢 INFO | UX bug, ne security |
| F-A008-04 | Cookie scope: subdomény bez session | 🟢 NÍZKÝ | Bezpečný v current setup |

**Celkový security verdict:** 🟠 1× P1 (inzerce unprotected UI) — okamžitá kontrola API handleru nutná.

**Dobré zprávy:**
- `/admin/*` dobře chráněno — žádný privilege escalation pro admin panel ✅
- `/makler/*` dobře chráněno — BROKER isolation funguje ✅
- `/marketplace/investor` a `/marketplace/dealer` správně chráněno ✅
- `/parts` správně chráněno ✅
- BROKER ONBOARDING → onboarding redirect funguje ✅
- Admin panel chráněn i přes subdomain URLs ✅

---

## 7) Doporučené follow-up akce

1. **[OKAMŽITĚ]** Ověřit `/api/inzerce/create` (nebo ekvivalentní) handler — má session check? Pokud NE → P0 security fix.
2. **[FIX pro middleware]** Přidat ochranný blok pro `/inzerce/pridat` v middleware.ts.
3. **[Produkce]** Nastavit `NEXTAUTH_COOKIE_DOMAIN=.carmakler.cz` pro cross-subdomain sessions.
4. **[AUDIT-007b]** Zkontrolovat inzerce flow E2E (přidání inzerátu bez přihlášení = reálný test).
