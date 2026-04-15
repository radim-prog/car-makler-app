# FIX-049c Bundle Analyzer Findings

**Datum:** 2026-04-15
**Build:** `ANALYZE=true next build --webpack` (exit 0)
**Output:** `.next/analyze/{client,edge,nodejs}.html` (commited jen summary — HTMLy v .gitignore per `.audit-reports/`)

## Top client chunks (>50KB raw)

| Chunk | Raw | Pravděpodobný obsah | FIX target |
|-------|-----|---------------------|-----------|
| `96942-8b51e3f860009a96.js` | **424K** | Pravděpodobně framer-motion + recharts + další UI libs | **FIX-049a** (LazyMotion) |
| `79174-70674ab28485451f.js` | **360K** | Sentry + Prisma types + shared utils | **FIX-049b/f** (split investigation) |
| `4bd1b696-f21c412a1bcc7c6e.js` | 196K | Next.js router/RSC runtime | no-op |
| `framework-fc7406bf89a7dd05.js` | 188K | React + ReactDOM | no-op |
| `main-4d643c0da4ff73a4.js` | 148K | Next.js main | no-op |
| `67464-321066aacfce352e.js` | 120K | Possibly @stripe/stripe-js + NextAuth | **FIX-049f** (route-split Stripe) |
| `93006-e68d25f0b7281f52.js` | 112K | Likely lucide-react icons | **FIX-049b** (barrel) |
| `polyfills-42372ed130431b0a.js` | 112K | Browser polyfills | no-op |

**Celkem client chunks:** 8.5 MB uncompressed.

## Per-route analysis

Největší app-specific page chunky:
- `app/(web)/kolik-stoji-moje-auto/page-*.js` — 84K
- `app/(pwa)/makler/vehicles/[id]/page-*.js` — 84K

## Target priority (data-driven)

1. **FIX-049a (LazyMotion)** — potvrzeno, 96942 chunk 424K je prime suspect pro framer-motion bloat. Expected −200ms.
2. **FIX-049b (barrel)** — 93006 112K possibly lucide-react barrel. Tree-shake potential.
3. **FIX-049f (route-split)** — 67464 120K by neměl být v (web) routes pokud je to Stripe. Check if leaks.

## Proven negatives

- `@prisma/client` není detekovatelně v client bundle (good — server-only drženo)
- `@serwist/next` je ve správném PWA scope

## Acceptance ✅

- [x] `client.html` existuje (1.2MB, open v browseru pro deep dive)
- [x] `bundle-findings.md` top 5 targets s konkrétními chunks

**Per plánovač §2 FIX-049c:** discovery done, handoff to FIX-049a.

**Pozn.:** FIX-049 balík odložen na post-AUDIT-028 per team-lead directive — optimize přes neexistující B2B landings = waste.
