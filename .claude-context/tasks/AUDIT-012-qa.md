# AUDIT-012: Vitest Unit Testy — QA výstup
**Datum:** 2026-04-14
**Kontrolor:** kontrolor (sonnet)
**Příkaz:** `npx vitest run`
**Výsledek:** ⚠️ PARTIAL PASS (1 suite selhala, 143/143 testů prošlo)

---

## Souhrn

| Metrika | Hodnota |
|---------|---------|
| Test suites (soubory) | 16 celkem |
| Suites: passed | 15 |
| Suites: **failed** | **1** |
| Tests: passed | **143 / 143** |
| Tests: failed | 0 |
| Tests: skipped | 0 |
| Čas | 436ms (transform 1.19s, import 1.46s, tests 79ms) |

---

## Test soubory (16)

| Soubor | Oblast | Status |
|--------|--------|--------|
| `__tests__/middleware.test.ts` | Middleware / auth | ✅ pass |
| `__tests__/lib/canonical.test.ts` | URL canonicalizace | ✅ pass |
| `__tests__/lib/cart.test.ts` | Košík (e-shop) | ✅ pass |
| `__tests__/lib/commission-calculator.test.ts` | Provize kalkulace | ✅ pass |
| `__tests__/lib/gamification.test.ts` | Gamifikace makléřů | ❌ **FAIL** |
| `__tests__/lib/listing-quick-filters.test.ts` | Filtry inzerce | ✅ pass |
| `__tests__/lib/markup.test.ts` | Marže (e-shop) | ✅ pass |
| `__tests__/lib/onboarding-quiz.test.ts` | Onboarding quiz | ✅ pass |
| `__tests__/lib/parts-categories.test.ts` | Kategorie dílů | ✅ pass |
| `__tests__/lib/rate-limit.test.ts` | Rate limiting | ✅ pass |
| `__tests__/lib/subdomain.test.ts` | Subdomény | ✅ pass |
| `__tests__/lib/urls.test.ts` | URL helpers | ✅ pass |
| `__tests__/lib/utils.test.ts` | Utility funkce | ✅ pass |
| `__tests__/validators/contact.test.ts` | Zod validace (kontakt) | ✅ pass |
| `__tests__/validators/lead.test.ts` | Zod validace (lead) | ✅ pass |
| `__tests__/validators/listing.test.ts` | Zod validace (inzerát) | ✅ pass |

---

## Failed suite detail

```
FAIL __tests__/lib/gamification.test.ts [ __tests__/lib/gamification.test.ts ]
Error: Cannot find module '.prisma/client/default'
Require stack:
- /root/Projects/car-makler-app/node_modules/@prisma/client/default.js
```

**Root cause:** Identický s AUDIT-011 — Prisma client nebyl vygenerován (`npx prisma generate` nebyl spuštěn).
Gamification testy importují `lib/gamification.ts`, která importuje Prisma client — ten neexistuje.

**Poznámka:** Samotných 0 testů v tomto souboru selhalo (suite se nespustila vůbec — import error).

---

## Pokrytí oblastí

| Oblast | Pokryto testy? |
|--------|---------------|
| Middleware / auth routing | ✅ Ano |
| URL & canonical | ✅ Ano |
| Košík (e-shop) | ✅ Ano |
| Provize & marže | ✅ Ano |
| Gamifikace makléřů | ⚠️ Soubor existuje, ale nesouží (Prisma issue) |
| Filtry inzerce | ✅ Ano |
| Onboarding | ✅ Ano |
| Kategorie dílů | ✅ Ano |
| Rate limiting | ✅ Ano |
| Validátory (Zod) | ✅ Ano (3 soubory) |
| API routes | ❌ Žádné testy |
| Prisma queries | ❌ Žádné testy |
| Auth / NextAuth | ❌ Žádné přímé testy |

---

## Verdikt

✅ **143/143 testů prošlo** — základní logika validátorů, middleware, URL a business kalkulací je funkční.

⚠️ **1 suite selhala** — pouze kvůli chybějícímu Prisma generate (stejný fix jako AUDIT-011).

❌ **Slabé pokrytí API routes** — žádné integration testy pro API endpointy. Riziko: regrese v API se neodhalí automaticky.

**Akce pro implementátora:** `npx prisma generate` vyřeší failed suite. Doporučeno přidat API route testy v další iteraci.

---

## v2 Rerun po `prisma generate` (2026-04-14)

| Metrika | v1 (před) | v2 (po) | Delta |
|---------|-----------|---------|-------|
| Test suites failed | 1 | **0** | ✅ |
| Tests passed | 143 | **155** | +12 ✅ |
| Tests failed | 0 | 0 | = |
| Celkový status | ⚠️ partial | **✅ PASS** | |

### Klíčové zjištění v2

`gamification.test.ts` nyní prochází — Prisma client je dostupný.
**+12 nových testů** se přidalo z gamification suite (dříve se ani nespustila).

Pokrytí oblastí — aktualizace:

| Oblast | Pokryto testy? |
|--------|---------------|
| Gamifikace makléřů | ✅ **Nyní funguje** (12 testů přidáno) |

### Závěr v2

✅ **PASS — 16/16 suitů, 155/155 testů prošlo.**
