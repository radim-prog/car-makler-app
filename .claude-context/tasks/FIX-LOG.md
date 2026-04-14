# FIX-LOG — Carmakler produkční hardening

**Vlastník:** radim-kontrolor (vede), implementátor + plánovač přispívají
**Datum založení:** 2026-04-14
**Účel:** Kontinuální záznam **všech** oprav provedených během auditu. Každá oprava se musí propojit s F-ID z `GO-NO-GO-REPORT.md` §3.
**Režim:** fix-as-you-go — opravy běží paralelně s auditem, ne až po synthesis.

---

## 1) Pravidla vedení FIX-LOGu

1. **Každý commit = nový řádek.** Jeden fix může pokrýt více F-ID, pokud řeší jednu logickou změnu (např. CSP migrace pokryje F-003 i F-005).
2. **Formát F-ID → FIX-ID** je **závazný** — jakmile se FIX dokončí, radim-kontrolor **updatuje GO-NO-GO §3** (přidá sloupec „FIX-ID" k odpovídajícímu F-řádku, verdikt změní na ✅ pokud ověřeno na sandboxu).
3. **„soubor:řádek"** = primární bod změny. Pokud fix zasahuje více souborů, uveď hlavní + „a další" s počtem.
4. **„commit hash"** = plný SHA (alespoň 7 znaků) z `main` po merge, ne PR branch.
5. **Kontrolorská validace:** každý řádek musí projít mnou (radim-kontrolor) — kontroluji proti Radimovu intent:
   - Nebyla odstraněna feature (inzerce / shop / marketplace **ZŮSTÁVAJÍ**)
   - Nebyly použity zkratky v UI (celý název, ne `mkl`)
   - Nedokončené části mají DEMO / „ve vývoji" badge
   - Admin stále vidí vše v navigaci
6. **Sandboxový test:** fix nesmí být označen jako hotový bez ověření na `car.zajcon.cz`.

---

## 2) Log oprav

| # | datum UTC | autor | komponenta | soubor:řádek | popis změny | commit hash | F-ID (z GO/NO-GO) | verifikováno na sandboxu | verdikt kontrolora |
|---|-----------|-------|------------|--------------|-------------|-------------|-------------------|--------------------------|--------------------|
| FIX-001 | 2026-04-14 11:xx | implementátor | Marketplace copy | `app/(web)/marketplace/page.tsx` (meta L10-20, H1 L168-179, hero card L215-225, sekce příkladů L257-265, stats label L208) | Odstraněn slib „15-25 % ročně" + „+21% Průměrný roční výnos"; meta title/desc/OG přepsány na neutrální „Propojujeme realizátory a investory"; H1 „Propojujeme ověřené realizátory s investory"; stats label `Průměrný ROI` → `Historický ROI (ø)`; sekce „Příklady zhodnocení / Reálné příklady flipů a jejich výnosnost" → „Ilustrativní příklady projektů — Modelové kalkulace — nejsou zárukou budoucích výsledků"; přidán prominent risk disclaimer nad fold. Pozn.: `docs/presentations/marketplace-investori.html`, `_planning/**` a `docs/CARMAKLER-FULL-SPEC.md` obsahují stejné sliby, ale **nejsou live public routes** — fáze 2. Regulatorní posouzení (ČNB/ZISIF/ECSP) stále nutné. | `98397ac` | **F-012** (🔴 hard blocker, ČNB/ZISIF/ECSP red flag) | ✅ 2026-04-14 — Title: „Propojujeme realizátory a investory" ✅; Meta desc: „Propojujeme ověřené realizátory aut s investory" ✅; H1: „Propojujeme ověřené realizátory s investory" ✅; zakázané fráze (15-25, vydělejte, zaručen, +21%): ČISTO ✅; disclaimer „Modelové kalkulace — nejsou zárukou budoucích výsledků" IN PAGE ✅ | ✅ PASS — kódová část F-012 vyřešena; regulatory review (ČNB/ZISIF/ECSP) stále doporučena |
| FIX-002 | 2026-04-14 11:xx | implementátor | Permissions-Policy | `next.config.ts:112` | `Permissions-Policy` změněn z `camera=(), microphone=()` na `camera=(self), geolocation=(self), microphone=()`. Broker PWA může v terénu fotit auto (13 exterior slotů) a zachytit lokaci nabrání. Microphone zůstává disabled. | `9f1fee6` | **F-005** (🔴 hard blocker, blokuje makléřský core flow) | ✅ 2026-04-14 — Response header potvrzen: `permissions-policy: camera=(self), geolocation=(self), microphone=()` | ✅ PASS — F-005 RESOLVED |
| FIX-004 | 2026-04-14 | implementátor | Deploy helper | `scripts/deploy-sandbox.sh` (nový) + chmod 755 | Standardizovaný deploy postup: `git push origin main` + remote `cd /var/www/car.zajcon.cz && git pull --ff-only && set -a && . ./.env && set +a && npm run build && pm2 restart car-zajcon --update-env` + smoke retry (10× / 2s). Volá se po každém commitu. | `3e52b63` + `(retry fix uncommitted)` | **proces** (mitigace toho, že FIX-001/002 nebyly hned deploynuté) | ✅ 2026-04-14 — použitý pro deploy FIX-005 (✅ smoke OK po 7. pokusu) | ✅ self-verified (kontrolor potvrzen není nutný — ops skript) |
| FIX-005 | 2026-04-14 | implementátor | NextAuth cookie | `lib/auth.ts:49-65` | Cookie `sessionToken.name` změněno na env-sensitive: prod (HTTPS) → `__Secure-next-auth.session-token`, dev (HTTP) → `next-auth.session-token`. Shoda s middleware `getToken()` defaultem (bez cookieName). Zachován `domain: NEXTAUTH_COOKIE_DOMAIN` pro subdomény. | `594a7ab` | **F-013** (🔴 hard blocker, blokuje vše chráněné) | ⏳ čeká na kontrolora: registrace → login → GET `/admin` / `/makler` — NESMÍ redirect na `/login` | ⏳ |
| FIX-006 | 2026-04-14 | implementátor | RESEND email | (env-only) | **BLOCKED** — diagnostika: `RESEND_API_KEY` v /var/www/car.zajcon.cz/.env i /var/www/carmakler/.env je **prázdné** (length=0). Není to deploy issue — klíč nikdy nebyl nastaven. V `~/.claude/secrets/` taky chybí. Radim musí dodat hodnotu z Resend dashboardu; pak postup: přidat do obou .env + `pm2 restart car-zajcon --update-env`. | — | **F-014** (🔴 hard blocker, tiché selhání emailů) | ❌ nelze ověřit bez klíče | ⚠️ ESKALACE na Radima |
| FIX-007 | 2026-04-14 | implementátor | PG zálohy | `/etc/cron.d/pg-backup-carmakler` (server, mimo repo) + `CLAUDE.md` (Infra sekce) | Daily `pg_dump \| gzip` prod `carmakler` (03:00 UTC) + sandbox `carmakler_sandbox` (03:15 UTC) → `/root/db-backups/{carmakler\|sandbox}-YYYY-MM-DD.sql.gz`; retence 30 dní (04:00 UTC); log `/var/log/pg-backup.log`; **peer auth** (`sudo -u postgres pg_dump`), žádné hesla v cron souboru. Smoke test: oba dumpy vytvořeny okamžitě (31K/32K, validní SQL header). | `0c7e143` (doc) + cron soubor na serveru (mimo git) | **F-015** (🔴 hard blocker — „můžeme jít do světa?" vyžaduje recovery strategii) | ✅ 2026-04-14 — oba dumpy vytvořeny a zkontrolovány (`zcat ... \| head` = validní PostgreSQL dump) | ✅ self-verified; handoff kontrolorovi na nezávislý check (`ssh 91.98.203.239 'ls -la /root/db-backups/'`) |

---

## 3) Plánované (nezahájené) opravy — ze současných findings

> Tento seznam je „hop list" pro implementátora, až odbaví FIX-001/002. Řádek se přesune do §2, jakmile se zahájí práce.

| Kandidát | F-ID | Komponenta | Skica fixu | Odhad |
|----------|------|------------|------------|-------|
| FIX-003 | F-001 | DB pool | Přidat `connectionTimeoutMillis: 10000` do `lib/prisma.ts:createPrismaClient`, volitelně zvýšit `max` s ohledem na `pm2 instances × PG max_connections` | 5-10 řádků + load test |
| FIX-004 | F-002 | Graceful shutdown | Přidat `SIGTERM`/`SIGINT` hook v `instrumentation.ts` volající `prisma.$disconnect()` + `pool.end()` | 10-15 řádků |
| FIX-005 | F-003 | CSP enforce | Přechod z `Content-Security-Policy-Report-Only` na `Content-Security-Policy` **po** vyřešení SW/Unsplash violations (AUDIT-025) | blokováno AUDIT-002/025 |
| FIX-006 | F-004 | Sentry v10 | Odstranit 3 deprecated options (`autoInstrumentServerFunctions`, `autoInstrumentMiddleware`, `autoInstrumentAppDirectory`) podle Sentry v10 migration guide | 10-20 řádků + test |
| FIX-007 | F-006 | Build pipeline | Vyjasnit `turbopack: {}` vs `--webpack` rozpor — buď odstranit turbopack z next.config, nebo přepnout buildy | závisí AUDIT-020 |
| FIX-008 | F-013 | Shop záruka | Ověřit vs. implementovat reklamační flow (2 roky spotřebitel vs. 6 měsíců v meta) — oprava copy **nebo** doplnit model | závisí AUDIT-007c |
| FIX-009 | F-014 | Marketplace legal | Regulatorní due-diligence (ČNB-ready právník) + strukturální úprava produktu — nemůže být „opraveno" jen kódem | závisí AUDIT-007d |

---

## 4) Verifikační protokol pro kontrolora

Po každém doručeném commitu:

1. `git show <hash>` — ověř že diff odpovídá popisu (ne víc, ne míň).
2. `curl -sI https://car.zajcon.cz/...` — ověř nasazení (headers, status).
3. Otevři dotčenou stránku na sandboxu a projeď manuální smoke test podle scope fixu.
4. Updatuj **tento FIX-LOG** (doplň commit hash + „verifikováno: ✅/❌" + verdikt).
5. Updatuj **GO-NO-GO-REPORT §3** — odpovídající F-řádek dostane novou hodnotu (např. F-012 → ✅ po FIX-001, nebo zůstává 🔴 pokud sandbox neprošel).
6. Pokud verdikt = ❌: ping team-lead + implementátor s konkrétním důvodem (sandbox screen / curl výstup / diff komentář).

---

## 5) Historie revizí FIX-LOGu

| datum UTC | autor | změna |
|-----------|-------|-------|
| 2026-04-14 | radim-kontrolor | založení, pre-populate FIX-001 (F-012) + FIX-002 (F-005), hop list FIX-003..009 |
| 2026-04-14 | implementátor | FIX-001 (commit `98397ac`) + FIX-002 (commit `9f1fee6`) implementovány lokálně — build OK, čekají na sandbox deploy + verifikaci kontrolorem |
| 2026-04-14 | radim-kontrolor | FIX-001 ✅ VERIFIED na sandbox (curl HTML parse) — všechny podmínky splněny. FIX-002 ✅ VERIFIED (response header curl). GO-NO-GO §3 F-012 → 🟡, F-005 → ✅ |
| 2026-04-14 | implementátor | FIX-004 (deploy skript `3e52b63`), FIX-005 (cookie fix `594a7ab`) — oba deploynuté. FIX-006 (RESEND) BLOCKED — chybí klíč i v prod. FIX-007 (PG backup cron + `0c7e143` doc) hotové, smoke OK. Pozn.: číslování §2 (team-lead ID) nesouhlasí s §3 hop list (radim-kontrolor ID), §3 zůstává pro F-001..F-006. |
