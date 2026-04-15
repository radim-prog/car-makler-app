# AUDIT-024 — GDPR Technický Audit
**Datum:** 2026-04-14
**Auditor:** QA agent (Claude Sonnet 4.6)
**Projekt:** Carmakler — car-makler-app
**Sandbox:** https://car.zajcon.cz (během auditu nedostupný — nginx 502)
**Větev:** main @ 66dc687

---

## Přehled výsledků

| GDPR právo | Článek | Implementace | Stav |
|---|---|---|---|
| Právo na přístup / export dat | Art. 15 | `GET /api/settings/export` → JSON soubor | ⚠️ Částečné |
| Právo na výmaz | Art. 17 | `POST /api/settings/delete-account` | ❌ Stub — pouze notifikace |
| Právo na přenositelnost | Art. 20 | JSON export (viz Art. 15) | ⚠️ Částečné |
| Audit trail zpracování | Art. 5(2) | Žádný model AuditLog | ❌ Chybí |
| Cookie consent | Art. 7 + ePrivacy | CookieConsent komponenta přítomna | ⚠️ Nedostatečné |
| Kaskádové mazání PII | Art. 17 | Bez onDelete Cascade pro User | ❌ Chybí |

---

## Findings

### F-GDPR-01 — AuditLog model neexistuje
**Závažnost:** VYSOKÁ

**Nález:** Schema `prisma/schema.prisma` (1806 řádků) neobsahuje žádný model `AuditLog`, tabulku `audit_log` ani žádnou strukturu pro logování přístupu k osobním údajům. Grep přes celý adresář `prisma/` nevrátil žádný výsledek.

**Dopad:** Bez audit logu není možné prokázat soulad s čl. 5 odst. 2 GDPR (zásada odpovědnosti). V případě porušení ochrany dat není k dispozici záznam kdo, kdy a k jakým datům přistupoval.

**Kde chybí:** Celý projekt — schema, API routes, admin panel.

---

### F-GDPR-02 — Art. 17 erasure je jen stub (pouhá notifikace)
**Závažnost:** KRITICKÁ

**Nález:** Soubor `app/api/settings/delete-account/route.ts` neobsahuje žádnou anonymizaci ani smazání dat. Endpoint pouze:
1. Najde adminy role ADMIN/BACKOFFICE
2. Pošle jim interní notifikaci `createNotification(...)` se zprávou "Makléř X žádá o smazání účtu"
3. Vrátí `200 OK` s textem "Žádost o smazání účtu byla odeslána. Budeme vás kontaktovat."

**Chybí:** `prisma.user.update(anonymize)`, `prisma.$transaction(...)`, `prisma.user.delete(...)`, mazání sessions, odvolání tokenů, anonymizace vázaných záznamů.

**Dopad:** Uživatel obdrží potvrzení, ale jeho data zůstanou v databázi nedotčena. GDPR čl. 17 vyžaduje výmaz nebo anonymizaci bez zbytečného odkladu (obecně do 30 dnů).

---

### F-GDPR-03 — Art. 15 export je neúplný (chybí klíčové modely)
**Závažnost:** STŘEDNÍ

**Nález:** `app/api/settings/export/route.ts` exportuje:
- `User` profil (základní pole)
- `Vehicle` záznamy (brokerId)
- `SellerContact` záznamy (brokerId)
- `Commission` záznamy (brokerId)

**Chybí v exportu:**
- `AiConversation` — AI konverzace obsahují přímé vstupy uživatele (PII v JSON poli `messages`)
- `Notification` — záznamy o aktivitě
- `Lead` — přiřazené leady obsahují jméno, telefon, email třetích osob zpracované ve jménu uživatele
- `BrokerPayout` — finanční záznamy
- `Escalation`, `Contract`, `EmailLog` — historické záznamy
- `Inquiry` (jako `senderId`) — dotazy kupujícího
- `Listing` (pro role ADVERTISER) — inzeráty

**Poznámka k testu:** Sandbox vracel `502 Bad Gateway` — živý test endpointu nebyl možný. Analýza je založena na zdrojovém kódu.

**Dopad:** Neúplný export nesplňuje čl. 15 GDPR, který vyžaduje kopii VŠECH osobních údajů subjektu.

---

### F-GDPR-04 — Plausible Analytics načítán bez cookie consentu
**Závažnost:** VYSOKÁ

**Nález:**
- `app/layout.tsx` renderuje `<Analytics />` bezpodmínečně jako součást root layoutu (řádek 87)
- `components/web/Analytics.tsx` vkládá `<Script src="https://plausible.io/js/script.js" strategy="afterInteractive" />` bez jakékoli podmínky
- Komponenta **nečte** `useCookieConsent` hook ani `localStorage` cookie consent
- `useCookieConsent` hook existuje (`lib/hooks/useCookieConsent.ts`) a je funkční, ale není použit v `Analytics.tsx`

**Konkrétní problém:** Plausible skript se načte všem návštěvníkům ihned po první návštěvě stránky — ještě před tím, než CookieConsent banner vůbec zaznamená souhlas/odmítnutí.

**Dopad:** Porušení ePrivacy směrnice (2002/58/EC) a čl. 6 GDPR — zpracování bez právního základu. Plausible je sice považován za privacy-friendly (no cookies), ale přesto provádí IP tracking a fingerprinting, což spadá pod čl. 5(1)(b) GDPR.

---

### F-GDPR-05 — Chybějící kaskádové mazání PII při smazání User záznamu
**Závažnost:** VYSOKÁ

**Nález:** Analýza `onDelete` direktiv v schema.prisma ukazuje, že žádná z hlavních User→PII relací nemá `onDelete: Cascade`. Konkrétně:

| Model | Pole s userId | onDelete | Stav |
|---|---|---|---|
| `AiConversation` | `userId` (NOT NULL) | výchozí (Restrict) | ❌ PII zůstane |
| `Inquiry` | `senderId` (nullable) | výchozí (SetNull) | ⚠️ Osieřelý záznam s email/phone |
| `Order` | `buyerId` (nullable) | výchozí (SetNull) | ⚠️ deliveryName/Phone/Email zůstane |
| `Lead` | `assignedToId` (nullable) | výchozí (SetNull) | ⚠️ Záznamy s name/phone/email třetích osob |
| `Commission` | `brokerId` (NOT NULL) | výchozí (Restrict) | ❌ Blokuje smazání User |
| `Contract` | `brokerId` (NOT NULL) | výchozí (Restrict) | ❌ Blokuje smazání User |
| `Notification` | `userId` (NOT NULL) | výchozí (Restrict) | ❌ PII zůstane |
| `SellerContact` | `brokerId` (NOT NULL) | výchozí (Restrict) | ❌ Obsahuje jméno/tel/email třetích osob |

**Klíčový problém:** `Order.deliveryName`, `Order.deliveryPhone`, `Order.deliveryEmail` jsou přímá PII pole uložená přímo v záznamu — při nastavení `buyerId = NULL` tato data **zůstanou v databázi** bez vazby na uživatele, ale jsou stále identifikovatelná.

**Dopad:** Při hypotetickém skutečném smazání uživatele (které aktuálně stejně neprobíhá — viz F-GDPR-02) by PII v `Order`, `Inquiry` a dalších tabulkách přežilo.

---

### F-GDPR-06 — CookieConsent ukládá souhlas pouze do localStorage (ne do DB)
**Závažnost:** NÍZKÁ

**Nález:** `CookieConsent.tsx` funkce `saveConsent()` ukládá souhlas pouze do `localStorage` klientského prohlížeče. Žádný API call, žádný záznam v databázi.

**Dopad:** Souhlas nelze prokázat jako důkaz (čl. 7 odst. 1 GDPR vyžaduje, aby správce doložil, že subjekt souhlas udělil). Při vymazání browser storage nebo přístupu z jiného zařízení se consent banner zobrazí znovu a předchozí souhlas je nenávratně ztracen.

---

### F-GDPR-07 — MarketplaceApplication uchovává IP adresu bez stanoveného účelu
**Závažnost:** NÍZKÁ

**Nález:** Model `MarketplaceApplication` (schema řádek 1257–1258) obsahuje pole `ipAddress String?` a `userAgent String? @db.Text` označená jako "Rate limiting / anti-spam metadata". Není definována doba retence pro tato pole, ani politika jejich výmazu.

**Dopad:** IP adresa je osobní údaj (rozsudek Breyer C-582/14). Ukládání bez definované doby retence a výmazové politiky je v rozporu s čl. 5(1)(e) GDPR (zásada omezení uložení).

---

## Tabulka GDPR práv vs. implementace

| Právo subjektu | Článek GDPR | Endpoint / Mechanismus | Stav | Poznámka |
|---|---|---|---|---|
| Právo na přístup | Art. 15 | `GET /api/settings/export` | ⚠️ | Chybí AiConversation, Orders, Listings |
| Právo na výmaz | Art. 17 | `POST /api/settings/delete-account` | ❌ | Pouze stub — posílá notifikaci adminům |
| Právo na přenositelnost | Art. 20 | JSON export (viz Art. 15) | ⚠️ | Neúplné — chybí strojově čitelné formáty pro všechna data |
| Právo na opravu | Art. 16 | Settings stránka předpokládána | ❓ | Neauditováno v tomto scope |
| Právo vznést námitku | Art. 21 | Není implementováno | ❌ | Chybí mechanismus |
| Zásada odpovědnosti | Art. 5(2) | Žádný AuditLog | ❌ | Nelze prokázat soulad |
| Souhlas (analytics) | Art. 7 + ePrivacy | CookieConsent existuje, ale netriggeruje Analytics | ❌ | Analytics načítán bez souhlasu |
| Záznam souhlasu | Art. 7(1) | localStorage only | ❌ | Souhlas nelze prokázat |

---

## Doporučení — prioritizované

| Priorita | Finding | Akce |
|---|---|---|
| P0 — Kritická | F-GDPR-02 | Implementovat skutečnou anonymizaci v `delete-account`: `$transaction`, anonymizace jméno/email/telefon, zrušení sessions |
| P0 — Kritická | F-GDPR-04 | Podmínit načítání `<Analytics />` souhlasem — použít `useCookieConsent()` hook v `Analytics.tsx` |
| P1 — Vysoká | F-GDPR-01 | Vytvořit model `AuditLog` v Prisma schématu a logovat přístupy k PII endpointům |
| P1 — Vysoká | F-GDPR-05 | Přidat `onDelete: Cascade` nebo anonymizační trigger pro User→AiConversation, User→Notification; anonymizovat PII fieldy v Order při výmazu |
| P2 — Střední | F-GDPR-03 | Rozšířit export o `AiConversation`, `Order` (anonymizovat cizí PII), `BrokerPayout`, `Listing` |
| P2 — Střední | F-GDPR-06 | Ukládat záznam o souhlasu do DB (model `CookieConsentLog` s userId/sessionId, timestamp, version, preferences) |
| P3 — Nízká | F-GDPR-07 | Definovat retenci pro `MarketplaceApplication.ipAddress` — buď cron mazání po N dnech, nebo odstranit pole |

---

## Technické poznámky

- **Sandbox:** `https://car.zajcon.cz` byl během auditu nedostupný (nginx 502) — živé testy endpointů nebylo možné provést. Všechny závěry jsou založeny na analýze zdrojového kódu.
- **JWT generování:** Token byl úspěšně vygenerován pomocí `next-auth/jwt` encode s rolí BROKER. Curl test vrátil 502 z důvodu nedostupnosti serveru.
- **Schema verze:** Auditováno `prisma/schema.prisma` @ commit 66dc687, 1806 řádků.

---

*Zpráva vygenerována: 2026-04-14 | QA agent AUDIT-024*
