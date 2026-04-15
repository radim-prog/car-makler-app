# AUDIT-001 — Plán: Prisma Pool hardening + graceful shutdown

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (downgrade z P0, runtime stabilní 43h — preventive hardening)
**Odhadovaná práce implementátora:** 1-2h (kód) + 1h (load test + verifikace)
**Depends on:** —
**Blokuje:** nic aktivně; preventive pro traffic spike / concurrent batch

---

## 1) Kontext & root cause reframe

**Původní incident (team-lead):** 71 pm2 restartů / 42h (1.7/h).
**Korekce (team-lead, 2026-04-14 po `pm2 describe`):**
- uptime: 43h non-stop
- restarty: 71 cumulative, **unstable_restarts: 0**
- → všech 71 proběhlo **PŘED** current 43h uptime stretch, historické (deploy chaos, „Could not find a production build" ×49)
- aktuální zátěž: 5 idle conn + 1 active / 100 PG max → **5 % využití**

**Aktuální stav:** runtime stabilní, žádný triggering. Hypotéza A zůstává technicky validní, ale jako **latent bomb**, ne aktivní incident.

**Smoking gun (zpožděná bomba):**

```ts
// lib/prisma.ts:14
const pool = new Pool({ connectionString, max: 5 });
// Default: connectionTimeoutMillis = 0 → okamžitě throw při pool exhaustion
// Default: idleTimeoutMillis = 10000 (OK)
// Default: allowExitOnIdle = false (OK)
```

Při traffic spike (6+ concurrent requests přes pool max=5):
1. `pool.connect()` → throw `Error: timeout exceeded when trying to connect` okamžitě
2. Prisma handler error nepřeformátuje + bubble up
3. Route handler crash → Node uncaught → pm2 restart
4. **V aktuálním stavu se nestane** (1 active conn).

**Upstream fix `99b6003`** řeší jen build-time (static generation, 7 workers × 10 default conn × multiple imports = 2165 "too many clients"). Runtime scenario není v commitu adresován.

## 2) Cíle AUDIT-001

1. **Zabrzdit latent bomb:** Pool throw → graceful retry/timeout místo okamžitého crash.
2. **Graceful shutdown:** SIGTERM z pm2 reload → `prisma.$disconnect()` místo zombie connection.
3. **Canonical `.env.example`:** obsahuje doporučené query params pro produkci.
4. **Load test verifikace:** důkaz že fix pomáhá (nebo není potřeba, nebo odhalí jinou latent issue).
5. **Doporučení pro produkční `/var/www/carmakler/.env`** (Radim rozhodne, implementátor neprovádí).

## 3) Plán implementace (pro implementátora)

### 3.1 `lib/prisma.ts` — Pool config hardening

**Změna:**

```ts
// PŘED (řádek 14):
const pool = new Pool({ connectionString, max: 5 });

// PO:
const pool = new Pool({
  connectionString,
  max: Number(process.env.PG_POOL_MAX) || 5,
  connectionTimeoutMillis: Number(process.env.PG_CONNECTION_TIMEOUT_MS) || 10_000,
  idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT_MS) || 30_000,
  allowExitOnIdle: false,
});
```

**Zdůvodnění hodnot:**
- `max: 5` zachovat (PG rezerva 94 conn je dostatečná; zvýšení může skrýt leaky kód)
- `connectionTimeoutMillis: 10000` — 10s je benevolentní vs. Next.js route handler default timeout (žádný, ale Vercel/reverse proxy typicky 30s). Request vrátí 503 místo crash.
- `idleTimeoutMillis: 30000` — explicit default (pg default je 10 000, ale je spornější — u některých queries connection leak pod zátěží). 30s je kompromis.
- `allowExitOnIdle: false` — explicitně (prevent edge případ kdy process exitne protože Pool idle).
- **ENV override** — pro případ že Radim změní PG limit a bude potřeba ladit bez rebuildu.

### 3.2 `instrumentation.ts` — SIGTERM shutdown hook

**Stávající soubor (`/root/Projects/car-makler-app/instrumentation.ts`):**

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
```

**Rozšíření:**

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");

    const { prisma } = await import("./lib/prisma");

    const shutdown = async (signal: string) => {
      console.log(`[shutdown] ${signal} received, disconnecting Prisma...`);
      try {
        await prisma.$disconnect();
        console.log("[shutdown] Prisma disconnected");
      } catch (err) {
        console.error("[shutdown] Prisma disconnect failed:", err);
      }
      // Give pm2 time to flush logs; Next.js spustí process.exit sám.
    };

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
```

**Pozor:**
- `process.once`, ne `process.on` — multiple registrations při HMR v dev modu by triggerovaly disconnect N-krát.
- `$disconnect()` vrací Promise, ne blokovat.
- Next.js **sám** managuje process lifecycle; my jen clean-up connection pool před exitem.
- Sentry shutdown hook se registruje samostatně v `sentry.server.config.ts` (nic neměnit tam).

### 3.3 `.env.example` — canonical DATABASE_URL

**Stávající (řádek s DATABASE_URL):**

```
DATABASE_URL=postgresql://user:password@localhost:5432/carmakler
```

**Změna:**

```
DATABASE_URL=postgresql://user:password@localhost:5432/carmakler?schema=public&connection_limit=5&pool_timeout=10&connect_timeout=10

# Optional pool overrides (default hodnoty v lib/prisma.ts):
# PG_POOL_MAX=5
# PG_CONNECTION_TIMEOUT_MS=10000
# PG_IDLE_TIMEOUT_MS=30000
```

**Zdůvodnění:**
- `schema=public` — Prisma convention, explicit lepší než implicit.
- `connection_limit=5` — Prisma-level cap (doplněk k pg Pool `max`).
- `pool_timeout=10` — Prisma timeout při čekání na connection (vteřiny).
- `connect_timeout=10` — Postgres driver TCP connect timeout.
- Prisma engine query params jsou **dokumentováno** v `prisma.io/docs/reference/database-reference/connection-urls#postgresql`.

### 3.4 (out of scope AUDIT-001, flag pro Radima)

**Produkční `/var/www/carmakler/.env` — doporučení:**

```diff
- DATABASE_URL=postgresql://carmakler:***@localhost:5432/carmakler?schema=public
+ DATABASE_URL=postgresql://carmakler:***@localhost:5432/carmakler?schema=public&connection_limit=5&pool_timeout=10&connect_timeout=10
```

**Proč out of scope:** deploy změna s downtime riziko, potřebuje Radimovo vědomé rozhodnutí + `pm2 reload carmakler` okénko.

## 4) Verifikace — load test (novinka)

### 4.1 Setup

**Nástroj:** `autocannon` (npm, lightweight, Node-native — nepotřebuje instalaci k6).

```bash
npx autocannon -c 20 -d 30 -p 10 https://car.zajcon.cz/api/vehicles
```

- `-c 20` — 20 concurrent connections (4× pool max=5, zaručeně triggered queue/timeout)
- `-d 30` — 30 sekund trvání
- `-p 10` — pipelining (10 req/conn, simuluje realistic burst)

### 4.2 Metriky před fixem (baseline)

- **Success rate** (2xx responses %) — očekávání: pokud se podaří trigger pool exhaustion, budeme vidět 500 nebo timeout errors
- **p50, p95, p99 latency** — očekávání: p99 spike když pool plný
- **PG `pg_stat_activity` count** během testu (každých 5s `SELECT count(*) FROM pg_stat_activity WHERE datname='carmakler'`) — očekávání: max 5 (pool cap)
- **pm2 restarty** v log — očekávání: **0** (pokud ne, máme **potvrzený incident**, hypotéza A ověřena)

### 4.3 Metriky po fixu (acceptance)

- **Success rate:** ≥ 99 % (timeouty vrátí 503, ne crash)
- **p95 latency:** ne víc než baseline + 20 % (čekání na pool by neměl výrazně zpomalit)
- **PG active count:** max 5 (nezvýšeno)
- **pm2 restarty:** 0
- **Zero Node uncaught exceptions** v `pm2 logs carmakler --err --lines 100` během testu

### 4.4 Pokud load test **neodhalí** rozdíl

Znamená to:
- Current infrastructure + traffic pattern **nikdy nehit runtime pool exhaustion** (single fork pm2, low traffic)
- Fix je **ryze preventivní** (žádné měřitelné zlepšení v current state)
- Hodnota = resilience vůči future traffic spike, concurrent batch jobs, cron storm

**Acceptance i tak:** fix proces projde testem bez regrese = merge OK.

## 5) Souběžné vyřešení (side-check, ne fix)

Během implementace checknout:

### 5.1 Hypotéza C — Edge runtime import Prisma

```bash
# Grep Prisma imports v middleware + všem co může runtime="edge" použít
grep -rn "from [\"']@/lib/prisma[\"']\|from [\"']./lib/prisma[\"']" \
  middleware.ts app/**/middleware.ts app/**/route.ts 2>/dev/null

# Grep "export const runtime" pro edge routes
grep -rn "export const runtime.*=.*[\"']edge[\"']" app/
```

Pokud edge route importuje `lib/prisma` → **P1 bug**, edge VM Prisma nepodporuje.

### 5.2 Hypotéza D — Dlouhé transakce v cron/webhooks

```bash
grep -rn "prisma.\$transaction\|prisma.\$executeRaw\|prisma.\$queryRaw" \
  app/api/cron app/api/stripe app/api/feeds 2>/dev/null
```

Pokud `$transaction` bez `timeout` option → potenciálně drží connection forever.

### 5.3 Hypotéza F — Prisma 7.5 preview known issues

**Read-only check:**
- https://github.com/prisma/prisma/issues?q=label%3A%22driver+adapters%22+is%3Aissue+created%3A%3E2025-12-01
- Flag v plánu: „Prisma 7.x je preview. Pokud load test odhalí anomálii která neodpovídá pool exhaustion, první suspect = Prisma adapter-pg bug."

**Nenavrhovat downgrade** (migrace Prisma 6 → 7 je non-trivial, breaking changes). Sledovat upstream jen.

## 6) Acceptance criteria (pro kontrolora)

- [ ] `lib/prisma.ts` Pool config obsahuje všechny 4 parametry (max, connectionTimeoutMillis, idleTimeoutMillis, allowExitOnIdle)
- [ ] `instrumentation.ts` registruje SIGTERM + SIGINT handlery s `prisma.$disconnect()` + ošetřeným error path
- [ ] `.env.example` DATABASE_URL obsahuje query params + komentář s PG_POOL_MAX/PG_CONNECTION_TIMEOUT_MS/PG_IDLE_TIMEOUT_MS
- [ ] `npm run build` projde bez erroru
- [ ] `npm run test` (pokud existují unit testy týkající se Prismy) projdou
- [ ] Load test `autocannon -c 20 -d 30` na sandbox → success rate ≥ 99 %, 0 pm2 restartů, žádná Node uncaught exception
- [ ] Manuální SIGTERM test: `pm2 reload carmakler` → v `pm2 logs carmakler` je vidět `[shutdown] SIGTERM received, disconnecting Prisma...` + `Prisma disconnected`
- [ ] Produkční .env doporučení **dokumentováno** v `AUDIT-001-impl.md` pro Radima — **ne aplikováno implementátorem**
- [ ] Commit message conventional: `fix(prisma): harden pool config + add graceful shutdown hook`

## 7) Risk & open questions

### Risk
- **R1 (low):** `instrumentation.ts` SIGTERM handler může kolidovat se Sentry shutdown (Sentry taky chce flush). **Mitigation:** Sentry shutdown je registrován samostatně a oba handlery jsou idempotentní.
- **R2 (low):** `prisma.$disconnect()` může blokovat pokud je active query → pm2 forceKillTimeout (default 1600ms) ukončí proces. **Mitigation:** acceptable, aktivní query spadne, ale není zombie.
- **R3 (medium):** Load test na sandbox může ovlivnit databázi pokud není izolace. **Mitigation:** sandbox PG je `carmakler_sandbox` DB (team-lead potvrdil), nevadí.

### Open questions pro Radima (přes team-lead)
1. **Produkční `.env` update** (sekce 3.4) — ano/ne/kdy? Je to 1min change + `pm2 reload`, ale potřebuje deploy window.
2. **PG limit 100** je na lokálním Postgres (ne managed) — máme ho pod kontrolou? Nebo je to default a v budoucnu může někdo jiný spotřebovat conn (PgAdmin, monitoring, manuální psql)?
3. **PgBouncer** — team-lead potvrdil, že není nasazen. Otázka pro budoucno: při 1000+ concurrent požadavků bude potřeba. Flag pro AUDIT-020 (infra).

## 8) Dependency na další AUDIT tasky

- **AUDIT-003 (Sentry/Monitoring):** pokud Sentry v10 migration vyžaduje změny v `instrumentation.ts`, koordinace s implementátorem aby se shutdown hook nepřepsal.
- **AUDIT-020 (DevOps):** build config `turbopack` vs `--webpack` rozpor nesouvisí s AUDIT-001, ale řeší se souběžně.
- **AUDIT-002 (Security):** `connection_limit` / `pool_timeout` v URL jsou plain-text, ne secret — OK v `.env`.

## 9) Out of scope

- ❌ PgBouncer nasazení (→ AUDIT-020)
- ❌ Migrace Prisma 7 → 6 (breaking, nedává smysl)
- ❌ Refactor všech `prisma.$transaction` volání na timeout (→ AUDIT-018 code quality, po side-check odhalení)
- ❌ Prod deploy (→ team-lead + Radim decision)
- ❌ Změna pm2 exec_mode fork → cluster (→ AUDIT-020, konzervativní: fork je OK pro ~stovky req/s při 1 instance)

---

**Verdict plánovače:** P1 preventive hardening, **5-10 řádků kódu** v `lib/prisma.ts` + **~15 řádků** v `instrumentation.ts` + **1 řádek** v `.env.example`. Load test potvrdí/vyvrátí praktickou hodnotu. Implementátor může začít kdykoli; není blocker pro nic.
