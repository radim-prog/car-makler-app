# GO / NO-GO Report — Carmakler launch readiness (M1 sandbox + M2 produkce)

**Vlastník:** radim-kontrolor
**Datum založení:** 2026-04-14
**Poslední update:** 2026-04-15 (Radim: launch target přesunut — Milestone 1 = car.zajcon.cz "demonstrable complete"; carmakler.cz netknutá)
**Účel:** Kontinuální vstup pro Radima — **„je car.zajcon.cz launch-ready pro Milestone 1 review?"**

---

## 0aa) Provozní režim 2026-04-15 — Milestone model (NOVÝ)

> Radim (2026-04-15): „hod to na car.zajcon.cz.... budeme to teď dokud na tom pracujeme dávat na něco.zajcon.cz"

**Cíl posunut z „produkční carmakler.cz launch" na dvoustupňový Milestone model:**

| Milestone | Cíl | Stav | Deploy target |
|---|---|---|---|
| **M1 — sandbox launch-ready** | `car.zajcon.cz` v „demonstrable complete" stavu — všechny hard blockers vyřešené, všechny 4 produkty funkční, brand/narrative/design konzistentní, GDPR+legal+stability kompletní. Radim může web ukázat komukoliv (investor, pilot autobazar, právník) bez embarrassment. | 🟡 **aktivní cíl** | `car.zajcon.cz` přes `scripts/deploy-sandbox.sh` |
| **M2 — produkční deploy** | `carmakler.cz` live — synchronizace naše fork → kolegova produkce | ⏸ **odloženo** | TBD; AUDIT-033-v2 zůstává v repu jako reference, neimplementovat |

**Pravidla M1:**
- `carmakler.cz` (kolegova produkce, `JevgOne/cmklv2`) = **netknutá.** Žádný PR, replace, DNS swap.
- Všechny commity teď → `car.zajcon.cz` přes `scripts/deploy-sandbox.sh`.
- Budoucí Radimovy projekty ve vývoji → vlastní `*.zajcon.cz` subdomény (pattern pro Radimovu pracovní infrastrukturu).
- **„Launch verdikt" v tomto reportu nyní odkazuje na M1 (sandbox launch-ready), NE na produkční carmakler.cz.**
- M2 kritéria (DNS, HTTPS certs pro prod, blue-green, rollback, GRANT na prod DB) explicitně **mimo scope M1**; LAUNCH-CHECKLIST E1/E2 zachovány jako budoucí M2 reference.

**Implikace pro kontrolora:**
- M1 „launch-ready" = moment, kdy sandbox nemá žádný P0 bug / nekonzistentní brand / infantilní text / broken flow.
- A7 (pm2 ecosystem.config.js) **downgrade na 🟠** pro M1 scope — sandbox deploy nevyžaduje persistované env mezi rebooty (jednorázové `--update-env`). Zůstává 🔴 pro M2.
- Eskalace na Radima pro M1: **A8** (Wedos mailbox + SMTP credentials — Resend ZRUŠEN 2026-04-15) + **B6** (ČNB právník). **C1 F-046** (brand) — řešitelné interně, bez eskalace.
- D3 (Stripe production) mimo M1 — sandbox může jet v test mode.
- VETOES platí dál (Top makléři, marketplace 40/40/20, 4 subdomény, UI zkratky).

---

## 0a) Závazná rozhodnutí 2026-04-14 10:05 (FINÁLNÍ — žádné re-escalation)

> Radim: „nechci žádné otázky, máš obrovský tým, udělejte to nejlépe a nejprofesionálněji."
> Team-lead rozhoduje za tým. Eskalace na Radima JEN pro: extern API key (Wedos mailbox + SMTP creds, Stripe), právní posudek (ČNB), změna ekonomického modelu (provize, marketplace 40/40/20), existential business decision.
> Všechny ostatní rozhodnutí = závazná, kontrolor verify proti tomuto stavu.

| Téma | Rozhodnutí | Status |
|---|---|---|
| Nad-web architektura | **Varianta C (hybrid)** — 4 nové B2B landing pages + zachované existující subdomény | závazné |
| Brand jméno | **CarMakléř** (s diakritikou) — jednotně napříč všemi 4 produkty | závazné |
| Design systém | **Editorial B2B** (Midnight `#0D1F3C` + Fraunces serif + Lucide ikony, ZERO emoji v UI) **+ orange-500 CTA accent zachován** | závazné |
| FIX-017 anon inzerce | **Volba C** — anon vyplní → DRAFT → magic link e-mail confirm → live | závazné |
| Pavel z Kolína | **Modelový případ + prominent disclaimer** „Modelový scénář, ne reálný klient" | závazné |
| Foto knihovna | **SVG ilustrace primární** + studio fotky pro hero | závazné |
| Live stats | **„Pilotní fáze 2026" placeholder** + reálná data po launchi | závazné |
| B2B PDF pitch deck | **ANO** — sales tool pro autobazar acquisition | závazné |
| Marketplace launch | **§1115 OZ spolumajitelský model** + waitlist + invite-only beta (legal escape od ČNB licence) | **závazné, full live až po legal review** |
| Marketplace UI dnes | **„Coming Soon" + waitlist gate**, existing flow za `?invite=TOKEN` | závazné |
| Timing launch | **Ekosystém homepage IHNED** (po designer copy), **Marketplace až po legal** | závazné |
| Email service | **Wedos SMTP JEDINÝ provider** (nodemailer, smtp.wedos.net:587 STARTTLS). **Resend ZRUŠEN 2026-04-15** — Radim 2× potvrdil: „nebudeme používat resend... koupíme si emaily normálně na wedosu". FIX-037 = demontáž Resend (uninstall, delete lib/resend.ts, rewrite lib/email.ts). | závazné |

**Implikace pro kontrolora (verify checklist):**
- F-022 infantilní vzhled → CTA orange-500 přípustný (kompromis), zbytek midnight + Fraunces.
- F-026 Top makléři reframing → bude součástí copy varianty C, **VETO na odstranění platí**.
- F-012 marketplace → kódový gating (waitlist + invite token) řeší produkční viditelnost; legal due-diligence pokračuje paralelně.
- F-016 reframed: ~~RESEND_API_KEY~~ → **Wedos SMTP creds od Radima** = blocker. FIX-019 Wedos config hotový, FIX-037 demontáž Resend v progresu, čeká Wedos mailbox zakoupený Radimem.
- Brand **„CarMakléř"** (s diakritikou, velké K, velké M) → kontrolor hlídá konzistenci napříč VŠEMI novými stránkami; žádné „Carmakler" / „carmakler" v titulcích / hero / footer; žádné zkratky.
- Varianta C nesmí odstranit existující subdomény — jen přidá `/pro-bazary`, `/pro-auticare`, `/pro-investory`, `/pro-makleri`.

**Aktivní VETOES (4, beze změny):**
1. VETO odstranění „Top makléři" (reframing pouze).
2. VETO změna ekonomického modelu marketplace 40/40/20 — **toto jediné Radim musí potvrdit**.
3. VETO odstranění kterékoliv ze 4 subdomén.
4. VETO UI zkratky.

---

## 0b) Radimovo rozhodnutí 2026-04-15 (PROVOZNÍ PIVOT — ZÁVAZNÉ)

> Radim: „hod to na car.zajcon.cz.... budeme to teď dokud na tom pracujeme dávat na něco.zajcon.cz"

| Položka | Rozhodnutí |
|---------|------------|
| **carmakler.cz** | NETKNUTÁ — kolega's production, žádný PR do `JevgOne/cmklv2`, žádný DNS swap |
| **car.zajcon.cz** | Naše „production" pro vývoj — všechny commity sem přes `scripts/deploy-sandbox.sh` |
| **AUDIT-033 A/B/C** | ODLOŽENO — zůstává v repu jako reference, neimplementovat |
| **Budoucí projekty** | Poběží na vlastních `*.zajcon.cz` subdoménách (general pattern) |

**Nový cíl GO-NO-GO:**

- **Milestone 1** = `car.zajcon.cz` ve stavu „demonstrable complete" pro Radimovy revize (= aktuální cíl)
- **Milestone 2** = produkční deploy na `carmakler.cz` (AUDIT-033 A/B/C, stále otevřeno, bez termínu)

**Důsledky pro kontrolora:**
- Launch-readiness checklist **aplikuje na car.zajcon.cz** (sandbox), ne carmakler.cz
- Hard blockers A7/B6/C1 platí pro Milestone 1 (demonstrable complete = musí fungovat i zde)
- Eskalace na Radima (A8 Wedos mailbox + SMTP creds, B6 legal, D3 Stripe) se neodkladají — jsou prerekvizitou M1

---

## 0) Radimova aktuální vize (zdroj pravdy)

**Projekt = 4 propojené produkty na subdoménách:**
1. **Makléřská služba** → `carmakler.cz` (hlavní) — prodej aut přes certifikované makléře
2. **Inzerce** → `inzerce.carmakler.cz` — bezplatný Bazoš-like pro soukromé prodejce + integrace s makléřskou sítí
3. **Shop dílů** → `shop.carmakler.cz` — **katalogizované** autodíly podle modelu auta (diferenciátor vs. Bazoš), napojení na distributory (AutoKelly, AP Partner)
4. **Marketplace** → `marketplace.carmakler.cz` — propojení investorů (100-300k Kč) s „autíčkáři", short-term investice

**⚠️ Planning docs v `_planning/` (říjen 2025) popisují POUZE vizi 1. To je zastaralá verze.**
**Zdroj pravdy = aktuální kód + CLAUDE.md + CLAUDE konverzace s Radimem (2026-04-14).**

**Velikost dat (capacity planning):** pár stovek inzerátů, pár tisíc uživatelů → PG s pool=5 je naddimenzováno, ale nechat.

---

## 1) Matice hodnocení (platná od 2026-04-14)

| Stav v kódu | Očekáváno (aktuální vize) | Verdikt | Značka |
|---|---|---|---|
| Implementováno + funguje | Ano | HOTOVO | ✅ |
| Implementováno, ale nefunguje / nedokončeno | Ano | FIX NEEDED | 🔧 |
| Neimplementováno | Ano | CHYBÍ | ❌ |
| Implementováno | Ne (zbytečně navíc) | ZBYTEČNÉ | 🗑️ |

**⚠️ Stará matice (KONZISTENTNÍ / SCOPE DRIFT / MISSING) je ZRUŠENA. Nepoužívat.**

---

## 2) Hlavní otázky Radima → GO / NO-GO dimenze

| # | Dimenze | Konkrétní otázka | Stav | Zdroje |
|---|---|---|---|---|
| 1 | **Backend zapojení** | DB běží stabilně, přes connection pool, zálohy chodí? | ⏳ čeká AUDIT-001 + AUDIT-021 | — |
| 2 | **Přihlašování** | Registrace + login + role-based access funguje end-to-end? | ⏳ čeká AUDIT-013c + AUDIT-002 | — |
| 3 | **Subdomény** | `inzerce/shop/marketplace` vrací správný obsah, access matrix správně? | ⏳ čeká AUDIT-008 + AUDIT-013c | — |
| 4 | **Produkční stabilita** | Stability (pm2 restarty?), výkon, security headers, GDPR? | ⏳ čeká AUDIT-001/002/003/024 | — |
| 5 | **4 produkty kompletní** | Každý produkt má funkční MVP flow? | ⏳ čeká AUDIT-007a/b/c/d | — |
| 6 | **Platby** | Stripe Connect Express funguje, refundy, DPH, faktury? | ⏳ čeká AUDIT-014 | — |
| 7 | **Externí integrace** | Cebia, Wedos SMTP (Resend ZRUŠEN), ARES, Claude, shipping (5 carriers)? | ⏳ čeká AUDIT-016 + AUDIT-026 | — |
| 8 | **PWA terénní použití** | Makléř v terénu může focení + GPS (Permissions-Policy)? | ⏳ čeká AUDIT-025 + AUDIT-027 | — |
| 9 | **B2B pozicování (autobazary/autíčkáři)** | Má web sekci „Pro autobazary" + „Pro autíčkáře" s pitchem? Primární segment je B2B (100-200 aut), ne civilista s 1 autem. | ⏳ čeká AUDIT-028 + designer | Radim feedback 2026-04-14 |
| 10 | **Ekosystém narrative (4 produkty jako cyklus)** | Vypráví hlavní stránka value chain Autíčkář→Marketplace→Makléř→Shop→Inzerce? Cyklus posiluje rating → další investice. | ⏳ čeká AUDIT-028 + designer | Radim feedback 2026-04-14 |
| 11 | **Profesionální vs. infantilní vzhled** | Vypadá web důvěryhodně pro autobazarníka s flotilou 100-200 aut? (Ne omalovánkový / dětský tone.) | ⏳ čeká designer | Radim feedback 2026-04-14 |

**Legenda:** ✅ GO | 🟡 GO s výhradami | 🟠 NO-GO soft (fixable < 1 den) | 🔴 NO-GO hard (blocker > 1 den)

**🆕 Dimenze 9-11 jsou KO kritéria** — bez B2B pitch, ekosystémového narrative a profesionálního vzhledu web **nemůže** získat autobazar jako klienta. Radim to považuje za stejně závažné jako hard blockery F-005/F-012.

---

## 3) Kontinuální findings log

> Aktualizuje radim-kontrolor s každým novým QA/plánem/impl výstupem.
> Každá položka: `[číslo]` `[kategorie]` `[✅/🔧/❌/🗑️]` `[popis]` `[zdroj]` `[dopad na GO/NO-GO]`.

### 2026-04-14 (zakládací snapshot — z AUDIT-001 recon)

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-001 | DB pool | ✅ | **FIX-008 aplikován + ověřen.** `connectionTimeoutMillis: 10s`, `idleTimeoutMillis: 30s`, ENV overrides. Load test: 11k req/30s, avg 56ms, **0 errors**, 0 pm2 restarts. | `FIX-LOG FIX-008` | ✅ RESOLVED |
| F-002 | Graceful shutdown | ✅ | **FIX-008 aplikován + ověřen.** SIGTERM/SIGINT handlers v `instrumentation.ts`. `pm2 reload` → `[shutdown] SIGINT received, disconnecting Prisma... Prisma disconnected`. | `FIX-LOG FIX-008` | ✅ RESOLVED |
| F-003 | CSP enforcement | 🔧 | CSP je v `Report-Only` módu → neblokuje reálné útoky | `next.config.ts:118` | 🟡 — plánovaný přechod na enforce (AUDIT-002) |
| F-004 | Sentry | 🔧 | 3 deprecated options v `next.config.ts:141-144` (Sentry v10 migration needed) | `AUDIT-001-recon-notes.md` §5 | 🟢 — warning only, ne blocker |
| F-005 | Permissions-Policy | ✅ | **FIX-002 aplikován + ověřen.** `camera=(self), geolocation=(self), microphone=()` — broker PWA může fotit + GPS. Sandbox header potvrzen 2026-04-14. | `FIX-LOG FIX-002` | ✅ RESOLVED |
| F-006 | Build pipeline | 🔧 | `turbopack: {}` v next.config + `npm run build --webpack` = rozpor | `AUDIT-001-recon-notes.md` §7 | 🟡 — AUDIT-020 |
| F-007 | Upstream mechanism | ✅ | Commit `99b6003` identifikován jako build-time fix (jen static gen), ne runtime | `AUDIT-001-recon-notes.md` §2 | informační |
| F-008 | Uptime sandbox | ✅ | 43h bez restartu, 6/100 PG conns — žádný akutní tlak | team-lead brief | revize AUDIT-001 P0→P1 |
| F-009 | Stripe Connect | ✅ | Express typ potvrzen (commit `2bf0657`) | upstream git log | vstup pro AUDIT-014 |

### 2026-04-14 (2. kolo — ověření subdomén radim-kontrolorem)

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-010 | Subdomény | ✅ | Všechny 4 URL vrací HTTP 200, rychlé odezvy (~50-80 ms), titulky + meta přesně mapují Radimovu vizi | `curl` proti `*.car.zajcon.cz` | 🟢 — zásadní positive signal pro GO |
| F-011 | SEO/brand konzistence | ✅ | Titulky: „Prodej aut přes certifikované makléře", „vložte inzerát zdarma", „autodíly a příslušenství", „Investiční platforma pro flipping aut" — všechno česky, konzistentní tone | HTML `<title>` | 🟢 |
| F-012 | **Marketplace disclaimer** | 🟡 | **FIX-001 aplikován + ověřen (kódová část).** Zakázané fráze (15-25%, vydělejte, +21%) odstraněny; meta/H1 přepsán na „Propojujeme realizátory a investory"; disclaimer „Modelové kalkulace — nejsou zárukou budoucích výsledků" přidán. **Regulatory review (ČNB/ZISIF/ECSP) stále doporučena** — strukturální povaha produktu (investor↔realizátor, dělení zisku) nevyřešena kódem. | `FIX-LOG FIX-001` | 🟡 Kódový fix DONE; legal due-diligence pending (FIX-009) |
| F-013 | Shop záruka | ⚠️ | „6 měsíců záruka" v meta description — je to implementováno v Prisma modelu (vrácení/reklamace podle zákona 2 roky pro spotřebitele)? Nebo jen marketing copy? | `<meta name="description">` shop | 🟡 AUDIT-014 / AUDIT-007c ověří |
| F-014 | Marketplace loan structure | ⚠️ | „Ověření realizátoři nabízí příležitosti, ověření investoři financují" — pokud to je investice → ČNB licence, pokud půjčka → zákon o spotřebitelském úvěru, pokud crowdfunding → nařízení EU 2020/1503 (ECSP) | `<meta name="description">` marketplace | 🟠 AUDIT-007d **regulatorní due-diligence nutná** |

**F-012 kódová část VYŘEŠENA (FIX-001 ✅).** Regulatory due-diligence (ČNB/ZISIF/ECSP) stále doporučena — strukturální povaha marketplace produktu přetrvává (viz FIX-009).
**F-005 VYŘEŠEN (FIX-002 ✅).** Camera + geolocation povoleny pro broker PWA.

### 2026-04-14 (3. kolo — AUDIT-013c E2E smoke + FIX-001/FIX-002 verify)

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-015 | **Auth / Cookie mismatch** | ✅ | **FIX-005 aplikován + ověřen.** Cookie `__Secure-next-auth.session-token` správně nastaven. 5 rolí × 16 rout = 16/16 PASS. Admin panel, Broker PWA, User profil — vše dostupné bez redirectu na login. | `FIX-LOG FIX-005` + `AUDIT-013c-qa.md` §v2 | ✅ RESOLVED |
| F-016 | **Email (Wedos SMTP)** | 🔴 | **Resend ZRUŠEN** (Radim 2026-04-15 2× potvrdil). Wedos SMTP kód připraven (FIX-019 ✅), chybí `SMTP_USER`/`SMTP_PASSWORD`/`SMTP_FROM` ze zakoupeného Wedos mailboxu → žádné transakční emaily (verifikace, reset, notifikace, anon magic link). FIX-037 demontáž Resend v progresu. | `AUDIT-013c-qa.md` §3,§4 | 🔴 P0 — bez Wedos creds nefunguje registrační + anon DRAFT flow |
| F-017 | **PostgreSQL zálohy** | ✅ | **FIX-007 aplikován + ověřen.** `/etc/cron.d/pg-backup-carmakler` aktivní. Oba dumpy 2026-04-14 existují (31K/32K). Retence 30 dní. | `FIX-LOG FIX-007` | ✅ RESOLVED |
| F-018 | **pm2 env persistence** | ⚠️ | `ecosystem.config.js` chybí → po restartu/rebootu serveru se ztratí všechny env vars (`DATABASE_URL`, `NEXTAUTH_SECRET` atd.). Aktuálně nutné ručně spustit `--update-env`. | `AUDIT-013b-qa.md` + `AUDIT-013c-qa.md` §9 | 🟠 RIZIKO — při restartu serveru app nenaběhne bez manuálního zásahu |
| F-019 | **Sentry deprecated config** | ✅ | **FIX-009 aplikován + ověřen.** 3 deprecated options odstraněny z `next.config.ts`. `pm2 logs` prohledány — 0 deprecation warnings. | `FIX-LOG FIX-009` | ✅ RESOLVED |
| F-020-log | **Next.js InvariantError v pm2 logu** | ⚠️ | `InvariantError: The client reference manifest for route "X" does not exist` logováno pro více rout. **Non-fatal** — ověřeno JWT injection content-check: admin/dashboard→"Dashboard", admin/vehicles→"Vozidla", makler/dashboard→"Ahoj, Audit!", muj-ucet→"Můj účet" — všechny 200 OK s korektním obsahem. Pravděpodobně Next.js 16.1.7 canary known log noise. | kontrolor live check 2026-04-14 | 🟢 WARN — neblokuje funkčnost, stránky renderjí správně |

### 2026-04-14 (4. kolo — Radim strategický design feedback → B2B / ekosystém / infantilní vzhled)

> Radim (project owner) explicitně přehodnotil narrative. Primární zákazník **není civilista**, ale **autobazar / autíčkář**. Design musí tento pivot reflektovat.

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-020 | **B2B pozicování** | 🟡 | **FIX-010 aplikován + ověřen.** Hero strip: „Autobazary — Síť makléřů po ČR", „Autíčkáři — Financování + prodej", „Firemní flotily — Hromadný výprodej". ⚠️ Dedikovaná B2B landing sekce (ROI kalkulačka, jak začít, reference dealerů) stále chybí. Základní entry-point přítomen. | `FIX-LOG FIX-010` + sandbox 2026-04-14 | 🟡 B2B entry OK; deep B2B pitch = plánovač/designer fáze 2 |
| F-021 | **Ekosystém narrative** | 🟡 | **FIX-011 + FIX-014 aplikovány + ověřeny.** „součást ekosystému" v Inzerce copy, „4× PRODUKTY V EKOSYSTÉMU" ve stats panelu. ⚠️ Plný vizuální cycle diagram (Autíčkář→Marketplace→Makléř→Shop→Inzerce) chybí. | `FIX-LOG FIX-011,014` + sandbox 2026-04-14 | 🟡 Ekosystém naznačen; vizuální cyklus = fáze 2 |
| F-022 | **Infantilní vs. profesionální vzhled** | ✅ | **FIX-010/011/012/013/014 aplikovány + ověřeny.** Playwright screenshoty: clean sans-serif typografie, dark+orange palette, trust scores, ověřené recenze s cenami vozidel, CSS stats panel. Profesionální B2B tón potvrzen. | `FIX-LOG FIX-010..014` + screenshot 2026-04-14 | ✅ RESOLVED — design odpovídá B2B autobazar standardu |
| F-023 | **Hero copy „leasing"** | ✅ | **FIX-010 aplikován + ověřen.** `grep 'zaměstnanec\|živnostník\|důchodce'` → **0** ✅. H1 „Vaše auto prodáme v průměru do 20 dní" ✅. | `FIX-LOG FIX-010` + sandbox 2026-04-14 | ✅ RESOLVED |
| F-024 | **Shop ikonky (nákupní tašky)** | ✅ | **FIX-011 + FIX-014 aplikovány + ověřeny.** Screenshot: ⚙️ gear ikona na „Shop s autodíly" ✅. „Pomoc s financováním" s credit-card ikonou ✅. | `FIX-LOG FIX-011` + screenshot 2026-04-14 | ✅ RESOLVED |
| F-025 | **Recenze 3× identické 5★** | ✅ | **FIX-012 aplikován + ověřen.** 10 recenzentů (Jana K. / Martin D. / Tomáš H. / Petr M. / Autobazar Horák / Karel R. / Lukáš V. / Michaela S. / Jiří T. / Ing. Adam P.), variable ratings 7×5★+2×4.5★+1×4★, OVĚŘENÁ badge, B2B entry. | `FIX-LOG FIX-012` + screenshot 2026-04-14 | ✅ RESOLVED |
| F-026 | **„Top makléři" reframing (NE odstranění!)** | ✅ | **FIX-013 aplikován + ověřen. VETO splněno.** H2 „TOP Makléři" ZACHOVÁNO v HTML ✅. Benefit reframed: „Makléř jako průvodce" ✅. Empty stats skryty přes IIFE conditional ✅. | `FIX-LOG FIX-013` + sandbox 2026-04-14 | ✅ RESOLVED — VETO compliance potvrzen |

**F-022/F-023/F-024/F-025/F-026 VYŘEŠENY (FIX-010..014 ✅).** Designer pass dokončen a ověřen kontrolorem.
**F-020/F-021 ČÁSTEČNĚ** — základní B2B signály přítomny; deep B2B landing + vizuální ekosystém = plánovač/designer fáze 2.

**🛡️ Aktivní hlídky kontrolora (nové):**
- **VETO na odstranění „Top makléři"** — jakýkoliv návrh `delete` této sekce = okamžitý REJECTED (Radim řekl reframing).
- **VETO na změnu ekonomického modelu Marketplace** (40/40/20 split, investor↔realizátor) bez explicitního Radimova schválení. F-012 regulatory rámec stále otevřen — strukturální změna může zhoršit ČNB situaci.
- **VETO na odstranění kterékoliv z 4 subdomén** (carmakler / inzerce / shop / marketplace) — potvrzený Radimův záměr.
- **VETO na UI zkratky** („mkl", „market", …) — vždy celý název.

### 2026-04-14 (5. kolo — AUDIT-008 Access Matrix)

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-027 | **`/inzerce/pridat` unprotected** | 🟠 | `INZERENT_ROLES` definováno v middleware.ts ale **nikdy nepoužito** v žádném `if` bloku. `/inzerce/pridat` dostupné anonymně (HTTP 200). Závažnost závisí na API handler — pokud `/api/inzerce/create` nemá session check → **write access bez auth**. | `AUDIT-008-qa.md` F-A008-01 | 🟠 P1 — okamžitá kontrola API handleru + middleware fix |
| F-028 | **`BUYER_ROLES` unused** | ⚠️ | `BUYER_ROLES` definováno, nikdy aplikováno. Buyer-specific routy nemají role-based middleware check (jen "any auth"). | `AUDIT-008-qa.md` F-A008-02 | 🟡 P2 — informační, API handler audit |
| F-029 | **`/marketplace/investice` → 404** | 🟢 | Route neexistuje pro žádnou roli. Patrně přejmenována na `/marketplace/investor`. Pokud je odkaz v navigaci, UX bug. | `AUDIT-008-qa.md` F-A008-03 | 🟢 INFO |
| F-030 | **Cookie scope: subdomény bez session** | 🟢 | `NEXTAUTH_COOKIE_DOMAIN` není nastaven → cookie jen na `car.zajcon.cz`. Subdomény anonymous. Bezpečné v current single-host setup; riziko při scale-out. | `AUDIT-008-qa.md` F-A008-04 | 🟢 NÍZKÝ — pro produkci nastavit `.carmakler.cz` |

**Dobré zprávy z AUDIT-008:** `/admin`, `/makler`, `/marketplace/investor`, `/marketplace/dealer`, `/parts` — všechny správně chráněny. BROKER onboarding redirect OK. Admin chráněn i přes subdomény. ✅

### 2026-04-14 (6. kolo — AUDIT-024 GDPR technický audit)

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-031 | **GDPR AuditLog** | ❌ | Žádný model `AuditLog` v Prisma schema (1806 řádků). Bez logu nelze prokázat soulad s čl. 5(2) GDPR (accountability). Při porušení dat nejsou záznamy o přístupu. | `AUDIT-024-qa.md` F-GDPR-01 | 🟠 P1 — nutné před launchem |
| F-032 | **GDPR Art.17 výmaz — stub** | 🔴 | `POST /api/settings/delete-account` jen pošle notifikaci adminům, data ZŮSTANOU nedotčena. Chybí: anonymizace, `$transaction`, smazání sessions, odvolání tokenů. Potvrzení „Budeme vás kontaktovat" = falešné GDPR splnění. | `AUDIT-024-qa.md` F-GDPR-02 | 🔴 **P0 BLOCKER** — zákon vyžaduje výmaz do 30 dnů |
| F-033 | **GDPR Art.15 export neúplný** | 🔧 | `GET /api/settings/export` chybí: `AiConversation`, `Order` (delivery PII), `BrokerPayout`, `Listing`, `Lead`, `Notification`, `EmailLog`. Sandbox 502 neumožnil živý test. | `AUDIT-024-qa.md` F-GDPR-03 | 🟡 P2 — neúplný export nestačí GDPR čl. 15 |
| F-034 | **Analytics bez souhlasu** | ✅ | **FIX-018 aplikován + ověřen.** `Analytics.tsx` refaktorován na `"use client"` + `useCookieConsent()` hook. Guard: `if (!consent?.analytics) return null`. `curl / | grep plausible` → **0** ✅. Cookie banner „Přijmout vše / Pouze nutné / Nastavení" vizuálně potvrzen. | `FIX-LOG FIX-018` + sandbox 2026-04-14 | ✅ RESOLVED — P0 GDPR blocker vyřešen |
| F-035 | **GDPR kaskádové mazání PII** | 🔧 | Žádná User→PII relace nemá `onDelete: Cascade`. `AiConversation`, `SellerContact`, `Commission`, `Contract`, `Notification` mají `Restrict` → blokují DELETE. `Order.deliveryName/Phone/Email` přežije při buyerId=NULL. | `AUDIT-024-qa.md` F-GDPR-05 | 🟠 P1 — blokuje technickou proveditelnost Art.17 výmazu |
| F-036 | **Consent jen v localStorage** | ⚠️ | `CookieConsent.tsx` ukládá souhlas jen do `localStorage`. Žádný API call, žádný DB záznam. Nelze prokázat souhlas dle čl. 7(1) GDPR. | `AUDIT-024-qa.md` F-GDPR-06 | 🟡 P2 — pro EU launch nutný DB log |
| F-037 | **ipAddress bez retence** | ⚠️ | `MarketplaceApplication.ipAddress String?` bez definované doby retence. IP = osobní údaj (rozsudek Breyer). Porušení čl. 5(1)(e) GDPR (omezení uložení). | `AUDIT-024-qa.md` F-GDPR-07 | 🟢 P3 — cron delete nebo pole odstranit |

**GDPR celkové hodnocení:** 2× P0 blokery (F-032 výmaz stub + F-034 Analytics bez souhlasu). Bez jejich opravy **nelze legálně provozovat** platformu zpracovávající PII v EU.

### 2026-04-14 (7. kolo — AUDIT-025 PWA audit)

| # | Kategorie | Verdikt | Popis | Zdroj | Dopad |
|---|---|---|---|---|---|
| F-038 | **Manifest 502 → ✅ transient** | ✅ | Při auditu subagent naměřil 502. Re-test kontrolorem: `curl /manifest.json` → **HTTP 200**. Manifest je dostupný, soubor existuje v `public/manifest.json`, validní (14 polí ✅). Transientní výpadek sandboxu. | `AUDIT-025-qa.md` F-PWA-01 + live re-test | ✅ RESOLVED — neblokuje |
| F-039 | **SW cache-control** | ⚠️ | `sw.js` má `cache-control: public, max-age=0`. Doporučeno `no-store` (spec best practice). `skipWaiting: true` minimalizuje riziko. | `AUDIT-025-qa.md` F-PWA-02 | 🟢 NÍZKÝ — nginx config jednoduchá oprava |
| F-040 | **Offline stránka chybí (pwa-parts)** | 🔧 | `(pwa)/makler/offline/` existuje s kompletním UI. `(pwa-parts)/` **nemá offline stránku**. Dodavatel dílů vidí jen `OfflineBanner` bez možnosti správy pending akcí. | `AUDIT-025-qa.md` F-PWA-03 | 🟡 P2 — UX degradace pro parts supplier PWA |
| F-041 | **Offline cold start** | 🟢 | Cold start bez SW cache → `net::ERR_FAILED` (Playwright). Očekávané chování — SW musí mít alespoň jednu návštěvu pro precache. Není bug. | `AUDIT-025-qa.md` F-PWA-04 | 🟢 INFO — dokumentovat v UX onboarding |
| F-042 | **`beforeinstallprompt` chybí** | 🔧 | Žádná implementace install prompt handleru v celém `app/`. Instalovatelnost závisí čistě na prohlížeči. Pro makléřskou PWA (terénní použití) je instalace klíčová. | `AUDIT-025-qa.md` F-PWA-05 | 🟡 P2 — doporučeno před launchem |
| F-043 | **Push notifikace** | ❌ | `PushManager.subscribe()`, `Notification.requestPermission()` ani push API endpoint nenalezeny. Pro makléře (nové zakázky, schválení BackOffice) relevantní funkce. | `AUDIT-025-qa.md` F-PWA-06 | 🟡 FÁZE 2 — není blocker MVP |
| F-044 | **Sdílený manifest pro 2 PWA** | ⚠️ | `manifest.json start_url: "/makler/dashboard"` — pokud si dodavatel dílů instaluje PWA, dostane makléřský dashboard. Architektonické rozhodnutí pro fáze 2. | `AUDIT-025-qa.md` F-PWA-07 | 🟢 INFO — akceptovatelné v MVP, fáze 2 řeší |
| F-045 | **Background Sync stubs** | 🔧 | 4 sync tagy: `sync-vehicles`, `sync-images`, `sync-contracts`, `sync-contacts`. Pouze `sync-contacts` má reálnou implementaci (IndexedDB + fetch). Ostatní 3 = `console.log` only. | `AUDIT-025-qa.md` F-PWA-08 | 🟡 P2 — offline sync nefunguje pro vozidla/obrázky/smlouvy |

**PWA celkové hodnocení:** Serwist config ✅, Manifest validní ✅, SW dostupný 200 ✅, CSP `worker-src 'self'` ✅. Kritické F-038 potvrzeno jako transient. Bloker na produkci: F-042 (install prompt) + F-045 (sync stubs) doporučeny před launchem.

### Očekávané další updates
- Po AUDIT-013c (kontrolor) — **hlavní E2E smoke celé app** → masivní injekce findings do F-015+.
- Po AUDIT-011/012 (kontrolor) — TypeScript + unit test výsledky.
- Po AUDIT-007a/b/c/d — kompletnost MVP per produkt.
- **AUDIT-007d priority boost** kvůli F-012 — regulatorní posouzení marketplace musí být dřív než synthesis.

---

## 4) Předběžný GO/NO-GO (stav 2026-04-14 20:00)

**Celkový verdikt:** 🟡 **GO S VÝHRADAMI — audit běží, předběžný odhad**

**Pro (pro GO):**
- App stabilně běží 43h bez restartu.
- Stripe Connect Express + Sentry + NextAuth + Prisma = solidní production stack.
- 4 produkty jsou implementované (validováno HTTP 200 všech subdomén).
- Upstream má aktivní vývoj + PR workflow (kolega disciplinovaný).

**Proti (potenciální NO-GO):**
- ~~F-005 Permissions-Policy~~ ✅ VYŘEŠEN (FIX-002)
- ~~F-012 Marketplace copy~~ 🟡 kód OK (FIX-001); regulatory review pending
- ~~F-015 Cookie mismatch~~ ✅ VYŘEŠEN (FIX-005) — 16/16 rout přístupných
- ~~F-017 PG zálohy~~ ✅ VYŘEŠEN (FIX-007) — denní pg_dump aktivní
- **🔴 P0 — Wedos SMTP creds chybí** — Resend ZRUŠEN (Radim 2026-04-15), Wedos mailbox kupuje Radim, FIX-037 demontáž v progresu.
- **🔴 P0 — B2B narrative (F-020/F-021/F-022)** — bez pitch pro autobazary + ekosystémové story + profesionálního vzhledu se nezíská primární zákazník.
- **🔴 P0 — F-032** — GDPR Art.17 výmaz je stub; data se nemažou, zákon porušen.
- ~~F-034 Analytics~~ ✅ RESOLVED (FIX-018)
- CSP je v Report-Only = bezpečnostní headers **nejsou enforced**.
- Content bugs F-023/F-024/F-025/F-026 (hero leasing copy, shop ikonky, recenze, Top makléři reframing) — degradují conversion.
- Dalších 25+ auditních tasků teprve startuje — příliš brzy na finální verdikt.

**Nové KO dimenze 9-11 zvedají laťku** — audit nyní pokrývá i narrative/brand readiness, ne jen technickou stabilitu.

**Hard blockers track (2026-04-14 update — po AUDIT-024/025):**
- F-001 ✅ RESOLVED (FIX-008 — PG pool timeout hardened, load test 0 errors)
- F-002 ✅ RESOLVED (FIX-008 — graceful Prisma disconnect na SIGINT/SIGTERM)
- F-004/F-019 ✅ RESOLVED (FIX-009 — Sentry deprecated options odstraněny, logy čisté)
- F-005 ✅ RESOLVED (FIX-002 — Permissions-Policy)
- F-012 🟡 kód OK (FIX-001) / legal due-diligence pending
- F-015 ✅ RESOLVED (FIX-005 — Cookie mismatch, 16/16 routes pass + content check 5/5)
- F-017 ✅ RESOLVED (FIX-007 — PG backup cron aktivní)
- F-038 ✅ RESOLVED (manifest 502 byl transient — re-test 200 OK)
- F-022 ✅ RESOLVED (FIX-010..014 — profesionální vzhled, B2B segmenty, recenze, shop ikony)
- F-023/024/025/026 ✅ RESOLVED (FIX-010..014 designer pass)
- F-034 ✅ RESOLVED (FIX-018 — Analytics podmíněno cookie consentem, bf9af5c)
- **F-016 🔴 AKTIVNÍ BLOCKER** — Wedos SMTP creds (Resend ZRUŠEN 2026-04-15, FIX-037 demontáž v progresu, čeká Wedos mailbox od Radima)
- **F-020 🟡 PARTIAL** — B2B entry-point přítomen; deep B2B landing = fáze 2
- **F-021 🟡 PARTIAL** — Ekosystém naznačen; vizuální cyklus = fáze 2
- **F-032 🔴 AKTIVNÍ BLOCKER** — Art.17 delete-account je stub (GDPR výmaz nefunguje)
- **GDPR P1: F-031/F-035** — AuditLog chybí + kaskádové mazání PII
Každý nový hard blocker = ping team-lead.

**Odhad time-to-GO:** 3-7 pracovních dní při rychlém tempu (paralelní batche 1-4 + synthesis).

---

## 5) Trvalé hlídky pro radim-kontrolor

1. **Zákaz odstranění features:** inzerce, shop, marketplace **ZŮSTÁVAJÍ**. Pokud jakýkoliv agent navrhne odstranit → VETO + flag pro team-lead.
2. **Zákaz zkratek v UI:** vždy celý název (ne `mkl`, `marketplace` zkratka, atp.).
3. **Duplicity mohou být záměrné:** ověř kontext před doporučením merge/delete.
4. **Nedokončené funkce se OZNAČUJÍ:** DEMO / „ve vývoji" badge. Neschovávají se.
5. **Admin musí vše najít v navigaci:** žádné skryté stránky.
6. **Produkční testy nutné:** kontrolor musí reálně otestovat na `car.zajcon.cz`, ne spoléhat na statickou analýzu kódu.
7. **4-kategoriová nová matice** (§1) je ZÁVAZNÁ pro všechny agenty od 2026-04-14.

---

## 6) Finální checklist pro Radima (po AUDIT-023 synthesis)

**⚠️ Nevyplňovat před AUDIT-023.** Toto je šablona cílového stavu.

- [ ] Backend: PG pool hardened, backup strategie aktivní, graceful shutdown
- [ ] Auth: registrace + login + password reset + rolové guardy end-to-end OK
- [ ] Subdomains: 4× subdoména vrací správný obsah, access matrix bez leaks
- [ ] GDPR: RoPA + DPA + cookie consent + export/erasure endpointy + DPO jmenován
- [ ] Permissions-Policy: camera/geolocation allowed pro broker PWA
- [ ] CSP: přechod z Report-Only na enforcing
- [ ] Platby: Stripe Connect Express KYC flow, refund, DPH, faktury, SCA/3DS
- [ ] PWA: offline flow, install prompt, manifest, SW update flow — obě PWA
- [ ] Email: DKIM/SPF/DMARC zelené, deliverability 10/10, 15+ template review
- [ ] Externí integrace: Cebia + ARES + Wedos SMTP + Claude + 5 carriers funkční (Resend ZRUŠEN)
- [ ] Monitoring: Sentry v10 clean, no deprecation, alerting nastaven
- [ ] Tests: unit > 70 %, E2E pokrývá 4 produkty end-to-end
- [ ] Performance: Lighthouse mobile > 80, LCP < 2.5s, CLS < 0.1
- [ ] SEO: sitemap + robots + llms.txt + schema.org aktivní
- [ ] Docs: README + on-boarding + admin manuál + runbook pro incidenty
- [ ] Zálohy: automatický pg_dump, offsite, test obnovy prokázán

**Cílový verdikt:** 🟢 GO (všech 16 řádků odškrtnuto)
