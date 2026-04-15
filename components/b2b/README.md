# B2B landing components — Designer handoff

**Autor:** Designer lane (FIX-036, 2026-04-15)
**Pro:** Implementátor — integrace do budoucí landing page `/pro-autickare`
**Copy reference:** `.claude-context/design/AUDIT-028c-copy-rewrite.md` §2.3–2.4
**Design tokens:** FIX-022 (midnight paleta, Fraunces, JetBrains Mono, data-broker #F97316, data-investor #6366F1)

---

## Co je v této složce

### `PavelStory.tsx`
Self-contained React server component renderující modelový scénář autíčkáře Pavla:

1. **Disclaimer banner** (žlutý, povinný nad sekcí) — "Modelový scénář…"
2. **Hero** — kicker, Fraunces H2, sub-claim, 4-metrická band (balíková cena / kapitál / horizont / hrubý zisk)
3. **Capital-flow SVG** — editorial flow diagram: Tomáš (investor, indigo) → Pavel (autíčkář, orange) → 3 výstupy (makléři, koncoví zákazníci, Shop) → agregovaný zisk 534 000 Kč
4. **Timeline** — 8 kroků (Den 1 → Den 85–90), každý s inline Lucide SVG ikonou, Fraunces titulkem, body textem a KPI number. Per-krok akcent: broker (oranž) / investor (indigo) / shop (zelená) / default (midnight)
5. **Finální rozdělení** — 3 persona karty (Pavel 293 600 Kč • Tomáš 213 600 Kč / ROI 40,7 % • Platforma 242 800 Kč včetně makléřských provizí)
6. **Footer disclaimer** (povinný, pod celou sekcí)

### `pavelStoryStyles.ts`
Scoped CSS pod `.pavel-scope` prefixem. Používá CSS variables z globals.css s fallback hodnotami, takže komponenta funguje i mimo Next.js app scope (např. v Storybooku nebo standalone render pipelinech).

---

## Použití

```tsx
// app/(web)/pro-autickare/page.tsx (existuje-li; jinak vytvořit)
import { PavelStory } from "@/components/b2b/PavelStory";

export default function ProAutickarePage() {
  return (
    <main>
      {/* Hero, value proposition, specs… */}
      <PavelStory />
      {/* ROI kalkulačka (AUDIT-028c §2.4), ověřovací protokol, waitlist */}
    </main>
  );
}
```

Props jsou minimální — komponenta je self-contained:

```ts
interface PavelStoryProps {
  headingId?: string;   // default: "pavel-story" (používáno pro aria-labelledby)
  className?: string;   // volitelný wrapper override
}
```

---

## Co zbývá (implementátor, ne designer)

1. **Vytvořit page** `app/(web)/pro-autickare/page.tsx` s full AUDIT-028c copy (hero, value props, `<PavelStory />`, ROI kalkulačka, ověřovací protokol, waitlist formulář, FAQ, legal disclaimers).
2. **ROI kalkulačka** (AUDIT-028c §2.4) — interaktivní client component (`"use client"`) s React Hook Form + Zod. Default hodnoty: 10 vozů/měsíc, 270 000 Kč, 20 % marže, 90 % kapitálu od investora.
3. **Waitlist formulář** (AUDIT-028c §2.6) — napojit na `/api/waitlist` endpoint (FIX-020 gated flow).
4. **SEO meta** — title/description/OG image dle AUDIT-028c §6.3.
5. **Legal review** kompletní stránky před publikací — ČNB fráze explicitně vyloučit.

---

## Verifikace (Designer zajistil)

- [x] `npx tsc --noEmit` clean
- [x] Všechny texty v souladu s AUDIT-028c §2.3 (čísla, disclaimery, §1115 OZ reference, 40/40/20 split)
- [x] Inline SVG ikony (bez runtime dep na lucide-react)
- [x] Scoped CSS (`.pavel-scope`) — nekoliduje s Tailwind / globals
- [x] Responsive breakpoint 880px (mobile timeline stacking, metric-strip 2×2)
- [x] Aria: `role="note"` na disclaimer, `role="img"` na flow SVG s detailním `aria-label`, `aria-labelledby` na hlavním section, `aria-hidden` na dekorativních ikonách
- [x] Brand: „CarMakléř" s diakritikou (AUDIT FIX-046 compliance)

---

## FIX-LOG reference

F-047 FIX-036: B2B Pavel modelový scénář — editorial illustration + timeline komponent (Designer, 2026-04-15).
Navazuje na FIX-035 (B2B pitch deck), sdílí design tokeny FIX-022.
