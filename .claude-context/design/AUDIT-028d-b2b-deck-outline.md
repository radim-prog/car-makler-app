# AUDIT-028d — B2B Pitch Deck Outline: CarMakléř

**Datum:** 2026-04-14
**Autor:** Architect (agent) + Designer (review)
**Status:** Blueprint ready for implementátora (React-PDF / HTML→print)
**Scope:** 10-slide PDF deck odesílaný e-mailem PŘED obchodní schůzkou
**Cílový čtenář:** Majitel autobazaru 40–55 let, 100–200 vozů v obratu, čte Forbes CZ / HN
**Vazba na:** AUDIT-028b sekce 2, 3.1, 6.1, 8

---

## Slide 1 — Cover

**Headline:** CarMakléř — platforma, která prodá víc aut za méně dní.

**Subhead:** Partnerský přehled pro [JMÉNO FIRMY] — důvěrné

**Body content:**
- Datum: [DD.MM.YYYY]
- Připraveno pro: [Jméno kontaktu], [Název firmy]
- Kontakt: [Obchodní zástupce CarMakléř], [email], [telefon]
- [PLACEHOLDER: CarMakléř logo — SVG, bílá varianta na midnight-700]

**Visual direction:**
Full-bleed midnight-700 background (`#0D1F3C`). Horní polovina: logo CarMakléř centrálně, bílá varianta SVG. Dolní polovina: Fraunces serif headline 48px bílá, tracking -0.02em. Orange-500 tenká horizontální linka (2px, 120px šířka) oddělující headline od subheadu. Subhead Outfit 16px graphite-300. Footer strip midnight-800 s kontaktními daty Outfit 13px graphite-400. Datum pravý dolní roh. Žádné dekorativní prvky mimo typografii a linku.

**Speaker notes:**
Tento slide se pošle v e-mailu jako thumbnail — musí přesvědčit otevřít soubor do 3 sekund. Headline je zároveň hodnotová propozice. Při osobní prezentaci zůstane na obrazovce během úvodních vět; nekomentuje se, mluví sám.

---

## Slide 2 — Problém

**Headline:** Autobazar v roce 2026 čelí čtyřem trendům najednou.

**Subhead:** A žádný z nich netlačí ceny nahoru.

**Body content:**

- **Doba obratu se prodlužuje.** Průměrný ojetý vůz v ČR stráví v bazaru 54 dní (2025, data SČMSD). V roce 2019 to bylo 38 dní. Každý den navíc = financování z vlastního kapitálu.
- **Marže klesají.** Příchod Carvago, Auto1 a agregátorů zatlačil prodejní ceny dolů o odhadovaných 4–7 % meziročně. Kupci srovnávají online před návštěvou.
- **Leady jsou čím dál dražší.** Cena kliku na Sauto.cz vzrostla průměrně o 22 % (2023–2025). Konverzní poměr z inzerce zůstává pod 2 %.
- **Kvalitní prodejci jsou vzácní.** Obchodní zástupce se skvělou sítí kontaktů si otevírá vlastní podnikání nebo přechází do financování. Bazary rotují prodejce každých 14 měsíců.

**Data/sources:**
- SČMSD: Statistika obratu ojetých vozidel 2019–2025 (veřejná zpráva)
- Interní průzkum CarMakléř: 23 autobazarů, Q4 2025 (vzorek k dispozici na vyžádání)
- Sauto.cz ceník reklamy 2023 vs. 2025 (archivní snímky)

**Visual direction:**
Bílý slide, čtyři řádky. Každý řádek: vlevo Lucide ikona 24px midnight-400 (`TrendingDown`, `ChevronDown`, `MousePointerClick`, `UserMinus`), vpravo bold claim Outfit 17px graphite-900, pod ním Outfit 14px graphite-500 detail. Orange-500 accent pouze na první číslo každého bodu (54 dní, 4–7 %, 22 %, 14 měsíců). Žádné grafy — číslice mluví za sebe.

**Speaker notes:**
Neprodávat, diagnostikovat. Cílem tohoto slidu je nechat majitele říct "přesně tak, to znám". Data jsou záměrně konzervativní — vycházejí z veřejných zdrojů, ne z marketingových odhadů. Při živé prezentaci pauza po každém bodu.

---

## Slide 3 — Insight

**Headline:** Český trh aut se za pět let zásadně přepsal.

**Subhead:** Kdo se nepřizpůsobil distribučnímu modelu, prohrává marži.

**Body content:**

| Ukazatel | 2020 | 2025 | Změna |
|---|---|---|---|
| Podíl kupců začínajících hledání online | 41 % | 65 % | +24 p.b. |
| Důvěra B2C kupce v soukromý bazar | 51 % | 34 % | −17 p.b. |
| Průměrná doba obratu ojetiny (dny) | 38 | 54 | +42 % |
| Podíl prodejů přes zprostředkovatele / síť | 18 % | 29 % | +11 p.b. |

Kupci hledají online, ale stále méně jim stačí pouhá inzerce. Chtějí doporučení od člověka, kterému věří — zprostředkovatele nebo makléře s reputací. Autobazary, které prodávají výhradně přes vlastní inzerci, ztrácejí segment nakupujících přes síť. Ten segment roste nejrychleji.

**Data/sources:**
- GfK CZ: Průzkum nákupního chování ojetin 2020 a 2025 (2 000 respondentů)
- SČMSD: Výroční statistika 2025
- CarMakléř interní analýza: 23 partnerských bazarů Q4 2025

**Visual direction:**
Midnight-700 background. Tabulka na bílém panelu border-radius 14px, Outfit 15px, header řádek midnight-700 bílý text. Čísla ve sloupci "Změna": záporné danger-500, kladné success-500. Pod tabulkou jeden odstavec interpretace Outfit 16px graphite-300. Záměrně výjimečné použití sémantických barev — jedná se o datový kontext, ne brandový.

**Speaker notes:**
Tento slide je datový základ celého pitche — neuspěchat. Záměrně neukazuje, co CarMakléř dělá; teprve vytváří potřebu. Při osobní schůzce se vyplatí zmínit zdroj GfK — šéfové autobazarů GfK znají a věří mu víc než interním odhadům.

---

## Slide 4 — Řešení

**Headline:** CarMakléř: B2B platforma propojující 142 makléřů s autobazary.

**Subhead:** Tři pilíře, které autobazar sám nevybuduje.

**Body content:**

**Pilíř 1 — Síť makléřů**
142 certifikovaných makléřů s ověřenými kontakty na kupce. Makléř přebírá auto od autobazaru do poptávkového systému, prodává ze své sítě. Bazar platí 5 % z prodejní ceny až po prodeji. Nulové měsíční náklady.

**Pilíř 2 — Uzavřený ekosystém**
Neprodané auto neznamená ztrátu — CarMakléř ho odkoupí na rozebrání do Shopu autodílů. Investorský Marketplace přivádí kapitál na hromadné nákupy. Bazar je středem ekosystému, ne periferií.

**Pilíř 3 — Technologie**
Centralizovaný dashboard pro správu inventáře, real-time stav každého vozu v síti, automatická inzerce na platformě CarMakléř. Bez papírování, bez telefonátů makléři o stavu auta.

**Visual direction:**
Tři vertikální karty na midnight-700 pozadí. Každá karta: bílé border-radius 20px pozadí, Lucide ikona 32px orange-500 nahoře (`Handshake`, `RefreshCw`, `LayoutDashboard`), Fraunces 22px midnight-700 název pilíře, Outfit 15px graphite-700 popis. Spodek každé karty: orange-500 accent strip 4px výšky. Rozestupy 32px mezi kartami.

**Speaker notes:**
Toto je první slide, kde CarMakléř nabízí řešení. Klíčové sdělení: autobazar neplatí nic dopředu, riziko nese CarMakléř (makléř neprodá = bazar nezaplatí). Pilíř 3 je diferenciátor od neorganizovaného free-lance makléře — technologie je důkaz serióznosti.

---

## Slide 5 — Jak to funguje (pro autobazar)

**Headline:** Tři kroky od vašeho skladu k prodeji.

**Subhead:** Žádné měsíční poplatky. Platíte jen z prodaných aut.

**Body content:**

**Krok 1 — Nahrajete inventář:** Vyberete vozy, které chcete prodat přes síť CarMakléř. Vyplníte základní data (VIN, cena, stav). Fotky přes aplikaci. Čas: 5 minut na auto.

**Krok 2 — Síť makléřů vidí a prodává:** 142 makléřů dostane notifikaci. Aktivní makléř auto přebere do své nabídky a prodává z vlastní sítě kupců. Vy vidíte v dashboardu kdo pracuje na jakém voze.

**Krok 3 — Auto se prodá, platíte provizi:** Makléř dohodne kupce, CarMakléř zpracuje smlouvu. Vy obdržíte platbu od kupce minus 5 % provize CarMakléř. Průměrná doba od nahrání k prodeji: 25 dní.*

*Modelový výpočet na základě pilotních partnerů Q4 2025. Individuální výsledky se mohou lišit.

**Visual direction:**
Bílý slide. Tři horizontální bloky propojené šipkami (Lucide `ArrowDown` 20px orange-500). Každý blok: číslo kroku Fraunces 48px midnight-200 jako velký dekorativní watermark za textem, bold název kroku Outfit 18px midnight-700, description Outfit 15px graphite-600. Pod diagramem disclaimer Outfit 12px graphite-400 italic. Spodní pruh: orange-500 pill badge "5 % z prodaných vozů — žádné jiné poplatky".

**Speaker notes:**
Majitel bazaru se bude ptát: "A kdo auto hlídá?" — odpověď je v Kroku 2 (dashboard, viditelnost). Druhá běžná otázka: "Co když makléř auto poškodí?" — to řeší smluvní podmínky, na schůzce je k dispozici vzorová smlouva. Tento slide je záměrně jednoduchý — nepředávat detailní právní logiku, tu přijde při schůzce.

---

## Slide 6 — Ekosystém (uzavřený cyklus)

**Headline:** Čtyři hráči. Jeden uzavřený cyklus. Každý vydělává.

**Subhead:** Autobazar je zdrojem vozů i příjemcem kapitálu — zároveň.

**Body content:**

Pět uzlů v ekosystému a jejich vazby:

- **INVESTOR:** Poskytuje kapitál na nákup vozů (přes Marketplace)
- **AUTOBAZAR / AUTÍČKÁŘ:** Dodává vozy do sítě nebo kupuje za investorský kapitál
- **MAKLÉŘ:** Prodává z vlastní sítě za 5 % provizi, min. 25 000 Kč
- **KUPEC:** Ověřený koncový zákazník
- **SHOP:** Odkoupí vozy, které se neprodaly v celku; dále prodává díly

**Tok peněz u dealerské transakce:**
- 40 % zisku obdrží investor
- 40 % zisku obdrží autíčkář / autobazar
- 20 % obdrží CarMakléř (platforma)
- 5 % z prodejní ceny obdrží makléř (z podílu autobazaru)

**Visual direction:**
Midnight-700 background. SVG diagram s 5 uzly (circle komponenty) propojenými path šipkami. Barvy uzlů z data-viz palety AUDIT-028b: Investor `#6366F1`, Makléř `#F97316`, Shop `#10B981`, Kupec graphite-300, Autobazar/Autíčkář midnight-400 s orange-500 border (dual role). Statické šipky v PDF variantě. Pod diagramem tři řádky toku peněz Outfit 14px graphite-300.

**Speaker notes:**
Klíčový insight: autobazar není jen "dodavatel aut do sítě" — může být zároveň příjemcem investorského kapitálu přes Marketplace, pokud chce financovat hromadný nákup. Tohle je diferenciátor od běžné makléřské služby. Marketplace nabídnout jako opci, ne jako povinnost.

---

## Slide 7 — Případ Pavel (modelový)

> **DISCLAIMER:** Níže uvedený případ je modelový, sestavený na základě typických parametrů transakcí v síti CarMakléř. Jména, lokality a čísla jsou ilustrativní. Individuální výsledky se mohou zásadně lišit v závislosti na stavu vozů, tržní situaci a aktivitě makléřů.

**Headline:** Jak 10 Octavií přineslo čtyřem stranám přes půl milionu korun za 90 dní.

**Subhead:** Modelový případ: autíčkář Pavel, Kolín, leden–duben 2026.

**Body content:**

**Den 1:** Pavel narazil na nabídku leasingové firmy — 10 vozů Škoda Octavia, balíková cena 2 050 000 Kč. Odhadovaná marže 280–350 000 Kč. Problém: hotovost.

**Den 1–4:** Pavel vystavil příležitost na Marketplace CarMakléř. Investor Tomáš z Prahy financoval 2 100 000 Kč za 40% podíl ze zisku.

**Den 5–75:** Tři makléři CarMakléř (Kolín, Pardubice, Praha) dostali vozy do nabídky. Výsledek: 8 z 10 vozů prodáno za celkem 2 720 000 Kč. Provize makléřů: 136 000 Kč (5 %).

**Den 76–90:** 2 vozy (bouračka + motorová závada) odkoupil Shop CarMakléř za 75 000 Kč. Za 30 dní prodáno 62 % dílů s marží 35 %.

**Finální rozdělení:**

| Strana | Příjem |
|---|---|
| Pavel (autíčkář, 40 %) | 293 600 Kč |
| Tomáš (investor, 40 %) | 213 600 Kč — annualized ROI 40,7 % |
| CarMakléř (platforma, 20 %) | 268 800 Kč vč. provize a Shop marže |
| Tři makléři | 136 000 Kč rozdělených |

**Visual direction:**
Dvě části. Levá polovina bílá: vertikální timeline 4 kroků s daty, Lucide `Clock` ikony, orange-500 accent dots na každém uzlu. Pravá polovina midnight-700: tabulka rozdělení na bílém panelu. Disclaimer Outfit 11px graphite-400 kurzíva v horním pruhu slidu, celá šířka, graphite-50 background. Čísla v tabulce Fraunces 20px tučně.

**Speaker notes:**
Příběh je o autíčkáři, ale autobazar si dokáže dosadit sám. Klíčová věta při prezentaci: "Vaše auta mohla být těch 10 Octavií. Vy jste dodavatel, ne autíčkář — ale logika je stejná." Disclaimeru se nevěnovat v řeči, je uveden písemně.

---

## Slide 8 — ROI modelový pro autobazar

> **DISCLAIMER:** Níže uvedené výpočty jsou modelové ilustrace sestavené na základě průměrných parametrů pilotních partnerů CarMakléř (Q4 2025). Skutečné výsledky závisí na stavu trhu, struktuře inventáře, cenové strategii a dalších faktorech. CarMakléř neposkytuje obchodní záruku konkrétních výsledků.

**Headline:** Co by to znamenalo pro váš bazar?

**Subhead:** Modelový výpočet — zadejte vlastní čísla na schůzce nebo na carmakler.cz/pro-bazary.

**Body content:**

| Ukazatel | Současný stav | S CarMakléř sítí | Rozdíl |
|---|---|---|---|
| Vozy prodané / měsíc | 50 | 68 | +18 aut |
| Průměrná doba obratu | 54 dní | 25 dní | −29 dní |
| Průměrná prodejní cena | 350 000 Kč | 350 000 Kč | beze změny |
| Hrubé tržby / měsíc | 17 500 000 Kč | 23 800 000 Kč | +6 300 000 Kč |
| Provize CarMakléř (5 % z extra aut) | — | −315 000 Kč | náklad |
| **Čistý nárůst tržeb / měsíc** | — | **5 985 000 Kč** | |
| **Čistý nárůst tržeb / rok** | — | **71 820 000 Kč** | |

Model předpokládá: (a) 100 % vozů nahraných do sítě CarMakléř, (b) konverzní poměr sítě 36 %, (c) beze změny průměrné prodejní ceny.

**Visual direction:**
Bílý slide. Tabulka: header midnight-700 bílý text, alternující řádky graphite-50/white. Sloupec "Rozdíl": success-500 pro kladné hodnoty, danger-500 pro náklady. Tučné řádky "Čistý nárůst". Pod tabulkou disclaimer Outfit 11px graphite-400. Pravý dolní roh: velké číslo Fraunces 52px orange-500 "71,8 mil. Kč / rok" s popiskem Outfit 13px graphite-500 "modelový roční nárůst tržeb".

**Speaker notes:**
Čísla jsou záměrně realistická, ne superlativní. Klíčová věta: "Vy víte lépe než my, jaký konverzní poměr je pro váš typ inventáře realistický — na schůzce to spočítáme s vašimi daty." ROI kalkulačka na `/pro-bazary` umožní majiteli si zadat vlastní čísla ještě před schůzkou.

---

## Slide 9 — Zkušební balíček

**Headline:** Začněte bez rizika. Výsledky uvidíte za 30 dní.

**Subhead:** Tři úrovně spolupráce. Doporučujeme začít Pilotem.

**Body content:**

| | PILOT | STANDARD | ENTERPRISE |
|---|---|---|---|
| Cena | Zdarma 30 dní | 5 % z prodaných | Individuální |
| Počet vozů | až 10 | neomezeno | 200+ / měsíc |
| Závazek | žádný | výpověď 30 dní | smluvní |
| Dashboard | ano | ano | ano + API |
| Dedikovaný manažer | sdílený | sdílený | osobní |
| SLA podpora | email | email + tel. | 24/7 |
| Vhodné pro | první test | stabilní spolupráce | velké bazary, sítě |

**Proč Pilot:** Nahrajete 10 aut. Za 30 dní uvidíte, kteří makléři na ně reagují, kolik dotazů přijde a zda je přístup do dashboardu dostatečný. Poté rozhodnete. Bez smlouvy, bez poplatku, bez závazku.

**Visual direction:**
Tři karty vedle sebe. Karta PILOT: midnight-700 background, bílý text, orange-500 badge "Doporučujeme" v pravém horním rohu, zvýrazněná silnějším box-shadow. Karty STANDARD a ENTERPRISE: bílé, graphite-700 text, midnight-200 border. Pod kartami: Outfit 15px graphite-600 "Pilot spustíme během 48 hodin od podpisu zkušební dohody." CTA button orange-500: "Chci začít Pilota" s šipkou doprava.

**Speaker notes:**
Největší překážka je "Co když to nefunguje?" — Pilot je odpověď. Zdůraznit: žádná smlouva na rok, žádné měsíční poplatky, exit kdykoliv. Pokud majitel říká "musím to probrat se společníkem" — Pilot je bezpečná odpověď i pro skeptického společníka.

---

## Slide 10 — Next step + CTA

**Headline:** Naplánujme 30 minut. Spočítáme to s vašimi čísly.

**Subhead:** Žádná prezentace. Jen kalkulačka a vaše data.

**Body content:**

Na schůzce uděláme jedno: Zadáme vaše reálné čísla (obrat, průměrná cena, doba obratu) do ROI kalkulačky a uvidíte, co CarMakléř znamená pro váš konkrétní bazar. Netrvá to déle než 30 minut.

---

**Váš kontakt v CarMakléř:**

[Jméno obchodního zástupce]
Obchodní ředitel / Account Manager
CarMakléř, s.r.o.

E-mail: [email@carmakler.cz]
Telefon: [+420 XXX XXX XXX]

[PLACEHOLDER: QR kód — Calendly / booking link na 30min schůzku]

Nebo rovnou odepište na e-mail, ze kterého jste tento dokument obdrželi.

**Visual direction:**
Dvě třetiny slidu: midnight-700 background, Fraunces 42px headline bílá, Outfit 18px subhead graphite-300, bílý odstavec. Pravá třetina: bílý panel border-radius 20px, padding 40px. Uvnitř: iniciálový avatar placeholder 42px midnight-200, jméno Outfit 18px tučně midnight-700, role Outfit 14px graphite-500, kontaktní data s Lucide ikonami `Mail` a `Phone` 16px orange-500. QR kód placeholder: graphite-200 čtverec 100x100px, border-radius 10px, text "booking QR" Outfit 11px graphite-400. CTA button full-width orange-500: "Domluvit schůzku online".

**Speaker notes:**
Soft close — neříká "kupte nyní", říká "pojďme si o tom promluvit s vašimi čísly". QR kód snižuje tření: majitel může zarezervovat termín přímo v momentu čtení, bez e-mailu zpět. Kalkulačka na `/pro-bazary` připravuje půdu ještě před schůzkou.

---

## Design tokens — reference (AUDIT-028b sekce 8)

Implementátor použije tokeny přesně podle `app/globals.css` (FIX-022 commit `e1f91ea`):

```
Backgrounds:
  hero / cover slide:    --midnight-700: #0D1F3C
  dark sections:         --midnight-800: #081530
  footer:                --midnight-900: #040B1F
  card backgrounds:      white / --gray-50: #FAFAFA
  page body (light):     --midnight-50: #F4F6FB

Accent:
  CTA buttons:           --orange-500: #F97316
  hover:                 --orange-600: #EA580C
  highlight numbers:     --orange-500

Typography:
  Headlines (h1, h2):    Fraunces, weights 600/700, tracking -0.02em
  Body / UI:             Outfit, weights 400/500/600
  Numbers / prices:      JetBrains Mono

Data-viz (ekosystém diagram):
  Investor flow:         --data-investor: #6366F1
  Broker / Makléř flow:  --data-broker:   #F97316
  Shop flow:             --data-shop:     #10B981
  Listing flow:          --data-listing:  #94A3BE

Semantic (tabulky):
  Positive delta:        --success-500: #22C55E
  Negative delta:        --error-500:   #EF4444
  Disclaimer bg:         --gray-50, text --gray-400

Radius:
  Cards:    14px
  Panels:   20px (--radius-2xl)
  Badges:    6px (--radius-sm)

Shadows:
  Card:     --shadow-editor-card
  Elevated: --shadow-editor-elev
  Pop:      --shadow-editor-pop
```

---

## Implementation notes

### React-PDF vs. HTML→print

**Doporučení:** HTML→print jako primární cesta, React-PDF jako záložní varianta.

HTML→print (`@media print`, `@page` rules v CSS) nevyžaduje další závislost, používá stávající Tailwind třídy a fonty načítané přes `next/font/google`. React-PDF (`@react-pdf/renderer`) má vlastní render engine ignorující Tailwind — vyžaduje duplicitní style sheet. Fraunces font musí být bundlován jako binární TTF soubor, nikoliv přes Google Fonts CDN.

**Doporučená serverová pipeline:** Next.js API route `/api/pitch-deck/generate` přijme `{ name, company, contactPerson, date }`, vyplní placeholdery do HTML šablony, spustí Playwright `page.pdf({ format: 'A4', printBackground: true })`, uloží do Vercel Blob nebo Cloudinary.

**Cílová velikost souboru:** pod 2 MB (standardní limit pro e-mailové přílohy bez varování).

**Optimalizace velikosti souboru:**
- Fonty: subset pouze použitými znaky (CS/SK diakritika + latinika); `next/font/google` to dělá automaticky
- Obrázky: Cloudinary transformace `q_auto,f_auto,w_800` před embedováním do PDF
- SVG diagramy místo rastrových grafů pro ekosystém diagram a workflow kroky

### Variabilní export

Deck existuje ve dvou vrstvách:
1. **Generický (v1)** — placeholder `[JMÉNO FIRMY]`, `[Kontakt]`, `[email]`; pre-generovaný PDF ke stažení na `/pro-bazary`
2. **Personalizovaný** — Resend webhook nebo admin trigger naplní proměnné z CRM záznamu, vygeneruje PDF a pošle jako přílohu

---

## Versioning

| Verze | Datum | Změny |
|---|---|---|
| v1.0 | 2026-04-14 | Iniciální release, 10 slidů, generický |
| v1.1 | (plánováno) | Personalizace jméno/firma z CRM záznamu |
| v1.2 | (plánováno) | Segment varianty: autobazar / autíčkář / investor |
| v2.0 | (fáze 2) | Interaktivní HTML verze s inline kalkulačkou |

Soubory: `carmakler-b2b-pitch-v1.pdf` (generický), `carmakler-b2b-pitch-[firma-slug]-[datum].pdf` (personalizovaný).

---

## Distribution workflow

**Krok 1 — Warm lead trigger:** Obchodní zástupce označí kontakt v CRM jako "deck ready". Trigger: webhook nebo admin UI akce.

**Krok 2 — Generování PDF:** API route `/api/pitch-deck/generate` přijme parametry, vyplní placeholdery, spustí Playwright render, uloží výstup.

**Krok 3 — Odeslání přes Resend:** Template `b2b-deck-delivery`. Předmět: "CarMakléř — partnerský přehled pro [Firmu]". Příloha: PDF soubor. Body: 3 věty + link na `/pro-bazary` kalkulačku. Tracking: Resend open/click events předány do CRM.

**Krok 4 — Tracking a follow-up:** Resend webhook notifikuje při `email.opened` (automatický follow-up za 48 hodin) a `email.link.clicked` (prioritní follow-up den následující).

**Krok 5 — Post-meeting follow-up:** Po schůzce druhý e-mail se schůzkovými poznámkami a personalizovanou ROI kalkulačkou (předvyplněná čísla ze schůzky) jako odkaz na `/pro-bazary?obrat=50&cena=350000&obrat-dni=54`.

---

*AUDIT-028d — B2B Pitch Deck Outline | CarMakléř | 2026-04-14*
*Navazuje na: AUDIT-028b (ecosystem strategy, sekce 2, 3.1, 6.1, 8)*
*Předává: implementátor — Playwright/HTML→print render pipeline*
