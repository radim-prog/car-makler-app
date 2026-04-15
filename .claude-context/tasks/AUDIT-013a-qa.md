# AUDIT-013a: Produkční Smoke Test Sandbox — QA výstup
**Datum:** 2026-04-14
**Kontrolor:** kontrolor (sonnet)
**Sandbox:** https://car.zajcon.cz
**Auth:** Basic Auth radim@wikiporadce.cz / Ht7#jLs5bN8wYx
**pm2 proces:** car-zajcon (port 3030)

---

## Smoke test tabulka

| Routa | Očekáváno | Dostáno | Verdict |
|-------|-----------|---------|---------|
| `/` | 200 | **200** | ✅ OK |
| `/prodej` | 200 | **404** | ❌ FAIL — routa neexistuje v tomto forku |
| `/prihlaseni` | 200 | **200** | ✅ OK |
| `/admin` | 403 nebo redirect | **307** → `/login?callbackUrl=%2Fadmin` | ✅ OK (správný auth redirect) |
| `/api/health` | 200 | **404** | ⚠️ INFO — health endpoint neimplementován |
| `/sitemap.xml` | 200 | **200** | ✅ OK |
| `/robots.txt` | 200 | **200** | ✅ OK |
| `/sw.js` | 200 | **200** | ✅ OK |
| `/dily` | (bonus) | **200** | ✅ OK — e-shop sekce funguje |
| `/marketplace` | (bonus) | **200** | ✅ OK — marketplace landing funguje |
| `/makler` | (bonus) | **307** → login | ✅ OK — chráněná routa správně redirectuje |

**Výsledek:** 7/9 zadaných rout ✅, 2 problémy (viz níže)

---

## Problémy na sandboxu

### ❌ KRITICKÉ: Prisma DB connection failing

```
prisma:error SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

Tento error se opakuje v pm2 logu. Znamená že **PostgreSQL připojení selhává** — heslo v DATABASE_URL je null/undefined/prázdné.

**Dopad:** Všechny DB-závislé routy vrátí error při pokusu o query (výjimka: statické stránky a stránky bez DB).
**Projevuje se při:** načtení stránek s daty z DB (přihlásit se, admin dashboard, katalog vozidel...).
**Root cause:** Chybná konfigurace `DATABASE_URL` env var v `.env.production` nebo pm2 ecosystem souboru na serveru.

> Sandbox vrátil 200 na `/prihlaseni` — ale přihlášení samotné pravděpodobně selže kvůli DB chybě.

### ❌ `/prodej` — 404

Routa `/prodej` v tomto forku neexistuje. Pravděpodobně se jmenuje jinak — alternativní routy:
- `/dily` → 200 ✅
- `/marketplace` → 200 ✅
- Katalog vozidel: pravděpodobně `/nabidka` nebo `/automobily` (obě 404 v rychlém testu)

### ⚠️ `/api/health` — 404

Health endpoint neexistuje. Doporučeno přidat pro monitoring.

---

## pm2 logy — klíčové záznamy

### Error log (car-zajcon-error.log) — Sentry deprecation warnings

```
[@sentry/nextjs] DEPRECATION WARNING: autoInstrumentServerFunctions is deprecated
[@sentry/nextjs] DEPRECATION WARNING: autoInstrumentMiddleware is deprecated
[@sentry/nextjs] DEPRECATION WARNING: autoInstrumentAppDirectory is deprecated
```

Tyto varování se opakují při každém restartu (3 záznamy v logu = 2 restarty + aktuální instance).

⚠️ **Sentry flag:** Deprecated config v `next.config.js` — `autoInstrumentServerFunctions`, `autoInstrumentMiddleware`, `autoInstrumentAppDirectory` jsou zastaralé. Přejde na `webpack.*` varianty.

### Out log (car-zajcon-out.log) — klíčové záznamy

```
▲ Next.js 16.1.7
✓ Ready in 868ms
prisma:error SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string  ← KRITICKÉ
✓ Ready in 844ms  ← 2. restart
```

---

## Souhrnné nálezy

| Závažnost | Nález |
|-----------|-------|
| 🔴 KRITICKÉ | Prisma SASL error — DB připojení selhává (heslo není string) |
| 🔴 KRITICKÉ | `/prodej` 404 — routa neexistuje nebo má jiný název |
| 🟡 VAROVÁNÍ | Sentry deprecated config (autoInstrument*) |
| 🟡 VAROVÁNÍ | `/api/health` chybí — monitoring blind spot |
| ℹ️ INFO | `sw.js` 200 bez CSP violation v pm2 logu (CSP není logován server-side) |

---

## Verdikt

⚠️ **NETESTOVÁNO PLNĚ NA PRODUKCI** — DB připojení selhává, takže všechny autentizované routy a DB-závislé funkce nebyly ověřeny.

Sandbox odpovídá a static routy fungují, ale DB vrstva je nefunkční kvůli chybné konfiguraci hesla.

**Blocker pro další QA:** Opravit `DATABASE_URL` na sandboxu (správné PG heslo). Toto je infrastrukturní problém, ne kódový.
