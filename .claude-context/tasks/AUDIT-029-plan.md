# AUDIT-029 — Plán: B2B Pitch Deck PDF generování

**Datum:** 2026-04-14
**Autor:** Plánovač (READ-ONLY)
**Priorita:** P1 (B2B akvizice autobazarů — po MVP launch)
**Odhadovaná práce implementátora:** 2-3 dny
**Depends on:** AUDIT-028d-b2b-deck-outline.md (designer, ready), AUDIT-028 Fáze 2 (design tokeny `e1f91ea` — hotovo)
**Navazuje:** AUDIT-031 (email provider factory), AUDIT-026 (email flows)

---

## 0) Co je na vstupu

- **Designer hotov:** `AUDIT-028d-b2b-deck-outline.md` (22kB) — 10 slidů s headline, subhead, body content, visual direction, speaker notes, design tokens reference
- **Brand hotov:** FIX-022 commit `e1f91ea` (midnight + Fraunces + Outfit + orange-500 CTA, all tokens v `app/globals.css`)
- **Stack rozhodnutí:** HTML template + Playwright `page.pdf()` (primární), React-PDF (zamítnut — duplicitní stylesheet, Tailwind nefunkční)
- **Distribution:** Resend template + CRM trigger + tracking webhook

## 1) Architektura

### 1.1 File layout

```
app/api/pitch-deck/
  generate/route.ts           → POST endpoint, vrací { url, expiresAt }
  preview/[slug]/page.tsx     → HTML preview (headless Playwright renderuje tento URL)

components/pitch-deck/
  Slide01Cover.tsx
  Slide02Problem.tsx
  Slide03Insight.tsx
  Slide04Solution.tsx
  Slide05HowItWorks.tsx
  Slide06Ecosystem.tsx
  Slide07PavelCase.tsx
  Slide08RoiModel.tsx
  Slide09Trial.tsx
  Slide10NextStep.tsx
  DeckLayout.tsx              → A4 landscape container, shared typography
  DisclaimerBanner.tsx        → reused na S7/S8 (modelový scénář)
  EcosystemDiagramSvg.tsx     → static SVG (no Framer Motion v PDF)
  shared/PrintStyles.tsx      → @page rules, page-break-inside: avoid

lib/pitch-deck/
  template.ts                 → TemplateParams interface
  generator.ts                → renderToPdf(params) → Buffer
  placeholders.ts             → substituce [JMÉNO FIRMY], [email], [QR kód]

prisma/schema.prisma          → nové: PitchDeckGeneration model (audit log)
```

### 1.2 TemplateParams interface

```ts
// lib/pitch-deck/template.ts
export interface PitchDeckParams {
  // Personalizace (všechny optional — generický deck má placeholders)
  companyName?: string;           // "Autobazar Kolín s.r.o."
  contactPerson?: string;         // "Pan Novák"
  contactPersonRole?: string;     // "jednatel"
  salesRepName: string;           // required, obchodní zástupce CarMakléř
  salesRepEmail: string;          // required
  salesRepPhone: string;          // required
  bookingUrl?: string;            // Calendly link (z CRM)

  // Metadata
  deckDate: Date;                 // defaults to today
  language: 'cs' | 'sk';          // MVP: jen 'cs'
  version: 'v1.0';                // z deckOutline Versioning tabulky

  // Generické vs. personalizované
  mode: 'generic' | 'personalized';
}
```

### 1.3 Render pipeline (API route)

```ts
// app/api/pitch-deck/generate/route.ts (sketch)
export async function POST(req: Request) {
  const params = PitchDeckParamsSchema.parse(await req.json());
  const session = await getServerSession(authOptions);
  requireRole(session, ['ADMIN', 'BACKOFFICE', 'MANAGER']);

  // 1. Render HTML
  const slug = `${params.mode}-${params.companyName ?? 'generic'}-${Date.now()}`;
  const previewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/pitch-deck/preview/${slug}`;

  // 2. Persist params (cache pro preview route)
  await redis.set(`pitch-deck:${slug}`, JSON.stringify(params), 'EX', 600); // 10min TTL

  // 3. Playwright headless render
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(previewUrl, { waitUntil: 'networkidle' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    landscape: true,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();

  // 4. Upload to Cloudinary
  const upload = await cloudinary.v2.uploader.upload_stream({
    resource_type: 'raw',
    folder: 'pitch-decks',
    public_id: slug,
    format: 'pdf',
  });
  const url = upload.secure_url;

  // 5. Audit log
  await prisma.pitchDeckGeneration.create({
    data: {
      slug,
      params: params as any,
      url,
      generatedBy: session.user.id,
      mode: params.mode,
    },
  });

  return Response.json({ url, slug, expiresAt: addDays(new Date(), 30) });
}
```

### 1.4 Preview route (headless target)

```tsx
// app/api/pitch-deck/preview/[slug]/page.tsx
export default async function PitchDeckPreview({ params }: { params: { slug: string } }) {
  const json = await redis.get(`pitch-deck:${params.slug}`);
  if (!json) return <div>Expired</div>;
  const data = PitchDeckParamsSchema.parse(JSON.parse(json));

  return (
    <DeckLayout>
      <Slide01Cover {...data} />
      <Slide02Problem />
      <Slide03Insight />
      <Slide04Solution />
      <Slide05HowItWorks />
      <Slide06Ecosystem />
      <Slide07PavelCase />  {/* disclaimer banner uvnitř */}
      <Slide08RoiModel />   {/* disclaimer banner uvnitř */}
      <Slide09Trial />
      <Slide10NextStep {...data} />
    </DeckLayout>
  );
}
```

### 1.5 @page CSS rules

```css
/* components/pitch-deck/shared/PrintStyles.tsx */
@page {
  size: A4 landscape;
  margin: 0;
}
@media print {
  .slide {
    width: 297mm;
    height: 210mm;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
  }
  .slide:last-child { page-break-after: auto; }
  body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

## 2) Task breakdown

### Fáze 1 — Render infrastruktura (Day 1, ~6h)

| ID | Task | Effort |
|----|------|--------|
| T-029-001 | Install `playwright` (dependency existuje přes E2E), vendor chromium binary audit | 30min |
| T-029-002 | Vytvořit `DeckLayout.tsx` + `PrintStyles.tsx` (A4 landscape, @page, font loading pipeline) | 1h |
| T-029-003 | Vytvořit `preview/[slug]/page.tsx` route + Redis cache wrapper | 1h |
| T-029-004 | Vytvořit `/api/pitch-deck/generate` POST endpoint s Playwright renderem + Cloudinary upload | 2h |
| T-029-005 | Prisma migration: `PitchDeckGeneration` model (id, slug, params Json, url, generatedBy FK User, mode, createdAt, expiresAt) | 30min |
| T-029-006 | Zod schema `PitchDeckParamsSchema` v `lib/pitch-deck/template.ts` | 30min |
| T-029-007 | Placeholder substitution helper `substitutePlaceholders(template, params)` | 30min |

### Fáze 2 — Slide komponenty (Day 1-2, ~10h)

| ID | Task | Effort | Designer reference |
|----|------|--------|---------------------|
| T-029-008 | Slide01Cover (midnight-700 + logo placeholder + Fraunces H48 + orange 2px linka) | 45min | 028d §Slide 1 |
| T-029-009 | Slide02Problem (bílý, 4 řádky s Lucide ikonami TrendingDown/ChevronDown/MousePointerClick/UserMinus, orange accent čísla) | 1h | 028d §Slide 2 |
| T-029-010 | Slide03Insight (midnight-700 + bílá tabulka 4 řádky, success/danger deltas) | 1h | 028d §Slide 3 |
| T-029-011 | Slide04Solution (3 vertikální karty na midnight-700, Lucide Handshake/RefreshCw/LayoutDashboard, orange accent strip) | 1h | 028d §Slide 4 |
| T-029-012 | Slide05HowItWorks (3 horizontal bloky, velké watermark čísla Fraunces 48px, orange ArrowDown connectors, pill badge 5%) | 1h | 028d §Slide 5 |
| T-029-013 | Slide06Ecosystem (SVG 5-node diagram, data-viz barvy, static arrows) + `EcosystemDiagramSvg.tsx` | 2h | 028d §Slide 6 |
| T-029-014 | Slide07PavelCase (timeline + tabulka rozdělení, DisclaimerBanner nahoře) | 1.5h | 028d §Slide 7 |
| T-029-015 | Slide08RoiModel (tabulka Current vs CarMakléř, velké orange Fraunces 52px „71,8 mil. Kč/rok", DisclaimerBanner) | 1.5h | 028d §Slide 8 |
| T-029-016 | Slide09Trial (3 karty PILOT/STANDARD/ENTERPRISE, PILOT highlighted midnight + orange badge) | 1h | 028d §Slide 9 |
| T-029-017 | Slide10NextStep (midnight 2/3 + bílý panel 1/3 s kontakt + QR placeholder) | 1h | 028d §Slide 10 |
| T-029-018 | `DisclaimerBanner.tsx` reusable (graphite-50 bg, Outfit 11px italic, plná šířka) | 30min | 028d §S7+S8 |

### Fáze 3 — Distribution + tracking (Day 2-3, ~5h)

| ID | Task | Effort |
|----|------|--------|
| T-029-019 | Resend template `b2b-deck-delivery` (3 věty + link na `/pro-bazary`) | 1h |
| T-029-020 | Send flow: POST `/api/pitch-deck/send` s `{ companyName, email, contactPerson }` → generate → attach → Resend API | 1h |
| T-029-021 | Resend webhook handler `/api/webhooks/resend/pitch-deck` — update `PitchDeckGeneration.openedAt` / `clickedAt` | 45min |
| T-029-022 | Admin UI: `/admin/pitch-decks` tabulka s historií generace + status (generated, sent, opened, clicked) | 1.5h |
| T-029-023 | Admin UI: „Vygenerovat deck" form (company, contact, sales rep dropdown) s live preview iframe | 1h |
| T-029-024 | Pre-generovaný generic deck: cron `/api/cron/pitch-deck-regenerate` měsíčně + statický link na `/pro-bazary/download` | 45min |

### Fáze 4 — QA + edge cases (Day 3, ~3h)

| ID | Task | Effort |
|----|------|--------|
| T-029-025 | PDF velikost: ověř `< 2 MB` (Cloudinary q_auto,f_auto,w_800 pro embedded obrázky) | 30min |
| T-029-026 | Font subset check: Fraunces + Outfit pouze CS/SK glyphs (next/font auto-subset) | 30min |
| T-029-027 | Diacritic rendering: všechny texty s ěščřžýáíéůúťďň render správně | 30min |
| T-029-028 | Page-break test: žádný slide se nerozdělí mezi stránky | 30min |
| T-029-029 | Cross-browser preview: Chrome/Firefox/Safari headless render konzistentní | 30min |
| T-029-030 | E2E Playwright test `tests/e2e/pitch-deck.spec.ts`: generate → download → asserting PDF má 10 stránek + velikost | 30min |
| T-029-031 | Spam score check: Mail-tester.com (target: 9/10+) — subject + body + attachment analysis | 30min |

## 3) Designer reference — design tokens (z AUDIT-028d §Design tokens)

Implementátor používá **existující** tokeny z `app/globals.css` (FIX-022 `e1f91ea`):

- **Bg:** `--midnight-700: #0D1F3C`, `--midnight-800: #081530`, `--gray-50: #FAFAFA`, white
- **Accent CTA:** `--orange-500: #F97316`, hover `--orange-600: #EA580C`
- **Fonts:** Fraunces (600/700, tracking -0.02em) pro H1/H2, Outfit (400/500/600) pro body, JetBrains Mono pro čísla
- **Data-viz:** investor `#6366F1`, broker `#F97316`, shop `#10B981`, listing `#94A3BE`
- **Semantic:** success `#22C55E`, error `#EF4444`
- **Radius:** cards 14px, panels 20px, badges 6px
- **Shadow:** `--shadow-editor-card`, `--shadow-editor-elev`, `--shadow-editor-pop`

Žádné nové tokeny. Žádné nové fonty (Fraunces už načten přes `next/font/google`).

## 4) Acceptance criteria

### Generic deck (v1 bez personalizace)

- [ ] `GET /pro-bazary/download/carmakler-b2b-pitch-v1.pdf` vrací statický 10-slide PDF, velikost < 2 MB
- [ ] Všechny placeholders `[JMÉNO FIRMY]`, `[Kontakt]`, `[email]` jsou prázdné řádky nebo generický text („—")
- [ ] Diakritika (ěščřžýáíéůúťďň) rendering OK na všech slidech
- [ ] Modelové disclaimery viditelné na S7 + S8
- [ ] Ekosystém diagram (S6) se renderuje jako SVG (ne rastr)

### Personalizovaný deck (admin-triggered)

- [ ] `POST /api/pitch-deck/generate` s `{ mode: 'personalized', companyName: 'X', salesRepEmail: 'y@z.cz', ... }` vrací `{ url, slug, expiresAt }`
- [ ] Placeholdery na S1 a S10 jsou vyplněny firma + jméno + kontakt
- [ ] PDF download z URL funguje 30 dní, poté expiruje
- [ ] `PitchDeckGeneration` audit log záznam existuje

### Email distribution

- [ ] `POST /api/pitch-deck/send` s `{ slug, to, subject }` přes Resend odešle email s přílohou
- [ ] Resend webhook `email.opened` aktualizuje `PitchDeckGeneration.openedAt`
- [ ] Resend webhook `email.clicked` aktualizuje `PitchDeckGeneration.clickedAt` (link do `/pro-bazary`)
- [ ] Mail-tester.com spam score ≥ 9/10

### Performance

- [ ] PDF generation < 15s (Playwright launch ~3s + render ~2s + upload ~5s)
- [ ] API route timeout 30s (dostatek s rezervou)
- [ ] Redis cache `pitch-deck:{slug}` TTL 10 min = dostatek na render window

### Admin UX

- [ ] `/admin/pitch-decks` list zobrazuje všechny vygenerované decky + status
- [ ] Admin může downloadovat PDF + resend
- [ ] Admin formulář validuje Zod + vrací friendly errors

## 5) Risks & mitigation

| # | Risk | Impact | Probability | Mitigation |
|---|------|--------|-------------|------------|
| R1 | Playwright Chromium binary chybí v produkci (Vercel / pm2) | Blocker | Medium | Pre-install via `npx playwright install chromium` v Dockerfile / deploy hook; Vercel má `@sparticuz/chromium` fallback |
| R2 | PDF > 2 MB → blocked by mail filters | Medium | Low | Cloudinary image optimization + font subset; monitorovat avg size |
| R3 | Fraunces diacritic chybí v PDF embed | Medium | Low | `next/font/google` subset auto; fallback testů na Outfit pokud Fraunces selže |
| R4 | Preview route volaná bez auth — leak personalizovaných dat | High | Low | Preview route validuje Redis TTL + slug = nondeterministic UUID; generic deck public OK |
| R5 | Resend attachment limit 25 MB | Low | Impossible (naše PDF < 2 MB) | — |
| R6 | Spam filters (SPF/DKIM/DMARC) blokují | Medium | Medium | Depends on AUDIT-031 (Wedos SMTP) nebo Resend DKIM setup — cross-reference |
| R7 | QR kód placeholder nikdy nenahrazen → trapné v produkci | Low | Medium | `bookingUrl` required v `personalized` mode; generic deck má „odpovězte na email" instead |
| R8 | Číselná data (54 dní, 4-7%, 22%) zastarají → marketing claim inaccurate | Medium | Medium | Cron `pitch-deck-regenerate` měsíčně + admin dashboard „last data refresh" indicator |
| R9 | Playwright headless timeouts v produkci pod load | Medium | Low | Queue všech generací přes Bull/BullMQ (Redis queue), nikoli synchronní — budoucí refactor |
| R10 | Copy revize po launch → regenerace statického deck | Low | High | Versioning `v1.0 / v1.1 / v1.2` v slug; admin UI „Force regenerate all" akce |

## 6) Legal guardrails

- **S7 + S8 disclaimer (required, cannot be removed):** „Modelový scénář sestavený na základě typických parametrů. Skutečné výsledky závisí na stavu trhu, struktuře inventáře..." (plný text v AUDIT-028d §Slide 7-8 headers)
- **Žádné slovo „zaručeno", „jistý výnos", „garance zisku"** (B10 rozhodnutí od team-leada)
- **ROI čísla** jsou označena „modelový výpočet" s kurzívou a graphite-400 barvou
- **SČMSD / GfK zdroje** uvedené písemně — v případě audit nutná interní dokumentace zdroje (Radim ověří datové zdroje před launch)

## 7) Out of scope

- ❌ **v1.1 personalizace z CRM** — plánováno jako AUDIT-033 (pending)
- ❌ **v1.2 segment varianty** (autíčkář / investor) — plánováno jako AUDIT-033
- ❌ **v2.0 interaktivní HTML verze** s inline kalkulačkou — fáze 2 post-MVP
- ❌ **Multi-jazyk (SK, EN, DE)** — MVP pouze `cs`
- ❌ **A/B testing slidů** — příliš brzy, fáze 3
- ❌ **PowerPoint export** — Radim neřekl že chce, PDF je standardní B2B format

## 8) Interakce s ostatními AUDITy

- **AUDIT-028** (ekosystém LP): komponenty jako `EcosystemDiagramSvg` sdílené s homepage ES? → extract do `components/shared/EcosystemDiagram.tsx` pro DRY
- **AUDIT-031** (Wedos SMTP): `/api/pitch-deck/send` používá `getEmailProvider()` factory — dostane provider automaticky
- **AUDIT-026** (email deliverability): SPF/DKIM/DMARC setup je prerekvizita pro spam score ≥ 9/10
- **AUDIT-028c** (designer copy): ověř že všechny headlines/subheads z AUDIT-028d zůstanou po copywriting review designera

## 9) Deployment checklist

- [ ] `npx playwright install chromium` spuštěno v deploy hooku (ecosystem.config.js z AUDIT-003)
- [ ] Env vars: `RESEND_API_KEY`, `CLOUDINARY_URL`, `REDIS_URL`, `NEXT_PUBLIC_APP_URL`
- [ ] Prisma migrate deploy: `PitchDeckGeneration` table
- [ ] Cloudinary folder `pitch-decks/` vytvořen + lifecycle policy 90 dní retention
- [ ] Resend template `b2b-deck-delivery` published
- [ ] Static generic PDF first-time generate + upload → `/pro-bazary/download`
- [ ] Smoke test: admin v produkci vygeneruje deck pro sebe → email dorazí → PDF se otevře

---

**Verdict plánovače:** Kompletní blueprint, designer dodal vysoce strukturovaný outline. Implementátor má 31 tasků (cca 2-3 dny) rozdělených do 4 fází. Žádné open questions — všechno jde.

**Kritické:** T-029-001 (Playwright chromium install) + T-029-005 (Prisma migration) jsou **první** — blokují vše ostatní. Fáze 2 (10 slide komponent) je paralelizovatelná (1 komponenta = 1 agent).

Implementátor může začít ihned. AUDIT-029 je **post-MVP** (B8 rozhodnutí B2B deck ANO, ale ne blocker pro launch) — lze odsunout po AUDIT-024/028/031/027.
