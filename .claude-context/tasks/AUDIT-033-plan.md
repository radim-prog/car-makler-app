# AUDIT-033 — Plán: Production deployment (sandbox → prod)

**Datum:** 2026-04-15
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P0 (blocker pro launch MVP)
**Odhadovaná práce implementátora:** 1-2 dny (nákup + DNS propagace + první deploy + rollback dry-run)
**Depends on:** FIX-007 (backup cron), FIX-017 (anon DRAFT), AUDIT-024 (GDPR), AUDIT-031 (Wedos SMTP), AUDIT-003 (pm2 ecosystem), AUDIT-027 (Permissions-Policy)
**Navazuje:** AUDIT-030 (subdomény launch)

---

## 0) Kontext & současný stav

**Sandbox:** `/var/www/car.zajcon.cz` na `91.98.203.239`, pm2 proces `car-zajcon` (id 4), port 3030, deploy přes `scripts/deploy-sandbox.sh` (`git push` → `ssh pull + build + pm2 restart --update-env`).

**Production:** NEEXISTUJE. `/var/www/` má jen `html/` (default) a `krize.zajcon.cz/`. Cílová cesta `/var/www/carmakler` je virtuální — bude alokována při první produkční instalaci.

**Reálný hosting scenario (team-lead context):**
- Radim spolupracuje s kolegou, který spravuje produkční server
- Git zdroj: `radim-prog/car-makler-app` (current repo) → kolegova produkce `/var/www/carmakler`
- Kolegův server není stejný jako `91.98.203.239` (předpokládáme separate host)

**Otevřená rozhodnutí (delegace na Radima + kolegu):**
- Produkční host / IP / přístupové kredence
- Produkční DB: nový PostgreSQL server nebo sdílený?
- Doména: `carmakler.cz` DNS provider + kdo spravuje?
- SSL: Let's Encrypt / Cloudflare / komerční cert?
- Blue-green vs. maintenance window (závisí na SLA)

## 1) Cíle

1. **Zero-downtime first deploy** nebo **maintenance window ≤ 15 min** (podle volby strategie)
2. **Identické infra jako sandbox** (pm2 fork × 1, PostgreSQL 16, Node 20+, systemd env file)
3. **Rollback plán** otestovaný dry-run před prvním produkčním cut-over
4. **Data migration path** — sandbox obsahuje test data, prod start s čistou DB nebo seedem
5. **DNS cut-over** řízený (DNS TTL pre-lower 24h předem)
6. **Post-deploy monitoring** (Sentry + pm2 logs + smoke suite)

## 2) Task breakdown

### Fáze 1 — Pre-production checklist (Radim + team-lead, ~4h celkem)

| ID | Task | Owner | Effort | Blocker? |
|----|------|-------|--------|----------|
| T-033-001 | Rozhodnutí produkční hosting (kolegův server? Hetzner Cloud? Shared?) | Radim | 1h | ✅ P0 |
| T-033-002 | SSH přístupy kolegův server → Radim → Claude (root nebo sudo user + pub key) | Radim + kolega | 30min | ✅ P0 |
| T-033-003 | Rozhodnutí DB strategie (nová prod DB vs shared) + backup plán stejný jako FIX-007 | Radim | 30min | ✅ P0 |
| T-033-004 | DNS: `carmakler.cz` A record → prod IP, lower TTL 60s 24h předem | Radim | 15min + 24h čekání | ✅ P0 |
| T-033-005 | SSL cert strategy (Let's Encrypt preferováno: `certbot --nginx -d carmakler.cz -d www.carmakler.cz`) | Kolega | 30min | ✅ P0 |
| T-033-006 | ENV inventář: seznam všech production secrets (DATABASE_URL, SENTRY_DSN, RESEND_API_KEY, WEDOS_SMTP_PASS, CLOUDINARY_URL, STRIPE_SECRET_KEY, NEXTAUTH_SECRET, atd.) | Plánovač + Radim | 1h | ✅ P0 |
| T-033-007 | Rozhodnutí deploy strategy: (A) Maintenance window ~15 min, nebo (B) Blue-green (2× pm2 proces, nginx upstream swap) | Radim | — | ✅ P0 |

### Fáze 2 — Infra setup na prod serveru (implementátor + kolega, ~6h)

| ID | Task | Effort |
|----|------|--------|
| T-033-008 | Instalace Node 20 LTS + npm + pm2 globálně na prod hostu | 30min |
| T-033-009 | Instalace PostgreSQL 16 + vytvoření DB `carmakler` + user `carmakler` s heslem (pokud nesdíleno) | 45min |
| T-033-010 | Nginx vhost `carmakler.cz` s reverse proxy na `127.0.0.1:3000`, cert via Let's Encrypt | 45min |
| T-033-011 | Clone `radim-prog/car-makler-app` → `/var/www/carmakler` (SSH deploy key na GitHub) | 30min |
| T-033-012 | `ecosystem.config.js` deploy (z AUDIT-003), systemd EnvironmentFile `/etc/carmakler.env` (mode 600) s všemi prod secrets | 1h |
| T-033-013 | Prisma migrate deploy + seed (jen admin user + SYSTEM_DELETED sentinel + nic dalšího) | 45min |
| T-033-014 | GRANT pro AuditLog / PitchDeckGeneration / všech nových tables na `carmakler` user | 30min |
| T-033-015 | Backup cron stejný jako FIX-007 (`/etc/cron.d/pg-backup-carmakler-prod`), retention 14 dní dle AUDIT-024 D1 | 45min |
| T-033-016 | GDPR erasure cron z AUDIT-024 (`/etc/cron.d/gdpr-erasure`) 02:05 UTC daily | 15min |
| T-033-017 | Sentry DSN production environment config (separátní project od sandbox) | 30min |
| T-033-018 | `npm ci && npm run build && pm2 start ecosystem.config.js` — první start ověř `pm2 logs carmakler` čistý | 1h |

### Fáze 3 — Pre-launch verifikace (implementátor + kontrolor, ~3h)

| ID | Task | Effort |
|----|------|--------|
| T-033-019 | Smoke suite na prod doméně (16 rout matrix z FIX-005 testu) | 30min |
| T-033-020 | Security headers curl test (CSP, Permissions-Policy z AUDIT-027, HSTS) | 15min |
| T-033-021 | Sentry test event (úmyslný throw v `/api/health-error-test`) → event dorazí | 15min |
| T-033-022 | Email test: Resend + Wedos SMTP fallback (AUDIT-031) oba deliverují test email | 30min |
| T-033-023 | Backup test: manuální `pg_dump` + ověř soubor v `/root/db-backups/` | 15min |
| T-033-024 | Load test mini (autocannon 30s, 50 concurrent, na `/` + `/inzeraty`) | 30min |
| T-033-025 | Cross-browser smoke (Chrome, Safari, Firefox) na landing page | 30min |
| T-033-026 | PWA install test (broker přihlásí se, add-to-home-screen, offline foto scenario) | 30min |

### Fáze 4 — DNS cut-over + monitoring (implementátor + team-lead, ~2h)

| ID | Task | Effort |
|----|------|--------|
| T-033-027 | DNS A record swap: `carmakler.cz` → prod IP (TTL už lowered z T-033-004) | 5min |
| T-033-028 | Wait for propagation (2-5 min s low TTL), monitor `dig carmakler.cz +short` z více lokalit | 15min |
| T-033-029 | Smoke retry 10× jako sandbox deploy: `curl -sfI https://carmakler.cz/` → 200 OK | 10min |
| T-033-030 | Sentry live monitoring (první 30 min po cut-over) — zero-tolerance policy na nové erroru | 30min |
| T-033-031 | pm2 memory/CPU monitoring `pm2 monit` — watch pro memory leak / CPU spike | 30min |
| T-033-032 | LAUNCH-CHECKLIST.md update: prod live, all checks green | 15min |

### Fáze 5 — Rollback dry-run (implementátor, ~2h — PŘED T-033-027)

**KRITICKÉ: Dry-run se dělá PŘED cut-over, ne až v případě incidentu.**

| ID | Task | Effort |
|----|------|--------|
| T-033-033 | Zálohovat prod DB před cut-over: `pg_dump carmakler > /root/db-backups/pre-launch-$(date +%F).sql.gz` | 15min |
| T-033-034 | Zálohovat pm2 state: `pm2 save` + kopie `ecosystem.config.js` do `/root/rollback-snapshots/$(date +%F)/` | 15min |
| T-033-035 | **Dry-run rollback scenario A:** „Kritická chyba po deploy, revert na předchozí git commit" — `git reset --hard HEAD~1 && npm run build && pm2 restart` | 30min |
| T-033-036 | **Dry-run rollback scenario B:** „DB migrace poškodila data, restore ze zálohy" — `pg_restore -d carmakler_restore /root/db-backups/pre-launch-*.sql.gz` (do jiné DB, ne over prod) | 30min |
| T-033-037 | **Dry-run rollback scenario C:** „DNS rollback, zpět na sandbox" — DNS A record zpět, TTL ověřen | 30min |
| T-033-038 | Dokumentace rollback runbook v `docs/ROLLBACK.md` | 30min |

## 3) Deploy strategy — volba A vs B

### Strategy A — Maintenance window (doporučeno pro MVP)

**Proč:** Jednoduchá, ~15 min downtime, pro MVP přijatelné (trafic 0, jen Radim + testeři).

**Flow:**
1. Announcement 24h předem (landing page banner „Plánovaná odstávka 2026-04-XX 22:00-22:15 CEST")
2. DNS TTL lower 24h předem (60s)
3. V okně: Nginx vrátí 503 maintenance page, běž Prisma migrace, deploy build, restart pm2
4. Smoke check, pak remove 503

**Pro:** Simplé, deterministické, rollback triviální (git reset + restart)
**Proti:** 15 min user-facing downtime (v MVP zero impact)

### Strategy B — Blue-green

**Proč:** Zero-downtime, standard pro post-MVP fáze

**Flow:**
1. 2× pm2 proces: `carmakler-blue` (port 3000), `carmakler-green` (port 3001)
2. Nginx upstream pool s weighted round-robin
3. Deploy na green: build + migrate + start + smoke
4. Nginx swap: blue weight 0, green weight 100
5. Blue zůstane 30 min jako warm rollback, pak stop

**Pro:** Zero downtime, instant rollback (swap back)
**Proti:** Složitější, 2× RAM, Prisma migrace musí být backward-compatible (neni nullable drop, rename column bez alias, atd.)

**Doporučení plánovače:** **Strategy A pro první prod deploy**, přejít na B později (AUDIT-034 post-launch, po zvládnutí A dvakrát třikrát).

## 4) Data migration

### 4.1 Sandbox → prod strategy

**Plánovač doporučuje:** **Clean prod DB + Prisma seed** (ne sandbox dump import).

**Důvody:**
- Sandbox má testovací data (fake users, fake vehicles) — netahej do produ
- MVP launch = prázdný katalog, první reální inzeráty přijdou po launch
- Seed pouze `ADMIN` user + `SYSTEM_DELETED` sentinel user + regionální ředitelé (pokud už známí)

### 4.2 Seed content

```ts
// prisma/seed-prod.ts (NEW)
await prisma.user.upsert({
  where: { email: 'admin@carmakler.cz' },
  update: {},
  create: {
    email: 'admin@carmakler.cz',
    name: 'Admin',
    role: 'ADMIN',
    status: 'ACTIVE',
    passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD!, 10),
  },
});

await prisma.user.upsert({
  where: { email: 'system-deleted@carmakler.internal' },
  update: {},
  create: {
    email: 'system-deleted@carmakler.internal',
    name: 'SYSTEM_DELETED',
    role: 'ADMIN',
    status: 'DELETED',
  },
});
```

**POZOR:** `SEED_ADMIN_PASSWORD` musí být v `/etc/carmakler.env` jako ENV var, NE hardcoded.

## 5) ENV inventář (T-033-006 output)

Seznam všech required secrets pro produkci (bude v `/etc/carmakler.env` mode 600):

**Auth / session:**
- `NEXTAUTH_SECRET` (generate `openssl rand -base64 32`)
- `NEXTAUTH_URL=https://carmakler.cz`

**DB:**
- `DATABASE_URL=postgresql://carmakler:***@localhost:5432/carmakler?schema=public`
- `SEED_ADMIN_PASSWORD` (jen při seedu, lze odstranit po)

**Email (AUDIT-031):**
- `EMAIL_PROVIDER=resend` (nebo `wedos`)
- `RESEND_API_KEY`
- `WEDOS_SMTP_HOST=smtp.wedos.net`
- `WEDOS_SMTP_USER=noreply@carmakler.cz`
- `WEDOS_SMTP_PASS`

**Monitoring:**
- `SENTRY_DSN` (separátní prod project, NE sandbox DSN)
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` (build-time sourcemaps)

**Storage / CDN:**
- `CLOUDINARY_URL=cloudinary://key:secret@cloudname`

**Payments (AUDIT-014, post-launch):**
- `STRIPE_SECRET_KEY=sk_live_...`
- `STRIPE_PUBLISHABLE_KEY=pk_live_...`
- `STRIPE_WEBHOOK_SECRET`

**External APIs:**
- `VINDECODER_API_KEY`
- `ANTHROPIC_API_KEY` (AI asistent)
- `PUSHER_APP_ID`, `PUSHER_KEY`, `PUSHER_SECRET`, `PUSHER_CLUSTER`

**GDPR:**
- `GDPR_CONTACT_EMAIL=gdpr@carmakler.cz`

**PM2:**
- `NODE_ENV=production`
- `PORT=3000`
- `PG_POOL_MAX=20`

**Pre-launch:**
- Každý secret ověř přes Zod schema `lib/env.ts` při startu — app odmítne nastartovat když chybí required

## 6) Acceptance criteria

### Infra

- [ ] `/var/www/carmakler` existuje, owned by deploy user, git repo synced s `origin/main`
- [ ] `pm2 list` ukazuje `carmakler` online, 0 restarts, fork_mode × 1
- [ ] `nginx -t` clean, certbot renewal cron aktivní
- [ ] PostgreSQL 16, DB `carmakler` s všemi Prisma migracemi applied
- [ ] `/etc/carmakler.env` mode 600, ownership root:root, všechny required ENV present
- [ ] Backup cron `/etc/cron.d/pg-backup-carmakler-prod` aktivní, první dump existuje
- [ ] GDPR erasure cron `/etc/cron.d/gdpr-erasure` aktivní

### Functional

- [ ] `https://carmakler.cz/` 200 OK + HTML obsah landing page
- [ ] `https://www.carmakler.cz/` 301 → `carmakler.cz` (next.config redirect)
- [ ] 16/16 rout smoke z FIX-005 test passing
- [ ] Admin login funguje (admin@carmakler.cz + SEED_ADMIN_PASSWORD)
- [ ] Sentry test event dorazí do prod project
- [ ] Email test (Resend + Wedos fallback) deliver
- [ ] CSP header + Permissions-Policy (AUDIT-027) present v curl headers

### Security

- [ ] Let's Encrypt cert valid, HTTPS-only redirect
- [ ] HSTS preload active (max-age 2 roky)
- [ ] Žádný secret v git (check `git grep -i 'api_key\|secret'`)
- [ ] `/etc/carmakler.env` mode 600, ne world-readable

### Monitoring

- [ ] Sentry prod project aktivní, errors groupování funguje
- [ ] pm2 log rotation aktivní (`pm2 install pm2-logrotate`)
- [ ] Backup retention test: 14+ dní dumpů zachováno, starší smazány

### Rollback

- [ ] Dry-run A (git reset) zkoušeno + dokumentováno
- [ ] Dry-run B (DB restore) zkoušeno do jiné DB, NE over prod
- [ ] Dry-run C (DNS rollback) zkoušeno s kratším TTL
- [ ] `docs/ROLLBACK.md` committed v repo

## 7) Risks & mitigation

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R1 | DNS propagace delší než 5 min (některé ISP cache 24h) | Medium | Lower TTL 24h předem; monitor přes `dig @8.8.8.8`, `dig @1.1.1.1`, `dig @9.9.9.9` |
| R2 | Prisma migrace fail na prod (incompatible s prod DB schema) | High | Migrate deploy nejdřív na sandbox, verify clean, pak prod |
| R3 | SSH klíče nefungují, lockout | Critical | Pre-test SSH access 24h předem, mít fallback console access (hosting panel) |
| R4 | Let's Encrypt rate limit (5 certs/week) | Low | Pre-issue cert na staging cert před prod cut-over |
| R5 | Nginx upstream swap (Blue-green) selže uprostřed | Medium | Volba A maintenance window eliminuje |
| R6 | pm2 nespustí build (chybí NODE_ENV, ENV file) | High | T-033-018 validuje `pm2 logs` clean před dál |
| R7 | Sentry sourcemap upload fail → stacky v prod nečitelné | Low | T-033-017 ověří sourcemap funkcionalitu |
| R8 | Backup cron existuje ale nezapisuje (permission issue) | High | T-033-015 + T-033-023 manuální first dump ověř |
| R9 | PWA service worker cached verze blokuje update | Medium | Service worker `skipWaiting` logic + verze v `sw.js` filename |
| R10 | Kolegův server down během cut-over | Critical | Mít fallback maintenance page na Cloudflare / GitHub Pages |

## 8) Post-launch monitoring (první 7 dní)

**Dashboard:**
- Sentry error rate (target: < 0.5% requestů)
- pm2 restart count (target: 0, max 1-2 za týden akceptabilní)
- pg backup daily check (cron log `/var/log/pg-backup.log`)
- Uptime monitoring (externí: UptimeRobot nebo StatusCake na `https://carmakler.cz/`)

**Daily check (prvních 7 dní, pak týdně):**
1. `pm2 status carmakler` — uptime, memory, restart count
2. `tail -50 /var/log/pg-backup.log` — poslední backup OK
3. Sentry Issues page — 0 nových critical, všechny resolved
4. Google Analytics / Plausible (až bude nastaveno) — traffic baseline

**Alerting:**
- Sentry alert rules: nový error type během 1h → Slack + email
- UptimeRobot: 2× 500 v řadě → SMS (Twilio)
- pm2: memory > 1GB → restart (`max_memory_restart: 1G` v ecosystem.config.js)

## 9) Out of scope

- ❌ **Kubernetes / Docker** — overkill pro MVP, pm2 stačí
- ❌ **CDN (Cloudflare front-layer)** — nice-to-have, post-launch AUDIT-035
- ❌ **Multi-region deployment** — CZ/SK traffic, 1 region v Evropě stačí
- ❌ **Autoscaling** — pm2 cluster mode až pokud load > 1k rps (AUDIT-001 doporučení ponechat fork × 1)
- ❌ **Database read replica** — až když primary DB > 50% load
- ❌ **Subdomains** (inzeraty.carmakler.cz, makler.carmakler.cz) — AUDIT-030 post-MVP
- ❌ **Email domain warmup** (Resend) — AUDIT-026 samostatný, ne prod deploy scope

## 10) Interakce s ostatními AUDITy

- **AUDIT-003 pm2 ecosystem:** prerekvizita — ecosystem.config.js musí existovat před T-033-012
- **AUDIT-024 GDPR erasure:** schema migrace `deletionRequestedAt/Scheduled/Cancelled` applied v T-033-013, cron v T-033-016
- **AUDIT-027 Permissions-Policy:** ověřeno v T-033-020 curl headers
- **AUDIT-031 Wedos SMTP:** ověřeno v T-033-022 email test, DNS SPF/DKIM/DMARC prerekvizita T-033-004
- **AUDIT-030 subdomény:** odsunuto, placeholder waitlist gate (FIX-020) aktivní

## 11) Open questions pro Radima + kolegu (T-033-001..007 blockery)

1. **Hosting rozhodnutí:** Kolegův dedicated server? Shared VPS? Hetzner Cloud nový? → určí resource limits + kdo má root.
2. **Doména:** DNS provider (Wedos? Active24? Cloudflare?) — kdo má API klíč / login?
3. **DB:** Sdílená PostgreSQL instance s jiným projektem kolegy, nebo čistě samostatný server?
4. **SSL:** Let's Encrypt (doporučeno), nebo komerční (EV cert pro B2B důvěru)?
5. **Maintenance window time:** Nejméně traffic = pátek/sobota večer 22:00-22:30 CEST? Nebo async deploy via Strategy B?
6. **Kolegův SSH přístup pro Claude:** Pub key import do `authorized_keys` kolegova serveru — kdo to udělá, kdy?
7. **Seed admin password:** Kdo vygeneruje první `SEED_ADMIN_PASSWORD`? Má být rotated po prvním loginu?

**Žádnou z těchto otázek neřeš mezitím — každá vyžaduje Radimův/kolegův input. Plán je ready, čeká jen na Fázi 1 T-033-001..007.**

---

**Verdict plánovače:** Production deploy = P0 blocker pro launch. 38 tasků, 1-2 dny práce po vyřešení open questions. Doporučuje **Strategy A (maintenance window)** pro první deploy — simple, deterministic, easy rollback. Přechod na Blue-green post-MVP jako AUDIT-034.

**Kritické:** Fáze 5 (dry-run rollback) PŘED Fáze 4 (DNS cut-over) — NE naopak. Testuj nouzový plán dokud je na něj čas, ne až nastane krize.
