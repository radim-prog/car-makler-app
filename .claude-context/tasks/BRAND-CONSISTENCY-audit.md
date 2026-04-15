# BRAND CONSISTENCY AUDIT — F-046
**Autor:** radim-kontrolor  
**Datum:** 2026-04-15  
**Finding:** F-046 (C1 LAUNCH BLOCKER)  
**Závazné znění:** `CarMakléř` (háček na é, velké C, velké M) — rozhodnutí 0a

---

## Shrnutí

| Varianta | Počet | Status |
|---------|-------|--------|
| `CarMakléř` (správně) | 289× | ✅ |
| `CarMakler` (chybí háček) | ~147× | 🔴 |
| `Carmakler` (chybí háček + špatná velká písmena) | ~35× | 🔴 |
| `carmakler` technická (DB, storage keys, domény) | ~50× | ✅ OK |

**Celkem porušení:** ~182× ve ~40 souborech user-facing kódu.

---

## KATEGORIE 1 — KRITICKÁ: Právní dokumenty (🔴 LAUNCH BLOCKER)

Tyto stránky jsou legally binding, musí být opraveny PŘED launchem.

### `app/(web)/ochrana-osobnich-udaju/page.tsx` — 6× `CarMakler`
- L10 meta description
- L12 title
- L14 breadcrumb description
- L22 structuredData name
- L24 structuredData description
- L27 structuredData name

### `app/(web)/zasady-cookies/page.tsx` — 3× `CarMakler`
- L9 description
- L11 title
- L12 description

### `app/(web)/gdpr/page.tsx` — 4× `CarMakler`
- L9 meta description
- L11 title
- L13 breadcrumb description
- L36 body copy: "Tato stránka popisuje zpracování osobních údajů na platformě CarMakler"

### `app/(web)/reklamacni-rad/page.tsx` — 8× `CarMakler`
- L10 meta description
- L12 title
- L14 breadcrumb description
- L22 structuredData name
- L24 description
- L27 name
- L68 body copy: "e-shopu CarMakler"
- L176 body copy: "CarMakler zajišťuje koordinaci"

---

## KATEGORIE 2 — KRITICKÁ: E-mailové šablony a SMS (🔴 LAUNCH BLOCKER)

Odesílány zákazníkům, porušení brand = podvod vůči zákazníkovi.

### `app/api/invitations/route.ts` — 5× `Carmakler`
- L118 fallback string: `"Carmakler"` (manager name)
- L123 email subject: `"Pozvanka do Carmakler"`
- L127 email HTML h1: `<h1>Carmakler</h1>`
- L131 email body: `"manazer ... vas zve do maklerskesiti Carmakler"`
- L144 email footer: `"Tento email byl odeslan ze systemu Carmakler"`

### `app/api/payments/webhook/route.ts` — 2× `Carmakler`
- L92 email subject: `"Potvrzení platby | Carmakler"`
- L93 email body: `"Děkujeme za nákup přes Carmakler"`

### `app/api/payments/[id]/confirm/route.ts` — 2× `Carmakler`
- L92 email subject: `"Potvrzení platby | Carmakler"`
- L93 email body: `"Děkujeme za nákup přes Carmakler"`

### `components/pwa/contacts/SmsTemplates.tsx` — 1× `Carmakler`
- L18 SMS šablona: `"Jsem {makler} z Carmakler."`

---

## KATEGORIE 3 — VYSOKÁ: SEO meta tituly a OG tagy (~90× `CarMakler`)

Ovlivňuje prezentaci ve výsledcích vyhledávání a sociálních sítích. 30+ stránek se opakujícím vzorem.

**Postižené stránky (všechny mají shodný vzor `— CarMakler` v titulku):**

- `app/(web)/nabidka/kabriolet/page.tsx` + SUV, kombi, elektromobily, hybrid (body types)
- `app/(web)/nabidka/praha/page.tsx` + brno, ostrava, plzen, olomouc, liberec, hradec-kralove, ceske-budejovice (cities)
- `app/(web)/nabidka/skoda/page.tsx` + audi, bmw, volkswagen, ford, renault, seat, mercedes-benz, peugeot, dacia, toyota, mazda, citroen, opel, kia (brands)
- `app/(web)/nabidka/skoda/fabia/page.tsx` + octavia, kodiaq, superb, bmw/3-series, vw/golf, vw/passat, ford/focus, audi/a4, toyota/yaris, kia/ceed (models)
- `app/(web)/nabidka/do-100000/page.tsx` + do-200000, do-300000, do-500000, do-1000000 (price ranges)
- `app/(web)/jak-prodat-auto/page.tsx` — 10+ výskytů v title, body, FAQ
- `app/(web)/kolik-stoji-moje-auto/page.tsx` — title + body copy
- `app/(web)/nabidka/[slug]/page.tsx` — dynamické stránky inzerátů

**Vzor opravy (stejný pro všechny):** `— CarMakler` → `— CarMakléř`

---

## KATEGORIE 4 — STŘEDNÍ: Komponenty a UI texty

### `components/web/ModelLandingContent.tsx` — 6× `CarMakler`
- L69 title prop
- L112 H2: "Proč koupit ojeté X na CarMakler?"
- L117, L129, L133, L135 body copy

### `components/web/BrandLandingContent.tsx` — 5× `CarMakler`
- L70 title prop
- L122 H2: "Proč koupit ojeté X na CarMakler?"
- L125, L136, L144 body copy

### `components/web/PriceCalculator.tsx` — 3× `CarMakler`
- L11 FAQ answer: "certifikovaného makléře CarMakler"
- L15 FAQ answer: "certifikovaným makléřem CarMakler"
- L23 FAQ answer: "S makléřem CarMakler"

### `components/web/OrderForm.tsx` — 1× `CarMakler`
- L172: "v sídle CarMakler v Praze"

### `components/web/listing-form/Step6Preview.tsx` — 1× `Carmakler`
- L198: "Požadována pomoc makléře Carmakler"

### `components/web/listing-form/Step5PriceContact.tsx` — 1× `Carmakler`
- L179 label: "Chci pomoc od makléře Carmakler"

### `components/pwa/VehicleTimeline.tsx` — 1× `Carmakler`
- L61 H3: "Historie na Carmakler"

### `components/pwa/SettingsContent.tsx` — 1× `Carmakler` (user-facing)
- L383: "všech vašich dat uložených v systému Carmakler"
- (L64 filename: `carmakler-data-export` — technické, OK)

### `components/pwa/onboarding/TrainingSlides.tsx` — 2× `Carmakler`
- L15 slide title: "Jak funguje Carmakler"
- L18 slide body: "Carmakler propojuje prodejce"

### `components/pwa/AiAssistant.tsx` — 1× `Carmakler`
- L294: "cenotvorby nebo procesů Carmakler"

### `components/pwa/contracts/steps/PreviewStep.tsx` — 2× `Carmakler`
- L58: "Carmakler s.r.o." (smluvní strana — KRITICKÉ!)
- L137: "Carmakler s.r.o. Finální text podmínek"

### `components/pwa/contracts/ContractPreview.tsx` — 1× `Carmakler`
- L72: "Carmakler" (contract header)

### `components/partner/PartnerLayout.tsx` — alt atributy
- L99, L157: `alt="CarMakler"` — alt text (střední priorita)

---

## KATEGORIE 5 — STŘEDNÍ: API routes a AI

### `app/api/assistant/chat/route.ts` — 2× `Carmakler`
- L95 system prompt: "v platformě Carmakler"
- L101 system prompt: "Procesů a postupů v Carmakler"

### `app/api/feeds/import/run/route.ts` — 1× `Carmakler`
- L57 User-Agent header: "Carmakler Feed Importer/1.0"

### `app/llms.txt/route.ts` — 6× `Carmakler`
- L17, L21, L27, L30, L49, L55 (AI crawler response — vidí to AI crawleři)

### `app/(web)/notifikace/[token]/page.tsx` — 1× `Carmakler`
- L8 title: "Nastaveni notifikaci | Carmakler"

### `app/(partner)/partner/documents/page.tsx` — 3× `Carmakler`
- L5 title: "Dokumenty | Carmakler Partner"
- L20, L27 document descriptions

### `app/(partner)/partner/billing/page.tsx` — 1× `Carmakler`
- L72 label: "Provize Carmakler"

### `app/prezentace/page.tsx` — multiple× `Carmakler`
- Partner prezentační stránka (celá stránka)

---

## KATEGORIE 6 — TECHNICKÁ (ACCEPTABLE, bez opravy)

Tyto výskyty jsou záměrné technické identifikátory, nesmí se měnit:

| Výskyt | Soubor | Důvod |
|--------|--------|-------|
| `carmakler.cz` | všechny | doménové jméno |
| `carmakler_sandbox`, `carmakler` | CLAUDE.md | DB jméno |
| `carmakler_compare` | CompareContext.tsx | localStorage key |
| `carmakler-install-dismissed` | InstallPrompt.tsx | localStorage key |
| `carmakler-offline` | lib/offline/db.ts | IndexedDB name |
| `carmakler-dily-sablona.csv` | CsvImport.tsx | filename |
| `carmakler-data-export-*.json` | SettingsContent.tsx | filename |
| `carmakler-eshop` | ZasilkovnaWidget.tsx | Zásilkovna API identity |
| `CarmaklerDB` | lib/offline/db.ts | TypeScript interface name |

---

## Prioritizace oprav

### Stupeň 1 — BLOCKER před launchem (implem. hned)
1. **Právní dokumenty** (GDPR, cookies, OOP, reklamační řád) — 4 soubory, ~21 výskytů
2. **E-mailové šablony** (invitations, payments) — 3 soubory, ~9 výskytů
3. **SMS šablona** (SmsTemplates.tsx) — 1 výskyt
4. **Smlouvy** (PreviewStep.tsx, ContractPreview.tsx) — 2 soubory, 3 výskyty

### Stupeň 2 — Opravit tentýž sprint
5. **Nabídka landing pages SEO titles** — 30+ souborů, hromadný find+replace `— CarMakler` → `— CarMakléř`
6. **Sdílené komponenty** (ModelLandingContent, BrandLandingContent, PriceCalculator) — 3 soubory

### Stupeň 3 — Do 48h
7. **PWA komponenty** (VehicleTimeline, SettingsContent, TrainingSlides, AiAssistant)
8. **Partner stránky** (documents, billing, prezentace)
9. **API/AI routes** (assistant chat, llms.txt, feeds User-Agent)

---

## Doporučená opravná strategie

Hromadná náhrada přes `sed` nebo find+replace v IDE:

```bash
# Oprava CarMakler → CarMakléř (NE v technických identifikátorech)
# Spustit v /app a /components:
grep -rl "CarMakler" app/ components/ lib/ | xargs sed -i 's/CarMakler/CarMakléř/g'

# Pak selektivně vrátit technické výskyty pokud se omylem přepsaly:
# (žádné technické výskyty s CarMakler nejsou — jsou pouze Carmakler nebo carmakler)

# Oprava Carmakler → CarMakléř:
grep -rl "Carmakler" app/ components/ lib/ | xargs sed -i 's/Carmakler/CarMakléř/g'

# POZOR: po hromadné náhradě zkontrolovat:
# 1. Carmakler s.r.o. → CarMakléř s.r.o. (správně)
# 2. carmakler.cz → nesmí se změnit (lowercase + .cz domain)
# 3. carmakler_ storage keys → nesmí se změnit
```

**POZOR:** `carmakler.cz` domény nesmí být dotčeny — lowercase `carmakler` před `.cz` je technická hodnota, ne brand copy.

---

## Soubory vyžadující manuální kontrolu po hromadné náhradě

- `components/pwa/contracts/steps/PreviewStep.tsx` — `Carmakler s.r.o.` → správně `CarMakléř s.r.o.`
- `app/api/assistant/chat/route.ts` — system prompt (otestovat že AI asistent funguje po změně)
- `app/api/invitations/route.ts` — e-mailové šablony jsou hardcoded HTML bez háčků — opravit také `"Pozvanka"` → `"Pozvánka"`, `"maklerskesiti"` → `"makléřské síti"` (pravopis)

---

## Stav C1 v LAUNCH-CHECKLIST

**C1:** 🔴 LAUNCH BLOCKER — ~182 porušení brand v ~40 souborech  
**Fix ID:** FIX-046 (nový)  
**Kdo:** implementátor (hromadný sed + manuální review) → kontrolor verify  
**Odhad:** 2-4h práce implementátora (hlavně masová náhrada + review)
