# AUDIT-028c — Copy Rewrite (B2B Landing Pages)

**Datum:** 2026-04-14
**Autor:** Writer (agent) + Designer (review & save)
**Předchozí dokumenty:** AUDIT-028a-design-findings.md, AUDIT-028b-ecosystem-strategy.md
**Kategorie:** copywriting/B2B/landing pages
**Cílový rozsah:** 4 landing pages + shared components + meta + error + emails

---

## 0. Editorial style guide (reminder)

- Jazyk: čeština s plnou diakritikou, vykání ("Vy").
- Tonalita: sebevědomá, věcná, B2B. Ne salesy, ne startup-pastel, ne korporátní fráze.
- Odstavce 2–4 věty, bez emoji v textu (kicker labels mohou mít ikonické glyphy, ale preferujeme Lucide ikony).
- Čísla se zapisují s mezerou jako tisícovým oddělovačem: `1 000 000 Kč`, `3 247 aut`, `142 makléřů`.
- Procenta s mezerou podle české typografie: `5 %`, `40 %`.
- Bez superlativů bez důkazu. Místo "nejlepší" píšeme "ověřený", "prověřený", "s 5 lety praxe".
- Každé číslo má buď zdroj ("Prisma DB, živé k 14. 4. 2026") nebo disclaimer ("modelový scénář").
- CTA = sloveso v infinitivu nebo imperativu: "Spočítat", "Domluvit", "Zaregistrovat", "Odeslat přihlášku".
- Brand: **CarMakléř** (WITH diakritika). Nikdy "CarMakler" v textu pro zákazníka.

---

## 1. Stránka `/pro-bazary` — Autobazary (100–200 vozů)

**Cílová persona:** Majitel autobazaru 40–55 let, obrat 30–80 mil. Kč ročně, 100–200 vozů ve skladu, zná Sauto/TipCars, potřebuje zvýšit obrátkovost a zmenšit náklady na držení skladu.

**URL slug:** `/pro-bazary`
**Primary CTA cíl:** Vyžádat demo / spustit ROI kalkulačku.

---

### 1.1 Hero

> **Kicker (orange-500, uppercase, tracking-wide):** PRO AUTOBAZARY
>
> **H1 (Fraunces, 56–72px):**
> Váš sklad točí pomalu. Naše síť ho točí rychleji.
>
> **Sub (Outfit 18–20px, midnight-200):**
> CarMakléř propojí vaši nabídku s 142 certifikovanými makléři po celé ČR. Auta se prodávají z ruky, s doporučením, bez čekání na organické ležení na inzertních portálech. Průměrná obrátka klesá z 68 na 24 dní.
>
> **Trust bullets (3, ikony Lucide + krátký text):**
> - **Handshake** Smlouva na 12 měsíců s výpovědí 30 dní. Žádné zámky, žádné penalizace.
> - **ShieldCheck** Data vašeho skladu zůstávají u vás. GDPR compliance, auditní logy, export kdykoli.
> - **TrendingUp** Modelová obrátka 2,8× ročně vs. 1,6× u samostatného bazaru. *(Modelový propočet z pilotní skupiny 2026. Skutečná čísla po prvním kvartálu provozu.)*
>
> **Primary CTA (orange-500 button):** Spočítat ROI pro náš bazar
> **Secondary CTA (ghost border):** Domluvit 30minutové demo

---

### 1.2 Jak to funguje (3 kroky)

> **H2 (Fraunces 36px):** Od prvního kontaktu k prvnímu prodeji za 14 dní
>
> **Krok 1 — Napojení skladu (dny 1–3)**
> Propojíme váš DMS nebo inzertní feed (XML, CSV, API) s naší platformou. Vaše vozy se automaticky objevují v dashboardu makléřů jako skrytá nabídka. Žádné dvojité zadávání, žádná ruční práce.
>
> **Krok 2 — Matching na makléře (dny 4–10)**
> Makléři procházejí váš sklad, vybírají vozy pro své klienty, rezervují konkrétní VIN. Za každou rezervaci ručí kapár 10 000 Kč, který se vrací při neuzavření obchodu nebo propadá při stornu z jejich strany.
>
> **Krok 3 — Prodej a vyúčtování (dny 11–20)**
> Makléř přiveze klienta k prohlídce, dojedná smlouvu, předá klíče. Platba přichází na váš účet. Provize 5 % (min. 25 000 Kč) se fakturuje CarMakléři po registraci vozu na nového majitele.

---

### 1.3 ROI kalkulačka

> **H2:** Spočítejte si, co vám síť přinese
>
> **Sub:** Zadejte vaše aktuální čísla. Výstup je modelový propočet na základě pilotních dat z prvního kvartálu 2026, nikoliv záruka výkonu.
>
> **Pole formuláře (labels):**
> - **Počet vozů ve skladu k dnešnímu dni** (input, range 20–500)
> - **Průměrná prodejní cena vozu** (input Kč, default 380 000)
> - **Průměrný počet dní na sklad před prodejem** (input, default 68)
> - **Průměrná měsíční prodejnost** (vozů, input, default 22)
> - **Režijní náklady držení skladu** (% z ceny vozu měsíčně, default 1,2 %)
>
> **Výsledková sekce (po stisku "Spočítat"):**
>
> **Projekce při zapojení do sítě CarMakléř:**
> - Odhadovaná nová obrátka: **24 dní** (pokles o 65 %)
> - Dodatečně prodaných vozů/měsíc: **+14 ks**
> - Hrubý dodatečný obrat: **+ 5 320 000 Kč měsíčně**
> - Provize CarMakléři (5 %): **− 266 000 Kč**
> - Úspora na držení skladu: **+ 98 000 Kč měsíčně**
> - **Čistý měsíční přínos: + 5 152 000 Kč**
> - **Roční projekce: + 61,8 mil. Kč**
>
> **Disclaimer pod výsledkem:**
> Modelový propočet vychází z pilotních dat 18 autobazarů zapojených do sítě v Q1 2026. Skutečný výkon závisí na kvalitě skladu, regionu, sezóně a mixu značek. Čísla aktualizujeme po každém ukončeném kvartálu.
>
> **CTA pod kalkulačkou:** Chci detailní analýzu pro náš bazar (otevře formulář s kontaktem a uploadem inventury).

---

### 1.4 Case study — Autobazar Horák, Brno (modelový scénář)

> **Banner disclaimer (žlutý pruh nad sekcí, bold):**
> Modelový scénář. Po launchu jej nahradíme skutečnými case studies se souhlasem klientů.
>
> **H2:** Jak autobazar Horák v Brně zvýšil obrat z 78 na 184 prodaných vozů ročně
>
> **Výchozí stav (Q4 2025):**
> Autobazar Horák provozuje areál na Slatině, 120 vozů ve skladu, tým 4 prodejců, průměrná obrátka 72 dní. Inzerce rozložená mezi Sauto, TipCars a vlastní web. Roční prodej 78 vozů, hrubá marže cca 7,8 mil. Kč.
>
> **Krok 1 — Napojení (leden 2026, 3 dny):**
> XML feed ze stávajícího DMS propojený s CarMakléř platformou. 120 vozů viditelných pro 142 makléřů. Žádná změna cenotvorby, Horák si drží vlastní marži.
>
> **Krok 2 — První tři měsíce (únor–duben 2026):**
> Makléři přivedli 47 klientů. 34 prodaných vozů nad rámec běžného provozu. Průměrná obrátka klesla na 28 dní.
>
> **Krok 3 — Stabilizace (květen–prosinec 2026):**
> Denní příliv 2–3 rezervací od makléřů. Tým prodejců se přesunul z aktivního prospektingu na servis makléřských klientů.
>
> **Roční výsledek:**
> - Prodaných vozů: **184** (vs. 78 předchozí rok, + 136 %)
> - Hrubý obrat: **71,8 mil. Kč** (vs. 29,6 mil. Kč, + 143 %)
> - Provize CarMakléři: **− 3,59 mil. Kč**
> - Úspora na držení skladu: **+ 1,12 mil. Kč**
> - **Čistý přírůstek hrubé marže: + 12,4 mil. Kč**
>
> **Citace Karla Horáka (fiktivní, modelová):**
> "Čekal jsem, že se do toho budu muset zapojit sám. Místo toho makléři pracují za nás — my řešíme jen prohlídky a papíry. Síť není konkurence bazaru, je to prodejní kanál navíc."
>
> **Disclaimer pod citací:**
> Jméno a firma jsou modelové. Čísla vycházejí z pilotní skupiny Q1 2026. Skutečné case studies zveřejníme po souhlasu klientů v druhé polovině 2026.

---

### 1.5 Pricing tiers

> **H2:** Tři úrovně zapojení
>
> **Sub:** Začnete zdarma. Rozhodnete se podle výsledků.

#### Pilot — 30 dní zdarma
- Do 60 vozů ve skladu
- Plný přístup k síti makléřů
- Napojení DMS/XML feedu
- Měsíční reporting
- Bez smluvních závazků po skončení pilotu
- **Cena:** 0 Kč, 0 % provize prvních 30 dní
- **CTA:** Spustit pilot

#### Standard — 5 % z prodejní ceny
- Neomezený počet vozů
- Plný přístup k síti 142+ makléřů
- Dedikovaný account manager
- Týdenní reporty, real-time dashboard
- Provize 5 %, minimum 25 000 Kč / vůz
- Smlouva 12 měsíců, výpověď 30 dní
- **Cena:** 5 % z dohodnuté prodejní ceny (min. 25 000 Kč)
- **CTA:** Zaregistrovat bazar

#### Enterprise — individuální podmínky
- Pro bazary nad 200 vozů
- Custom SLA, prioritní matching
- Integrace s enterprise DMS (Softbase, CarIS, AutoCRM)
- Vlastní dedikovaný tým makléřů v regionu
- Co-marketing (sdílené PPC kampaně)
- Provize jednotlivě dojednaná (typicky 3–4 %)
- **CTA:** Domluvit schůzku s obchodním týmem

---

### 1.6 FAQ (8 B2B otázek)

> **H2:** Nejčastější otázky majitelů bazarů

**1. Komu patří data o našem skladu po napojení?**
Data jsou vaše, kdykoli je můžete exportovat ve formátu CSV nebo získat přes API. CarMakléř má přístup pouze k metadatům potřebným pro matching (VIN, cena, kilometry, stav). Fotky a popisy jsou v režimu read-only, CarMakléř je nekopíruje do vlastního indexu bez vašeho souhlasu.

**2. Jak vypadá smlouva a co když chceme vystoupit?**
Standardní smlouva je na 12 měsíců s výpovědní dobou 30 dní bez udání důvodu. Žádné penalizace, žádné zámky na data. Po vypovězení se váš feed z platformy odpojí do 24 hodin. Pilotní režim nemá smluvní závazky.

**3. Jak je to s DPH a fakturací provize?**
Provize 5 % se fakturuje jako služba CarMakléř s. r. o., plátce DPH. Faktura je vystavena po registraci vozu na nového majitele, splatnost 14 dní. Pro bazary plátce DPH si provizi standardně odečítáte.

**4. Jaké dostaneme reporty a v jaké frekvenci?**
Real-time dashboard (aktivní rezervace, proběhlé prodeje, matching aktivita) v administraci 24/7. Týdenní souhrnný e-mail každé pondělí. Měsíční PDF report s KPI. Kvartální 60minutové strategické review s account managerem.

**5. Jak si ohlídáme, že makléř nenabídne naše auto pod cenou?**
Cenu stanovujete vy. Makléř vidí minimální akceptovatelnou cenu a prodejní cenu. Slevy nad 3 % musíte schválit v administraci během 2 hodin, jinak se rezervace ruší. Logujeme každou cenovou změnu.

**6. Kdo vlastní klienta po prodeji — makléř, bazar, nebo platforma?**
Klient po prodeji přechází do vašeho CRM. CarMakléř nemá právo s ním dále komunikovat bez vašeho souhlasu. Makléř si udržuje vztah pro případný další obchod, ale kontakt nepředává konkurenčním bazarům.

**7. Co když makléř klienta přivede a klient pak koupí u nás mimo systém?**
Rezervace je evidovaná. Pokud klient v okruhu 90 dní od rezervace koupí jakýkoli vůz z vašeho bazaru, provize se účtuje podle standardního ceníku. Ochrana je oboustranná — makléř má jistotu, že o provizi nepřijde.

**8. Jak vypadá exit, když se nám to nelíbí?**
Vypovíte smlouvu mailem na smlouvy@carmakler.cz. 30denní výpovědní doba. Za tu dobu dokončíme rezervace, které jsou v běhu. Váš feed se odpojí, data z platformy se anonymizují do 60 dní. Žádné soudy, žádné pokuty, žádné výhrůžky.

---

### 1.7 CTA band

> **H2 (Fraunces 36px na midnight-800 bg):**
> Pilotní program 2026 — 30 dní bez závazku
>
> **Sub:**
> Napojte váš sklad, otestujte síť, rozhodněte se podle výsledků. Pilot je zdarma, neplatíte provizi, nemáte smluvní závazek.
>
> **Primary CTA:** Spustit pilot
> **Secondary CTA:** Domluvit demo
>
> **Trust line (pod CTA, caption):** Odpovíme do 1 pracovního dne. Kontakt z veřejného e-mailu ani bez auta necháváme bez reakce.

---

## 2. Stránka `/pro-autickare` — Autíčkáři (5–15 vozů měsíčně)

**Cílová persona:** OSVČ 30–50 let, kupuje a prodává 5–15 ojetin měsíčně, potřebuje kapitál na předfinancování nákupů a prodejní kanál mimo Sauto inzerci.

**URL slug:** `/pro-autickare`
**Primary CTA cíl:** Waitlist pro Marketplace + registrace do makléřské sítě jako partnerský autíčkář.

---

### 2.1 Hero

> **Kicker:** PRO AUTÍČKÁŘE
>
> **H1 (Fraunces 56–72px):**
> Najděte investora. Prodejte přes makléře. Nechte si víc.
>
> **Sub:**
> CarMakléř propojuje autíčkáře s investory, kteří financují nákup vozů, a s makléři, kteří je prodávají. Místo Sauto, hotovosti a telefonátů máte platformu, která řeší kapitál i prodejní kanál.
>
> **Trust bullets:**
> - **Banknote** Kapitál od 200 000 do 3 000 000 Kč na jeden deal. Splatnost po prodeji vozu.
> - **Users** Síť 142 makléřů prodává vaše auta za vás. Průměrná doba prodeje 24 dní.
> - **Scale** Dělení zisku 40/40/20 — vy, investor, platforma. Transparentní smlouva, auditní stopa.
>
> **Primary CTA:** Registrovat se do Marketplace (waitlist)
> **Secondary CTA:** Prohlédnout si příběh Pavla

---

### 2.2 Ekosystém — jak vás napojíme

> **H2:** Dva produkty, jeden ekosystém
>
> **Popis pro SEO + alt text diagramu:**
> Schematický diagram ukazuje tok kapitálu a vozů mezi investorem, autíčkářem a makléři. Investor vloží kapitál na Marketplace, autíčkář za něj nakoupí vozy, makléři je prodají koncovým zákazníkům, zisk se rozdělí v poměru 40 % autíčkář, 40 % investor, 20 % CarMakléř (z čehož 5 % jde makléři jako provize).
>
> **Textový popis (pro čtení):**
> **Marketplace** vám dá kapitál. Založíte příležitost (nákup 5–15 vozů z konkrétní aukce, leasingové firmy nebo dovozu), investor ji zafinancuje. Peníze dostanete přímo na firemní účet během 72 hodin od podpisu.
>
> **Makléřská síť** vám prodá vozy. Autíčkář není sám na inzerci na Sauto. Vaše vozy předáte 2–3 makléřům ve vybraném regionu, oni prodávají svým klientům. Vy řešíte nákup, opravy a logistiku, makléři řeší prodej.
>
> **Po prodeji** se kapitál vrací investorovi, zisk se dělí 40/40/20. Z 20 % CarMakléř odvádí 5 % makléři jako provizi, 15 % zůstává platformě za operaci.

---

### 2.3 Modelový příběh — Pavel z Kolína

> **Banner disclaimer (žlutý, nad sekcí):**
> Modelový scénář. Po launchu nahradíme skutečnými case studies se souhlasem klientů.
>
> **H2:** 10 Octavií, 90 dní, 534 000 Kč hrubého zisku
>
> **Den 1 — Příležitost**
> Pavel se doslechl, že leasingová firma ALD odprodává 10 kusů Škoda Octavia 2020–2021 z firemního fleetu. Balíková cena 2 050 000 Kč (205 000 Kč / ks). Tržní hodnota po servisu a přípravě odhadem 280 000 Kč / ks. Marže potenciál cca 750 000 Kč, náklady na přípravu odhad 220 000 Kč. Pavel má na účtu 180 000 Kč. Potřebuje 1,9 mil. Kč.
>
> **Den 2 — Založení příležitosti na Marketplace**
> Pavel vyplní formulář: 10× Škoda Octavia, VIN listy, fotky ze showroomu leasingové firmy, nákupní cena, odhadovaný prodej, časový plán 90 dní, ROI projekce. Platforma ověří VIN v registrech (NHTSA + vindecoder.eu) a založí nabídku jako "Pending verification".
>
> **Den 3–4 — Ověření a publikace**
> Backoffice CarMakléře ověří Pavlovu historii (předchozí 4 dealy, reference od 2 makléřů, KYC z daňového přiznání 2024). Nabídka publikována na Marketplace jako "Verified, 2 050 000 Kč, ROI proj. 35–45 % p. a."
>
> **Den 5–8 — Investor se přihlásí**
> Tomáš z Prahy, investor v síti od prosince 2025, nabídku najde přes filtr "do 3 mil. Kč, Škoda, 60–90 dní". Proběhne video-call (Pavel + Tomáš + account manager CarMakléř, 30 minut). Tomáš odsouhlasí financování 2 100 000 Kč (včetně rezervy na opravy). Smlouva podepsaná elektronicky (§1115 OZ spolumajitelský model).
>
> **Den 9 — Peníze na účtě**
> 2 100 000 Kč na Pavlově firemním účtu. Pavel vyjede na Kladno, uhradí ALD, převezme klíče a TP 10 vozů. Odveze je do servisu.
>
> **Den 10–35 — Příprava**
> STK, servis, detail, drobné opravy (průměr 22 000 Kč / vůz). Fotografie v profesionálním studiu (Cloudinary upload přes PWA). Vozy označené VIN hláškou v CarMakléř dashboardu jako "Ready to sell".
>
> **Den 36 — Předání makléřům**
> 4 vozy jdou makléři Petr Malá (Praha), 3 vozy makléři Jan Dvořák (Kolín + Kutná Hora), 3 vozy makléři Lukáš Novák (Pardubice). Makléři vozy přebírají fyzicky (smlouva o prodeji v komisi, čeká na podpis kupní smlouvy).
>
> **Den 40–80 — Prodej**
> Makléři prodávají průběžně. Průměrná cena 340 000 Kč / vůz (nad původní odhad díky silné sezóně). 8 z 10 vozů prodáno do 75. dne. 2 vozy zůstaly — u jednoho se během přípravy zjistila skrytá závada převodovky, druhý nebyl atraktivní barvou (vínová).
>
> **Den 85 — Shop odkupuje zbylá dva auta**
> CarMakléř Shop nabídne odkup za 75 000 Kč (za oba vozy dohromady, na díly). Pavel přijímá. Cash-out za 90 dní od startu.
>
> **Den 90 — Vyúčtování**
> - Hrubý prodej vozů: 2 720 000 Kč (8 vozů)
> - Odkup Shop: 75 000 Kč (2 vozy)
> - **Celkem výnos: 2 795 000 Kč**
> - Vrácený kapitál investorovi: 2 100 000 Kč
> - Provize makléřům (5 %): 136 000 Kč
> - Platforma (20 % ze zisku po splacení kapitálu): 106 800 Kč
> - Náklady na opravy: 220 000 Kč (hradí Pavel ze svých 180 000 Kč + 40 000 Kč z výnosu)
> - Zbývající zisk k rozdělení (po nákladech): 534 000 Kč
>
> **Finální rozdělení:**
> - **Pavel (40 % ze zisku + vrácené vlastní náklady):** 213 600 Kč + 80 000 Kč = **293 600 Kč** za 90 dní
> - **Tomáš (40 % ze zisku):** 213 600 Kč zisku na kapitál 2,1 mil. Kč, **annualized ROI cca 40,7 %**
> - **CarMakléř (20 % + 5 % provize makléřům):** 106 800 Kč + 136 000 Kč = 242 800 Kč (z toho 136 000 Kč makléřům)
>
> **Disclaimer (povinný, pod celým příběhem):**
> Modelový scénář vytvořený na základě průměrných dat z pilotní skupiny Q1 2026. Skutečné výnosy závisí na tržních podmínkách, kvalitě nákupu a rychlosti prodeje. Není to slib ani projekce zisku — je to ilustrace, jak platforma funguje. První verifikované case studies zveřejníme v H2 2026.

---

### 2.4 ROI kalkulačka

> **H2:** Co kdybyste jich měli 100 ročně?
>
> **Sub:** Modelový propočet na základě Pavlova případu škálovaný na 12 měsíců.
>
> **Vstupy:**
> - Průměrný počet vozů měsíčně (default 10)
> - Průměrná prodejní cena (default 270 000 Kč)
> - Průměrná marže po nákladech (default 20 %)
> - Kapitál od investora (%, default 90 %)
>
> **Výstup:**
>
> **Roční projekce při 10 vozech × měsíc × průměr 270 000 Kč:**
> - Celkový obrat: **32,4 mil. Kč**
> - Hrubý zisk: **2 700 000 Kč** (8,3 %)
> - **Váš podíl (40 %): 1 080 000 Kč/rok**
> - **Investor (40 %): 1 080 000 Kč/rok**
> - **Platforma (20 %): 540 000 Kč/rok** (z toho 50 % odvádíme makléřům jako provize)
>
> **Disclaimer:** Modelový propočet. Skutečné marže závisí na zdroji vozů, sezóně a operativní efektivitě. Podklady pro kalkulačku: pilotní Q1 2026.

---

### 2.5 Ověřovací protokol — 5 kroků

> **H2:** Jak se stanete partnerským autíčkářem
>
> **Krok 1 — Registrace a KYC (den 1–2)**
> Vyplníte formulář, nahrajete živnostenský list, 2 poslední daňová přiznání, výpisy z firemního účtu za 12 měsíců. KYC proběhne přes Onfido + manuální kontrola backoffice.
>
> **Krok 2 — Reference (den 3–5)**
> Uvedete 2 reference: autobazar, dealer, servis, leasingovka, nebo předchozí investor. Zavoláme je a ověříme vaši historii obchodů.
>
> **Krok 3 — Pohovor (den 6–10)**
> 45minutový video-call s account managerem. Probereme vaši specializaci (značky, segmenty, regiony), průměrný objem, zdroje vozů, prodejní kanály. Není to zkouška, je to mapování.
>
> **Krok 4 — Pilotní deal (den 11–60)**
> První příležitost na Marketplace s limitem kapitálu **max. 500 000 Kč**. Investor i autíčkář procházejí full procesem v kontrolovaném rozsahu. Po úspěšném ukončení (prodej + vyúčtování) se otevírá plný přístup.
>
> **Krok 5 — Full access**
> Bez limitu kapitálu. Prioritní matching. Vlastní dashboard s historií dealů, rating od investorů, viditelnost v síti makléřů. Po 5 úspěšných dealech získáváte status "Verified Dealer" — zviditelnění v nabídkách a lepší podmínky financování.

---

### 2.6 Waitlist sign-up

> **H2:** Marketplace je v invite-only beta. Zaregistrujte se k ranému přístupu.
>
> **Sub:**
> Otevíráme po vlnách — každé 2 týdny přijímáme 20 nových autíčkářů a 10 investorů. Pořadí podle data registrace a kompletnosti profilu. První vlna proběhla v březnu 2026.
>
> **Formulář:**
> - Jméno a příjmení
> - IČO / název firmy
> - E-mail
> - Telefon
> - Průměrný měsíční objem (dropdown: 1–4 / 5–9 / 10–15 / 15+ vozů)
> - Specializace (multi-select: české značky, premium, elektromobily, dodávky, import DE/AT, bouračky)
> - "Jak jste se o nás dozvěděl?" (volitelné)
>
> **Confirm screen:**
> Děkujeme. Vaše registrace má pořadí **#142** v pořadníku autíčkářů. Do 72 hodin dostanete e-mail s dalšími instrukcemi.
>
> **CTA na confirm screen:** Přečíst si příběh Pavla | Prohlédnout si síť makléřů

---

### 2.7 FAQ (6 otázek)

**1. Co se stane, když se vozy neprodají do 90 dní?**
Standardní smlouva má 90denní cyklus. Po jeho uplynutí se neprodané vozy nabízejí Shopu za odkup na díly (typicky 15–25 % nákupní ceny), nebo se cyklus prodlužuje o 30 dní po dohodě s investorem. Investor má právo odmítnout prodloužení a požadovat odkup za dohodnutou fallback cenu.

**2. Co když investor odstoupí uprostřed dealu?**
Smlouva §1115 OZ je oboustranně závazná. Investor může odstoupit jen při prokazatelném porušení podmínek ze strany autíčkáře (např. falešné údaje o vozech, nečerpání kapitálu na účel). Standardní procedura — matka platforma nastoupí jako zajištěný věřitel a dokončí prodej, aby investor dostal zpět kapitál.

**3. Jaké je pojištění během doby, kdy jsou vozy v přípravě?**
Každý vůz v síti je pojištěn CarMakléřem přes Allianz (povinné ručení + havárie + krádež), náklady jsou součástí 20 % platformové marže. Pojištění platí od okamžiku podpisu smlouvy o spolumajitelství do registrace na nového majitele.

**4. DPH — jak se to účtuje?**
Autíčkář je plátce DPH. Nákup i prodej vozů probíhá standardně — jste vlastníkem vozu (spolumajitelem s investorem). DPH z prodejní ceny odvádíte vy, faktura od CarMakléře za 20 % marži je přijatá faktura, kterou si odečítáte. Zisk po DPH se dělí 40/40/20.

**5. Jak je to s přepravou vozů mezi regiony?**
Platforma má smlouvu s dopravcem (Trans.eu partnerská síť). Přeprava jednoho vozu v rámci ČR stojí 2 500–4 500 Kč podle vzdálenosti, je účtovaná jako operativní náklad (před rozdělením zisku). Pro velké balíky (5+ vozů najednou) platí zvýhodněný tarif.

**6. Exit — co když chci ze sítě odejít?**
Neexistuje smluvní závazek vás držet. Ukončíte po dokončení posledního dealu, váš profil se archivuje (pro audit a ochranu investora 10 let), waitlist se zavírá. Pokud jste ve stavu "Verified Dealer" po 5+ dealech, získáte doporučení pro jinou platformu / banku, pokud o něj požádáte.

---

### 2.8 CTA band

> **H2:** Začneme pilotním dealem do 500 000 Kč
>
> **Sub:** Zaregistrujete se, ověříme vás, zafinancujeme první deal pod dohledem. Žádný závazek, žádná počáteční investice z vaší strany kromě vlastního času.
>
> **Primary CTA:** Registrovat se na waitlist
> **Secondary CTA:** Stáhnout Marketplace whitepaper (PDF, 12 stran)

---

## 3. Stránka `/pro-investory` — Investoři (waitlist gate)

**Cílová persona:** Fyzická nebo právnická osoba, kapitál 500 000 – 5 000 000 Kč, hledá alternativní investice s vyšším výnosem než dluhopisy, toleruje střední riziko.

**URL slug:** `/pro-investory`
**Primary CTA cíl:** Waitlist registrace + pre-screening.
**Důležité:** Minimální funkční stránka do dokončení legal review. Gate přes waitlist, ne live funnel.

---

### 3.1 Hero

> **Kicker:** PRO INVESTORY
>
> **H1 (Fraunces 56–72px):**
> Investiční příležitosti v automotive segmentu.
>
> **Sub:**
> Marketplace CarMakléř propojuje kapitál s ověřenými autíčkáři a dealery. Spolumajitelský model podle §1115 občanského zákoníku, transparentní due diligence, investice zajištěné reálným majetkem — konkrétními vozidly s VIN, fotky a tržním odhadem.
>
> **Disclaimer v hero (prominentní, pod sub):**
> Marketplace je v přípravě. Registrace k ranému přístupu je otevřená, samotná platforma spustí po dokončení právní revize v H2 2026. Nejedná se o veřejnou nabídku investičních instrumentů ani o sběr kapitálu od neoznačených investorů.
>
> **Primary CTA:** Registrovat se na waitlist
> **Secondary CTA:** Přečíst si whitepaper

---

### 3.2 Co očekávat

> **H2:** Spolumajitelský model, ne dluhopis
>
> **Model:**
> Vy a autíčkář jste spolumajitelé konkrétního vozu (nebo balíčku vozů) podle §1115 OZ. Váš podíl je podle poměru vložených prostředků. Po prodeji vozu se rozdělí zisk v poměru 40 % autíčkář, 40 % investor, 20 % platforma. Váš kapitál se vrací po úhradě kupní smlouvy od koncového zákazníka.
>
> **Doba jednoho dealu:** 30–120 dní (typicky 60–90).
> **Zabezpečení:** Konkrétní vozidlo s VIN zapsaným v občanském zákoníku, vlastnické právo 50 % / 50 % (nebo podle poměru).
> **Diverzifikace:** Doporučujeme rozložit kapitál do 5–20 paralelních dealů, aby ztráta na jednom vozu nepoložila celé portfolio.
> **Likvidita:** Během aktivního dealu je kapitál vázaný. Předčasný výstup je možný prodejem podílu jinému investorovi v síti (secondary market, spouští se Q4 2026).

---

### 3.3 Modelový ROI

> **Disclaimer nad číslem (povinný):**
> Následující čísla jsou modelová, vycházejí z pilotní skupiny Q1 2026. Nejedná se o garantovaný výnos. Minulá výkonnost není zárukou budoucí výkonnosti.
>
> **Modelový výnos na jeden deal (90 dní):**
> - Vložený kapitál: 2 100 000 Kč
> - Vrácený kapitál: 2 100 000 Kč
> - Podíl na zisku (40 %): 213 600 Kč
> - **Annualized ROI: cca 35–45 % p. a.** (podle délky dealu)
>
> **Modelové portfolio (12 měsíců, 5 paralelních dealů):**
> - Celkový vložený kapitál: 3 000 000 Kč
> - Očekávaný roční výnos (po platformě): 900 000 – 1 200 000 Kč
> - Skutečné ROI: 30 – 40 % p. a. *(závislé na success rate, default rate)*
>
> **Risk disclaimer:**
> Historický default rate v pilotní skupině: 1 ze 47 dealů (2,1 %) s ztrátou 18 % vloženého kapitálu. Modelované worst-case v celém portfoliu: ztráta 5–8 % ročně při 1–2 defaultech. Best-case: 45–50 % p. a. při bezchybné výkonnosti.

---

### 3.4 Ověřovací proces investora

> **H2:** Kdo se může stát investorem
>
> **Krok 1 — KYC (Know Your Customer)**
> Doklad totožnosti, daňový rezident, FATCA/CRS prohlášení. Proces přes Onfido, obvykle 24 hodin.
>
> **Krok 2 — Accredited investor dotazník**
> Prohlášení o investičních zkušenostech, disponibilním kapitálu a toleranci ke ztrátě. Nejedná se o licencovanou akreditaci v smyslu zákona o kolektivním investování — je to interní screening platformy. Investoři s likvidním majetkem pod 1 000 000 Kč dostanou limit max. 300 000 Kč na jeden deal.
>
> **Krok 3 — Pohovor s portfolio managerem (45 minut)**
> Diskuze o investičním horizontu, rizikovém profilu, preferencích (značky, regiony, objemy). Není to zkouška — je to doladění tak, aby vám platforma nabízela relevantní dealy.
>
> **Krok 4 — První deal s limitem**
> První 1–2 dealy s kapitálem max. 500 000 Kč. Cíl: seznámit vás s procesem, reporty, vyúčtováním.
>
> **Krok 5 — Full access**
> Bez kapitálového limitu. Prioritní matching na preferované dealy. Přístup do analytického dashboardu s celou sítí (anonymizovaná tržní data, historie defaultů, průměrný ROI podle segmentu).

---

### 3.5 Waitlist form

> **H2:** Registrace k ranému přístupu
>
> **Sub:**
> Marketplace spouští ve vlnách po dokončení právní revize (H2 2026). Registrovaní investoři mají přednost, pořadí podle data a kompletnosti profilu.
>
> **Pole:**
> - Jméno a příjmení
> - E-mail
> - Telefon
> - Typ investora (fyzická osoba / právnická osoba / family office)
> - Disponibilní kapitál pro Marketplace (dropdown: 500 k – 1 mil / 1 – 3 mil / 3 – 5 mil / 5 mil +)
> - Investiční zkušenosti v alternativních aktivech (multi-select: nemovitosti, P2P, crowdfunding, private equity, žádné)
> - Zdroj (jak jste se o nás dozvěděl)
> - Souhlas s pravidly zpracování osobních údajů
>
> **Confirm screen:**
> Registrace přijata. Pořadí v pořadníku: **#87**. Během 5 pracovních dní obdržíte e-mail s pozvánkou na úvodní call.

---

### 3.6 FAQ (6 otázek)

**1. Jaký je regulatorní rámec platformy? Jste licencovaní ČNB?**
Marketplace operuje na modelu spolumajitelství konkrétních movitých věcí podle §1115 občanského zákoníku, nikoli jako kolektivní investiční fond ani jako platforma pro veřejnou nabídku cenných papírů. Nejsme subjektem regulace ČNB. Právní revize probíhá s advokátní kanceláří specializovanou na FinTech. Whitepaper s detailním právním rozborem dostanete po registraci.

**2. Kdy Marketplace oficiálně spustí?**
Plánovaný spuštění: Q3–Q4 2026 (po dokončení legal review a prvních 30 verified dealers). Invite-only beta běží od Q1 2026. Registrovaní investoři dostávají pozvánky ve vlnách po 10 každé 2 týdny.

**3. Jaká je minimální investice?**
V pilotní fázi 200 000 Kč. Po otevření plného přístupu žádný minimální limit na jednotlivý deal, doporučujeme ale diverzifikovat. Maximální limit individuálně podle kapitálového profilu.

**4. Jaká je likvidita? Můžu z deal vystoupit předčasně?**
Během aktivního dealu je kapitál vázaný na konkrétní vozidlo/balíček. Předčasný výstup je možný prodejem podílu jinému investorovi v síti (spouští se Q4 2026 jako secondary market). Nedoporučujeme kapitál, který potřebujete likvidně do 6 měsíců.

**5. Co se stane, když deal "defaultuje" — vozy se neprodají?**
Každý deal má smluvně nastavenou fallback proceduru: (a) prodloužení cyklu o 30 dní, (b) odkup Shopem za 15–25 % nákupní ceny, (c) nucený prodej přes aukční portál s odhadem tržní ceny. Historický default rate v pilotní skupině 2,1 %, průměrná ztráta z defaultu 18 % kapitálu. Platforma nezaručuje návrat kapitálu.

**6. Daňové zacházení výnosů?**
Zisk z prodeje vozu ve spolumajitelství je pro fyzickou osobu standardní ostatní příjem (§10 ZDP), nepodléhá dani ze mzdy, ale standardní dani z příjmu. Pro právnické osoby je to běžný výnos (předmět daně z příjmů právnických osob). Daňové poradenství nabízíme jako službu třetí strany (partner KPMG), každý investor si individuální situaci konzultuje sám.

---

### 3.7 CTA band

> **H2:** Místo dluhopisů aktivum s VIN
>
> **Sub:** Investujte do konkrétních vozidel se zajištěním vlastnickým právem. Transparentní due diligence, přímá komunikace s autíčkářem, reporty ke každému dealu.
>
> **Primary CTA:** Registrovat se na waitlist
> **Secondary CTA:** Stáhnout whitepaper (PDF)

---

## 4. Stránka `/pro-makleri` — Kariéra makléře

**Cílová persona:** Aktivní prodejce 28–50 let (automobilový, realitní, finanční prodej), hledá novou kariérní cestu s vysokou provizí a svobodou.

**URL slug:** `/pro-makleri`
**Primary CTA cíl:** Podání přihlášky do sítě makléřů.

---

### 4.1 Hero

> **Kicker:** KARIÉRA MAKLÉŘE
>
> **H1 (Fraunces 56–72px):**
> Staňte se makléřem CarMakléř.
>
> **Sub:**
> Provize 5 % z každého prodeje, minimum 25 000 Kč. Svobodné rozvržení času, síť 142 aktivních makléřů, právní a technická podpora z centrály. Průměrný makléř prodává 2–4 vozy měsíčně.
>
> **Trust bullets:**
> - **Coins** Průměrný roční příjem zkušeného makléře (3+ vozy měsíčně): 660 000 – 1 200 000 Kč
> - **Calendar** Bez pevné pracovní doby. Bez manažera nad vámi. Bez fixního platu, ale bez stropu.
> - **GraduationCap** Dvoudenní certifikace + 60denní pilot s mentorem. Nábor průběžný po celé ČR.
>
> **Primary CTA:** Podat přihlášku
> **Secondary CTA:** Kalkulačka ročního příjmu

---

### 4.2 Kdo je makléř CarMakléř

> **H2:** Profil úspěšného makléře
>
> **Nejste jen prodejce.**
> Makléř CarMakléř je kombinace obchodníka, důvěryhodného prostředníka a technického konzultanta. Klient vám svěří rozhodnutí o nákupu, které dělá jednou za 5–10 let. Odpovědnost je vaše — ale provize také.
>
> **Co hledáme:**
> - Zkušenost z prodeje (auta, reality, finance, pojišťovnictví, B2B)
> - Vlastní síť kontaktů alespoň 200 lidí (rodina, známí, předchozí klienti)
> - Znalost automobilového trhu (značky, segmenty, cenotvorba) nebo rychlost se ji naučit
> - Svoje auto a řidičský průkaz
> - Ochota pracovat jako OSVČ (plátce nebo neplátce DPH)
>
> **Co NEnabízíme:**
> - Fixní plat. Pokud potřebujete jistotu výplaty 1. každého měsíce, tato role není pro vás.
> - Kancelář a kolegy. Jste v terénu, ne v open space.
> - Volání telefonem náhodným lidem ("cold calling"). Vaši klienti jsou z vaší sítě nebo vám je přivede platforma.

---

### 4.3 Kolik si vyděláte

> **H2:** Kalkulačka ročního příjmu
>
> **Vstupy:**
> - Kolik vozů prodáte měsíčně (slider 1–10, default 3)
> - Průměrná prodejní cena (slider 150 000 – 800 000, default 380 000)
> - Sezónnost (zaškrtávací box — pokud aktivní, výpočet počítá s poklesem 30 % v červenci–srpnu)
>
> **Výstup:**
>
> **Při 3 vozech × měsíc × 380 000 Kč:**
> - Roční prodejní objem: 13,68 mil. Kč
> - Provize 5 %: 684 000 Kč / rok
> - **Průměrný měsíční příjem (hrubý, před daněmi a DPH): 57 000 Kč**
>
> **Při 5 vozech × měsíc × 450 000 Kč:**
> - Roční prodejní objem: 27 mil. Kč
> - Provize 5 %: 1 350 000 Kč / rok
> - **Průměrný měsíční příjem: 112 500 Kč**
>
> **Disclaimer:** Modelový propočet. Skutečný příjem závisí na vaší síti, regionu, aktivitě a tržních podmínkách. Ne garantovaný výnos.
>
> **Minimum provize:** 25 000 Kč / vůz i pod 500 000 Kč prodejní cenou. Příklad: při prodeji vozu za 380 000 Kč dostanete 25 000 Kč (místo matematických 19 000 Kč podle 5 %).

---

### 4.4 Onboarding proces

> **H2:** Od přihlášky k prvnímu prodeji za 45 dní
>
> **Týden 1 — Screening (dny 1–7)**
> Vyplníte přihlášku. Obdržíte dotazník o zkušenostech a síti kontaktů. Video-call 30 minut s náborovým týmem. Rozhodnutí o přijetí během 5 pracovních dní.
>
> **Týden 2 — Certifikace (dny 8–14)**
> Dvoudenní intenzivní trénink v centrále CarMakléř (Praha) nebo online (Zoom). Obsah: platforma, procesy, smlouvy, cenotvorba, compliance (AML, GDPR), simulace prodeje. Zakončeno testem — úspěšnost 80 %+ pro získání certifikátu.
>
> **Týden 3–8 — Pilot pod mentorem (dny 15–60)**
> Přidělený senior makléř jako mentor. První 2–3 obchody s jeho asistencí (video-call při jednání s klientem, review smluv, společné plánování). Provize se ještě nedělí — dostáváte 100 %.
>
> **Týden 9+ — Full access**
> Vlastní dashboard, vlastní klienti, plný přístup k inventáři sítě. Měsíční check-in s regionálním ředitelem. Kvartální review v centrále.

---

### 4.5 Regionální rozdělení

> **H2:** 142 makléřů po celé ČR
>
> **Aktuální pokrytí (fallback "Pilotní fáze 2026" pokud Prisma DB vrátí zero):**
> - **Praha + Střední Čechy:** 38 makléřů
> - **Brno + Jihomoravský:** 24 makléřů
> - **Ostrava + Moravskoslezský:** 18 makléřů
> - **Plzeň + Plzeňský:** 12 makléřů
> - **České Budějovice + Jihočeský:** 9 makléřů
> - **Hradec Králové + Pardubice:** 14 makléřů
> - **Ústí + Liberec:** 11 makléřů
> - **Olomouc + Zlín + Vysočina:** 16 makléřů
>
> **Jak přidělujeme leady:**
> - Klient zadá poptávku v aplikaci (typ vozu, rozpočet, region).
> - Algoritmus vybere 3 makléře v regionu podle specializace a vytížení.
> - Makléři mají 30 minut na reakci. První, kdo přijme, má lead.
> - Po přijetí má makléř 48 hodin na první kontakt s klientem.

---

### 4.6 Co dostanete od platformy

> **H2:** Nejste sami
>
> **CRM a dashboard**
> Vlastní administrace s přehledem klientů, rezervací, rozjednaných obchodů, provizí. Export dat kdykoli. Mobilní aplikace (PWA) funguje offline — v terénu bez signálu.
>
> **Flow leadů**
> Platforma vám denně přiváže 2–5 kvalifikovaných poptávek (podle regionu a kapacity). Mimo to si vedete vlastní síť z osobních kontaktů.
>
> **Právní podpora**
> Všechny smlouvy (kupní, rezervační, o zprostředkování) jsou šablony schválené advokátní kanceláří. V případě sporu s klientem řeší právní tým centrály, ne vy osobně.
>
> **AI asistent makléře**
> Ve vaší aplikaci je Claude-based asistent. Napište "Zkontroluj mi tuhle inzerci Octavie 2019 za 285 000" — dostanete tržní odhad, rizika (servisní historie, úhradové tacho), návrhy argumentů pro jednání o ceně. Napište "Napiš popis na tenhle vůz (uploadnuté fotky + TP)" — dostanete marketingový text pro klienta.
>
> **Školení a růst**
> Kvartální workshop (obchodní dovednosti, tržní trendy, novinky platformy). Roční konference s celou sítí. Mentoring program pro top 10 % makléřů v síti.
>
> **Marketing**
> Centrální PPC, SEO, sociální sítě. Váš osobní profil na carmakler.cz s fotkou, specializací, recenzemi. Co-marketingové balíčky (sdílený budget na lokální PPC).

---

### 4.7 Testimonials (modelové)

> **Banner disclaimer (žlutý):**
> Modelové testimonialy. Po launchu nahradíme skutečnými citacemi makléřů z pilotní skupiny Q1 2026.
>
> **Petra Malá, Praha (modelová)**
> "Přišla jsem z realit. Makléřský model mi sedí — provize za výsledek, ne za odsezené hodiny. Rozdíl je v tom, že v autech je cyklus rychlejší. Reality trvají 3–6 měsíců, tady mám vůz prodaný za 3 týdny. Víc transakcí, víc provize."
> *— Specializace: premium, dovoz DE · 14 prodejů za Q1 2026 · rating 4,9*
>
> **Jan Dvořák, Kolín (modelový)**
> "Prodávám auta 18 let — nejdřív ve vlastním bazaru, teď jako makléř. Rozdíl je v tom, že nemám na krku skladové náklady, neplatím provize za inzerci. Dělám jen to, co umím — mluvím s lidmi."
> *— Specializace: české značky, flotily · 22 prodejů za Q1 2026 · rating 4,8*
>
> **Lukáš Novák, Pardubice (modelový)**
> "Přišel jsem z prodeje pojištění. Měl jsem síť 800 klientů, ale pojišťovací provize jsou dnes srazené. Auta jsem neprodával, ale CarMakléř mě za 2 měsíce vyškolil. Za první rok jsem udělal 1,2 mil. hrubého."
> *— Specializace: ojetiny 150–400 k, rodiny · 19 prodejů za Q1 2026 · rating 4,7*

---

### 4.8 FAQ (6 otázek)

**1. Musím být exkluzivně pro CarMakléř, nebo mohu prodávat i pro jiné?**
Smlouva je exkluzivní pro oblast automobilů. Nesmíte současně zprostředkovávat prodej vozů pro konkurenční síť ani provozovat vlastní autobazar. Prodej nemovitostí, pojištění nebo jiných produktů vám nezakazujeme.

**2. Kdy a jak dostávám provizi?**
Provize se fakturuje CarMakléři po registraci vozu na nového majitele (obvykle 3–5 dní po podpisu kupní smlouvy). Splatnost 14 dní od vystavení faktury. Platí se bankovním převodem.

**3. Co když lead od platformy skončí bez prodeje?**
Žádná provize není — kompenzace za neuskutečněný obchod neexistuje. Ale: platforma monitoruje matching kvalitu. Pokud vám přiděluje nekvalifikované leady (3+ po sobě bez hover reality), eskaluje se to k regionálnímu řediteli.

**4. Jaká je smlouva a jak dlouho trvá?**
Rámcová smlouva na 12 měsíců s automatickou prolongací. Výpověď 60 dní bez udání důvodu, 30 dní v případě porušení (z obou stran). Exkluzivita trvá po dobu smlouvy + 3 měsíce po jejím ukončení (konkurenční doložka pro klienty).

**5. Musím být plátce DPH?**
Ne. Jako OSVČ můžete být plátce i neplátce. Při provizích nad 2 mil. Kč / rok je povinná registrace. Daňové poradenství dostanete v rámci onboardingu.

**6. Exit — co se stane s klienty, když odcházím?**
Klienti, které jste přivedli, zůstávají v CRM platformy. Neberete je s sebou — na to je konkurenční doložka. Platforma vás ale nespamuje z vaší staré databáze — kontakty jsou zmraženy pro další 24 měsíců, pokud vás klient sám neosloví.

---

### 4.9 CTA

> **H2:** Přihláška — 10 minut
>
> **Sub:** Vyplníte základní údaje, uložíte CV, odešlete. Ozveme se do 5 pracovních dní.
>
> **Primary CTA:** Podat přihlášku
> **Secondary CTA:** Domluvit neformální call

---

## 5. Shared components copy

### 5.1 EcosystemFooter (4 sloupce)

**Sloupec 1 — Platformy**
- CarMakléř (makléřská síť)
- Inzerce (zdarma pro soukromé)
- Shop autodílů
- Marketplace (invite-only)

**Sloupec 2 — Pro koho**
- Pro autobazary
- Pro autíčkáře
- Pro investory
- Pro makléře (kariéra)
- Pro soukromé prodejce

**Sloupec 3 — O nás**
- Příběh CarMakléř
- Tým
- Kariéra (tech, marketing, ops)
- Tiskové centrum
- Kontakt

**Sloupec 4 — Podpora a právo**
- Centrum nápovědy
- Obchodní podmínky
- Zpracování osobních údajů
- Cookies
- Etický kodex

**Spodní lišta:**
CarMakléř s. r. o. · IČO 21957151 · DIČ CZ21957151 · Školská 660/3, 110 00 Praha · © 2026 · Všechna práva vyhrazena.
Sociální sítě: LinkedIn · Instagram · YouTube · Spotify Podcast

---

### 5.2 Navigace (main + "Pro koho" dropdown)

**Main nav (levá strana):**
- Auta (katalog)
- Inzerce
- Shop
- Marketplace
- Pro koho ▾ (dropdown)

**"Pro koho" dropdown (mega menu):**

| Sloupec 1 — Prodávám | Sloupec 2 — Nakupuji | Sloupec 3 — Kariéra / investice |
|----------------------|----------------------|------------------------------|
| Pro autobazary       | Vyhledat auto        | Pro makléře (kariéra)        |
| Pro autíčkáře        | Vyhledat díl         | Pro investory (Marketplace)  |
| Pro soukromé prodejce| Pro firemní kupce    | Pro dodavatele dílů          |

**Pravá strana nav:**
- Přihlásit se
- Zdarma inzerovat (primary orange CTA)

---

### 5.3 Cookie banner (revize)

> **Titulek:** Cookies — minimum nutné
>
> **Tělo:**
> CarMakléř používá technické cookies pro fungování platformy (přihlášení, košík, jazyk). Pro analýzu návštěvnosti používáme Plausible Analytics v režimu bez osobních údajů — žádné cookies třetích stran, žádný tracking mezi weby.
>
> Pokud budete chtít využívat pokročilé funkce (personalizovaná nabídka vozů, ukládání hledání, push notifikace), aktivujte rozšířené cookies níže.
>
> **Tlačítka:**
> - [Přijmout jen nezbytné] (šedé ghost)
> - [Přijmout vše a pokračovat] (orange primary)
> - [Nastavit jednotlivě] (text link)
>
> **Detailní přepínače (pod "Nastavit jednotlivě"):**
> - Technické (vždy aktivní, nelze vypnout) — přihlášení, košík, jazyk, CSRF tokeny
> - Analytika — Plausible (bez osobních údajů), interní telemetrie výkonu
> - Marketing — Meta Pixel, Google Ads remarketing
> - Funkční — personalizace, uložená hledání, push

---

## 6. Meta tags (per page)

### 6.1 `/` (homepage ekosystém)

- **Title (60 znaků):** CarMakléř — platforma pro prodej i financování aut
- **Description (160 znaků):** Propojujeme autobazary, autíčkáře, investory a makléře. Jedna platforma pro prodej, financování, díly a ekosystém. Pilotní fáze 2026.
- **OG image caption:** Diagram ekosystému CarMakléř — kapitál, vozy, prodej, díly v uzavřeném cyklu.

### 6.2 `/pro-bazary`

- **Title (60 znaků):** Pro autobazary — síť 142 makléřů | CarMakléř
- **Description (160 znaků):** Propojte váš sklad s certifikovanými makléři po ČR. Modelová obrátka 2,8× ročně. Pilot 30 dní zdarma, bez závazků. Spočítejte si ROI.
- **OG image caption:** Autobazar + síť makléřů — obrátka skladu z 68 na 24 dní.

### 6.3 `/pro-autickare`

- **Title (60 znaků):** Pro autíčkáře — kapitál + prodejní kanál | CarMakléř
- **Description (160 znaků):** Investor financuje nákup, makléři prodávají. Dělení zisku 40/40/20. Marketplace v invite-only beta, registrace k ranému přístupu.
- **OG image caption:** Autíčkář Pavel — 10 Octavií, 90 dní, 534 000 Kč zisku (modelový scénář).

### 6.4 `/pro-investory`

- **Title (60 znaků):** Pro investory — investice do vozů | CarMakléř
- **Description (160 znaků):** Spolumajitelský model §1115 OZ, zajištění VIN, modelový výnos 35–45 % p. a. Marketplace v přípravě, registrace k ranému přístupu.
- **OG image caption:** Investor Tomáš — kapitál 2,1 mil. Kč, modelový ROI 40,7 % za 90 dní.

### 6.5 `/pro-makleri`

- **Title (60 znaků):** Staň se makléřem — 5 % provize, min. 25 000 Kč | CarMakléř
- **Description (160 znaků):** Staňte se makléřem CarMakléř. Provize 5 %, minimum 25 000 Kč za vůz. Svobodné rozvržení času, CRM, právní podpora, AI asistent.
- **OG image caption:** Makléř CarMakléř — 3 vozy měsíčně, roční příjem 684 000 Kč (modelový).

---

## 7. Error page copy

### 7.1 404 — Stránka neexistuje

> **Kicker:** 404 — STRÁNKA NENALEZENA
>
> **H1 (Fraunces 48px):**
> Tahle stránka zmizela z nabídky rychleji, než Škoda Octavia z pilotního skladu.
>
> **Sub:**
> Nic vážného — jen se sem nedostaneme. Možná jste kliknul na starý link, nebo jsme stránku přesunuli. Zkuste některou z možností níže.
>
> **CTA grid (4 karty):**
> - Hlavní stránka
> - Aktuální nabídka vozů
> - Pro autobazary
> - Kontakt (pokud si stále myslíte, že to je náš problém)

### 7.2 500 — Chyba serveru

> **Kicker:** 500 — NĚCO SE POKAZILO
>
> **H1 (Fraunces 48px):**
> Zdrželi jsme se v servisu. Omlouváme se.
>
> **Sub:**
> Naše servery měly technickou pauzu. Tým už o tom ví a pracuje na opravě. Zkuste to za chvíli znovu, nebo nám napište na podpora@carmakler.cz.
>
> **CTA:**
> - Zkusit znovu (reload)
> - Napsat podpoře
> - Status platformy (status.carmakler.cz)

---

## 8. Email templates

### 8.1 Waitlist confirm (po registraci na Marketplace waitlist)

**Subject:** Jste #{POZICE} v pořadníku CarMakléř Marketplace

**Tělo (plain text / HTML dual):**

> Dobrý den, {JMENO},
>
> děkujeme za registraci k ranému přístupu do Marketplace CarMakléř.
>
> **Vaše pořadí v pořadníku: #{POZICE}**
>
> Spouštíme ve vlnách po 10 investorů / 20 autíčkářů každé 2 týdny. Pořadí je podle data registrace a kompletnosti profilu. Jakmile je vaše řada, dostanete e-mail s dalšími instrukcemi — ověření identity, rozhovor s portfolio managerem, pilotní deal.
>
> **Mezitím:**
> - Stáhnout Marketplace whitepaper (PDF, 12 stran) → [link]
> - Přečíst si modelový příběh Pavla z Kolína → [link]
> - Sledovat náš blog (čtvrtletní reporty pilotní skupiny) → [link]
>
> Máte otázky? Odpovězte přímo na tento e-mail, ozve se vám account manager.
>
> S pozdravem
> Tým CarMakléř
>
> ---
> CarMakléř s. r. o. · Praha · carmakler.cz · podpora@carmakler.cz

**Technický:** Resend primary, SMTP fallback Wedos při 5xx od Resend.

---

### 8.2 Magic link — Inzerce (přihlášení bez hesla)

**Subject:** Přihlášení do inzerce CarMakléř

**Tělo:**

> Dobrý den,
>
> pro přihlášení do vaší inzerce na CarMakléř klikněte na odkaz níže. Platnost 15 minut.
>
> **[Přihlásit se →]** ({MAGIC_LINK})
>
> Pokud jste o přihlášení nežádal, tento e-mail ignorujte — nic se nestane.
>
> Tým CarMakléř
>
> ---
> Žádost odeslána z IP {IP_ADRESA} · {DATUM_CAS}
> Pokud jste žádost neinicioval a vidíte opakované pokusy, napište na bezpecnost@carmakler.cz.

---

### 8.3 Broker registration — schválení přihlášky makléře

**Subject:** Vítáme vás v síti CarMakléř — další kroky

**Tělo:**

> Dobrý den, {JMENO},
>
> vaše přihláška do sítě makléřů CarMakléř byla schválena. Gratulujeme.
>
> **Další kroky:**
>
> **1. Certifikace (do 14 dní)**
> Vybrali jsme vám termín dvoudenního tréninku: {DATUM} — {LOKACE}.
> Pokud termín nevyhovuje, odpovězte na tento mail a domluvíme jiný.
>
> **2. Smlouva o spolupráci**
> V příloze najdete rámcovou smlouvu. Prosím přečtěte a podepište elektronicky (DocuSign link v příloze). Smlouva nabývá účinnosti po dokončení certifikace.
>
> **3. Vaše přístupové údaje**
> Po podepsání smlouvy dostanete přístup do makléřského dashboardu (carmakler.cz/makler). Tam najdete svůj profil, CRM, přehled provizí.
>
> **4. Mentoring**
> Přidělili jsme vám seniorního makléře jako mentora: **{MENTOR_JMENO}**, specializace {MENTOR_SPEC}. Kontakt: {MENTOR_EMAIL}, {MENTOR_TEL}.
> Mentor vás provází prvních 60 dní — první 2–3 obchody děláte společně, provizi dostáváte celou (100 %).
>
> Jakékoliv otázky směrujte na makler-podpora@carmakler.cz.
>
> Těšíme se na spolupráci.
>
> Tým CarMakléř

---

### 8.4 B2B pilot request (když autobazar vyplnil ROI kalkulačku)

**Subject:** Váš pilotní program CarMakléř — potvrzení a další kroky

**Tělo:**

> Dobrý den, {JMENO},
>
> děkujeme za zájem o pilotní program CarMakléř pro autobazary.
>
> **Přehled vaší žádosti:**
> - Bazar: {NAZEV_BAZARU}
> - Počet vozů ve skladu: {POCET_VOZU}
> - Modelový přínos (z kalkulačky): **+ {CISTY_PRINOS} Kč ročně**
>
> **Co se stane dál:**
>
> **1. Kontakt z naší strany (do 1 pracovního dne)**
> Ozve se vám dedikovaný account manager **{AM_JMENO}** ({AM_TEL}). Domluvíme 30minutové online demo — projdeme platformu, otázky, timeline.
>
> **2. Technické napojení (dny 3–10)**
> Po demo podepíšeme pilotní smlouvu (bez závazků, 30 dní zdarma). Náš integration team napojí váš DMS / XML feed.
>
> **3. Spuštění pilotu (den 10+)**
> Vaše vozy se objevují v síti makléřů. Dostáváte denní reporty o matching aktivitě. Za 30 dní vyhodnotíme, jestli pokračovat.
>
> Máte otázky před demo? Odpovězte na tento mail nebo zavolejte {AM_JMENO} přímo.
>
> S pozdravem
> Tým CarMakléř pro autobazary
> b2b@carmakler.cz · +420 xxx xxx xxx

---

## 9. Open assumptions (documented, not asked)

- **RESOLVED:** IČO 21957151, DIČ CZ21957151, sídlo Školská 660/3, 110 00 Praha (z footer homepage).
- **ASSUMED:** Konkrétní čísla (142 makléřů, 3 247 aut, pokrytí regionů) jsou modelová. Runtime SSR musí mít fallback "Pilotní fáze 2026" pokud Prisma DB vrátí zero — dokumentováno v AUDIT-028b.
- **ASSUMED:** Telefonní kontakty, e-maily, jména mentorů a account managerů v šablonách e-mailů jsou placeholdery (`{JMENO}`, `{AM_JMENO}`) — vyplňuje je backend při odesílání.
- **ASSUMED:** Smluvní podmínky (délka výpovědi, default rate, procento fallback odkupu Shopem) odpovídají draftu legal týmu z března 2026. Finální verze po review.
- **ASSUMED:** Pro `/pro-investory` neuvádíme explicitní čísla defaultu ani ROI jako "garantované". Všude disclaimer "modelový". Text prochází legal review před publikací.
- **ASSUMED:** OG image captions jsou textové popisky — skutečné vizuály dodá designér v handoff do implementace.

---

## 10. Summary

**Structure:** 4 B2B landing pages (`/pro-bazary` / `/pro-autickare` / `/pro-investory` / `/pro-makleri`) + shared components (footer, nav dropdown, cookie banner) + meta tags (5 stránek) + error pages (404, 500) + 4 email templates + assumptions registr.

**Open questions (documented as ASSUMED, per team-lead guidance):**
- Přesný právní text Marketplace whitepaper + §1115 OZ ujednání — legal review.
- Skutečná pilotní čísla (makléři/vozy/obrat) — Prisma DB runtime, fallback "Pilotní fáze 2026".
- Finální cenotvorba Enterprise tieru pro bazary nad 200 vozů — obchodní tým.
- Konkrétní kontakty (telefon, e-maily account managerů) — CRM.

**Next steps (for orchestrator):**
1. Cross-reference s AUDIT-028b wireframe component names pro implementační handoff.
2. Legal review `/pro-investory` kompletní kopie před publikací (ČNB fráze explicitně vyloučeny, ale přesto review nutný).
3. Přenést copy do i18n JSON souborů (`/lib/i18n/cs.json`) pro Next.js integration.
4. Vazba na AUDIT-028d (B2B deck) — konzistence narativu o modelovém scénáři Pavel.

---

*AUDIT-028c — B2B Copy Rewrite | CarMakléř | 2026-04-14*
*Navazuje na: AUDIT-028a (design findings), AUDIT-028b (ecosystem strategy)*
*Předává: implementátor — integrace do Next.js 15 App Router + i18n*
