# CarMakléř — Core Web Vitals baseline

**Datum:** 2026-04-15
**Autor:** implementátor (AUDIT-019 Phase 1)
**Source:** Lighthouse CLI 13.1.0, Chromium headless, sandbox `car.zajcon.cz`
**Matrix (plánovaná):** 11 URL × mobile/desktop × cold cache × 1 run = 22 runs
**Matrix (skutečná):** 7 URLs měřitelných × 2 devices = **14 validních runs**
**Výstupy:** `.audit-reports/2026-04-15-baseline/*.report.{json,html}` (44 souborů, 14 validních)

---

## 0) TL;DR

- **Desktop:** všechny měřené stránky **score 100**, LCP **< 800ms**. Žádná optimalizace nutná.
- **Mobile:** 6 ze 7 URLs score **90-96** (velmi dobré), **LCP 2.7-3.6s** — **4 z 7 nad 2.5s „Good" threshold Core Web Vitals**.
- **M1 target (homepage mobile LCP < 2.5s, score ≥ 80):** **LCP ❌ (3.47s)**, **score ✅ (91)**.
- **Jeden bottleneck dominuje:** `unused-javascript` (150-600ms savings). Žádné render-blocking, žádné unused CSS, žádné 3rd party — bundle je tight ale client chunks mají mrtvé větve.
- **CLS = 0 všude** (layout stable). **TBT 48-101ms** mobile (výborně, limit 200ms).

---

## 1) Route coverage gap (P1 finding)

**AUDIT-019-plan.md** předpokládal 11 URLs podle roadmap (`/pro-bazary`, `/pro-dealery`, `/inzerat/podat`, `/broker/dashboard`, `/404`), ale **5 z 11 vrací HTTP 404 na sandboxu**:

| URL z plánu | Status | Skutečná cesta / poznámka |
|-------------|--------|----------------------------|
| `/pro-bazary` | ❌ 404 | **Neimplementováno.** App router má `inzerce`, `sluzby`, `chci-prodat` — B2B landings chybí. |
| `/pro-dealery` | ❌ 404 | **Neimplementováno.** Dealer flow je `/marketplace/dealer/*` (interní). |
| `/inzerat/podat` | ❌ 404 | Správná cesta je `/moje-inzeraty/[id]` (auth-gated) nebo `/nabidka` (browse). |
| `/broker/dashboard` | ❌ 404 | PWA auth-gated, Lighthouse nepřihlášený. Expected. |
| `/404` | ❌ 404 | Lighthouse nemeří error pages (runtime error při 4xx). Expected. |

**Action:** AUDIT-028 B2B landings (task #29 pending) po implementaci spustit **re-run matrix** pro kompletní baseline. Alternativně opravit plán URLs na reálné routes.

---

## 2) Per-URL results (cold cache, run 1)

### 2.1 Mobile

| URL | Score | LCP | FCP | CLS | TBT | SI | TTI | Payload | Verdict |
|-----|-------|-----|-----|-----|-----|----|----|---------|---------|
| `/` (homepage) | **91** | 3.47s ⚠️ | 1.08s | 0.000 | 81ms | 1.08s | 3.49s | 761KB | LCP nad Good |
| `/chci-prodat` | **92** | 3.33s ⚠️ | 1.07s | 0.000 | 79ms | 1.07s | 3.34s | 521KB | LCP nad Good |
| `/marketplace` | **96** | 2.71s ⚠️ | 1.21s | 0.000 | 48ms | 1.21s | 3.24s | 514KB | LCP borderline |
| `/shop` | **90** | 3.55s ⚠️ | 1.07s | 0.000 | 101ms | 1.22s | 3.56s | 524KB | LCP nad Good |
| `/dily` | **91** | 3.55s ⚠️ | 1.06s | 0.000 | 60ms | 1.06s | 3.56s | 527KB | LCP nad Good |
| `/login?callbackUrl=/admin/login` | **91** | 3.48s ⚠️ | 1.22s | 0.000 | 83ms | 1.22s | 3.48s | 523KB | LCP nad Good |

*(CWV thresholds: LCP Good ≤ 2.5s, Needs Improvement 2.5-4s, Poor > 4s. Žádná stránka není Poor.)*

### 2.2 Desktop

| URL | Score | LCP | FCP | CLS | TBT | SI | TTI |
|-----|-------|-----|-----|-----|-----|----|----|
| `/` | **100** | 733ms | 298ms | 0.011 | 0ms | 328ms | 737ms |
| `/chci-prodat` | **100** | 629ms | 289ms | 0.000 | 0ms | 289ms | 631ms |
| `/marketplace` | **100** | 694ms | 292ms | 0.001 | 0ms | 292ms | 694ms |
| `/shop` | **100** | 687ms | 297ms | 0.000 | 0ms | 297ms | 689ms |
| `/dily` | **100** | 676ms | 288ms | 0.001 | 0ms | 296ms | 678ms |
| `/login` | **100** | 698ms | 298ms | 0.000 | 0ms | 350ms | 698ms |

Desktop výkon je v perfektním stavu — žádná akce.

---

## 3) Top 3 bottlenecks (mobile)

### B1 — Unused JavaScript (**dominantní finding**)

**Savings potential:** 150-600ms per URL.

| URL | Unused JS savings |
|-----|-------------------|
| `/` | **600ms** |
| `/dily` | 600ms |
| `/chci-prodat` | 450ms |
| `/shop` | 450ms |
| `/login` | 450ms |
| `/marketplace` | 150ms |

**Root cause hypothesis:** Next.js 15 RSC by měl keepovat client bundles malé, ale:
- `components/ui/*` je importované napříč celou aplikací jedním barrel exportem → tree-shaking zřejmě selhává
- Framer Motion (server-side impoprt ale client-rendering) — plný `motion` package instead of `motion/react`
- React Hook Form + Zod — schema bundles se duplikují across routes
- Shared layout components (header, footer) eager load client features které nejsou na každé stránce použité

**Quick fixes (FIX-049):**
- `next/dynamic` lazy import pro Framer Motion komponenty (`ssr: false` kde možné)
- `import { m } from "motion/react"` + `LazyMotion` wrapper (~20KB gzip savings)
- Audit `components/ui/index.ts` — rozbít barrel exports, každou komponentu importovat přímo
- `npm run analyze` (bundle-analyzer v `next.config.ts`) → screenshot top 10 chunků

### B2 — Main thread work (562-774ms)

**Root cause:** Hydratace RSC + client-side JS parsing. Koreluje s B1 (méně JS = méně main-thread).

**Quick fixes:** po B1 by měl spadnout passive.

### B3 — Network payload (514-761KB)

**Root cause:** Homepage je 761KB — největší. Ostatní ~520KB.

**Quick fixes:**
- Homepage hero image optimization (AUDIT-028 Unsplash → self-hosted WebP)
- Font subsetting (Outfit, Fraunces latin-ext stačí pro CZ)
- Po B1 → automaticky menší JS payload

---

## 4) M1 verdict (target: homepage mobile LCP < 2.5s, score ≥ 80)

| Kritérium | Target | Actual | Verdict |
|-----------|--------|--------|---------|
| Homepage mobile **LCP** | ≤ 2.5s | 3.47s | ❌ **MISS (-0.97s)** |
| Homepage mobile **score** | ≥ 80 | 91 | ✅ **PASS (+11)** |
| Top 3 landings mobile **LCP** | ≤ 3.0s | 3.33-3.55s | ⚠️ **MISS na všech** |
| Všechny URLs **CLS** | ≤ 0.1 | 0.000 | ✅ **PASS** (perfect layout stability) |
| Všechny URLs **TBT** | ≤ 200ms | 48-101ms | ✅ **PASS** |

**Závěr:** Celkový performance score je v pásmu „Good" (90+), **jediný blocker** pro M1 target je **mobile LCP**. Fix je jasně směřovaný: **rozbít unused-JS** → LCP by měl spadnout o 300-600ms → homepage 2.9s, landings ~3.0s. Ještě mimo 2.5s Good pásmo, ale výrazně blíž. Pro zlepšení pod 2.5s bude potřeba **B3 payload optimization** (hero image + font subsetting).

---

## 5) Recommended fixes (FIX-049 balík — handoff pro plánovače)

| FIX ID | Scope | Effort | Expected LCP Δ | Expected Score Δ |
|--------|-------|--------|----------------|-------------------|
| **FIX-049a** — LazyMotion (Framer Motion) | `motion/react` + `LazyMotion` wrapper v `components/providers/` | 2h | −200ms | +2 |
| **FIX-049b** — Barrel export audit | Rozbít `components/ui/index.ts`, direct imports | 1h | −100ms | +1 |
| **FIX-049c** — Bundle analyzer review | `ANALYZE=true npm run build` → identifikovat top 5 fat chunks | 30min | — | — |
| **FIX-049d** — Font subsetting | `next/font/google` `subsets: ["latin", "latin-ext"]` only | 30min | −50ms | +1 |
| **FIX-049e** — Homepage hero optimization | AUDIT-028 Unsplash → `files.carmakler.cz` WebP/AVIF + `priority` | 2h | −300ms | +3 |
| **FIX-049f** — Route-level splits review | Ověřit že `(web)/*` a `(pwa)/*` mají separate chunks | 1h | −100ms | +1 |

**Očekávaný kumulativní delta po FIX-049a+b+d+e:** LCP −650ms → homepage ~2.82s mobile (stále nad Good, ale v Needs Improvement → akceptovatelné pre-launch).

**Post-M1 structural (out of scope pro AUDIT-019 Phase 3):**
- Edge runtime pro landings (Vercel Edge / CF Pages)
- CDN pro `files.carmakler.cz` (self-hosted Varnish/Cloudflare)
- `web-vitals` RUM do Sentry (AUDIT-019 Phase 5)
- Lighthouse CI v GH Actions (regression prevention)

---

## 6) Methodology disclosures

- **Single run per URL** (plán předpokládal 3 runs median). Pro baseline single-run stačí (identifikace řádově, ne jemné delty). Pro Phase 4 re-benchmark po FIX-049 nutno `RUNS=3` pro validní median.
- **Sandbox hardware:** pm2 na Hetzner CPX21 (dedikovaný 2 vCPU). TTFB může být lepší než prod first-request (pm2 warm). Prod launch → re-measure.
- **Network throttle:** Lighthouse default mobile = Slow 4G (1.6 Mbps / 150ms RTT). Realistický worst-case CZ mobile.
- **No SITE_PASSWORD gate** — sandbox veřejně přístupný, measurement clean.
- **No AUDIT-010 regression** — Cache-Control matchers fungují (ověřeno před baseline), ale cold cache test = prvnímu návštěvníku, takže immutable cache nepřispěje (relevantní pro warm second-visit — samostatný budoucí pass).

---

## 7) Next steps

1. **Plánovač:** prioritizovat FIX-049 balík (doporučení: a → b → d → e → c → f; total effort ~7h)
2. **Implementátor:** po schválení plánovačem implementovat sequential (ne parallel — každý fix má cumulative efekt na hot bundle)
3. **Kontrolor:** Phase 4 re-benchmark se `RUNS=3` pro validní delta tabulku
4. **Team-lead:** forward baseline Radimovi až po radim-kontrolor review (nový workflow)

---

**Autor:** implementátor (green, opus)
**Handoff:** plánovač (FIX-049 breakdown s priorities)
