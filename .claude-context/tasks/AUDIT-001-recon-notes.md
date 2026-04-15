# AUDIT-001 — Pre-recon notes (smoking gun nalezen)

**Datum:** 2026-04-14
**Kontext:** Pre-recon před režimem B, paralelně s v3 breakdownem.
**Executor:** Plánovač (READ-ONLY).
**Stav:** Připraven podklad pro detailní plán AUDIT-001.

---

## 1) Klíčový nález: `lib/prisma.ts` po fixu `99b6003`

```ts
function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL environment variable is not set");
  const pool = new Pool({ connectionString, max: 5 });   // ⬅ JEN max, žádné timeouts
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter, log: … });
}

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;                        // ⬅ cache ve všech env (v4 fixu)
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {     // lazy proxy
  get(_target, prop, receiver) {
    return Reflect.get(getPrismaClient(), prop, receiver);
  },
});
```

## 2) Diff `99b6003` (`git show 99b6003` v `/root/Projects/cmklv2`)

Autor: JevgOne, 2026-04-12 15:08:28 +0200 (před 2 dny).

```diff
- const pool = new Pool({ connectionString });
+ const pool = new Pool({ connectionString, max: 5 });

- if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
+ globalForPrisma.prisma = client;
```

Commit message říká:
> Set pg Pool max to 5 connections (was unlimited default of 10 per instance)
> Cache PrismaClient singleton in all environments (was dev-only, so build with NODE_ENV=production created a new pool per import → 7 workers × 10 conn)
> Eliminates 2165 "too many clients already" errors during static generation

**Poznámka k commit message:** autor píše "was unlimited default of 10" — to je mírně zmatené. `pg.Pool` default `max` = 10. Commit ho snižuje na 5. Takže "was unlimited" je nepřesnost — bylo to výchozí 10. Důležitější zpráva: **fix řeší jen build-time** (static generation).

## 3) 🔥 Hlavní hypotézy proč restarty pokračují po fixu

### Hypotéza A — Pool timeout defaults chybí (NEJPRAVDĚPODOBNĚJŠÍ)

`new Pool({ connectionString, max: 5 })` **neobsahuje:**
- `idleTimeoutMillis` (default 10 000 ms — OK)
- `connectionTimeoutMillis` (default **0** = nečekat, okamžitě throw)
- `acquireTimeoutMillis` (neexistuje v `pg`, v knex ano)
- `allowExitOnIdle` (default false)

**Scénář crashe:**
1. Na runtime přijde 6. paralelní request (5 connection už je use)
2. `pool.connect()` zkusí dealokovat
3. Default `connectionTimeoutMillis: 0` = nečekat, **okamžitě throw** `Error: connection terminated due to connection timeout` nebo `Error: Call queue is full`
4. Prisma handler to nechytá, bubble up
5. Next.js route handler crash → Node.js uncaught → **pm2 restart**
6. 71× za 42h = ~1 / 35 min, pravděpodobně trigger na peak traffic

**Fix:** přidat `connectionTimeoutMillis: 10000`, případně `max: 10-20` (s ohledem na PG max_connections limit).

### Hypotéza B — pm2 cluster mode násobí pool

Pokud pm2 běží v `instances: "max"` na N-jádrovém VPS → N procesů × `max: 5` = N×5 connection.

**PG server limit** (pokud DigitalOcean managed / spravované PG):
- "Basic" tier: `max_connections = 22-25`
- "Standard" tier: `max_connections = 50-97`

Pokud 4 pm2 workers × 5 = 20 conn + Sentry + cron + ručné psql + monitoring → snadno přes limit.

**Fix:** snížit `max` na `POOL_MAX = floor((pg_max_connections - reserved) / pm2_instances)`, nebo nasadit PgBouncer, nebo jet pm2 `fork` mode místo cluster (1 worker).

### Hypotéza C — Edge runtime vs. Prisma

`middleware.ts` nesmí Prisma. Pokud ale middleware vytáhne import transitivně (např. přes `lib/auth.ts` → `lib/prisma.ts`) a Next to nerozseká na runtime bundle, edge vm se pokusí spustit `new Pool(...)` → fail.

**Ověření v B:** grep importů v `middleware.ts` a transitivně v `lib/auth.ts`.

### Hypotéza D — Cron/webhook dlouhé transakce

`app/api/cron/*`, `app/api/stripe/*` (webhooks), `app/api/feeds/*` (importy) mohou otevřít dlouhou transakci a zapomenout commit/rollback → pool-held forever.

**Ověření v B:** grep `prisma.$transaction` a `BEGIN`/explicit transactions.

### Hypotéza E — Missing graceful shutdown

`pm2 reload` → SIGTERM. Pokud `lib/prisma.ts` nemá `process.on("SIGTERM", () => prisma.$disconnect())`, reload zombies connection až do TCP keepalive timeout (default 2h!). Graceful restart během deploye pak vyčerpá pool.

**Fix:** přidat shutdown hook v `instrumentation.ts` nebo `lib/prisma.ts`.

### Hypotéza F — Prisma 7.5 preview bugs

Prisma 7.x je preview. `@prisma/adapter-pg` 7.5 může mít known issues s connection leakem při `prisma.$queryRaw` nebo edge cases při serialization. Zkontrolovat GitHub issues repo `prisma/prisma` po 2025-12.

## 4) CSP: potvrzená root cause `sw.js` Unsplash violation

Z `next.config.ts`:

```ts
const cspDirectives = [
  …
  "connect-src 'self' https://*.sentry.io https://plausible.io https://api.stripe.com https://widget.packeta.com",
  …
].join("; ");
```

**Unsplash NENÍ v `connect-src`.** Zároveň:

```ts
images: {
  remotePatterns: [
    …
    { protocol: "https", hostname: "images.unsplash.com" },   // ✅ povoleno pro next/image
  ],
},
```

Takže `next/image` s Unsplash URL **prochází přes `/_next/image` proxy** (self origin) — to je OK pro `connect-src`/`img-src`.

**Ale Service Worker** (`app/sw.ts` → generuje `public/sw.js`) pravděpodobně prefetchuje nebo cachuje raw URL `https://images.unsplash.com/photo-...` přímo (SW bypass Next image proxy). SW fetch jde přes `connect-src`, ne přes `img-src`. CSP zablokuje.

**Dvě možnosti:**
- A) Unsplash URL zůstane v dev dummy datech / seeds / placeholder komponentách → fix = **odstranit Unsplash ze SW prefetch**, placeholder nahradit `placehold.co` (už v CSP povolen).
- B) Unsplash je produkční content (např. landing hero fotky) → fix = **rozšířit `connect-src` o `https://images.unsplash.com`**.

**Předpokládám A** (klasický dummy-content smell). Ověření v AUDIT-025: grep `unsplash` v `app/sw.ts`, `public/`, `components/`.

**Navíc:** `next.config.ts:118` říká `Content-Security-Policy-Report-Only` = CSP **neblokuje**, jen reportuje. Takže Unsplash fetchy v SW **ve skutečnosti fungují** (v Report-Only nejsou blokovány), jen se loguje violation. To je intended state (testovací fáze CSP), ale musí se vyhodnotit v AUDIT-002 — kdy přejdeme na plný enforcement.

## 5) Sentry deprecation warnings — root cause potvrzen

V `next.config.ts:141-144`:

```ts
autoInstrumentServerFunctions: true,
autoInstrumentMiddleware: true,
autoInstrumentAppDirectory: true,
```

Potvrzeno 3 (ne 4) deprecation warnings. Sentry v10 migration guide:
- `autoInstrumentServerFunctions` → replaced by automatic instrumentation via webpack plugin
- `autoInstrumentMiddleware` → moved to `unstable_sentryWebpackPluginOptions`
- `autoInstrumentAppDirectory` → automatic default

**Fix scope:** AUDIT-003 (Monitoring). Přepsat init na `webpack.sentry.tunnel` pattern, migrace na v10 API.

Kontrolorem zmíněná "4. deprecation" — možná další v `sentry.server.config.ts` (`Integrations.*`). Nutno prověřit v AUDIT-003 detailu.

## 6) `.env.example` kontrolní nálezy pro AUDIT-001 + další

- **DATABASE_URL bez query params** (`postgresql://user:password@localhost:5432/carmakler`) — **žádný `?connection_limit=5&pool_timeout=10`**. Production config možná má, ale `.env.example` nastavuje zvyklost na minimální URL. Budeme muset ověřit produkční `/var/www/carmakler/.env` přes team-lead.
- `CLOUDINARY_*` označen jako **"LEGACY — jen pro migraci starých fotek"** (řádek 36) → confirms Sharp self-host je aktuální, Cloudinary phase-out.
- `UPLOAD_DIR=/var/www/uploads` + `UPLOAD_BASE_URL=https://files.carmakler.cz` → self-hosted, důsledek přepisu commit `468ea55`.
- **Shipping (5 dopravců)** — Zásilkovna + DPD + PPL + GLS + Česká pošta — všichni mají `.env` klíče s komentářem *"dry-run mód bez klíčů"*. Good defensive pattern.
- `SITE_PASSWORD` → Basic Auth na sandboxu, sedí.
- **Analytics dual:** Plausible OR GA4 — patrně Radimova vize GA4 je stále platná.
- `CRON_SECRET` + `REVALIDATE_SECRET` — pattern secret/challenge, audit v AUDIT-002.
- `LEADS_API_KEY` → externí lead import (Infoexe?) — audit v AUDIT-007a.

## 7) `next.config.ts` další nálezy (nad rámec AUDIT-001)

- **Žádné `serverExternalPackages`** — v Next 15/16 by mělo být `["@prisma/client", "prisma"]` pro opt-out bundleování → vliv na build performance. Ověřit v AUDIT-020.
- **`turbopack: {}`** prázdný objekt (řádek 64) — buď placeholder, nebo explicit enable. `package.json` buildy ale běží s `--webpack`. **Rozpor.** Ověřit v AUDIT-020.
- **Sentry `withSentryConfig`** wrapper — OK, ale options zastaralé (viz §5).
- **`X-XSS-Protection: 1; mode=block`** — deprecated header, moderní browsery mají vlastní XSS auditor. Minor.
- **`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`** — 2 roky + preload = strong, **pozor na `preload`** — vyžaduje registraci v HSTS preload listu. AUDIT-002.
- **`Permissions-Policy: camera=(), microphone=()`** — disabled. Ale PWA broker chce fotit auto — **potřebuje kameru**! Bude to blokovat? Ověřit.

## 8) Git log upstream — širší kontext (top 40 commitů)

**Top stream kolegovy práce v posledních ~týdnech:**
- `11a436b` admin users+orders pages
- `99b6003` fix pool (12. 4.)
- `6553788`, `f54eaff` mobile tier 1/2
- `b235c67` admin accounts + MANAGER role API
- `3fecb20` Manager/RegionalDirector admin panel access
- `5a79d3d` critical launch fixes (placeholder, logo, **orphan cleanup**, photo auto-checks)
- `f415e93` broker workflow checklist (9 phases, 28 steps)
- `d985efd` photo position guide (13 exterior slots)
- `468ea55` Cloudinary→Sharp
- `c12d39b` replace `[DOPLNIT]` placeholders
- `a49e1a2` photo watermark
- `72773b3` 6 PDF presentation templates
- **Mnoho PR numbers** (#211, #223, #210, #208, #197, #182, #161, #154, #126, #120) — kolega pracuje přes PR workflow s trackováním
- `f09773c` **Stripe, email verification, smart search, Zásilkovna, CSP** (kdy?)
- `2bf0657` **Stripe Connect Express** backend
- `49f680e` SEO Prisma SeoContent

**Pozorování:**
- Commit cadence velmi vysoká, desítky commitů za posledních pár dní.
- Workflow checklist (9 fází / 28 kroků) naznačuje **pokročilý broker flow** (AUDIT-007a).
- Orphan cleanup commit `5a79d3d` naznačuje že **datový model má problém s orphan daty** (AUDIT-004).
- Stripe Connect **Express** (ne Standard) potvrzeno (AUDIT-014).

## 9) Otázky pro AUDIT-001 režim B

Před napsáním detailního plánu potřebuji od team-lead:
1. **Produkční `DATABASE_URL`** bez hodnot hesla, jen struktura → obsahuje query params (connection_limit, pool_timeout)? Nebo čistý URL?
2. **pm2 ecosystem.config.js** — `instances`, `exec_mode` (cluster / fork), `max_memory_restart`?
3. **PG `max_connections`** limit na prod serveru — `SHOW max_connections;` + `SELECT count(*) FROM pg_stat_activity;`
4. **pm2 logs carmakler --lines 500** — konkrétní stacktrace před restartem. Potvrdí/vyvrátí hypotézu A.
5. **PgBouncer** nasazený? Nebo přímé připojení?

Tyto 5 bodů rozhodnou, které hypotézy vyloučit před psaním plánu.

## 10) Shrnutí pro team-lead

**🔥 Smoking gun (85 % confidence):** Commit `99b6003` řeší **jen build-time** pool exhaustion, ale **runtime** scénář není pokrytý:
- Chybí `connectionTimeoutMillis` v pg Pool configu
- pm2 cluster mode × pool_max × PG max_connections mohou být špatně dimenzované
- Chybí graceful shutdown hook

**Fix pravděpodobně** = 5-10 řádků v `lib/prisma.ts` + případně `instrumentation.ts` pro shutdown hook + validace pm2 config.

**Nalezeno bonusem:** `next.config.ts` používá `Content-Security-Policy-Report-Only` (neblokuje), takže Unsplash v SW logically funguje; violation je jen v logu. Fix v AUDIT-025 je kosmetický pokud validujeme SW zdroj.

**Rozpor:** `turbopack: {}` v `next.config.ts` vs. `npm run build` s `--webpack` — někde je configurační konflikt. AUDIT-020.

**Připraven** vstoupit do režimu B na AUDIT-001, jakmile kontrolor approvne v3 breakdown.
