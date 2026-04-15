# AUDIT-028 — Exekuční plán: Ekosystémová homepage + B2B pozicování

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (strategický; odblokovat B2B pitch květen 2026)
**Odhadovaná práce implementátora:** 4–6 týdnů (3 dev-týdny čistě kódu, rezerva na iteraci copy + Radimovy revize)
**Zdroje:**
- `.claude-context/design/AUDIT-028a-design-findings.md` (designer recon)
- `.claude-context/design/AUDIT-028b-ecosystem-strategy.md` (designer strategy — 15 sekcí, 14 komponent, 6 fází)
- `.claude-context/tasks/AUDIT-003-plan.md` (Sentry v10 + CSP + pm2 — nezávislý)
- `.claude-context/tasks/AUDIT-007d-plan.md` (marketplace regulatorní halt — ovlivňuje `/pro-investory`)
- `.claude-context/tasks/AUDIT-024-erasure-plan.md` (GDPR F-032 — nezávislý)

**Depends on:**
- ✅ Fáze 1 (FIX-010..014) — HOTOVO (commit `069446c`)
- ✅ Varianta C — confirmed (team-lead 2026-04-14)
- ✅ Brand system shift — confirmed s kompromisem (team-lead 2026-04-14)

> **Poznámka:** Tento dokument nahrazuje předchozí strategický variant-analysis plán. Varianta C (hybrid homepage rewrite bez URL changes) je nyní baseline.

---

## 0) 🎯 ZÁVAZNÁ ROZHODNUTÍ (team-lead 2026-04-14 10:05)

Všech 10 blokerů rozhodnuto. Tato sekce má precedenci nad pozdějšími otázkami v tomto dokumentu.

### Brand identity

- **Jméno:** **CarMakléř** (s diakritikou) — jednotně napříč UI, nadpisy, meta tagy, e-maily, legal texts. Pryč s "CarMakler" / "Carmakler" mixem. Implementátor v T-028-016 emoji audit + brand name consistency grep (replace `Carmakler|CarMakler` → `CarMakléř`, vyjma file paths, env vars a package name).
- **Design aesthetic:** **Editorial B2B** (midnight #0D1F3C + Fraunces serif pro h1-h3 + Lucide ikony + zero emoji v UI) ✅ approved
- **Orange CTA zachován:** **`--brand-orange: oklch(0.7 0.18 50)` zůstává jako primary CTA accent** (kompromis brand recognition). Tzn. tlačítka "Poptat demo", "Spočítat ROI", "Registrovat se" = orange. Midnight dominuje backgrounds a typografii, orange drží funkční CTA role.

### Content decisions

- **Pavel z Kolína story:** **Modelový scénář s prominent disclaimerem** — box nad/pod story text: *„Modelový scénář, ne reálný klient. Po launchu nahradíme skutečnými case studies."* GDPR-safe, transparentní.
- **Live stats:** **„Pilotní fáze 2026"** placeholder dokud reálná data nenaběhnou. Žádná fake čísla.
- **Recenze:** **10-12 modelových** variabilních 4★/4.5★/5★ s disclaimerem „Ukázkové reference — reálné recenze doplníme po pilotní fázi". (Reálné Google recenze neexistují — to je OK, honest > fake.)
- **Case study partner:** **Modelový autobazar** v T-028-035 s disclaimerem.
- **Pricing tiers autobazary:** **Pilot / Standard / Enterprise** (default 3 tier struktura, featureset dodá designer v AUDIT-028c copy). Ceny: **"Od dohody" / „Kontaktujte nás"** CTA pattern — žádné hardcoded ceny do V1 (zamezí pricing-drift když se model změní).

### Foto strategy

- **SVG ilustrace primární** (midnight + orange paleta) — scalable, no licensing, fits editorial
- **Studio fotky pouze pro hero** (Škoda/VW/BMW CZ mainstream — max 3-6 fotek stačí)
- T-028-004 revidován: SVG jako main path, studio fotky as enhancement

### Marketplace

- **`marketplace.car.zajcon.cz` = Coming Soon + waitlist gate** (T-028-038 + FIX-020 od implementátora)
- **Existing flow ukryt za `?invite=TOKEN` query param** (invite-only beta)
- **Legal framework:** §1115 OZ spolumajitelský model (per AUDIT-007d Varianta B — legal escape od ČNB licence)
- **Live investor signup = PAUSED** dokud nedorazí právní review (externí blocker, mimo team)

### B2B pitch deck PDF

- **ANO, critical sales tool** → **nový AUDIT-029** (designer dodá outline + copy, implementátor pak React-PDF nebo HTML→print renderer)
- Out of scope pro AUDIT-028 samotný

### Timing

- **Homepage IHNED** (jakmile copy AUDIT-028c hotové) — marketing nezávislé na regulatorním rámci
- **Marketplace launch** čeká na legal → homepage aktivně směřuje na `/pro-investory` waitlist-only

### Email infrastructure

- **Primární:** Resend (API key awaiting)
- **Fallback:** Wedos SMTP → **AUDIT-031-plan.md** (samostatný plán, paralelně psán)
- Dev mode log = stávající behavior bez klíčů

---

## 1) Varianta A vs C — plánovač potvrzuje doporučení

Designer i plánovač doporučují **Variantu C (hybrid)**:
- `carmakler.cz/` = nová ekosystémová homepage (přepis `app/(web)/page.tsx`)
- Stávající landing pages (makléřský obsah, `/nabidka/*`, …) **zůstávají na existujících URL** — nulové SEO riziko, 40+ SEO LP intact
- Subdomény (inzerce/shop/marketplace) **paralelně jako placeholder**, později full

**Varianta A (full HUB rebuild s přesunem brokera na `/makler`)** je **Growth Phase 2** — zvážit po 6 měsících provozu s variantou C (A/B data, B2B submissions baseline).

**Alternativní návrh plánovače:** pokud Radim preferuje Variantu C s opcí na platformní subdomény (platforma.carmakler.cz), označ v odpovědi — plán se doplní o DNS + deployment tasky.

---

## 2) Paralelizace a worktree safety

### 2.1 Paralelně-spustitelné skupiny

| Skupina | Tasky | Proč paralelní | Worktree-safe? |
|---|---|---|---|
| **G1 — Blockery** | T-028-001..004 | Nezávislé soubory (subdomény placeholder, /sluzby, menu audit, Cloudinary upload) | ✅ Ano |
| **G2 — Design foundation** | T-028-010..012 | Patch jediného souboru každý (globals.css, layout.tsx, tailwind) | ⚠️ Sekvenčně — stejný commit |
| **G3 — Component refactor** | T-028-013..016 | Každý komponent v samostatném souboru | ✅ Ano, 3 worktrees |
| **G4 — Lib modules** | T-028-020..022 | `lib/stats.ts`, `lib/testimonials.ts`, `lib/stories/*.ts` — 3 izolované soubory | ✅ Ano, 3 worktrees |
| **G5 — Web komponenty** | T-028-023..028 | 6 komponent v `components/web/` — každý samostatný soubor | ✅ Ano, max 3 paralelní |
| **G6 — B2B LP komponenty** | T-028-031..035 | 5 komponent, izolované | ✅ Ano |
| **G7 — B2B LP stránky** | T-028-036..039 | 4 stránky v různých route groups | ✅ Ano |
| **G8 — Polish** | T-028-041..044 | Nezávislé | ✅ Ano |

### 2.2 Sekvenční blokery (co musí čekat)

```
G1 + G2 (paralelně, ale G2 před G3)
        ↓
G3 (Button/Card/Badge)
        ↓
G4 (lib modules) + G5 (web components) — paralelně
        ↓
T-028-029 (page.tsx homepage rewrite) — BLOKUJE VŠE dál
        ↓
G6 (B2B komponenty)
        ↓
G7 (B2B LP) + G8 (Polish) — paralelně
        ↓
T-028-050..056 (Verifikace + deploy)
```

---

## 3) Task breakdown

**Legenda:**
- **Effort:** S (<2h) / M (2-8h) / L (1-3 dny)
- **Prio:** P0 (blokuje) / P1 (core) / P2 (nice-to-have)
- **🔶 BLOCKED:** čeká na rozhodnutí Radima
- **⚡ PARALLEL:** lze paralelizovat s [task IDs]

---

### Fáze 0 — Dev blockery (paralelně s Fází 2)

#### T-028-001 — Subdomény placeholder (F-019)
- **Scope:** Vytvořit `inzerce.carmakler.cz` / `shop.carmakler.cz` / `marketplace.carmakler.cz` jako "Coming Soon" landing s waitlist formulářem (email capture do Prisma `WaitlistEntry` tabulky)
- **Soubory:** `middleware.ts` (rozšířit subdomain rewrite), `app/(web)/_placeholders/inzerce/page.tsx`, `.../shop/`, `.../marketplace/`, `prisma/schema.prisma` (+WaitlistEntry model), `app/api/waitlist/route.ts`
- **Depends on:** —
- **Effort:** M (4h)
- **Prio:** P0 (blokuje B2B pitch — potřebuje "ekosystém" vizuálně existuje)
- **⚡ PARALLEL:** T-028-002..004
- **Pozn:** Pokud Radim preferuje full subdomény launch → přesunout do AUDIT-030 (samostatný task)

#### T-028-002 — FIX-015 /sluzby 404 (tracking)
- **Scope:** Track-only — implementátor už řeší v jiném branchi
- **Soubory:** —
- **Depends on:** —
- **Effort:** — (již v práci)
- **Prio:** P1
- **Pozn:** Plánovač jen monitoruje completion před T-028-029 (homepage rewrite potřebuje všechny linky zelené)

#### T-028-003 — Audit broken menu links celoplošně
- **Scope:** Playwright script, který prochází hlavní menu + footer + všechny CTA, reportuje 404/500. Vstup pro T-028-040 (navigace redesign).
- **Soubory:** `scripts/audit-links.ts`, report do `.claude-context/audits/menu-links-{date}.md`
- **Depends on:** —
- **Effort:** S (1h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-001, 004

#### T-028-004 — Hero foto pipeline (Cloudinary)
- **Scope:** Nahrát 6-10 hero fotek (Škoda Octavia, VW Passat, BMW 3-series v CZ kontextu) do Cloudinary, definovat transformační presety (`hero-desktop-1920`, `hero-mobile-640`, `thumbnail-400`). Alternativně: 3 SVG illustration fallbacky v midnight+orange paletě.
- **Soubory:** `lib/cloudinary/presets.ts`, dokumentace v `.claude-context/assets/hero-photos.md`
- **Depends on:** —
- **Effort:** M (3h + asset sourcing)
- **Prio:** P1
- **🔶 BLOCKED on Radim decision:** fotky vs SVG illustration (designer Q5)
- **⚡ PARALLEL:** T-028-001..003

---

### Fáze 2 — Design tokens foundation

**🚨 Celá fáze BLOCKED dokud Radim neschválí brand shift (sekce 0).**

#### T-028-010 — Patch `app/globals.css` — midnight palette + tokens
- **Scope:** Přidat midnight-50..900 CSS variables, data-viz tokens (investor/broker/shop/listing), shadows (card/elev/pop/glow), gradients (hero/orange-cta). Zachovat existující orange + gray tokens.
- **Soubory:** `app/globals.css`
- **Depends on:** Radim brand approval
- **Effort:** S (1h)
- **Prio:** P0 (blokuje všechny komponenty)

#### T-028-011 — Font loading v `app/layout.tsx`
- **Scope:** Přidat `Fraunces` (axes: opsz, weights 500/600/700/900) + `JetBrains_Mono`, zachovat `Outfit`. CSS variables `--font-display-loaded`, `--font-mono-loaded`, `--font-sans-loaded`.
- **Soubory:** `app/layout.tsx`, volitelně `next.config.ts` (font optimization flags)
- **Depends on:** Radim brand approval
- **Effort:** S (30min)
- **Prio:** P0

#### T-028-012 — Tailwind 4 `@theme inline` registrace tokenů
- **Scope:** V `globals.css` `@theme inline { ... }` registrovat `--color-midnight-*`, `--color-data-*`, `--font-display`, `--font-mono`. Dovolí použít `text-midnight-700` / `bg-midnight-800` / `font-display` v JSX.
- **Soubory:** `app/globals.css` (druhý patch) nebo `app/theme.css`
- **Depends on:** T-028-010
- **Effort:** S (1h)
- **Prio:** P0

#### T-028-013 — Refactor `Button.tsx` — +variant `tertiary`, `b2b`
- **Scope:** Přidat `tertiary` (ghost s arrow icon) a `b2b` (midnight-700 bg + white text) variants. Zachovat `primary` (orange), `secondary`, `ghost`.
- **Soubory:** `components/ui/Button.tsx`
- **Depends on:** T-028-010..012
- **Effort:** S (1h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-014, 015, 016

#### T-028-014 — Refactor `Card.tsx` — +variant `feature`
- **Scope:** Nová varianta `feature` (border + shadow-elev + large padding + display font pro title slot).
- **Soubory:** `components/ui/Card.tsx`
- **Depends on:** T-028-010..012
- **Effort:** S (1h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-013, 015, 016

#### T-028-015 — Refactor `Badge.tsx` — +variant `new`, `specialty`, `enterprise`
- **Scope:** `new` (orange pill), `specialty` (midnight-100 bg), `enterprise` (gradient orange→midnight).
- **Soubory:** `components/ui/Badge.tsx`
- **Depends on:** T-028-010..012
- **Effort:** S (30min)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-013, 014, 016

#### T-028-016 — Emoji → Lucide audit + mapping
- **Scope:** Grep všech emoji v `app/(web)/**/*.tsx` + `components/web/**/*.tsx`. Výstup: mapping tabulka (designer v sekci 2.4 dal 15 mapování). Výsledek = task list pro T-028-029 (homepage rewrite) + T-028-036..039 (B2B LP).
- **Soubory:** `scripts/emoji-audit.ts`, report do `.claude-context/audits/emoji-inventory.md`
- **Depends on:** —
- **Effort:** S (1h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-013..015

---

### Fáze 3 — Ekosystémová homepage (CORE)

#### T-028-020 — `lib/stats.ts` — Prisma wrappers pro LiveStats
- **Scope:** 6 stat funkcí s `cache()` + fallback na "Pilotní fáze 2026":
  - `getSoldCount()` → `vehicle.count({ status: 'SOLD' })`
  - `getActiveBrokersCount()` → `user.count({ role: 'BROKER', status: 'ACTIVE' })`
  - `getActiveListingsCount()`
  - `getAvgDaysToSale()` → agregace nad `vehicle.soldAt - vehicle.createdAt`
  - `getGmv30d()` → sum `vehicle.salePrice` kde `soldAt > now - 30d`
  - `getAvgRating()` → `review.aggregate({ _avg: rating })`
- **Soubory:** `lib/stats.ts`, `lib/stats.test.ts` (vitest s mock Prismou)
- **Depends on:** —
- **Effort:** M (3h)
- **Prio:** P0 (LiveStats komponenta ji potřebuje)
- **⚡ PARALLEL:** T-028-021, 022

#### T-028-021 — `lib/testimonials.ts` — seed 10-12 variabilních recenzí
- **Scope:** Struktura: `{ id, authorName, authorPhotoUrl, vehicleBrand, vehicleModel, vehicleYear, rating (4 | 4.5 | 5), text, date, source: 'google'|'internal' }`. 10-12 reálně vypadajících recenzí (mix 4★/4.5★/5★, ne všechny perfect). Refaktor FIX-012 hardcoded recenzí.
- **Soubory:** `lib/testimonials.ts`
- **Depends on:** —
- **Effort:** M (2h — seed content)
- **Prio:** P1
- **🔶 BLOCKED on Radim input:** máme reálné Google recenze? Jinak modelové s disclaimerem.
- **⚡ PARALLEL:** T-028-020, 022

#### T-028-022 — `lib/stories/pavel-kolin-jan-2026.ts` — Pavel scrollytelling data
- **Scope:** 8 kroků timeline (Day 1 → Day 90) + ROI breakdown struktura. Disclaimer field `isModel: boolean`.
- **Soubory:** `lib/stories/pavel-kolin-jan-2026.ts`, `lib/stories/types.ts`
- **Depends on:** —
- **Effort:** M (2h — copy)
- **Prio:** P1
- **🔶 BLOCKED on Radim input:** reálný case vs modelový s disclaimerem (designer Q2)
- **⚡ PARALLEL:** T-028-020, 021

#### T-028-023 — `components/web/EcosystemDiagram.tsx` — SVG + Framer Motion
- **Scope:** SVG inline <30KB, nodes (Investor, Autíčkář, Autobazar, Makléř, Kupec, Shop, Díly zákazníci) + animované šipky (Framer Motion `motion.path` + `pathLength`). Props: `variant: 'full'|'compact'`, `highlightFlow: 'money'|'cars'|'data'`. Mobile: redukce na vertikální flow. A11y: sr-only text alternativa.
- **Soubory:** `components/web/EcosystemDiagram.tsx`, `components/web/EcosystemDiagram.svg.tsx` (paths extract)
- **Depends on:** T-028-010..012
- **Effort:** L (1.5 dne — design + animace + mobile)
- **Prio:** P0 (hlavní USP homepage)
- **⚡ PARALLEL:** T-028-024..028

#### T-028-024 — `components/web/LiveStats.tsx` — Server Component revalidate=60
- **Scope:** Server Component, 6 stat tiles (prodaných | makléřů | aktivních LP | průměr dní | obrat 30d | rating). Použije `lib/stats.ts`. Loading skeleton. Error → "Pilotní fáze 2026".
- **Soubory:** `components/web/LiveStats.tsx`, `components/web/LiveStats.skeleton.tsx`
- **Depends on:** T-028-020, T-028-010..012
- **Effort:** M (3h)
- **Prio:** P0 (proof density)
- **⚡ PARALLEL:** T-028-023, 025..028

#### T-028-025 — `components/web/ProductPillars.tsx` — 4 produkty grid
- **Scope:** 4 karty (Makléřská síť, Inzerce, Shop, Marketplace) s Lucide icon + headline + body + segment tags + CTA. Grid 2×2 desktop, stack mobile.
- **Soubory:** `components/web/ProductPillars.tsx`
- **Depends on:** T-028-014 (Card), T-028-010..012
- **Effort:** M (2h)
- **Prio:** P0
- **⚡ PARALLEL:** T-028-023, 024, 026..028

#### T-028-026 — `components/web/B2BSegmentSelector.tsx` — 4 segmenty cards
- **Scope:** 4 karty (Autobazary 100-200 vozů / Autíčkáři 5-15 vozů/měs / Investoři 500k-5M / Soukromí 1 vůz) s ikonou + pitch + CTA do landing pages.
- **Soubory:** `components/web/B2BSegmentSelector.tsx`
- **Depends on:** T-028-014, T-028-010..012
- **Effort:** M (2h)
- **Prio:** P0
- **⚡ PARALLEL:** T-028-023..025, 027, 028

#### T-028-027 — `components/web/DealStory.tsx` — Pavel scrollytelling
- **Scope:** Levá sloupec: 8-step timeline s sticky scroll. Pravá: vizuál (foto/čísla/graf). Finální ROI breakdown box (40/40/20 rozdělení). `next/dynamic` lazy load. Disclaimer "Modelový případ" pokud `isModel: true`.
- **Soubory:** `components/web/DealStory.tsx`, `components/web/DealStoryTimeline.tsx`, `components/web/ROIBreakdown.tsx`
- **Depends on:** T-028-022, T-028-010..012
- **Effort:** L (1 den)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-023..026, 028

#### T-028-028 — `components/web/EcosystemFooter.tsx` — 4 sloupce + Marketplace link
- **Scope:** 4 sloupce (Platforma | Pro koho | Zdroje | Společnost) + bottom bar (copyright, GDPR link, cookie preferences). Midnight-900 bg. Zastoupení všech 4 produktů včetně Marketplace (kde aktuální footer ho nemá).
- **Soubory:** `components/web/EcosystemFooter.tsx`
- **Depends on:** T-028-010..012
- **Effort:** M (3h)
- **Prio:** P0
- **⚡ PARALLEL:** T-028-023..027

#### T-028-029 — 🔴 HOMEPAGE REWRITE: `app/(web)/page.tsx`
- **Scope:** Nová homepage složená z komponent. Section flow S0..S12 per designer sekce 4.1:
  - S0 Sticky header (transparent → solid on scroll)
  - S1 Hero (midnight gradient, Fraunces h1, 3 B2B CTAs + ghost soukromí)
  - S2 `<EcosystemDiagram variant="full" />`
  - S3 `<ProductPillars />`
  - S4 `<B2BSegmentSelector />`
  - S5 `<DealStory storyId="pavel-kolin-jan-2026" />`
  - S6 `<LiveStats />` (rozšířená 6-tile)
  - S7 Featured cars 6× (existing `getFeaturedCars`, skryj pokud < 3)
  - S8 Top makléři (conditional existing FIX-013)
  - S9 `<TestimonialsCarousel />` (T-028-043)
  - S10 `<EcosystemFAQ />` (T-028-041)
  - S11 CTA band "Připojte se k ekosystému" + 4 segmentové CTAs
  - S12 `<EcosystemFooter />`
- **Backup:** Stávající `page.tsx` → `app/(web)/_legacy/homepage-broker.tsx` (pro quick revert + Varianta A růst phase 2)
- **Feature flag (volitelně):** `NEXT_PUBLIC_HOMEPAGE_V2=true` pro A/B
- **Soubory:** `app/(web)/page.tsx`, `app/(web)/_legacy/homepage-broker.tsx`, volitelně `lib/flags.ts`
- **Depends on:** T-028-023..028, T-028-020..022, T-028-010..015, T-028-041 (pokud S10 hotové), T-028-043
- **Effort:** L (1-1.5 dne — composition + copy refinement + responsive polish)
- **Prio:** P0 — **blokuje zbytek plánu**
- **Pozn:** Kontrolor provede screenshot diff před + po, Lighthouse baseline.

#### T-028-030 — Metadata + JSON-LD Organization/Service
- **Scope:** `export const metadata` v `app/(web)/page.tsx` (Title "CarMakler — Platforma pro celý životní cyklus auta" | Description | OG image). JSON-LD Organization + Service structured data pro Google rich results.
- **Soubory:** `app/(web)/page.tsx` (metadata export), `components/seo/OrganizationSchema.tsx`
- **Depends on:** T-028-029
- **Effort:** S (1h)
- **Prio:** P1

---

### Fáze 4 — B2B landing pages

#### T-028-031 — `components/web/ROICalculator.tsx` + `lib/calculators/roi.ts`
- **Scope:** Dva módy: `dealership` (input: měsíční obrat, prům. prodejní cena, doba obratu → output: dodatečný obrat, roční tržby, provize CM, net profit) a `auticekar` (input: kapitál, měsíční vozy, marže → output: ROI %, měsíční zisk, kumulativní po 12 měsících). Zod validace (client + server), sanity clamps (no NaN/Infinity). Disclaimer "Orientační kalkulace".
- **Soubory:** `components/web/ROICalculator.tsx`, `lib/calculators/roi.ts`, `lib/calculators/roi.test.ts` (vitest — edge cases: 0 input, negative, extreme values)
- **Depends on:** T-028-010..015
- **Effort:** L (1 den)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-032..035

#### T-028-032 — `components/web/HowItWorks.tsx`
- **Scope:** Generic `{ steps: Step[] }` props, 3-5 číslovaných kroků s ikonou + title + body. Responsive horizontal timeline desktop / vertical mobile.
- **Soubory:** `components/web/HowItWorks.tsx`
- **Depends on:** T-028-010..015
- **Effort:** M (2h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-031, 033..035

#### T-028-033 — `components/web/PricingTiers.tsx`
- **Scope:** 3 karty (Pilot / Standard / Enterprise) s feature list, highlighted "recommended" middle tier, CTA per tier.
- **Soubory:** `components/web/PricingTiers.tsx`
- **Depends on:** T-028-014, T-028-010..012
- **Effort:** M (2h)
- **Prio:** P1
- **🔶 BLOCKED on Radim input:** aktuální pricing model pro autobazary (fee struktura, enterprise minimum)
- **⚡ PARALLEL:** T-028-031, 032, 034, 035

#### T-028-034 — `components/web/B2BPitch.tsx` (alias B2BHero)
- **Scope:** Hero pattern pro `/pro-*` landing pages: eyebrow + serif h1 + body + trust signals + dual CTA + right-side visual/illustration slot. Props pro customizaci per segment.
- **Soubory:** `components/web/B2BPitch.tsx`
- **Depends on:** T-028-010..013
- **Effort:** M (3h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-031..033, 035

#### T-028-035 — `components/web/CaseStudy.tsx`
- **Scope:** Struktura: foto/logo partner + before/after metriky + quote + ROI highlight. Použití: `/pro-bazary` S4, `/pro-auticekare` S3.
- **Soubory:** `components/web/CaseStudy.tsx`, `lib/case-studies/autobazar-brno.ts`
- **Depends on:** T-028-014
- **Effort:** M (3h — komponenta + 1-2 seed case studies)
- **Prio:** P1
- **🔶 BLOCKED on Radim input:** máme reálného partnera autobazar pro case study, nebo modelový? (designer Q6)

#### T-028-036 — `app/(web)/pro-bazary/page.tsx`
- **Scope:** Kompletní landing page per designer sekce 6.1. Sekce: S1 `<B2BPitch type="dealership" />` / S2 `<HowItWorks steps={...} />` / S3 `<ROICalculator type="dealership" />` / S4 `<CaseStudy />` / S5 `<PricingTiers />` / S6 FAQ sekce / S7 CTA band. Metadata + JSON-LD.
- **Soubory:** `app/(web)/pro-bazary/page.tsx`, `app/(web)/pro-bazary/layout.tsx` (optional)
- **Depends on:** T-028-031..035
- **Effort:** L (1 den)
- **Prio:** P0 (B2B pitch květen 2026 primary target)

#### T-028-037 — `app/(web)/pro-auticekare/page.tsx`
- **Scope:** Kompletní landing per sekce 6.2. Sekce: S1 Hero / S2 Zjednodušený cyklus / S3 Pavel story full / S4 ROI kalk / S5 Ověření protokol / S6 Testimonials / S7 FAQ / S8 CTA.
- **Soubory:** `app/(web)/pro-auticekare/page.tsx`
- **Depends on:** T-028-031..035, T-028-027 (DealStory)
- **Effort:** L (1 den)
- **Prio:** P0

#### T-028-038 — `app/(web)/pro-investory/page.tsx` — **WAITLIST MODE**
- **Scope:** Minimální landing kvůli **AUDIT-007d regulatornímu HALT**:
  - Hero "Připravujeme marketplace pro kvalifikované investory"
  - Krátký pitch (model: spolumajitelství vozidel §1115 OZ, preferred model B per AUDIT-007d)
  - Waitlist formulář (email + investiční rozsah 500k-5M) → Prisma `WaitlistEntry`
  - **Disclaimer** (risk warning, regulatorní proces, „nejedná se o veřejnou nabídku investic")
  - ŽÁDNÉ „investujte teď" CTA dokud není hotový AUDIT-007d Fáze 1 compliance (KYC/AML/smlouvy/ZoKES statut)
- **Soubory:** `app/(web)/pro-investory/page.tsx`, `app/api/waitlist/investor/route.ts`
- **Depends on:** T-028-034, T-028-001 (WaitlistEntry model)
- **Effort:** M (3h)
- **Prio:** P0 — **blokuje launch homepage** (B2BSegmentSelector odkazuje na /pro-investory)
- **🔶 REGULATORY FLAG:** Copy review právníkem PŘED deploy — zajistit že disclaimery splňují ČNB/ZISIF/ECSP kontext

#### T-028-039 — `app/(web)/pro-makleri/page.tsx` — migrace stávajícího broker landing
- **Scope:** Varianta C — stávající makléřský obsah z homepage se přesune do dedikovaného `/pro-makleri` (kde dosud broker registrace). Buď rewrite existujícího landing, nebo nový blend. Cross-link z homepage B2BSegmentSelector.
- **Soubory:** `app/(web)/pro-makleri/page.tsx` (ověřit existuje), volitelně přesun obsahu
- **Depends on:** T-028-034
- **Effort:** M (3-4h)
- **Prio:** P1
- **Pozn:** Pokud `/pro-makleri` neexistuje, zkontrolovat `/makler/registrace`, `/stat-se-maklerem` — sjednotit URL.

#### T-028-040 — Navigace — dropdown "Pro koho" + mobile menu
- **Scope:** Hlavní nav přidá dropdown "Pro koho" (4 segmenty → LP). Mobile menu redesign (midnight bg, accordion). Aktivní state indikátor.
- **Soubory:** `components/web/Navigation.tsx`, `components/web/MobileMenu.tsx`
- **Depends on:** T-028-036..039 (URLs existují), T-028-010..013
- **Effort:** M (4h)
- **Prio:** P1

---

### Fáze 5 — Polish

#### T-028-041 — `components/web/EcosystemFAQ.tsx` + `lib/faq/*.ts`
- **Scope:** Kategorizovaná Q&A (general / dealership / auticekar / investor). Accordion (shadcn + Framer). Strukturovaná data `lib/faq/{general,dealership,auticekar,investor}.ts`. JSON-LD FAQ schema na homepage + LPs.
- **Soubory:** `components/web/EcosystemFAQ.tsx`, `lib/faq/*.ts`, JSON-LD integrace
- **Depends on:** T-028-010..014
- **Effort:** M (4h — komponenta + ~32 otázek content)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-042..044

#### T-028-042 — `components/web/OnboardingSteps.tsx`
- **Scope:** Numbered steps s progress bar (pro „Jak začít jako makléř/bazar/autíčkář/investor").
- **Soubory:** `components/web/OnboardingSteps.tsx`
- **Depends on:** T-028-010..015
- **Effort:** S (2h)
- **Prio:** P2
- **⚡ PARALLEL:** T-028-041, 043, 044

#### T-028-043 — `components/web/TestimonialsCarousel.tsx` refactor
- **Scope:** Refactor existing FIX-012 carousel na novou strukturu (`lib/testimonials.ts` data). Embla carousel, 3 cards per slide desktop / 1 mobile. Autoplay pause on hover. Star rating (supportuje 4 | 4.5 | 5).
- **Soubory:** `components/web/TestimonialsCarousel.tsx`
- **Depends on:** T-028-021, T-028-014
- **Effort:** M (3h)
- **Prio:** P1
- **⚡ PARALLEL:** T-028-041, 042, 044

#### T-028-044 — Framer Motion animace + scroll transitions
- **Scope:** EcosystemDiagram path animation on intersection observer. Hero headline fade-in + stagger. Section reveals (subtle). Respect `prefers-reduced-motion`.
- **Soubory:** Úpravy v jednotlivých komponent (EcosystemDiagram, Hero, DealStory)
- **Depends on:** T-028-023, T-028-027, T-028-029
- **Effort:** M (4h)
- **Prio:** P2
- **⚡ PARALLEL:** T-028-041..043

#### T-028-045 — (OPTIONAL) Varianta A migrace — Growth Phase 2
- **Scope:** Pokud Radim po 6 měsících chce full HUB rebuild (přesun broker obsahu na `/makler/*`):
  - `next.config.ts` `redirects()` — 301 mapping cca 50+ URL
  - Sitemap regenerace
  - Search Console monitoring
  - Canonical URL update
- **Soubory:** `next.config.ts`, `app/(web)/makler/*` (přesun z root)
- **Depends on:** T-028-056 (production launch V1) + 6 měsíců data + Radim GO
- **Effort:** L (1 týden)
- **Prio:** P3 — **NOT IN THIS SPRINT**, dokumentováno pro future

---

### Fáze 6 — Verifikace + launch

#### T-028-050 — Playwright E2E tests
- **Scope:** Scénáře:
  - Homepage → scroll skrz všechny sekce, diagram animuje
  - Homepage → klik "Pro autobazary" → LP loads → ROI kalk vyplní → submit (mock)
  - Homepage → klik "Pro autíčkáře" → LP loads → Pavel story scroll
  - Homepage → klik "Pro investory" → waitlist formulář funguje
  - Mobile: hamburger menu → dropdown segmenty
- **Soubory:** `e2e/homepage.spec.ts`, `e2e/b2b-landing.spec.ts`
- **Depends on:** T-028-029, 036..039
- **Effort:** M (4h)
- **Prio:** P0

#### T-028-051 — Lighthouse audit (mobile + desktop)
- **Scope:** Target ≥90 Performance/Accessibility/Best Practices/SEO. Core Web Vitals all green (LCP < 2.5s, INP < 200ms, CLS < 0.1). Baseline + post.
- **Výstup:** `.claude-context/audits/lighthouse-{date}.md`
- **Depends on:** T-028-029, 036..039
- **Effort:** S (1-2h)
- **Prio:** P0

#### T-028-052 — Accessibility audit (Axe + keyboard nav)
- **Scope:** Axe scan, keyboard-only navigation test (všechny CTAs dosažitelné, focus visible), screen reader (NVDA/VoiceOver) smoke. WCAG AA minimum (AAA kde midnight-700+white).
- **Soubory:** `.claude-context/audits/a11y-{date}.md`
- **Depends on:** T-028-029, 036..039
- **Effort:** M (3h)
- **Prio:** P0

#### T-028-053 — Visual regression (screenshots před/po)
- **Scope:** Playwright screenshot per breakpoint (mobile 375, tablet 768, desktop 1440, 4K 2560). Porovnat s backup `_legacy/homepage-broker.tsx`. Uložit do `.claude-context/screenshots/v2-launch/`.
- **Depends on:** T-028-029
- **Effort:** S (1h)
- **Prio:** P1

#### T-028-054 — SEO audit + Search Console baseline
- **Scope:** Metadata audit (Title/Description/OG per page), canonical URLs, robots.txt, sitemap.xml, hreflang (jen `cs-CZ`). Submit do Google Search Console. Baseline keyword rankings (carmakler brand, "prodej auta přes makléře", "autobazar platforma").
- **Výstup:** `.claude-context/audits/seo-baseline-{date}.md`
- **Depends on:** T-028-030, 036..039
- **Effort:** M (2-3h)
- **Prio:** P1

#### T-028-055 — Deploy sandbox + manuální QA checklist
- **Scope:** `scripts/deploy-sandbox.sh` push. Radim + team-lead projdou QA checklist (30+ položek: každá sekce homepage, B2B LPs, ROI kalk, waitlist submits, mobile menu, footer links, …).
- **Výstup:** `.claude-context/qa/audit-028-sandbox-{date}.md`
- **Depends on:** T-028-050..054
- **Effort:** M (2-3h + Radim čas)
- **Prio:** P0

#### T-028-056 — Production deploy (gated)
- **Scope:** Po schválení QA: pm2 restart prod. Monitoring Sentry errors první 24h. Search Console watch první týden. Rollback plán (revert commit `<backup_sha>` + pm2 restart).
- **Depends on:** T-028-055 + Radim GO
- **Effort:** S (30min + monitoring)
- **Prio:** P0

---

## 4) Blokery — tasky čekající na Radima

| # | Blocker | Task IDs dotčené | Proč blokuje |
|---|---|---|---|
| **B1** | 🚨 **Brand system shift ANO/NE/ČÁSTEČNĚ** | T-028-010 → BLOKUJE CELOU Fázi 2+ | Bez schválení implementátor nesmí sahat na design tokeny |
| **B2** | Varianta A vs C volba | T-028-029 copy, T-028-045 budoucí | Default C dokud neřekne jinak — soft blocker |
| **B3** | Pavel story reálný vs modelový | T-028-022, 027 | Copy + disclaimer závisí (designer Q2) |
| **B4** | Foto knihovna (studio vs SVG) | T-028-004, T-028-029 hero visual | Asset delivery gate (designer Q5) |
| **B5** | Reálné Google recenze vs modelové | T-028-021 | 10-12 testimonials content (designer Q3) |
| **B6** | Case study partner (autobazar Brno reálný?) | T-028-035 | Copy + foto + metriky (designer Q6) |
| **B7** | Pricing model autobazary | T-028-033 | Pilot/Standard/Enterprise tier features + ceny |
| **B8** | B2B pitch deck PDF | samostatný AUDIT-029 | Designer Q7 — není v tomto planu |
| **B9** | Subdomény full launch vs placeholder | T-028-001 | Placeholder default — plán pokračuje |
| **B10** | Investor LP regulatorní copy review | T-028-038 | Právník schvaluje disclaimery před deploy (AUDIT-007d) |

**Akční bod team-leada:** předat Radimovi **B1 (brand shift) jako první** — bez toho zamrzne celá Fáze 2+. Ostatní B2-B9 lze řešit souběžně během Fáze 2-3.

---

## 5) Worktree rozdělení pro paralelní práci

Doporučení pro implementátora (max 3 worktrees současně per CLAUDE.md):

**Worktree 1 — Design foundation:**
- T-028-010, 011, 012 sekvenčně
- pak T-028-013, 014, 015 paralelně (lze 3 sub-worktrees)
- T-028-016 samostatně

**Worktree 2 — Lib + stats:**
- T-028-020, 021, 022 paralelně

**Worktree 3 — Komponenty (po Fázi 2):**
- T-028-023..028 — rozdělit na 2-3 batch (max 3 paralelní)
- T-028-031..035 po T-028-029

**Sekvenční checkpoint:** T-028-029 (homepage rewrite) **nesmí běžet paralelně s ničím jiným** — je to kritický integrační commit všech předchozích komponent.

---

## 6) Acceptance criteria (celkové)

- [ ] Radim schválil brand shift (B1 resolved)
- [ ] Wireframe homepage S0-S12 plně implementován (T-028-029 merged)
- [ ] `/pro-bazary`, `/pro-auticekare`, `/pro-investory`, `/pro-makleri` existují a load
- [ ] ROI kalkulačka vrací realistická čísla (unit testy zelené, manuální ověření)
- [ ] EcosystemDiagram funguje desktop + mobile, a11y sr-only alternativa
- [ ] LiveStats čte z Prisma (ne hardcoded), fallback "Pilotní fáze" funguje
- [ ] Žádné emoji v `app/(web)/**` (grep audit clean)
- [ ] Lighthouse ≥90 všechny kategorie (mobile + desktop)
- [ ] Playwright E2E všechny scénáře zelené
- [ ] Search Console sitemap nové stránky indexuje
- [ ] Waitlist formuláře (subdomény + /pro-investory) ukládají do Prisma, email notif funguje
- [ ] Kontrolor sign-off screenshot diff + Lighthouse + a11y reporty

---

## 7) Out of scope (pro AUDIT-028)

- ❌ Full Varianta A (broker → `/makler/*` migrace s 301s) — Growth Phase 2, samostatný task po 6 měsících data
- ❌ Subdomény full launch (inzerce/shop/marketplace jako funkční produkty) — waitlist mode adekvátní
- ❌ Marketplace investor live flow — **REGULATORNĚ ZABLOKOVÁNO** per AUDIT-007d, pouze waitlist LP
- ❌ B2B pitch deck PDF — samostatný AUDIT-029 (marketolog + designer)
- ❌ AUDIT-028c copy rewrite — paralelní dokument designer dodá
- ❌ Další jazykové mutace (EN, DE) — CZ-only první verze
- ❌ Dynamic pricing pro PricingTiers — hardcoded tiers OK pro V1

---

## 8) Risk & open questions pro plánovače → team-lead

### Risk

| # | Risk | P | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Radim nesouhlasí s midnight + Fraunces, ale chce ekosystémovou narrativu | M | H | Flag B1 před startem; fallback = zachovat Outfit pro h1, přidat jen darker bg variant |
| R2 | Fraunces CZ diakritika render problem | L | H | Test font na sandbox před Fází 3; Georgia fallback ready |
| R3 | EcosystemDiagram mobile performance (Framer Motion) | M | M | Static SVG variant na mobile bez animation |
| R4 | B2B landing pages launch ale prázdné case studies (B3/B5/B6 unresolved) | H | M | "Coming soon" placeholder sekce + modelové s disclaimerem MVP |
| R5 | ROI kalkulačka produkuje nesmyslná čísla → ztráta B2B důvěry | M | H | Unit testy edge cases + disclaimer "Orientační" + Zod clamps |
| R6 | Subdomény waitlist bez follow-up CRM workflow = ztracené leady | M | M | T-028-001 zahrne email notif adminovi + Notion CRM sync (budoucí AUDIT) |
| R7 | Homepage V2 drop organic traffic (title změna) | M | H | Canonical zachovat, 301 not needed (stejná URL), Search Console monitoring |
| R8 | Production deploy bez Radim QA = reputační risk B2B pitch | L | H | T-028-055 hard gate na Radimovo GO |

### Open questions pro team-leada

1. **B1 (brand shift)** — nejdůležitější. Máme pushovat Radimovi rozhodnutí ihned, nebo počkat až bude volný? Každý den bez odpovědi = další den zdržení Fáze 2.
2. **Subdomény budget** — T-028-001 počítá s placeholder waitlist. Pokud Radim chce full launch (inzerce/shop jako funkční produkty), to je AUDIT-030 samostatný 2-3 týdenní projekt.
3. **AUDIT-028c copy rewrite** — designer dodá paralelně. Kdy checkpoint review copy před T-028-029 (homepage)?
4. **Kontrolor kapacita** — Fáze 6 má 4 audity (E2E, Lighthouse, a11y, visual). Kdo je má drát — kontrolor paralelně nebo sekvenčně s blokací T-028-056?
5. **Marketolog zapojení** — SEO baseline (T-028-054), JSON-LD, keyword strategy — potřebujeme marketologův input před T-028-030/054?

---

## 9) Souhrn pro team-leada

- **40 tasků** rozdělených do 6 fází
- **~3 dev-týdny** čistého kódu, celkem **4-6 týdnů** s iteracemi + Radim QA
- **10 blokerů** na Radimovo rozhodnutí (B1 kritický)
- **6 fází** s jasnými checkpoints
- **Paralelizace:** Fáze 0+2 paralelně, G3-G4 paralelně, G5 v batch 3x, Fáze 4 po T-028-029
- **Varianta C** (hybrid homepage rewrite, bez URL changes) — potvrzeno designer + plánovač
- **Brand shift FLAG** jako P0 gate — **nemůže začít Fáze 2 bez Radim schválení**
- **AUDIT-045 Growth Phase 2** (Varianta A migrace) dokumentováno jako future decision po 6 měsících

**Verdict plánovače:** Strategie je solidní, execution risk je střední (velká vizuální změna + 14 nových komponent). Největší success lever = Radim rychle odpoví na B1 (brand shift). Bez toho celý plán zamrzne a B2B pitch květen 2026 slipuje.

**Ready for implementation handoff po resolved B1.**

---

**Konec dokumentu AUDIT-028-plan.md**
