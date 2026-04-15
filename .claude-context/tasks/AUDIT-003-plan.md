# AUDIT-003 — Plán: Sentry v10 migrace + CSP výseč + pm2 ecosystem

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (observability + deployment stability)
**Odhadovaná práce implementátora:** 0.5-1 den
**Depends on:** —

---

## 1) Recon výstup (stav 2026-04-14)

### 1.1 Sentry v10 deprecated options

**Verze:** `@sentry/nextjs@^10.47.0`, Next 16.1.7.

**Problém v `next.config.ts:141-144`:**

```ts
autoInstrumentServerFunctions: true,
autoInstrumentMiddleware: true,
autoInstrumentAppDirectory: true,
```

Všechny tři **deprecated** ve v10 (zdroj: Sentry v8→v10 migration guide). Ve v10 je instrumentation default-on přes `instrumentation.ts` hook a `sentry.*.config.ts` soubory. Tyto volby buď nefungují (silent no-op) nebo vypisují warning.

**Existující soubory:**
- `sentry.server.config.ts` (9 řádků, minimální: dsn, tracesSampleRate, environment, enabled)
- `sentry.edge.config.ts` (9 řádků, minimální)
- `sentry.client.config.ts` (29 řádků, má ignoreErrors, replaysOnErrorSampleRate)
- `instrumentation.ts` (23 řádků, standardní Sentry register + onRequestError)

### 1.2 CSP výseč (stav z previous session recon)

CSP v `next.config.ts:19-61` je `Content-Security-Policy-Report-Only` (neblokuje).

**Známé violations** z Radimova log outputu (team-lead session):
- **Perplexity CDN font** — externí doména neznámá, pravděpodobně bug kde Perplexity crawler načítá font se špatným referrer a my máme v `font-src` pouze `'self' fonts.gstatic.com`
- **Unsplash systemic** — `images.unsplash.com` je v `images.remotePatterns` (next.config.ts:81), ale NENÍ v CSP `img-src` (jen cloudinary, files.carmakler, placehold, sentry, packeta)

### 1.3 pm2 ecosystem

**Není žádný `ecosystem.config.js`** v repo. pm2 spouští app s CLI args nebo ad-hoc env (team-lead session zjistil že 71 restartů bylo historických „Could not find a production build").

**Problém:** Každý deploy / SSH session musí znovu nastavit env (PG_POOL_MAX, DATABASE_URL, SENTRY_DSN...). Persist přes pm2 save nebo ecosystem file. `pm2 save` ukládá do `~/.pm2/dump.pm2` — ale křehké, neexistuje ve VCS.

## 2) Cíle AUDIT-003

1. **Sentry v10** — odstranit deprecated `autoInstrument*`, potvrdit že instrumentation stále funguje (ověřitelné přes manuální Sentry event)
2. **CSP** — přidat Unsplash do `img-src`, vyřešit Perplexity font (pravděpodobně ignorovat jako false-positive z crawleru)
3. **pm2 ecosystem** — `ecosystem.config.js` ve VCS, persist env + restart policy

## 3) Plán implementace

### 3.1 Sentry v10 migrace (1h)

**Odstranit z `next.config.ts`:**

```diff
 export default withSentryConfig(withAnalyze(withSerwist(nextConfig)), {
   org: process.env.SENTRY_ORG,
   project: process.env.SENTRY_PROJECT,
   authToken: process.env.SENTRY_AUTH_TOKEN,
   silent: !process.env.SENTRY_AUTH_TOKEN,
   sourcemaps: {
     disable: !process.env.SENTRY_AUTH_TOKEN,
   },
-
-  // Automaticka instrumentace
-  autoInstrumentServerFunctions: true,
-  autoInstrumentMiddleware: true,
-  autoInstrumentAppDirectory: true,
 });
```

**Ověření že nic nerozbije:**

1. `npm run build` — no warnings about missing instrumentation
2. Deploy na sandbox
3. Manuální test: `curl https://car.zajcon.cz/api/health-error-test` (musí se vytvořit dummy route která throws) → ověř že Sentry dostane event
4. Grep `Sentry.captureException` a `Sentry.captureMessage` v kódu — existující usage pokračuje fungovat přes `sentry.server.config.ts` / client config

**Volitelně (ne blocker):** přidat `tunnelRoute: '/monitoring'` do withSentryConfig options pro CSP bypass (obchází ad-blockery). Pozn.: vyžaduje rewrite, nicméně lepší reliabilita pro analytics.

### 3.2 CSP fix (30 min)

**`next.config.ts:30` — img-src:**

```diff
-"img-src 'self' data: blob: https://files.carmakler.cz https://res.cloudinary.com https://placehold.co https://*.sentry.io https://widget.packeta.com",
+"img-src 'self' data: blob: https://files.carmakler.cz https://res.cloudinary.com https://images.unsplash.com https://placehold.co https://*.sentry.io https://widget.packeta.com",
```

**Perplexity font** — pravděpodobně nejde o náš bug. Log řádek vypadá jako:
```
Refused to load font 'https://pplx-cdn.com/fonts/xxx.woff2' — violates font-src 'self' https://fonts.gstatic.com
```

To znamená že **Perplexity crawler** navštívil naši stránku a vestavěl vlastní font do DOM. Nechceme whitelist `pplx-cdn.com` → violation zůstává, ignorujeme v reportech.

**Akce:** v `app/api/csp-report/route.ts` (pokud existuje) přidat filter:
```ts
const IGNORED_VIOLATIONS = ["pplx-cdn.com", /* other known crawlers */];
if (IGNORED_VIOLATIONS.some(x => blocked_uri.includes(x))) return NextResponse.json({ok: true});
```

**Následný step (P1, samostatný task):** po čisté Report-Only fázi (0 legitimních violations 7+ dní) přepnout na `Content-Security-Policy` (blokující). Aktuálně ještě ne — Radim může mít nevědomé 3rd-party integrace.

### 3.3 pm2 ecosystem.config.js (1h)

**Nový soubor v rootu:**

```js
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "carmakler",
      script: "npm",
      args: "start",
      cwd: "/root/Projects/car-makler-app",
      instances: 1,
      exec_mode: "fork", // zachovat fork_mode per AUDIT-001 recon
      max_memory_restart: "1G",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // DATABASE_URL, SENTRY_DSN, atd. přes systemd/env file, ne hardcoded
      },
      error_file: "/root/.pm2/logs/carmakler-error.log",
      out_file: "/root/.pm2/logs/carmakler-out.log",
      time: true,
      // Grace period pro SIGTERM shutdown (aligned s AUDIT-001 instrumentation.ts hook)
      kill_timeout: 10000, // 10s — odpovídá maximálnímu Prisma $disconnect timeoutu
      listen_timeout: 15000,
      restart_delay: 3000,
    },
  ],
};
```

**Restart policy:**
- `max_restarts` intentionally vynechán (default 15 během 1 min) → pokud app crash-loopuje, pm2 se vzdá a nám přijde alert
- `kill_timeout: 10000` korespondencí se `connectionTimeoutMillis: 10_000` v AUDIT-001
- Env vars `DATABASE_URL` / `SENTRY_DSN` / `PG_POOL_MAX` etc. žijí v `/etc/environment` nebo `/root/.bashrc` source před `pm2 start` — NE v ecosystem.config.js (security, ne commit do Git)

**Deploy workflow:**
1. `ssh root@car.zajcon.cz`
2. `cd /root/Projects/car-makler-app && git pull && npm ci && npm run build`
3. `pm2 startOrReload ecosystem.config.js --env production`
4. `pm2 save` (persist pro systemd reboot)

**.gitignore check:** ecosystem.config.js **COMMITUJEME**, protože secrets tam nejsou. Jen config a restart policy.

### 3.4 Alias v `package.json` scripts

```diff
  "scripts": {
+   "deploy:sandbox": "git pull && npm ci && npm run build && pm2 startOrReload ecosystem.config.js",
    ...
  }
```

(Existuje `scripts/deploy-sandbox.sh` per FIX-004 — pokud ano, jen update k volání ecosystem.)

## 4) Acceptance criteria

- [ ] `next.config.ts` bez deprecated Sentry options; `npm run build` clean
- [ ] Sentry event dorazí ze sandboxu (manuální test throw Error v `/api/health/sentry-test`)
- [ ] `img-src` obsahuje `images.unsplash.com`, Unsplash obrázek v landing page se načte bez CSP violation
- [ ] `api/csp-report` filtruje known crawler violations (pplx-cdn.com)
- [ ] `ecosystem.config.js` existuje, commit do Git, deploy funguje
- [ ] `pm2 describe carmakler` ukazuje správné env + kill_timeout: 10000 + fork_mode
- [ ] `npm run build` + `npm run test` passing

## 5) Risk & open questions

### Risk
- **R1 (low):** Sentry v10 `autoInstrument*` removal může ztratit auto-wrap pro Server Actions. **Mitigation:** ověřit v Sentry docs že App Router + `instrumentation.ts` stačí. V10 changelog to potvrzuje.
- **R2 (low):** CSP `images.unsplash.com` přidání je bezpečné (Unsplash je reputable, HTTPS-only). Riziko 0.
- **R3 (medium):** `ecosystem.config.js` s hardcoded env by bylo security hole. **Mitigation:** env vars přes systemd EnvironmentFile= nebo /root/.carmakler.env + `source` před `pm2 start`.
- **R4 (low):** `kill_timeout: 10000` může přerušit dlouhé requesty (např. feed import). **Mitigation:** background jobs běží přes separátní `cron` nebo `carmakler-worker` pm2 process, ne v hlavním webu.

### Open questions pro Radima
1. **Sentry tunnelRoute** (volitelné): přidat `/monitoring` rewrite pro ad-blocker bypass? Není blocker, jen nice-to-have.
2. **CSP enforce mode** (P1 followup): kdy přepnout z Report-Only → blocking? Nominálně po týdnu čistého logu.
3. **pm2 worker process** (budoucí): plán na oddělení cronů (feed import, sitemap regen) od web process?

## 6) Out of scope

- ❌ Migrace z pm2 na systemd (samostatná decision, pm2 je OK pro MVP)
- ❌ Multi-instance pm2 cluster_mode (AUDIT-001 doporučuje ponechat fork × 1 dokud load neroste)
- ❌ Sentry Replay enable na všech (drahé, aktuálně jen replaysOnErrorSampleRate: 1.0)
- ❌ Full CSP enforce — nechat Report-Only dokud nevyřešíme všechny true positives

---

**Verdict plánovače:** Rychlý low-risk cleanup. Sentry deprecated options = kosmetika (silent no-op), CSP Unsplash = 1-line fix, ecosystem.config = deployment stability win. 0.5-1 den práce, žádná blokace na dalších tasks.
