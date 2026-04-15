# AUDIT-035 — Plán: Design system dokumentace (Storybook vs MDX katalog)

**Datum:** 2026-04-15
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P2 (post-M1, ale přínos pro onboarding nového designera/dev)
**Odhadovaná práce implementátora:** 1 den (MDX) / 2-3 dny (Storybook)
**Depends on:** FIX-022 (editorial tokens) — done
**Paralelizovatelné s:** čímkoliv (nezávislý, nic nenaruší)

---

## 0) Motivace

**Carmakler má aktuálně:**
- 24 komponent v `components/ui/` (Button, Badge, Card, Input, Modal, Alert, Tabs, Toggle, Dropdown, ...)
- Bohatý design token systém v `app/globals.css:3-92` (orange + midnight paletty, shadow tiery, radius, gradients, layout vars)
- Komponenty s variants (Button: 6 variants × 3 sizes + icon mode)
- **ŽÁDNOU živou dokumentaci** — onboarding nového designera/dev vyžaduje čtení source kódu

**Problém:**
- Nový přispěvatel neví že existuje `<StatusPill variant="success">` — vytvoří vlastní div
- Designer netuší že má hex `#F97316` aliased jako `var(--orange-500)` → používá raw hex v Figma mocku
- Inkonzistence v buttonech napříč 40+ stránkami (FIX-046 brand konzistence story)

**Cíl AUDIT-035:** Vybudovat single-source-of-truth **design system katalog**:
- Renderuje každou komponentu se všemi variantami
- Zobrazí props API (TypeScript interface)
- Ukáže aktuální tokens (barvy, shadows, radii, typography)
- Copy-paste ready code snippets
- Accessible (a11y) a skrytý před veřejností (`/dev/design-system` za site password nebo NODE_ENV check)

## 1) Rozhodnutí: Storybook vs MDX katalog

### Option A — Storybook 8+

**Co je:** samostatný dev server (`npm run storybook`), React framework pro izolované komponenty, ekosystém addons (a11y, viewport, controls).

**Pros:**
- Industry standard, designer už zná z jiných projektů
- Addon-controls = UI pro interaktivní playground
- Addon-a11y = auto-check accessibility
- Plug-and-play pro publishing (Chromatic, Storybook Cloud)
- Testable jako `@storybook/test`

**Cons:**
- Samostatný build stack (Vite/webpack dle preference) — +150 MB node_modules
- Vlastní babel/swc config, může konfliktovat s Next.js
- Deploy = 2. buildpipeline (sandbox-docs? GitHub Pages?)
- RSC (React Server Components) Storybook support = beta, problematické pro Carmakler komponenty co používají server data
- Učící křivka pro MDX + stories syntax

**Effort:** 2-3 dny (setup + 24 komponent × `.stories.tsx` + tokens story + deploy)

### Option B — MDX katalog v Next.js App Router (doporučeno)

**Co je:** route `/dev/design-system/*` v existujícím Next.js projektu, MDX soubory v `app/dev/design-system/(...)/page.mdx`, live React komponenty inline.

**Pros:**
- **Zero new build stack** — používá existující `npm run dev`, Next.js App Router nativně zvládne MDX přes `@next/mdx`
- Sdílí Tailwind, tokens, všechny utilities
- Server Components zvládne přímo — real-world kontext
- Deploy "zadarmo" spolu s main appkou (path behind middleware auth)
- Jednoduchá navigace (Next.js Link)
- **Rychlejší onboarding pro dev** (stejná mentální mapa jako rest of app)

**Cons:**
- Bez interactive controls playground (musí se napsat manuálně s `useState`)
- Žádný auto-a11y check (lze doplnit axe-core devtool externě)
- Méně "wow factor" pro designery (zvyk na Storybook z jiných projektů)

**Effort:** 1 den (route + 4 MDX kategorií + showcases + token reference table)

### Verdikt plánovače: **Option B (MDX katalog)**

**Důvody:**
1. Carmakler je solo-ish projekt (1-2 dev, 1 designer) — Storybook overhead zbytečný
2. RSC komponenty v Carmakler (Header, Card s DB data) lépe renderovatelné v Next.js kontextu
3. Launch fokus je speed — 1 den vs 2-3 dny
4. Už existuje FIX-022 dokumentace v `.claude-context/design/` — MDX katalog ji může inlineovat
5. Post-launch lze stále upgradovat na Storybook pokud potřeba (komponenty zůstanou stejné)

Team-lead: pokud preferuje Storybook, sekce 3 má alternativní Option-A task breakdown.

## 2) File layout — Option B (MDX katalog)

```
app/dev/design-system/
├── layout.tsx              # shared nav sidebar + header + theme switcher
├── page.tsx                # landing (intro, credits, links to sub-pages)
├── tokens/
│   ├── page.tsx            # přehled všech tokens (barvy, shadows, radii, typography)
│   ├── colors/page.mdx     # color palette swatches (orange, gray, midnight, semantic, data-viz)
│   ├── typography/page.mdx # font-size scale, font-family (Outfit, Fraunces, JetBrains Mono)
│   ├── spacing/page.mdx    # radius tiery, shadow tiery, layout vars
│   └── gradients/page.mdx  # gradient previews
├── components/
│   ├── page.tsx            # index všech komponent
│   ├── button/page.mdx     # Button showcase (6 variants × 3 sizes + icon + disabled + loading)
│   ├── badge/page.mdx      # Badge
│   ├── card/page.mdx       # Card + StatCard
│   ├── input/page.mdx      # Input + Textarea + Select + Checkbox
│   ├── modal/page.mdx      # Modal
│   ├── alert/page.mdx      # Alert + StatusPill
│   ├── tabs/page.mdx       # Tabs
│   ├── dropdown/page.mdx   # Dropdown
│   ├── toggle/page.mdx     # Toggle + Checkbox
│   ├── pagination/page.mdx # Pagination
│   ├── empty-state/page.mdx
│   ├── progress/page.mdx   # ProgressBar
│   ├── charts/page.mdx     # RevenueChart + OrdersChart
│   ├── live-region/page.mdx
│   ├── trust-score/page.mdx
│   ├── platform-switcher/page.mdx
│   ├── search-overlay/page.mdx
│   └── stripe-status/page.mdx
├── patterns/
│   ├── page.tsx            # kombinované patterns
│   ├── hero/page.mdx       # editorial hero (midnight-700 + Fraunces)
│   ├── pricing-table/page.mdx
│   ├── testimonial/page.mdx
│   └── disclaimer-banner/page.mdx
├── icons/page.mdx          # Lucide-react icons reference + konvence
└── _components/            # pomocné helpery jen pro docs
    ├── Showcase.tsx         # wrapper s podlehnutým pozadím pro komponenty
    ├── PropsTable.tsx       # render TypeScript interface jako tabulku
    ├── CodeBlock.tsx        # highlight + copy-to-clipboard
    ├── ColorSwatch.tsx
    ├── ShadowCard.tsx
    └── TokenRow.tsx
```

### Access control

- Middleware check: `/dev/design-system/*` vyžaduje autentizaci **ADMIN** nebo **BACKOFFICE** role
- Alternativa: za `SITE_PASSWORD` (ale ten je pro celý web)
- Robots.txt disallow + `meta name="robots" content="noindex, nofollow"`
- Sitemap.ts exclude

## 3) Task breakdown (Option B)

### Phase 1 — Infrastructure (2h)

| ID | Task | Effort | Notes |
|----|------|--------|-------|
| T-035-001 | Install `@next/mdx` + `@mdx-js/react` + `@mdx-js/loader` + `remark-gfm` (GitHub-flavored markdown pro tabulky) | 15 min | Next.js 16 native MDX support |
| T-035-002 | `next.config.ts` — pluginit MDX (`withMDX(nextConfig)`), `pageExtensions: ["ts", "tsx", "mdx"]` | 15 min | |
| T-035-003 | Create `app/dev/design-system/layout.tsx` — sidebar nav, content area, breadcrumbs, theme toggle (světlý/editorial midnight) | 45 min | Uses existing Header pattern |
| T-035-004 | Middleware update — require ADMIN/BACKOFFICE pro `/dev/design-system/*` (soft redirect na `/login` s `callbackUrl`) | 15 min | — |
| T-035-005 | `robots.ts` + `sitemap.ts` — exclude `/dev/*` paths | 10 min | — |
| T-035-006 | Build helper components: `Showcase`, `PropsTable`, `CodeBlock`, `ColorSwatch`, `ShadowCard`, `TokenRow` v `app/dev/design-system/_components/` | 1h | PropsTable parsuje TS přes `typescript-json-schema` nebo manuální z interface string |

### Phase 2 — Tokens documentation (2h)

| ID | Task | Effort |
|----|------|--------|
| T-035-010 | `tokens/colors/page.mdx` — render všech `--orange-*`, `--gray-*`, `--midnight-*`, `--success-*`/`--error-*`/`--warning-*`/`--info-*`, `--data-*` swatches s hex + token name + usage guideline | 45 min |
| T-035-011 | `tokens/typography/page.mdx` — font families (Outfit default, Fraunces pro editorial H1, JetBrains Mono pro kód), font-size scale (12/13/15/17/20/28/36/48/72 px), letter-spacing, line-height guidelines | 30 min |
| T-035-012 | `tokens/spacing/page.mdx` — `--radius-*` (sm/md/lg/xl/2xl/full), `--shadow-editor-*` (card/elev/pop) showcase, `--sidebar-width`, `--header-height` layout vars | 30 min |
| T-035-013 | `tokens/gradients/page.mdx` — `--gradient-orange`, `--gradient-dark`, `--gradient-midnight`, `--gradient-hero-editor` visual previews 400×200px | 15 min |
| T-035-014 | `tokens/page.tsx` — landing tabulka všech CSS variables s hyperlinky na podstránky | 20 min |

### Phase 3 — Component showcases (24 komponent × ~20 min = 8h, paralelizovatelné)

Pro každou komponentu v `components/ui/`:

**MDX struktura:**
```mdx
# Button

Primární interaktivní element pro akce. Používá se pro CTAs, form submits, dialogs.

## Import
import { Button } from "@/components/ui/Button";

## Varianty
<Showcase>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="success">Success</Button>
  <Button variant="danger">Danger</Button>
</Showcase>

## Velikosti
<Showcase>
  <Button size="sm">Small</Button>
  <Button>Default</Button>
  <Button size="lg">Large</Button>
</Showcase>

## Icon-only
<Showcase>
  <Button icon><Plus /></Button>
</Showcase>

## Stavy
<Showcase>
  <Button disabled>Disabled</Button>
</Showcase>

## Props
<PropsTable component="Button" />

## Použití
- ✅ Primary CTA na stránce = jen **jeden** `variant="primary"`
- ✅ Destruktivní akce = `variant="danger"` + modal confirmation
- ❌ Neskládat 3+ outline buttonů vedle sebe (působí nerozhodně)
- ❌ `ghost` jen pro tercirérní akce (zrušit, zpět)

## Accessibility
- Focus ring automatically via tailwind defaults
- `disabled` state má `aria-disabled` automaticky
- Icon-only buttons potřebují `aria-label`
```

| ID | Komponent | Effort |
|----|-----------|--------|
| T-035-020 | Button | 25 min |
| T-035-021 | Badge + StatusPill | 20 min |
| T-035-022 | Card + StatCard | 20 min |
| T-035-023 | Input + Textarea + Select + Checkbox | 40 min |
| T-035-024 | Modal | 30 min |
| T-035-025 | Alert | 15 min |
| T-035-026 | Tabs | 20 min |
| T-035-027 | Dropdown | 20 min |
| T-035-028 | Toggle | 15 min |
| T-035-029 | Pagination | 15 min |
| T-035-030 | EmptyState | 15 min |
| T-035-031 | ProgressBar | 10 min |
| T-035-032 | RevenueChart + OrdersChart | 30 min (mock data) |
| T-035-033 | LiveRegion | 15 min |
| T-035-034 | TrustScore | 20 min |
| T-035-035 | PlatformSwitcher | 20 min |
| T-035-036 | SearchOverlay | 20 min (embed preview) |
| T-035-037 | StripeStatusBadge | 15 min |

**Subtotal:** 6h se zaokrouhlením. Paralelní s více implementátory → 2-3h real time.

### Phase 4 — Patterns & icons (2h)

| ID | Task | Effort |
|----|------|--------|
| T-035-040 | `patterns/hero/page.mdx` — editorial hero pattern (midnight-700 BG + Fraunces 48px + orange CTA) | 30 min |
| T-035-041 | `patterns/pricing-table/page.mdx` — 3-col pricing layout (Jarní Profi / Pavel modelový) | 30 min |
| T-035-042 | `patterns/testimonial/page.mdx` — avatar + quote + name/role layout | 20 min |
| T-035-043 | `patterns/disclaimer-banner/page.mdx` — žlutý banner ("Modelový scénář") | 15 min |
| T-035-044 | `icons/page.mdx` — Lucide-react reference (doporučené ikony pro brokery, platební, admin), import pattern, size guideline (16/20/24/32 px) | 25 min |

### Phase 5 — Landing + QA (1h)

| ID | Task | Effort |
|----|------|--------|
| T-035-050 | `app/dev/design-system/page.tsx` — landing s: CTA karty na 4 sekce (Tokens / Components / Patterns / Icons), version history (link do git log), principles (jak přispívat), Lucide-react install reminder | 30 min |
| T-035-051 | `components/page.tsx` — indexová tabulka všech 24 komponent s thumbnails, popisy, linky | 20 min |
| T-035-052 | Smoke test: `npm run build` clean; otevřít všechny podstránky manuálně, ověřit že Showcase vykresluje komponenty, PropsTable renderuje, CodeBlock copy funguje | 30 min |
| T-035-053 | README update v `components/ui/README.md` (pokud neexistuje, create) — pointer na `/dev/design-system` pro dev kontributory | 15 min |
| T-035-054 | Commit `📚 AUDIT-035: Design system MDX katalog` + push | 10 min |

**Total Phase 1-5:** ~15h sequential, **~6-8h real time s 2 paralelními implementátory** (komponenty jsou nezávislé).

## 4) Acceptance criteria

- [ ] `/dev/design-system` route funguje za ADMIN/BACKOFFICE auth, NE pro anonymous
- [ ] Všech 24 UI komponent má MDX stránku se Showcase + PropsTable + Usage guidelines + Accessibility notes
- [ ] Všech ~50 CSS tokens (colors, gradients, shadows, radii, typography) má swatches s hex hodnotou a copy-paste tokenem
- [ ] Search-friendly (Ctrl+F funguje, H1-H3 struktura)
- [ ] `robots.txt` vylučuje `/dev/*`, sitemap.ts taky, meta robots noindex
- [ ] Build pass: `npm run build` bez TypeScript errorů
- [ ] Lighthouse a11y ≥ 95 na `/dev/design-system` (Showcase komponenty mají landmark roles)
- [ ] Nový dev přečte README.md odkaz → `/dev/design-system` → za 5 min ví jak použít Button + Card + Modal

## 5) Props API extraction — jak renderovat PropsTable

**Problém:** `<PropsTable component="Button" />` potřebuje data.

**Možnosti:**
1. **Manuální data** v MDX (nejrychlejší, ale duplicate-of-truth):
   ```tsx
   <PropsTable rows={[
     { name: "variant", type: `"primary" | "secondary" | ...`, default: `"primary"`, description: "Vzhled buttonu" },
     ...
   ]} />
   ```
2. **Auto-extract** z TS interface pomocí `react-docgen-typescript` + build-time script:
   - Pros: žádná duplicita, zlé rename změna neprovede props table stale
   - Cons: +1 dev dependency, build-time komplikace
3. **`typescript` compiler API** custom script (`scripts/extract-props.ts`) → generuje `public/props/*.json` fixtures
   - Middle ground, čistší

**Doporučení:** Manuální v MVP (T-035-020..037 = 10 min navíc na komponentu). Auto-extract = follow-up FIX-048 po launch.

## 6) Risks & rollback

### R1 (low): Build size zvětšen o MDX
**Popis:** `@next/mdx` a stránky + ~50 showcase komponent zvětší bundle.
**Mitigation:** `/dev/design-system/*` je behind auth middleware → není v `generateStaticParams`, nepřidává do main bundle. Dynamic import Showcase komponent pokud potřeba.
**Rollback:** smazat `app/dev/` + revert `next.config.ts` MDX plugin.

### R2 (low): Token drift
**Popis:** Po přidání tokenu do `globals.css` vývojář zapomene update tokenu MDX → katalog lže.
**Mitigation:** Task T-035-012 má poznámku "Add to design-system/tokens". Commit hook (v budoucí AUDIT-Y) může kontrolovat.
**Rollback:** —

### R3 (medium): Komponenta s DB dependencies
**Popis:** Některé komponenty (StripeStatusBadge) mohou vyžadovat Partner data. Pure render v Showcase selže.
**Mitigation:** Showcase pouštíme s **mock props** — v Showcase wrapperu zobrazit všechny stavy (connected/disconnected/pending) s hard-coded partner objekty.
**Rollback:** označit komponentu "❌ not showcaseable" + odkaz na real usage v codebase.

### R4 (low): Middleware bypass
**Popis:** Pokud někdo přistoupí přes přímé URL + session NE platná → redirect smyčka.
**Mitigation:** Test T-035-052 ověří 401/302 pro non-ADMIN.
**Rollback:** odstranit middleware check, nechat public (design system není secret).

## 7) Option A — Storybook (alternativní task breakdown)

Pokud team-lead přesto chce Storybook:

| Phase | Task | Effort |
|-------|------|--------|
| A1 | `npx storybook@latest init` (Vite builder) | 30 min |
| A2 | Tailwind integration (`postcss` import v `.storybook/preview.ts`) | 30 min |
| A3 | Mock Next.js dependencies (`next/image`, `next/link`, `next-auth/react`) via `decorators` | 1h |
| A4 | 24 komponent × `.stories.tsx` (Button.stories.tsx, ...) | 6h |
| A5 | Token story (`tokens.stories.mdx` s swatches) | 1h |
| A6 | Setup `@storybook/addon-a11y`, `addon-viewport` | 30 min |
| A7 | Deploy přes GitHub Pages z `.github/workflows/storybook.yml` | 2h |
| A8 | `package.json` script `npm run storybook` | 5 min |

**Total:** ~11h = 2 dny. **+ dedikovaný deploy pipeline.**

## 8) Interakce s ostatními AUDITy

- **AUDIT-028 (Ekosystém LP + B2B):** designer's design tokens dokument vytvořený během AUDIT-028d již existuje v `.claude-context/design/` — MDX katalog jej konsoliduje jako **live reference**
- **AUDIT-034 (E2E test suite):** některé komponentové visual regression testy (T-034-070..080) mohou importovat showcase URL místo real routes pro stable screenshots
- **FIX-046 (brand konzistence CarMakléř):** MDX katalog má sloupec "Brand: CarMakléř" v typography sekci → contributor checker
- **AUDIT-029 (B2B Pitch Deck):** používá některé UI komponenty (Card, Badge) + vlastní Slide komponenty — katalog je zmíní v "Patterns" sekci

## 9) Out of scope

- ❌ Interactive controls playground (Storybook addon-controls substitute) — MVP bez
- ❌ Auto a11y scan — lze přidat v post-MVP přes `@axe-core/react` devtool
- ❌ Visual regression na katalog (screenshot test pro každou komponent story) — AUDIT-034 Phase 5 může pokrývat
- ❌ Public katalog na samostatné doméně (design.carmakler.cz) — post-M1 rozhodnutí
- ❌ Figma plugin pro sync tokens — future
- ❌ Dokumentace pro `components/web/*`, `components/pwa/*`, `components/admin/*` — jen `components/ui/` (generic), složitější komponenty = kolejní AUDIT

## 10) Reference

- Tailwind CSS 4 `@theme inline`: https://tailwindcss.com/docs/v4-beta
- `@next/mdx`: https://nextjs.org/docs/app/building-your-application/configuring/mdx
- Storybook 8 Next.js integration: https://storybook.js.org/docs/get-started/nextjs (alternativa)
- Carmakler tokens master: `app/globals.css:3-160`
- Existing components: `components/ui/*.tsx` (24 files)

---

**Verdict plánovače:** Low-risk, high-reward task pro onboarding a konsistenci. MDX katalog (Option B) = 1 den práce, žádné nové build pipeline, používá existující stack. Storybook (Option A) = 2 dny + vlastní deploy, ale designer friendlier.

Doporučení: **Option B** pro rychlost, reverzibilní na Storybook později.

Implementátor: start T-035-001 po schválení varianty team-leadem.
