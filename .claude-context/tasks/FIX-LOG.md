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
| FIX-001 | 2026-04-14 11:xx | implementátor | Marketplace copy | `app/(web)/marketplace/page.tsx` (meta L10-20, H1 L168-179, hero card L215-225, sekce příkladů L257-265, stats label L208) | Odstraněn slib „15-25 % ročně" + „+21% Průměrný roční výnos"; meta title/desc/OG přepsány na neutrální „Propojujeme realizátory a investory"; H1 „Propojujeme ověřené realizátory s investory"; stats label `Průměrný ROI` → `Historický ROI (ø)`; sekce „Příklady zhodnocení / Reálné příklady flipů a jejich výnosnost" → „Ilustrativní příklady projektů — Modelové kalkulace — nejsou zárukou budoucích výsledků"; přidán prominent risk disclaimer nad fold. Pozn.: `docs/presentations/marketplace-investori.html`, `_planning/**` a `docs/CARMAKLER-FULL-SPEC.md` obsahují stejné sliby, ale **nejsou live public routes** — fáze 2. Regulatorní posouzení (ČNB/ZISIF/ECSP) stále nutné. | `98397ac` | **F-012** (🔴 hard blocker, ČNB/ZISIF/ECSP red flag) | ⏳ | ⏳ |
| FIX-002 | 2026-04-14 11:xx | implementátor | Permissions-Policy | `next.config.ts:112` | `Permissions-Policy` změněn z `camera=(), microphone=()` na `camera=(self), geolocation=(self), microphone=()`. Broker PWA může v terénu fotit auto (13 exterior slotů) a zachytit lokaci nabrání. Microphone zůstává disabled. | `9f1fee6` | **F-005** (🔴 hard blocker, blokuje makléřský core flow) | ⏳ | ⏳ |

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
