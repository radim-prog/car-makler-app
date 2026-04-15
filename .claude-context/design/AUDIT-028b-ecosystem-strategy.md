# AUDIT-028b — Ecosystem Strategy & Design Direction

**Datum:** 2026-04-14
**Autor:** Architect (agent, opus) + Designer review
**Předchozí dokument:** `.claude-context/design/AUDIT-028a-design-findings.md`
**Status:** Strategy ready for plánovač → AUDIT-028 implementation plan
**Scope:** Visual design direction + ecosystem narrative + homepage wireframe + B2B landing pages + build sequence + components + design tokens
**NOT in scope:** Code changes (this is a strategy document only)

> **Poznámka pro team-leada:** Tento dokument je agnostický k Variantě A vs C — wireframe a komponenty jsou identické. Liší se pouze URL routing a migrační sekce. Plánovač zvolí variantu po konzultaci s Radimem.

---

## 1. Executive Summary

### 1.1 Co je problém

CarMakler má **silný produkt-market fit potenciál v B2B segmentu** (autobazary 100–200 vozů, autíčkáři hledající investorský kapitál), ale **současný web ho aktivně sabotuje** ve třech rovinách:

1. **Narrativa chybí.** 4 produkty (Makléřská síť, Inzerce, Shop, Marketplace) jsou na webu prezentovány jako 4 oddělené karty v patičce. Skutečná business hodnota — **uzavřený cyklus auto → kapitál → prodej → díly → loop** — je neviditelná. Autobazar, který přijde z Google Ads, vidí "ještě jeden makléřský servis", ne "platformu, která mi obrátí 200 aut měsíčně".
2. **Vizuál mluví jiným jazykem než cílovka.** Pastelový orange-50 background, 21 různých emoji v jediném souboru `page.tsx`, font Outfit ve startup-fitness stylu, fake 5★ recenze bez fotky a kontextu. To je vizuál pro koncového spotřebitele, který si přijde **jednou za 5 let prodat fabii**. Pro autobazar, který má rozhodnout o spolupráci za 5 milionů ročně, je to **deal-breaker** na první pohled.
3. **Pozicování je rozpolcené.** Hero říká "Vaše auto prodáme do 20 dní" (B2C jednotlivec), pod ním leasingové segmenty "Zaměstnanec / OSVČ od 3 měsíců / Důchodce" (B2C úvěrový jazyk), pak služby Prodej/Koupě/Prověrka/Financování (B2C transakce). Slovo **autobazar, autíčkář, investor, marketplace** se na homepage nevyskytuje.

### 1.2 Navrhovaný směr

**Přepsat homepage `/` na ekosystémový HUB s editorial B2B aesthetic** a doplnit dvě dedikované B2B landing pages (`/pro-bazary`, `/pro-auticekare`). Současný makléřský obsah se buď přesune na `/makler` (Varianta A) nebo zůstane jako sekundární vrstva pod novou ekosystémovou hero (Varianta C). Plánovač rozhodne s Radimem.

**Tři pilíře nového směru:**

- **Narrativa "uzavřeného cyklu"** — prominentní sekce nad fold-line s diagramem, který ukazuje peněžní a fyzický tok auta mezi 4 produkty. Tohle je hlavní zbraň proti "ještě jeden makléř" vnímání.
- **Editorial B2B vizuál** — midnight #0D1F3C jako primární barva, orange-500 jen jako accent (max 15% plochy), Fraunces serif pro headlines + Outfit pro body, Lucide-react ikony (zero emoji v UI), real fotky aut z vlastní knihovny + live stats z databáze.
- **Proof density** — místo 3 fake recenzí: živé statistiky z Prisma (počet aktivních inzerátů, makléřů, transakční objem za 30 dní), variabilní recenze (4★/4.5★/5★ mix s fotkami a kontextem auta), verified badges s reálnou metrikou.

### 1.3 Co tento dokument NENÍ

- Není to kompletní design specifikace každé komponenty (to je práce designéra a Figmy, my dáváme blueprint).
- Není to copy textace v plné délce (to je AUDIT-028c-copy-rewrite.md).
- Není to dev plán s task IDs (to je AUDIT-028 plán od plánovače).

---

## 2. Visual Design Direction — Editorial B2B Aesthetic

### 2.1 Strategická volba: proč editorial B2B

Cílovka **autobazar majitel 45 let s ročním obratem 30–80 mil. Kč** čte iDnes Premium, Forbes CZ, Hospodářské Noviny. Zvyklý na vizuál Carvago, Cars24, Auto1, Mototechna investor reports. **Není zvyklý** na pastelové startup designy v Outfit fontu se smajlíky. Editorial B2B aesthetic znamená:

- **Hierarchie typografie jako v novinách** — velký serif headline, kontrast s krátkým sans-serif kicker (eyebrow), klidný body text.
- **Tlumená paleta s jedním silným accent** — midnight base, orange jen jako "klikni sem" signál.
- **Data dominantní** — čísla, grafy, real-time stavy. Nepřesvědčuju emoceně, přesvědčuju evidencí.
- **Bílý prostor jako luxus** — generózní paddings, ne nacpané kartičky.

### 2.2 Color palette

```
PRIMARY (midnight) — používat na backgrounds heroů, footer, dark sections
  midnight-50:  #F4F6FB  (almost white, page bg pro light sections)
  midnight-100: #E4E9F2
  midnight-200: #C5CFE0
  midnight-300: #94A3BE
  midnight-400: #5C7194
  midnight-500: #2D4669
  midnight-600: #1A2F52
  midnight-700: #0D1F3C  ← hero bg, primary brand
  midnight-800: #081530
  midnight-900: #040B1F  ← footer, deepest

ACCENT (orange) — max 15% plochy stránky, používat pouze pro:
  - Primary CTA buttons
  - Stats highlight numbers
  - Active states (nav, tabs)
  - Decorative dividers
  orange-500: #F97316  ← stávající, ZACHOVAT
  orange-600: #EA580C  ← hover

NEUTRAL (graphite) — body text, card backgrounds, dividers
  graphite-50:  #FAFAFA
  graphite-100: #F4F4F5
  graphite-500: #71717A
  graphite-700: #3F3F46
  graphite-900: #18181B

SEMANTIC
  success-500: #10B981  (green, použito pro "verified", "active")
  warning-500: #F59E0B  (amber, použito pro "pending review")
  danger-500:  #EF4444  (červená pro errors, ne pro brand)

DATA VIZ (pro stats, charts, ekosystém diagram)
  data-investor: #6366F1  (indigo — kapitál tok)
  data-broker:   #F97316  (orange — prodej tok)
  data-shop:     #10B981  (green — díly tok)
  data-listing:  #94A3BE  (gray — inzerce tok)
```

**Pravidlo 60-30-10:**
- 60% midnight (background hero, sekce, footer)
- 30% white/graphite (body sections, karty)
- 10% orange + accent colors (CTAs, highlights, ekosystém arrows)

### 2.3 Typography

```
HEADLINES (h1, h2, h3 v hero/landing sekcích)
  Font: Fraunces (Google Fonts, serif, CZ diakritika OK)
  Weights: 500, 600, 700, 900 (display)
  Použít pro: hero h1, sekční h2, "moments" h3
  Tracking: -0.02em (slight tight)
  Optical size: text (default), display (pro h1 nad 48px)

BODY + UI (vše ostatní)
  Font: Outfit (stávající, ZACHOVAT)
  Weights: 400, 500, 600, 700
  Použít pro: body text, buttons, navigace, badges, kartové nadpisy
  Tracking: 0 (default)

MONO (statistics, prices, codes)
  Font: JetBrains Mono nebo system mono
  Použít pro: ceny v hero stats, transakční čísla, VIN

SCALE (Tailwind utilities)
  text-display:  72px / line-height 1.05  (Fraunces, jen homepage hero)
  text-h1:       48px / line-height 1.1   (Fraunces)
  text-h2:       36px / line-height 1.15  (Fraunces)
  text-h3:       24px / line-height 1.3   (Fraunces)
  text-h4:       20px / line-height 1.4   (Outfit, semibold)
  text-body-lg:  18px / line-height 1.6   (Outfit)
  text-body:     16px / line-height 1.6   (Outfit)
  text-body-sm:  14px / line-height 1.5   (Outfit)
  text-caption:  12px / line-height 1.4   (Outfit, uppercase tracking-wide)
```

### 2.4 Iconography — Lucide-react only

**Pravidlo:** Žádné emoji v UI. Emoji jsou OK v marketingových e-mailech, push notifikacích, Telegram zprávách. **NE v product UI.**

**Standardy:**
- Knihovna: `lucide-react` (ověřit `package.json`, jinak `npm i lucide-react`)
- Stroke width: 2px (default), 1.5px pro velké ikony nad 48px
- Default size: 20px (inline), 24px (standalone), 32px (feature card), 48px (hero)
- Color: dědí z parent (`text-midnight-700` nebo `text-orange-500`)

**Mapping emoji → Lucide (pro migraci současné homepage):**

| Současný emoji | Lucide ikona | Kontext |
|----------------|--------------|---------|
| 🚗 | `Car` | Prodej vozidla |
| 🛒 | `ShoppingCart` / `Tag` | Koupě |
| 🔍 | `ShieldCheck` | Prověrka (důvěryhodnější) |
| 💰 | `Banknote` / `Wallet` | Financování |
| 📋 | `Newspaper` | Inzerce |
| 🛍️ | `Wrench` / `Cog` | Shop autodíly (NEPŘIJATELNÁ taška!) |
| ⏱️ | `Clock` | Šetříme čas |
| 📄 | `FileText` | Smlouvy |
| 🛡️ | `ShieldCheck` | Bezpečnost |
| 🤝 | `Handshake` | Síť makléřů |
| ⭐ | `Star` (filled) | Hodnocení |
| ✓ | `CircleCheck` | Verified |
| 📍 | `MapPin` | Lokace |
| ⚡ | `Zap` | Výkon (HP) |
| 🆕 | `Sparkles` | Nový makléř badge |

### 2.5 Spacing, radii, shadows

```
SPACING — 8px grid
  Section vertical:  py-20 (80px) desktop, py-12 (48px) mobile
  Container max-w:   max-w-7xl (1280px), pro hero max-w-screen-2xl
  Card padding:      p-8 (32px), pro hustá grid p-6
  Element gap:       gap-8 desktop, gap-4 mobile (responzivní)

RADIUS
  --radius-sm:  6px   (badges, small buttons)
  --radius-md:  10px  (inputs, tags)
  --radius-lg:  14px  (cards default)
  --radius-xl:  20px  (hero blocks)
  --radius-2xl: 28px  (large feature panels)

SHADOWS — softer, more sophisticated
  shadow-card:   0 1px 3px rgba(13,31,60,0.06), 0 1px 2px rgba(13,31,60,0.04)
  shadow-elev:   0 8px 24px rgba(13,31,60,0.08), 0 2px 4px rgba(13,31,60,0.04)
  shadow-pop:    0 24px 48px rgba(13,31,60,0.12), 0 8px 16px rgba(13,31,60,0.06)
  shadow-glow:   0 0 0 4px rgba(249,115,22,0.12)  (focus ring)
```

### 2.6 Photography & illustration

- **NULA stock fotek z Unsplash.** Porušení CLAUDE.md pravidla + tonálně mimo (Mustang).
- **Hero fotky** — vlastní studio fotka Škoda Octavia / VW Passat / BMW 3-series (český mainstream). Pokud nedostupné, **abstraktní illustration** v midnight + orange paletě.
- **Foto makléřů** — povinné profile photos. Žádné placeholdery typu "PM" iniciály na barevném gradientu.
- **Foto z transakcí** — "Pavel z Kolína převzal klíče od Octavie 12.3.2026" — autenticita > polished.
- **Cloudinary** — všechny fotky přes Cloudinary CDN, CLAUDE.md compliant.

---

## 3. Ekosystémová narrativa — uzavřený cyklus

### 3.1 Narrativní rámec — 3 vrstvy storytellingu

**Vrstva 1 — slogan (5 sekund čtení):**
> "Auto, kapitál, prodej, díly. Jeden ekosystém."

**Vrstva 2 — pitch paragraph (30 sekund čtení):**
> CarMakler propojuje čtyři skupiny lidí kolem jednoho cíle — prodat víc aut s lepší marží.
> **Investoři** poskytují kapitál autíčkářům na nákup vozů.
> **Autíčkáři** nakupují, opravují a předávají auta na prodej.
> **Makléři** prodávají vozy přes svou síť kontaktů s 5% provizí.
> **Shop** zpracovává díly z aut, která se neprodala v celku.
> Každá strana vydělává. Žádná část neexistuje sama o sobě.

**Vrstva 3 — konkrétní příběh (2 minuty čtení, scrollovací sekce):**

> **Pavel z Kolína** je autíčkář — kupuje 5 až 15 ojetin měsíčně, opraví a prodává dál. V lednu 2026 narazil na příležitost: **10 vozů Škoda Octavia** od leasingové firmy za balíkovou cenu **2 050 000 Kč**. Marže potenciálně 280–350 000 Kč. Problém: peníze.
>
> Na **Marketplace CarMakler** vystavil příležitost. Během 4 dnů ji financoval **investor Tomáš z Prahy** — vložil 2,1 mil. Kč za 40% podíl ze zisku. Pavel pokryl náklady na opravy z vlastních 80 000 Kč.
>
> Auta předal **třem makléřům CarMakler** v Kolíně, Pardubicích a Praze. Během **75 dnů** se prodalo **8 z 10 vozů** za celkem **2 720 000 Kč**. Provize makléřům: **136 000 Kč** (5%). Hrubý zisk: **534 000 Kč**.
>
> Dvě auta zůstala — jedno bouračka, druhé s motorovou závadou. **Shop CarMakler** je odkoupil za **75 000 Kč** na rozebrání. Během 30 dnů prodáno **62 % dílů** s marží 35 %.
>
> **Finální rozdělení:**
> - Pavel (autíčkář, 40%): 213 600 Kč + vrácené 80k = **293 600 Kč hotově**
> - Tomáš (investor, 40%): 213 600 Kč zisku za 90 dní = **annualized ROI 40,7 %**
> - CarMakler (platforma, 20%): 106 800 Kč + provize + Shop marže = **268 800 Kč**
> - Tři makléři: 136 000 Kč rozdělené
>
> **Win-win-win-win.** Žádný hráč by sám nemohl tu transakci provést.

### 3.2 Vizuální diagram — uzavřený cyklus

ASCII reprezentace pro implementaci jako SVG/React komponentu `EcosystemDiagram.tsx`:

```
                    ┌─────────────────┐
                    │   INVESTOR      │
                    │  poskytne $$$   │
                    │  (Marketplace)  │
                    └────────┬────────┘
                             │ kapitál
                             ▼
    ┌────────────┐    ┌─────────────────┐    ┌────────────┐
    │  AUTÍČKÁŘ  │◄───┤   nákup vozů    │───►│  AUTOBAZAR │
    │ (financován│    │   z aukcí, leas.│    │ (zdroj aut)│
    │  investorem│    │   bourák, dovoz │    │ + síťovač  │
    └─────┬──────┘    └─────────────────┘    └─────┬──────┘
          │ připravená auta                         │
          └────────────────┬────────────────────────┘
                           ▼
                  ┌─────────────────┐
                  │     MAKLÉŘ      │
                  │ prodej z ruky   │
                  │ 5% provize, 25k │
                  └────────┬────────┘
                  prodáno (80%) │ neprodáno (20%)
                  ┌────────────┴────────┐
                  ▼                     ▼
           ┌──────────┐      ┌──────────┐
           │  KUPEC   │      │   SHOP   │
           │ koncový  │      │ rozebrání│
           └──────────┘      │ na díly  │
                             └────┬─────┘
                                  ▼
                         ┌────────────────┐
                         │ DÍLY ZÁKAZNÍCI │
                         └────────────────┘

  ═══════════════════ TOK PENĚZ ═══════════════════
  Investor → 40% zisku    |  Autíčkář → 40% zisku
  Makléř   → 5% z prodej. |  Platforma→ 20% + Shop
```

Implementační poznámka: použít **SVG s animovanými šipkami** (Framer Motion `motion.path` + `pathLength`), na hover tooltip s číslem, na mobile redukovat na vertikální flow.

### 3.3 Sekce "Pro koho je platforma"

Nahradit současný "Auto u nás dostane každý" + leasingové segmenty (už vyřízeno FIX-010) za plně formátovanou verzi s ikonami Lucide a CTA do landing pages.

---

## 4. Ekosystémová homepage — kompletní wireframe

### 4.1 Section map (top → bottom)

```
S0  STICKY HEADER (transparent on hero, solid on scroll)
S1  HERO — ekosystém pitch + live stats
S2  EKOSYSTÉM DIAGRAM — uzavřený cyklus vizualizace
S3  4 PRODUKTY — breakdown (Makléř, Inzerce, Shop, Marketplace)
S4  PRO KOHO — 4 segmenty s CTA do landing pages
S5  PŘÍBĚH PAVEL — scrollytelling jednoho dealu
S6  LIVE STATS BAR — proof density (DB-driven)
S7  AKTUÁLNÍ NABÍDKA — top 6 vozidel (real Prisma data)
S8  TOP MAKLÉŘI — pouze ti s 3+ prodeji, jinak skryto
S9  RECENZE — variabilní 4★/4.5★/5★
S10 FAQ — B2B otázky
S11 CTA BAND — "Připojte se k ekosystému"
S12 FOOTER — 4 produkty + Marketplace LINK PŘIDAN
```

### 4.2 S1 — Hero (above the fold)

```
[bg: midnight-700 gradient → midnight-800; subtle SVG noise]

EYEBROW (orange-500): PLATFORMA PRO CELÝ ŽIVOTNÍ CYKLUS AUTA
H1 Fraunces 72px white: Auto, kapitál, prodej, díly.
                        Jeden ekosystém.
BODY Outfit 18px gray-300: Spojujeme autíčkáře, investory,
                           makléře a kupce. 3 247 aut prodaných
                           v 2025.

CTAs: [Pro autobazary →] [Pro autíčkáře →] [Pro investory →]
      [Jsem soukromý prodejce – ghost link]

+ Hero illustration / Cloudinary foto (pravá strana)

LIVE STATS BAR (pod fold):
3 247 prodaných | 142 makléřů | 580 aktivních inzerátů |
18 dní průměr | 4,2 mld Kč obrat 2025
```

**Live stats logic:** Server Component, počítá z Prisma:
- `prisma.vehicle.count({ where: { status: 'SOLD' } })`
- `prisma.user.count({ where: { role: 'BROKER', status: 'ACTIVE' } })`
- `prisma.vehicle.count({ where: { status: 'ACTIVE' } })`
- aggregations pro avgDays, totalGMV

Pokud DB vrátí nulu → **"Pilotní fáze 2026 — prvních 30 transakcí"**. Žádná fake čísla.

### 4.3 S2 — Ekosystém diagram

Komponenta `<EcosystemDiagram variant="full" highlightFlow="money|cars|data" />` — SVG + Framer Motion.

### 4.4 S3 — 4 produkty breakdown

```
[Handshake] MAKLÉŘSKÁ SÍŤ     [Newspaper] INZERCE
142 ověř. makléřů, 5% provize  Free B2C, bez poplatků
Pro: Autobazary, Autíčkáři     Pro: Soukromé, Dealery

[Wrench] SHOP AUTODÍLY         [TrendingUp] MARKETPLACE
Použité OEM + aftermarket       Investorská, ověřené dealery
Pro: Vrakoviště, Opravárny      Pro: Investoři, Autíčkáři
```

### 4.5 S4 — Pro koho (segmenty)

4 karty: AUTOBAZARY (100-200 vozů), AUTÍČKÁŘI (5-15 vozů/měs), INVESTOŘI (500k-5M), SOUKROMÍ (1 vůz) — s linky na landing pages.

### 4.6 S5 — Příběh Pavla (scrollytelling)

Levá: vertikální timeline 8 kroků (Day 1 → Day 90). Pravá: vizuál (foto, čísla, graf rozdělení zisku). Finální box s ROI breakdown.

### 4.7 S6 — Live stats bar (rozšířená)

6 stat tiles (prodaných, makléřů, průměr dní, obrat, úspěšnost, avg rating) s `revalidate=60`.

### 4.8 S7-S12 — sumarizovaně

- **S7:** `getFeaturedCars` × 6. Pokud `< 3`, skryj.
- **S8:** TOP makléři **conditional** `totalSales >= 3`, jinak skryj (implementace FIX-013 už řeší).
- **S9:** `<TestimonialsCarousel>` s 10–12 variabilními (FIX-012 už dodáno).
- **S10:** `<EcosystemFAQ>` 8–10 B2B otázek.
- **S11:** CTA band "Připojte se k ekosystému" + 4 segmentové CTA.
- **S12:** Footer — **PŘIDAT Marketplace link**, reorganizovat do 4 sloupců.

---

## 5. Varianta A vs C — analýza a rozhodovací matice

### 5.1 Definice

- **Varianta A — Full HUB rebuild:**
  - `carmakler.cz/` = nová ekosystémová homepage.
  - `carmakler.cz/makler/` = stávající makléřský obsah (přesun).
  - `inzerce.` `shop.` `marketplace.` subdomény.

- **Varianta C — Hybrid (planner preference):**
  - `carmakler.cz/` = nová ekosystémová homepage.
  - Stávající landing pages **zůstávají na stávajících URL**.
  - Subdomény stejně potřeba nasadit.

### 5.2 Pros/cons matrix

| Kritérium | Varianta A | Varianta C |
|-----------|------------|------------|
| **Risk** | Vysoký (URL change, SEO, redirects) | Nízký (přepis `/page.tsx`) |
| **Time to market** | 4–6 týdnů | 1–2 týdny |
| **SEO impact** | Negativní krátkodobě, pozitivní dlouhodobě | Neutrální/pozitivní |
| **Brand clarity** | Vysoká | Střední |
| **B2B pitch ready** | Plně | Plně |
| **Dev complexity** | XL | M |
| **Reverzibilita** | Obtížná | Snadná |
| **Subdomain dependency** | Hard | Soft |
| **A/B testovatelnost** | Obtížná | Snadná |

### 5.3 SEO impact deep-dive

**Varianta A rizika:**
- Současné `/` má brand keyword "carmakler" rank #1. Přepis = nová Title/H1, dočasný drop.
- Přesun makléřského obsahu = **301 redirect mapa**.
- Subdomény oddělené subdomain authority.

**Varianta A mitigations:**
- 301 redirects v `next.config.js` `redirects()`.
- Sitemap.xml regenerace.
- Search Console monitoring.

**Varianta C — žádné SEO riziko.**

### 5.4 Rozhodovací doporučení

**Doporučení architecta: Varianta C s opcí na A za 6 měsíců.**

1. Rychlost time-to-market (B2B pitche květen 2026).
2. Reverzibilita — revert je 5-min.
3. SEO bezpečnost.
4. A/B test možnost.
5. Po 6 měsících vyhodnotit, pak Varianta A jako "growth phase 2".

---

## 6. B2B landing pages — wireframy

### 6.1 `/pro-bazary` — landing pro autobazary

**Sekce:** S1 Hero (ROI pitch), S2 Jak to funguje (3 kroky), S3 ROI kalkulačka, S4 Case study, S5 Pricing tiers (Pilot/Standard/Enterprise), S6 FAQ, S7 CTA band.

**Hero:**
```
EYEBROW: PRO AUTOBAZARY 100–200 VOZŮ
H1: Zvýšte obrat o 2–3× za 6 měsíců.
Sub: 142 makléřů CarMakler hledá auta. Vy jich máte. Spojme to.
Trust: 5% provize, žádné měsíční poplatky | Auto zůstává u vás |
       Výpověď do 30 dní
CTAs: [Spočítat ROI →] [Domluvit demo →]
```

**ROI kalkulačka vstupy:** měsíční obrat, prům. prodejní cena, současná doba obratu.
**Výstupy:** doba s CM, dodatečný obrat/měsíc, roční nárůst tržeb, provize CM, net profit.

### 6.2 `/pro-auticekare` — landing pro autíčkáře

**Sekce:** S1 Hero, S2 Zjednodušený cyklus, S3 Pavel příběh full, S4 ROI kalkulačka, S5 Ověření protokol, S6 Testimonials, S7 FAQ, S8 CTA.

**Hero:**
```
EYEBROW: PRO AUTÍČKÁŘE 5–15 VOZŮ MĚSÍČNĚ
H1: Najděte investora. Prodejte přes makléře. Nechte si víc.
Sub: Nepotřebujete banku, splátkové sliby ani vlastní 5M Kč.
     Marketplace propojí váš deal s investorem do 7 dní.
CTAs: [Vystavit příležitost →] [Jak to funguje →]
```

---

## 7. Components to create

Všechny v `components/web/` (server components default).

### 7.1 Nové komponenty (priority)

```
★★★ KRITICKÉ
EcosystemDiagram.tsx        { variant, focus?, highlightFlow? }
LiveStats.tsx               Server Component revalidate=60
ProductPillars.tsx          4 produkty grid
B2BSegmentSelector.tsx      4 cards s CTA na landing
EcosystemFooter.tsx         +Marketplace link, 4 sloupce

★★ DŮLEŽITÉ
DealStory.tsx               { storyId, variant }
ROICalculator.tsx           { type: 'dealership' | 'auticekar' }
HowItWorks.tsx              Generic 3-5 kroků
PricingTiers.tsx            3 cards
B2BPitch.tsx (alias B2BHero) Hero pattern
TestimonialsCarousel.tsx    10-12 recenzí (refaktor FIX-012)

★ NICE-TO-HAVE
EcosystemFAQ.tsx            Kategorizovaná Q&A
CaseStudy.tsx               Real case studies
OnboardingSteps.tsx         Numbered steps
```

### 7.2 Refactor existujících

```
Button.tsx    +variant 'tertiary' (ghost arrow), 'b2b' (midnight)
Card.tsx      +variant 'feature'
Badge.tsx     +variant 'new', 'specialty', 'enterprise'
```

### 7.3 Lib modules

```
lib/stories/pavel-kolin-jan-2026.ts
lib/case-studies/autobazar-brno.ts
lib/testimonials.ts                 10-12 reviews (FIX-012 seed)
lib/faq/{general,dealership,auticekar,investor}.ts
lib/calculators/roi.ts              + vitest testy
lib/stats.ts                        Prisma wrappers pro LiveStats
```

---

## 8. Design system tokens — Tailwind 4 / globals.css proposal

### 8.1 Patch pro `app/globals.css`

```css
:root {
  /* STÁVAJÍCÍ Orange + Gray ZACHOVAT */

  /* NOVÉ: MIDNIGHT PALETTE */
  --midnight-50:  #F4F6FB;
  --midnight-100: #E4E9F2;
  --midnight-200: #C5CFE0;
  --midnight-300: #94A3BE;
  --midnight-400: #5C7194;
  --midnight-500: #2D4669;
  --midnight-600: #1A2F52;
  --midnight-700: #0D1F3C;
  --midnight-800: #081530;
  --midnight-900: #040B1F;

  /* DATA VIZ */
  --data-investor: #6366F1;
  --data-broker:   #F97316;
  --data-shop:     #10B981;
  --data-listing:  #94A3BE;

  /* SHADOWS */
  --shadow-card: 0 1px 3px rgba(13,31,60,0.06), 0 1px 2px rgba(13,31,60,0.04);
  --shadow-elev: 0 8px 24px rgba(13,31,60,0.08), 0 2px 4px rgba(13,31,60,0.04);
  --shadow-pop:  0 24px 48px rgba(13,31,60,0.12), 0 8px 16px rgba(13,31,60,0.06);

  /* GRADIENTS */
  --gradient-hero: linear-gradient(180deg, #0D1F3C 0%, #1A2F52 100%);
  --gradient-orange-cta: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
}

@theme inline {
  --color-midnight-50: var(--midnight-50);
  /* ... všechny midnight levels ... */
  --color-data-investor: var(--data-investor);
  /* ... data viz ... */
  --font-display: 'Fraunces', Georgia, serif;
  --font-sans:    'Outfit', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;
}
```

### 8.2 Font loading v `app/layout.tsx`

```tsx
import { Outfit, Fraunces, JetBrains_Mono } from "next/font/google";

const outfit = Outfit({ subsets: ["latin", "latin-ext"], variable: "--font-sans-loaded" });
const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--font-display-loaded", axes: ["opsz"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-loaded" });
```

---

## 9. Build sequence — fáze pro implementátora

### Fáze 0 — Dev blockery (PARALELNĚ s Fází 1)
- F-019: Subdomény (inzerce/shop/marketplace) placeholder nebo full
- FIX-015: `/sluzby` 404 (implementátor už řeší)
- Audit broken menu links

### Fáze 1 — Quick copy/icon fixes ✅ HOTOVO
- FIX-010 až FIX-014 — commit `069446c`, deploy na sandboxu OK

### Fáze 2 — Visual refresh (design tokens)
- Týden 2: patch `globals.css`, font loading, refactor Button/Card/Badge
- **Žádné funkční změny**, pouze foundation

### Fáze 3 — Ekosystémová homepage
- Týden 3: ★★★ komponenty + `lib/stats.ts` + `lib/testimonials.ts` + nová `page.tsx`
- Backup stávající do `_legacy/homepage-broker.tsx`
- Feature flag volitelně

### Fáze 4 — B2B landing pages
- Týden 4: ★★ komponenty + `/pro-bazary`, `/pro-auticekare`, `/pro-investory` (minimální)
- Navigace dropdown "Pro koho"

### Fáze 5 — Polish + (optional) HUB migrace
- Týden 5–6: ★ nice-to-have, animace, Varianta A migrace pokud schválena

### Fáze 6 — Verifikace + launch
- Screenshoty desktop+mobile, e2e tests, Lighthouse, SEO audit
- Soft launch na sandboxu → production

---

## 10. Critical implementation details

### 10.1 Performance
- EcosystemDiagram: SVG inline <30KB, Framer Motion `pathLength` (HW accelerated).
- LiveStats: `revalidate: 60`, ne real-time.
- DealStory: lazy-loaded via `next/dynamic`.
- Fonty přes `next/font/google` + `latin-ext`.
- Obrázky `next/image` + Cloudinary.

### 10.2 Accessibility
- Lucide icons `aria-label` nebo `aria-hidden`.
- Diagram má sr-only text alternativu.
- Color contrast: midnight-700+white WCAG AAA.
- Keyboard nav: focusable nodes v diagramu.

### 10.3 Error handling
- LiveStats DB fail → "Pilotní fáze 2026". Nikdy fake čísla.
- Image fail → next/image blur placeholder.
- ROI Calculator input validation (no NaN/Infinity).

### 10.4 SEO
- Per-page `metadata` export (Title, Description, OG).
- JSON-LD: Organization, Service.
- next-sitemap pro automatickou generaci.

### 10.5 Analytics
- CTAs: `data-cta="pro-bazary-hero"` attributes.
- Events: `view_homepage`, `roi_calc_complete`, `b2b_form_submit`.

### 10.6 Security
- ROI Calculator — Zod validace client+server.
- B2B formuláře — rate limiting.
- CSP update pro Cloudinary.

### 10.7 Testing
- Unit: `roi.test.ts` (Vitest).
- Component: EcosystemDiagram, ROICalculator.
- E2E: Playwright scénáře.
- Visual regression: screenshoty před/po.

---

## 11. Risks & mitigations

| Risk | P | Impact | Mitigation |
|------|---|--------|------------|
| Live stats vrátí 0 v sandbox | H | M | "Pilotní fáze" fallback |
| Fraunces CZ diakritika | L | H | Test předem, Georgia fallback |
| EcosystemDiagram mobile perf | M | M | Static SVG na mobile |
| ROI Calculator nesmyslné výsledky | M | H | Unit testy + disclaimer |
| Subdomény nestihne dev | H | H | Coming Soon placeholder |
| Radim nesouhlasí s midnight | L | H | Screenshoty na sandbox před prod |
| SEO drop Varianta A | H | H | 301 redirects + monitoring |
| Pavel story etika | L | H | Disclaimer "Modelový případ" |

---

## 12. Success metrics

### 12.1 Krátkodobé (3 měsíce)
- Bounce rate < 50% (current ~70%)
- Time on page > 90s
- B2B submissions > 10/měs
- Lighthouse ≥ 90
- CWV all green

### 12.2 Dlouhodobé (6 měsíců)
- 5+ podepsaných autobazarů
- 3+ financovaní autíčkáři
- 2+ aktivní investoři
- Organic traffic +30%

---

## 13. Open questions for team-lead → Radim

1. **Varianta A vs C?** Doporučuji C s opcí na A za 6 měsíců.
2. **Pavel z Kolína** — reálný case nebo modelový s disclaimerem?
3. **Live stats fallback** — "Pilotní fáze 2026" nebo seed čísla?
4. **Subdomény deployment** — kdo a kdy?
5. **Foto knihovna** — máme studio fotky nebo iterace SVG?
6. **Marketplace MVP** — landing nebo coming-soon?
7. **B2B pitch deck** — PDF verze pro sales meetings?

---

## 14. References & inspiration

- **Carvago.com** — clean, data-driven, mid-luxury aesthetic.
- **Cars24** — tmavě modré + accent, mobile-first.
- **Auto1.com** — B2B remarketing platform.
- **Mototechna.cz** — český kontext, profi paleta.
- **Autorola.com** — B2B aukce dark mode.
- **Stripe.com** — serif headlines + sans body.
- **Linear.app** — dark hero + bright accent.
- **Vercel.com/enterprise** — segmentové CTAs.
- **Plaid — homepage** — "How money moves" diagram.
- **Brex — overview** — segmentová pitch.

---

## 15. Closing — next steps

1. **Team-lead** review + konfirmace s Radimem (otázky sekce 13).
2. **Plánovač** vytvoří AUDIT-028-plan.md s task breakdownem (sekce 9).
3. **Implementátor** začne Fází 0 (dev blockery) paralelně s Fází 2 (design tokens).
4. **Designer** iteruje copy v AUDIT-028c-copy-rewrite.md souběžně.
5. **Kontrolor** v každé fázi reviewuje screenshoty + Lighthouse + a11y.

**Verifikace dokumentu:** plánovač ověří zodpovídající wireframe v sekci 4–6 pro každou komponentu v sekci 7, a use-case v komponentech pro každý token v sekci 8.

---

**Konec dokumentu AUDIT-028b-ecosystem-strategy.md**
