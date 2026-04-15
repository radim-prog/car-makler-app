# AUDIT-033 v2 — Plán: Production deployment (replace, ne greenfield)

**Datum:** 2026-04-15
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P0 (launch blocker)
**Odhadovaná práce:** 1-5 dní (závisí na scénáři)
**Supersedes:** `AUDIT-033-plan.md` v1 (greenfield setup — premise neplatná)
**Depends on:** všech 6 předchozích plánů (024, 027, 028, 029, 031, 003)

---

## 0) Revize premisy (vs. v1)

**Co se změnilo:** Plánovač v1 předpokládal greenfield deploy na kolegův server. **Tým-lead upřesnil:**

| Aspekt | v1 assumption | Realita |
|--------|---------------|---------|
| Server | Setup nový | **Stejný server jako sandbox** (`91.98.203.239` nebo ekvivalent) |
| `/var/www/carmakler` | Vytvořit | **Existuje, běží kolegův pm2 proces** |
| DB `carmakler` | Vytvořit | **Existuje, kolegova data** |
| Doména DNS | Konfigurovat | **`carmakler.cz` už žije, Wedos DNS, máme API** |
| SSL cert | Let's Encrypt setup | **Existuje, auto-renew běží** |
| Nginx vhost | Setup | **Existuje** |
| Node/pm2/PG | Install | **Hotovo (kolega)** |
| Upstream repo | NEZNÁMÝ | **`JevgOne/cmklv2`** (kolegův) |
| Náš fork | `radim-prog/car-makler-app` | 27 commits nad `66dc687 Import cmklv2 snapshot` |
| Kolegova role | N/A | **Kód autor + současný provozovatel** |

**Důsledek:** Fáze 2 (infra setup) v1 je **~90 % out-of-scope**. Nové cíle:
1. **Dostat našich 27 fixů do produkce** (A, B, nebo C)
2. **Zachovat kolegovu spolupráci** (B preferováno)
3. **Zero-data-loss** (kolegova prod DB má stavová data)
4. **Clean Git history** (PR-friendly)

## 1) Inventář našich commitů (27) — co jde do produkce

```
28d0ba6 🔒 fix(headers): rozšířit Permissions-Policy (AUDIT-027)
19f5b8e 🚪 feat(marketplace): waitlist gate pro uzavřený launch (F-020)
f664e3f 🔒 fix(db): GRANT INSERT/SELECT/UPDATE na AuditLog pro carmakler (FIX-033)
afe25bd 📝 docs(fix-log): FIX-017/019/031/032 entries
3d266da 🔒 feat(gdpr): real Art. 17 erasure flow with cooling-off (F-032)
ea308b2 🔒 feat(audit): AuditLog Prisma model + helper (F-031)
bcbef4d 📧 feat(email): Wedos SMTP fallback s provider switch (F-019)
cdaca14 🔒 fix(security): anon listing → DRAFT + magic link e-mail confirm (F-029)
e1f91ea 🎨 fix(design-tokens): FIX-022 — editorial B2B tokens + Fraunces/JetBrains fonts
bf9af5c 🔒 fix(gdpr): Plausible Analytics conditional na cookie consent (F-034)
2200f29 🔗 fix(nav): /o-nas#tym anchor + /gdpr + /faq stub pages (F-028)
069446c 🎨 fix(homepage): FIX-010..014 — B2B copy rewrite + profesionální hero
15ddb56 🔗 fix(routing): chybějící /sluzby rozcestník (F-027)
e909bfc 🛡️ fix(prisma): PG pool hardening + SIGTERM graceful shutdown (F-001, F-002)
03cf580 🧹 fix(config): Sentry v10 deprecations + CSP Unsplash (F-017, F-018)
2ab332b 🔧 fix(setup): postinstall hook pro prisma generate (F-016)
0c7e143 🗄️ feat(infra): PostgreSQL daily dump cron + 30d retention (F-015)
594a7ab 🔐 fix(auth): oprava cookie name mismatch mezi auth a middleware (F-013)
3e52b63 🚀 feat(scripts): deploy helper pro sandbox car.zajcon.cz
9f1fee6 🛡️ fix(security): allow camera+geolocation pro broker PWA terén (F-005)
98397ac 🛡️ fix(marketplace): odstranit regulatorní riziko (F-012)
+ 6× docs(fix-log) commits
```

**Obsah:**
- Security: CSP, Permissions-Policy, HSTS (nepřímo), NextAuth cookie
- GDPR: AuditLog, Art. 17 erasure, cookie consent, Plausible gating
- Infra: pg_dump cron, PG pool hardening, SIGTERM, Sentry v10, postinstall
- Marketplace: waitlist gate, regulatorní copy
- Brand: editorial tokens, Fraunces, B2B copy rewrite
- Routing: /sluzby, /gdpr, /faq, /o-nas#tym
- Auth: anon DRAFT + magic link

**Žádný breaking change pro DB:** všech 27 Prisma migrací je additive (nové sloupce, nové tabulky AuditLog/PitchDeckGeneration, nulable fieldy `deletionRequestedAt/Scheduled/Cancelled`). **Žádný drop, žádný rename bez default.** → safe pro produkci.

## 2) Tři scénáře

### Scénář A — Fork/replace (radikální, NEDOPORUČENO)

**Co:** Zastavíme kolegův pm2 `carmakler` proces, přepíšeme git remote na náš fork, hard reset na `radim-prog/main`, redeploy.

**Kroky:**
1. Koordinace s kolegou (minimálně e-mail s upozorněním)
2. `ssh root@prod-server` → `cd /var/www/carmakler`
3. `pg_dump carmakler > /root/db-backups/pre-replace-$(date +%F).sql.gz` (safety)
4. `pm2 stop carmakler`
5. `git remote set-url origin https://github.com/radim-prog/car-makler-app.git`
6. `git fetch origin && git reset --hard origin/main`
7. `npm ci && npx prisma migrate deploy`
8. ENV file audit: `/etc/carmakler.env` musí obsahovat nové secrets (RESEND, WEDOS, SEED_ADMIN_PASSWORD pokud nutné)
9. `npm run build && pm2 start ecosystem.config.js` (z AUDIT-003)
10. Smoke + Sentry monitor

**Timing:** ~30 min execution + koordinace s kolegou (neznámá).

**Kolegova role:** **BYPASS** — kolega je jen informován post-fact, ztrácí kontrolu nad repem.

**Risks:**
- ❌ **Ztráta autorství kolegy** — commits z `JevgOne/cmklv2` zůstanou v `radim-prog` jen jako absorbované, kolega ztrácí ownership
- ❌ **Společenské riziko** — vypadá jako „převzetí" bez dohody
- ❌ **Merge konflikty** pokud kolega mezitím commitoval do `JevgOne/cmklv2`
- ❌ **Single point of failure** — pokud my zmizíme, kolega přebírá cizí 27 commitů bez kontextu
- ✅ Rychlost: nejkratší deploy-to-launch čas

**Rollback:** `git reset --hard <původní-commit-kolegy>`, `pm2 restart`. Trvale 5 min.

**Verdict:** **Pouze pokud kolega opustil projekt** a Radim převzal 100 % vlastnictví. Jinak `B` je lepší.

---

### Scénář B — Merge upstream PR (DOPORUČENO)

**Co:** Vytvoříme PR z `radim-prog/car-makler-app` do `JevgOne/cmklv2`. Kolega review + merge. Po merge kolega sám redeploy (my pomůžeme s GRANT/migrations/ENV/verify).

**Kroky:**

#### Fáze B.1 — PR příprava (plánovač + implementátor, ~2h)

1. **Přidat upstream remote:**
   ```bash
   git remote add upstream https://github.com/JevgOne/cmklv2.git
   git fetch upstream
   ```
2. **Audit gap** mezi `radim-prog/main` a `upstream/main`:
   ```bash
   git log upstream/main..HEAD --oneline     # naše commity
   git log HEAD..upstream/main --oneline     # kolegovy commity, které nemáme
   ```
3. **Rebase našich commitů na upstream/main** (pokud kolega mezitím commitoval):
   ```bash
   git checkout -b prod-merge
   git rebase upstream/main
   # resolve konflikty — očekávaný nízký počet (naše fixy v separátních souborech většinou)
   ```
4. **PR description** — strukturovaná do sekcí:
   - **Security fixes** (F-001, F-002, F-005, F-013, F-017, F-018, F-029, F-034, AUDIT-027)
   - **GDPR compliance** (F-031 AuditLog, F-032 erasure, F-034 cookie consent)
   - **Infra hardening** (F-015 backup, F-016 postinstall, pm2 ecosystem, Sentry v10)
   - **UX/Brand** (FIX-010..014 homepage, FIX-022 editorial tokens, F-027/028 routing)
   - **Marketplace** (F-012 regulatorní, F-020 waitlist gate)
   - **Migration steps pro reviewery:** Prisma migrate deploy + GRANT + ENV check
   - **Rollback plán:** `git revert <merge-commit>` + `prisma migrate resolve`
5. **Push fork + create PR** — via `gh pr create --repo JevgOne/cmklv2 --base main --head radim-prog:prod-merge`

#### Fáze B.2 — Code review (kolega, 1-3 dny)

6. Kolega review, komentáře, může požádat o změny
7. Radim mediátor pokud nesrozumění; plánovač + implementátor dostupní na otázky
8. Merge commit preferováno (zachová commit history), ne squash

#### Fáze B.3 — Post-merge deploy (kolega primary, implementátor support, ~1h)

9. Kolega `git pull upstream/main` v `/var/www/carmakler`
10. `npm ci && npx prisma migrate deploy` — nové tabulky AuditLog, PitchDeckGeneration, nové sloupce User
11. **GRANT pro `carmakler` DB user na nové tabulky** (FIX-033 obsahuje toto) — pokud kolega má jiný DB user, musí upravit `prisma/migrations/*_audit_log/grant.sql`
12. ENV audit: `/etc/carmakler.env` musí obsahovat `RESEND_API_KEY`, `WEDOS_SMTP_*` (pokud Radim používá), `GDPR_CONTACT_EMAIL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — pokud chybí, kolega přidá
13. `npm run build && pm2 reload carmakler --update-env`
14. Smoke test (curl hlavní rout) + Sentry monitor 30 min

#### Fáze B.4 — Post-deploy (kontrolor, ~1h)

15. LAUNCH-CHECKLIST.md update: všechny F-IDs RESOLVED v prod
16. Smoke test 16/16 rout
17. GDPR erasure cron audit (`crontab -l` na prod)
18. Backup cron audit + první dump

**Timing celkem:** 3-6 dní (PR review bottleneck u kolegy).

**Kolegova role:** **REVIEWER + EXECUTOR**. Má plnou kontrolu, my pomocníci.

**Risks:**
- 🟡 **PR rejection** — kolega může chtít jinou cestu (např. rozdělit do multiple PRs). Mitigace: nabídnout split po sekcích (security / GDPR / UX / infra).
- 🟡 **Review delay** — kolega zaneprázdněn, PR stagnuje týden. Mitigace: Radim follow-up personal.
- 🟢 **Merge konflikty** — očekáváme low (naše commity na separátních souborech).
- 🟢 **DB migrace** — všech 27 additive, safe parallel.

**Rollback:** `git revert <merge-commit>` + `npx prisma migrate resolve --rolled-back <migration>` + `pm2 reload`. Trvalost ~10 min.

**Verdict:** ✅ **Doporučené.** Zachovává ekvitu kolegy, čisté PR review, reálný code-review proces.

---

### Scénář C — Parallel deploy + DNS swap (safe, ale costly)

**Co:** Naše aplikace zůstane na `car.zajcon.cz` jako „production-ready staging". Kolegův `carmakler.cz` zůstává netknutý. Launch pomocí DNS swapu `carmakler.cz` → náš IP (stejný server, jen jiný pm2 proces + nginx vhost), jakmile Radim potvrdí koordinaci.

**Kroky:**

#### Fáze C.1 — Příprava druhého vhostu (~2h)

1. Na stejném serveru (`91.98.203.239` nebo prod host) vytvoř `/var/www/carmakler-next` (clone `radim-prog/car-makler-app`)
2. Nginx vhost `carmakler-next.temp.zajcon.cz` (temporary doména pro pre-launch testing)
3. Nová DB `carmakler_next` (čerstvá, s naším Prisma schema) nebo sdílená s existujícím `carmakler` (nutno zrevidovat compatibility)
4. Separate pm2 proces `carmakler-next` na port 3001
5. ENV file `/etc/carmakler-next.env` (own secrets)

#### Fáze C.2 — Pre-launch testing (~3h)

6. Smoke suite + funkční testy na `carmakler-next.temp.zajcon.cz`
7. Kolegův `carmakler.cz` production běží nerušeně

#### Fáze C.3 — DNS swap (launch moment, ~30 min)

8. Radim rozhodne „go" + koordinuje s kolegou (informativní message)
9. Lower DNS TTL 60s 24h předem
10. DNS swap `carmakler.cz` A record → prod IP (je stejný, ale nginx routuje na port 3001 místo 3000)
11. **Varianta a:** nginx swap `server_name carmakler.cz` z kolegova vhostu na náš
12. **Varianta b:** DNS subnet + different IP alias (složitější)
13. Smoke retry 10×
14. Kolegův pm2 zůstává **running** jako instant rollback

#### Fáze C.4 — Post-launch decommission (~1 týden po launch)

15. Po 7 dnech stable prod → kolegův pm2 stop + archivace
16. `carmakler_next` DB rename na `carmakler` (nebo data merge pokud kolega měl stavová data)

**Timing:** 2-3 dny setup + 30 min launch + 7 dní verify + 1h decommission = ~2 týdny.

**Kolegova role:** **INFORMED** (přečte zprávu, není v execution path, zachová si kód jako backup).

**Risks:**
- ❌ **Data split**: kolegův `carmakler` DB vs náš `carmakler_next` — pokud oba mají real users/vehicles, merge neřešitelný. **Fatal pokud prod už má zákaznická data.**
- 🟡 **Resource overhead**: 2× pm2 + 2× DB + 2× disk = ~2× RAM/storage během paralelního běhu
- 🟡 **Nginx config complexity** — jedno slip-up a oba procesy dostupné na stejné doméně
- ✅ **Instant rollback** (DNS back nebo nginx reload)

**Rollback:** DNS revert + nginx reload. < 5 min.

**Verdict:** **Pouze pokud prod DB má kritická data** a nemůžeme si dovolit migration risk. Pro MVP launch zbytečně složité.

---

## 3) Matrix porovnání

| Kritérium | A — Fork/Replace | B — Merge PR | C — Parallel+DNS |
|-----------|------------------|--------------|-------------------|
| **Timing** | 30 min exec | 3-6 dní | 2 týdny |
| **Kolegova role** | Bypass | Reviewer + Executor | Informed |
| **Társenský dopad na vztah** | 🔴 Risk | 🟢 Pozitivní | 🟡 Neutrální |
| **Rollback čas** | 5 min | 10 min | < 5 min |
| **Rollback bezpečnost** | 🟡 git reset | 🟢 revert + migrate resolve | 🟢 DNS swap |
| **Resource overhead** | 🟢 Žádný | 🟢 Žádný | 🔴 2× RAM/DB |
| **Git history cleanliness** | 🔴 Force-push vibe | 🟢 Clean PR | 🟡 Fork-only |
| **DB data safety** | 🟡 Depends on backup | 🟢 Migrate in place | 🔴 Split risk |
| **Kontrola nad procesem** | 🟢 Plná | 🟡 Kolega gate | 🟢 Plná |
| **Transparence pro stakeholders** | 🔴 Fait accompli | 🟢 Review process | 🟡 Partial |
| **Regulatorní stopa** (audit trail) | 🟡 git only | 🟢 GitHub PR + review | 🟡 git only |
| **Reverse migration (pokud by přišlo)** | 🔴 Hard | 🟢 Easy | 🟢 Easy |

## 4) Doporučení plánovače

### Primary: **Scénář B (Merge PR)**

**Rationale:**
1. **Společenská čistota** — kolega zůstává stakeholderem, žádné overreach
2. **Code review hodnota** — druhé oči na 27 commitů = catch pro missed edge cases
3. **Clean Git history** — auditovatelný proces, buduje důvěru
4. **Kolegova stabilita prod infry** — necháme ho udělat finální deploy, on ví, co tam má
5. **Fallback: pokud review táhne** → přejít na C jako urgency path

### Secondary (fallback): **Scénář C (Parallel)**

**Kdy eskalovat:**
- Kolega neresponduje na PR déle než 5 pracovních dnů
- Launch deadline tlačí (MVP konec dubna)
- Existující prod DB nemá kritická zákaznická data (ověřit!)

### NE: **Scénář A (Fork/replace)**

**Kdy:**
- Pouze pokud kolega explicitly opustí projekt a předá ownership
- Nikdy jako default

## 5) Zúžená Fáze 1 — Open questions (pouze 2)

| ID | Otázka | Kdo rozhoduje |
|----|--------|---------------|
| T-033-v2-001 | **Scénář volba A/B/C** | Radim (po konzultaci s kolegou pokud B) |
| T-033-v2-002 | **Maintenance window timing** — kolegův deploy může být bez downtime (pm2 reload), žádné okno nutné pro B. Pro A/C: pátek/sobota 22:00 CEST doporučeno. | Radim |

Ostatních 5 otázek z v1 (hosting, DNS, DB, SSL, SSH) = **neaplikabilní** (vše existuje).

**Seed admin password (bývalá Q7):**
- Scénář B → **nepotřeba** (kolegův admin zůstává, případně Radim přidá druhý ADMIN user přes seed migration v samostatném PR)
- Scénář A → **nepotřeba** pokud kolegova DB zachována
- Scénář C → Radim vytvoří nový admin v čerstvé `carmakler_next` DB

## 6) Execution checklist pro scénář B (preferovaný)

### Pre-flight (plánovač + implementátor, ~2h)

- [ ] Ověř že `radim-prog/main` je clean (žádné uncommitted changes)
- [ ] Přidat `upstream` remote (`JevgOne/cmklv2`)
- [ ] Fetch upstream, porovnat gap
- [ ] Rebase na upstream/main pokud nutné
- [ ] Dry-run build: `npm ci && npm run build && npx prisma migrate deploy --preview-feature` (proti sandbox DB clone)
- [ ] Vytvořit PR branch `prod-merge`

### PR creation

- [ ] PR description strukturovaně (6 sekcí: security/GDPR/infra/UX/marketplace/routing)
- [ ] Migration steps sekce s přesnými příkazy
- [ ] Rollback sekce
- [ ] Tag relevantní F-IDs
- [ ] CC Radim, kolega jako reviewer
- [ ] Screenshoty homepage před/po (FIX-022)

### Review support

- [ ] Plánovač k dispozici pro otázky k architektuře
- [ ] Implementátor k dispozici pro kód otázky
- [ ] Kontrolor poskytne FIX-LOG + AUDIT-XXX plány jako kontext
- [ ] Radim eskaluje blockery

### Post-merge (kolega + implementátor support)

- [ ] Kolega deploy per Fáze B.3
- [ ] Implementátor support: GRANT script, ENV audit, migrate deploy verifikace
- [ ] Kontrolor smoke + Sentry + backup verifikace
- [ ] LAUNCH-CHECKLIST update

## 7) Risks & mitigation — cross-scenario

| # | Risk | Scenarios affected | Mitigation |
|---|------|--------------------|-----------|
| R1 | Kolega nerespondujíci na PR | B | 3-day follow-up Radim → 5-day eskalace na C |
| R2 | Merge konflikty > 10 souborů | B | Pre-rebase na upstream/main, resolve before PR |
| R3 | ENV file chybí RESEND/WEDOS/GDPR vars | A, B, C | Pre-deploy checklist `lib/env.ts` Zod validation blokuje start |
| R4 | Prisma migrate selže na prod DB (schema drift) | A, B | Migrate deploy na sandbox clone prod DB nejdřív (backup + restore) |
| R5 | GRANT script nefunguje (kolegův DB user má jiné jméno) | A, B | FIX-033 je parametrizovaný, nebo vytvořit per-scenario GRANT |
| R6 | pm2 reload failuje kvůli chybějícímu `ecosystem.config.js` | A, B | AUDIT-003 deliverable — ecosystem.config.js v repu |
| R7 | DNS TTL pre-lower nezachycen | A, C | 24h předem snížit, ověř `dig`; B nepotřebuje |
| R8 | Sandbox testing gap (prod má data, sandbox ne) | všechny | Staging DB clone pro final verifikaci |
| R9 | Rollback DB migration breaks (nulable column s non-null data) | A, B | Všech 27 migrací je additive; revert scénář dokumentován v PR |
| R10 | Sentry sourcemap upload fail v build | všechny | AUDIT-003 ověření `SENTRY_AUTH_TOKEN` |
| R11 | Kolega má lokální uncommitted changes v `/var/www/carmakler` | B (deploy) | Kolega pre-flight `git status` check, commituje nebo stash |

## 8) Acceptance criteria (per scenario)

### Scénář B — Merge PR

- [ ] PR otevřen v `JevgOne/cmklv2` s 27 commits + 6 dokumentačních
- [ ] PR description obsahuje migration + rollback steps
- [ ] Kolega aproves
- [ ] Merge commit v `upstream/main`
- [ ] Prod deploy: `pm2 reload carmakler` → status online, 0 restarts
- [ ] Smoke 16/16 rout passing
- [ ] Sentry test event dorazí
- [ ] Backup cron ověřen (pokud už neexistoval; pokud ano, v FIX-015 existuje)
- [ ] GDPR erasure cron aktivní
- [ ] LAUNCH-CHECKLIST update

### Scénář C — Parallel+DNS

- [ ] `carmakler-next.temp.zajcon.cz` funkční před DNS swap
- [ ] Smoke + E2E clean
- [ ] DNS TTL 60s active 24h předem
- [ ] DNS swap + smoke retry 10×
- [ ] Kolegův pm2 zůstává running 7 dní
- [ ] Po 7 dnech: decommission + DB merge (pokud aplikovatelné)

### Scénář A — Fork/replace

- [ ] Kolega informed + potvrdil (písemně, audit trail)
- [ ] Pre-replace DB backup existuje
- [ ] `git remote` přepsán
- [ ] pm2 reload + smoke clean
- [ ] Pokud problém: rollback na původní commit kolegy

## 9) Post-deploy monitoring (všech scénářů)

První 7 dní:
- Sentry: error rate < 0.5%
- pm2: uptime ≥ 99.5%
- Backup cron: daily dump přítomen
- GDPR erasure cron: daily log aktivní
- Uptime externí (UptimeRobot doporučeno)

Alerting:
- Sentry nová issue → Slack + email (jakmile nastavíme)
- pm2 restart > 2/týden → investigate

## 10) Out of scope (všech scénářů)

- ❌ **CDN (Cloudflare)** — post-launch AUDIT-035
- ❌ **Kubernetes** — overkill pro MVP
- ❌ **Blue-green permanent** — post-MVP AUDIT-034
- ❌ **Multi-region** — fáze 2
- ❌ **Subdomains full** — AUDIT-030 backlog
- ❌ **Stripe live keys** — fáze 2 po ČNB právníkovi

## 11) Interakce s ostatními AUDITy

- **AUDIT-003 pm2 ecosystem:** `ecosystem.config.js` je součást PR v B
- **AUDIT-024 GDPR erasure:** cron setup součást post-deploy checklistu
- **AUDIT-027 Permissions-Policy:** commit `28d0ba6` součást PR
- **AUDIT-031 Wedos SMTP:** commit `bcbef4d` součást PR, DNS SPF/DKIM/DMARC pre-deploy task
- **AUDIT-028/029 ekosystém + pitch deck:** NE součást tohoto deployu, post-MVP

---

**Verdict plánovače (v2):** Scénář B (Merge PR do `JevgOne/cmklv2`) je **kriticky doporučený** z 3 důvodů: společenská etika, auditní čistota, deployment safety. Timing 3-6 dní akceptabilní pro MVP konec-duben target.

**Immediate next step pro Radima:** odpověz na T-033-v2-001 (A/B/C) + T-033-v2-002 (maintenance window). Poté implementátor spustí Fázi B.1.

**Plánovač čeká na rozhodnutí.**
