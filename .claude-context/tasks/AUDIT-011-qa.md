# AUDIT-011: TypeScript Typecheck — QA výstup
**Datum:** 2026-04-14
**Kontrolor:** kontrolor (sonnet)
**Příkaz:** `npx tsc --noEmit`
**Výsledek:** ❌ FAIL

---

## Souhrn

| Metrika | Hodnota |
|---------|---------|
| Celkem chyb | **277** |
| Dotčené soubory | **69** |
| Nejčastější chyba | TS7006 implicit any (238×) |

---

## Rozdělení chyb podle typu

| Kód | Počet | Kategorie |
|-----|-------|-----------|
| TS7006 | 238 | Implicit `any` — callback parametry bez typů |
| TS2339 | 17 | Vlastnost neexistuje na typu `{}` |
| TS2305 | 9 | **Prisma client není vygenerován** (PrismaClient, Prisma, Partner) |
| TS7031 | 4 | Implicit `any` v destructuring |
| TS18046 | 4 | `error` je `unknown` — chybí type narrowing |
| TS2365 | 2 | Aritmetická operace na špatném typu |
| TS2322 | 2 | Nekompatibilní přiřazení typu |
| TS2362 | 1 | Levá strana aritmetické operace |

---

## Rozdělení podle sekce aplikace

| Oblast | Chyb |
|--------|------|
| `app/(web)/` | 52 |
| `app/(pwa)/` | 37 |
| `app/(admin)/` | 28 |
| `app/api/` | ~40 |
| `lib/` | ~15 |
| `app/(partner)/` | 1 |

---

## ROOT CAUSE: Prisma client není vygenerován

**Kritické** — `npx prisma generate` nebyl spuštěn. To způsobuje kaskádu TS2305 chyb:

```
lib/prisma.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'PrismaClient'.
lib/stripe-connect-shared.ts(1,15): error TS2305: Module '"@prisma/client"' has no exported member 'Partner'.
lib/stripe-connect.ts(1,15): error TS2305: Module '"@prisma/client"' has no exported member 'Partner'.
app/api/vehicles/quick/route.ts(3,10): error TS2305: Module '"@prisma/client"' has no exported member 'Prisma'.
app/api/vehicles/route.ts(3,10): error TS2305: Module '"@prisma/client"' has no exported member 'Prisma'.
prisma/seed-partners.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'PrismaClient'.
prisma/seed.ts(1,10): error TS2305: Module '"@prisma/client"' has no exported member 'PrismaClient'.
scripts/migrate-cloudinary.ts(17,10): error TS2305: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

**Fix:** `npx prisma generate` — toto NE implementátor bez plánu, ale přes workflow.

---

## Top 10 konkrétních příkladů

| # | Soubor:řádek | Chyba |
|---|-------------|-------|
| 1 | `lib/prisma.ts:1` | TS2305 — `PrismaClient` chybí v `@prisma/client` (Prisma generate chybí) |
| 2 | `lib/stripe-connect-shared.ts:1` | TS2305 — `Partner` chybí v `@prisma/client` |
| 3 | `app/(pwa)/makler/leaderboard/page.tsx:47` | TS2339 — `firstName` neexistuje na `{}` (chybí typování Prisma query result) |
| 4 | `app/(pwa)/makler/leaderboard/page.tsx:49` | TS2339 — `level` neexistuje na `{}` |
| 5 | `app/(pwa)/makler/stats/page.tsx:420` | TS2339 — `toISOString` neexistuje na `{}` (Date vs. string) |
| 6 | `app/(web)/dily/page.tsx:155` | TS2322 — `{}` není přiřaditelný `ReactNode` |
| 7 | `app/api/vehicles/quick/route.ts:168` | TS18046 — `error` je `unknown`, chybí `instanceof Error` check |
| 8 | `app/api/stripe/webhook/route.ts:235` | TS7031 — destructuring bez typů (item, commissionRate...) |
| 9 | `lib/shipping/weight.ts:35` | TS2362 — aritmetika na `{}` (chybí number cast) |
| 10 | `app/api/settings/notifications/route.ts:34` | TS2339 — `pushEnabled` neexistuje (chybí validace Zod výstupu) |

---

## Verdikt

⚠️ **237+ chyb jsou "soft" (implicit any)** — neblokují build, jsou ale code quality debt.

❌ **9 chyb jsou hard (TS2305 Prisma)** — root cause: `prisma generate` nespuštěn. Fix je jednoduchý ale musí projít workflow.

**Akce pro implementátora:** Spustit `npx prisma generate` jako první krok každé instalace. Zvážit přidání do `postinstall` scriptu v package.json.

---

## v2 Rerun po `prisma generate` (2026-04-14)

**Příkaz:** `DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" npx prisma generate && npx tsc --noEmit`

| Metrika | v1 (před) | v2 (po) | Delta |
|---------|-----------|---------|-------|
| Celkem chyb | 277 | **0** | -277 ✅ |
| Dotčené soubory | 69 | **0** | -69 ✅ |

### Klíčové zjištění

**Všech 277 chyb bylo kaskádou z jediného root cause: chybějící `npx prisma generate`.**

Původní předpoklad byl, že TS7006 (implicit any, 238×) a TS2339 jsou samostatné problémy. Ukázalo se, že TypeScript nedokázal inferovat typy Prisma query výsledků bez vygenerovaného klienta — takže vše co záviselo na Prisma typech spadlo na `{}`, čímž se aktivovaly strict-mode chyby v celém projektu kaskádou.

Po spuštění `prisma generate` TypeScript správně inferencoval všechny typy a log je **prázdný (0 řádků = 0 chyb)**.

### Závěr v2

✅ **PASS — TypeScript typecheck čistý.**

**Doporučení pro implementátora:** Přidat `prisma generate` do `package.json` jako `postinstall` script:
```json
"scripts": {
  "postinstall": "prisma generate"
}
```
Tím se generování spustí automaticky po každém `npm install`.
