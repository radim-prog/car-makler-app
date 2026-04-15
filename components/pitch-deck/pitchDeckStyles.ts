// AUDIT-028d — B2B Pitch Deck CSS tokens (Designer lane, 2026-04-15)
//
// Scoped styles for PitchDeckTemplate. Aligned s FIX-022 tokens v
// app/globals.css (midnight paleta, Fraunces, orange CTA, data-viz).
// Prefix .deck-scope chrání před konflikty s Tailwindem v preview URL.
//
// Pozor: všechny selektory MUSÍ být pod .deck-scope, aby nebyla narušena
// marketing landing pages když admin preview renderuje deck vedle ostatních
// komponent v Next kontextu. Při Puppeteer renderu je .deck-scope root.

export const DECK_CSS = `
:root {
  --deck-midnight-50:  #F4F6FB;
  --deck-midnight-100: #E4E9F2;
  --deck-midnight-200: #C5CFE0;
  --deck-midnight-300: #94A3BE;
  --deck-midnight-400: #5C7194;
  --deck-midnight-500: #2D4669;
  --deck-midnight-600: #1A2F52;
  --deck-midnight-700: #0D1F3C;
  --deck-midnight-800: #081530;
  --deck-midnight-900: #040B1F;

  --deck-gray-50:  #FAFAFA;
  --deck-gray-100: #F4F4F5;
  --deck-gray-200: #E4E4E7;
  --deck-gray-300: #D4D4D8;
  --deck-gray-400: #A1A1AA;
  --deck-gray-500: #71717A;
  --deck-gray-600: #52525B;
  --deck-gray-700: #3F3F46;
  --deck-gray-800: #27272A;
  --deck-gray-900: #18181B;

  --deck-orange-400: #FB923C;
  --deck-orange-500: #F97316;
  --deck-orange-600: #EA580C;

  --deck-success-500: #22C55E;
  --deck-error-500:   #EF4444;

  --deck-investor: #6366F1;
  --deck-broker:   #F97316;
  --deck-makler:   #F97316;
  --deck-buyer:    #94A3BE;
  --deck-shop:     #10B981;

  --deck-font-display: "Fraunces", Georgia, serif;
  --deck-font-sans:    "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --deck-font-mono:    "JetBrains Mono", ui-monospace, monospace;

  --deck-shadow-card: 0 1px 3px rgba(13,31,60,0.06), 0 1px 2px rgba(13,31,60,0.04);
  --deck-shadow-elev: 0 8px 24px rgba(13,31,60,0.08), 0 2px 4px rgba(13,31,60,0.04);
  --deck-shadow-pop:  0 24px 48px rgba(13,31,60,0.12), 0 8px 16px rgba(13,31,60,0.06);

  --deck-slide-w: 297mm;
  --deck-slide-h: 210mm;
  --deck-pad:     22mm;
}

@page { size: A4 landscape; margin: 0; }

.deck-scope, .deck-scope * { box-sizing: border-box; }

.deck-scope {
  margin: 0;
  padding: 0;
  font-family: var(--deck-font-sans);
  color: var(--deck-gray-900);
  background: var(--deck-gray-100);
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.deck-scope .slide {
  width: var(--deck-slide-w);
  height: var(--deck-slide-h);
  padding: var(--deck-pad);
  background: #ffffff;
  position: relative;
  page-break-after: always;
  break-after: page;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.deck-scope .slide:last-of-type { page-break-after: auto; }

@media screen {
  .deck-scope {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
  }
  .deck-scope .slide {
    box-shadow: var(--deck-shadow-pop);
    border-radius: 6px;
  }
}

.deck-scope .slide-dark { background: var(--deck-midnight-700); color: #ffffff; }
.deck-scope .mono { font-family: var(--deck-font-mono); font-feature-settings: "tnum"; }
.deck-scope .accent { color: var(--deck-orange-500); }
.deck-scope .underline { text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1.5px; }

.deck-scope .slide-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18mm;
  font-family: var(--deck-font-sans);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--deck-gray-500);
}
.deck-scope .slide-header.inverted { color: var(--deck-midnight-200); }
.deck-scope .eyebrow-line { display: inline-block; width: 36px; height: 1px; background: var(--deck-orange-500); }
.deck-scope .eyebrow-text { font-weight: 600; }
.deck-scope .eyebrow-brand {
  margin-left: auto;
  font-weight: 500;
  color: var(--deck-gray-400);
  font-family: var(--deck-font-display);
  font-style: italic;
  text-transform: none;
  letter-spacing: 0;
  font-size: 13px;
}
.deck-scope .slide-header.inverted .eyebrow-brand { color: var(--deck-midnight-300); }

.deck-scope .slide-headline {
  font-family: var(--deck-font-display);
  font-weight: 700;
  font-size: 38px;
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 0 0 10px 0;
  max-width: 78%;
  color: var(--deck-midnight-800);
}
.deck-scope .slide-headline.inverted { color: #ffffff; }
.deck-scope .slide-subhead {
  font-family: var(--deck-font-sans);
  font-size: 17px;
  font-weight: 400;
  color: var(--deck-gray-600);
  margin: 0 0 30px 0;
  max-width: 72%;
  line-height: 1.4;
}
.deck-scope .slide-subhead.inverted { color: var(--deck-midnight-200); }
.deck-scope .slide-source {
  margin-top: auto;
  padding-top: 14px;
  font-size: 10.5px;
  color: var(--deck-gray-400);
  line-height: 1.5;
  border-top: 1px solid var(--deck-gray-100);
}
.deck-scope .slide-source.inverted {
  color: var(--deck-midnight-300);
  border-top-color: rgba(255,255,255,0.08);
}

.deck-scope .disclaimer-bar {
  background: var(--deck-gray-50);
  border-left: 3px solid var(--deck-orange-500);
  color: var(--deck-gray-600);
  font-size: 11px;
  line-height: 1.55;
  padding: 10px 14px;
  margin: -8px -8px 14px -8px;
  font-style: italic;
  border-radius: 4px;
}
.deck-scope .disclaimer-bar strong { color: var(--deck-midnight-700); font-style: normal; }

/* SLIDE 1 — COVER */
.deck-scope .slide-cover {
  background: var(--deck-midnight-700);
  color: #ffffff;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 20mm 22mm;
}
.deck-scope .cover-top { display: flex; justify-content: flex-start; }
.deck-scope .cover-logo-img { height: 32px; }
.deck-scope .cover-logo-text {
  font-family: var(--deck-font-display);
  font-weight: 900;
  font-size: 26px;
  letter-spacing: -0.03em;
  color: #ffffff;
}
.deck-scope .cover-main { display: flex; flex-direction: column; justify-content: center; max-width: 82%; }
.deck-scope .cover-headline {
  font-family: var(--deck-font-display);
  font-weight: 700;
  font-size: 54px;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin: 0 0 26px 0;
  color: #ffffff;
}
.deck-scope .cover-accent-line { width: 120px; height: 2px; background: var(--deck-orange-500); margin-bottom: 22px; }
.deck-scope .cover-subhead { font-size: 18px; color: var(--deck-midnight-200); margin: 0; font-weight: 400; }
.deck-scope .cover-footer {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 32px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.1);
  color: var(--deck-midnight-200);
  font-size: 12px;
}
.deck-scope .cover-footer-label {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 10px;
  color: var(--deck-midnight-300);
  margin-bottom: 4px;
}
.deck-scope .cover-footer-value { color: #ffffff; font-weight: 500; font-size: 13px; }
.deck-scope .cover-footer-meta { margin-top: 2px; font-size: 11px; color: var(--deck-midnight-300); }
.deck-scope .cover-footer-right { text-align: right; }

/* SLIDE 2 — PROBLEM */
.deck-scope .problem-rows { display: flex; flex-direction: column; gap: 18px; max-width: 85%; }
.deck-scope .problem-row {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 18px;
  align-items: start;
  padding: 14px 0;
  border-bottom: 1px solid var(--deck-gray-100);
}
.deck-scope .problem-row:last-child { border-bottom: 0; }
.deck-scope .problem-icon {
  color: var(--deck-midnight-400);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}
.deck-scope .problem-claim { font-size: 17px; font-weight: 600; color: var(--deck-gray-900); line-height: 1.4; margin-bottom: 4px; }
.deck-scope .problem-detail { font-size: 14px; color: var(--deck-gray-500); line-height: 1.5; }

/* SLIDE 3 — INSIGHT */
.deck-scope .insight-panel {
  background: #ffffff;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: var(--deck-shadow-elev);
  margin-bottom: 18px;
  max-width: 92%;
}
.deck-scope .insight-table { width: 100%; border-collapse: collapse; font-size: 14px; color: var(--deck-gray-800); }
.deck-scope .insight-table thead tr { background: var(--deck-midnight-700); color: #ffffff; }
.deck-scope .insight-table thead th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.deck-scope .insight-table th.col-year, .deck-scope .insight-table th.col-delta { text-align: right; }
.deck-scope .insight-table tbody td { padding: 14px 16px; border-top: 1px solid var(--deck-gray-100); }
.deck-scope .insight-table tbody td.col-year,
.deck-scope .insight-table tbody td.col-delta { text-align: right; }
.deck-scope .insight-table td.col-metric { font-weight: 500; color: var(--deck-midnight-700); }
.deck-scope .delta-pos { color: var(--deck-success-500); font-weight: 600; }
.deck-scope .delta-neg { color: var(--deck-error-500); font-weight: 600; }
.deck-scope .delta-neutral { color: var(--deck-gray-400); }
.deck-scope .insight-body { max-width: 80%; font-size: 14.5px; line-height: 1.6; color: var(--deck-midnight-200); margin: 0; }

/* SLIDE 4 — SOLUTION */
.deck-scope .solution-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 8px; }
.deck-scope .pillar-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 26px 22px 0 22px;
  color: var(--deck-gray-800);
  position: relative;
  overflow: hidden;
  box-shadow: var(--deck-shadow-pop);
  display: flex;
  flex-direction: column;
  min-height: 280px;
}
.deck-scope .pillar-icon { color: var(--deck-orange-500); margin-bottom: 14px; }
.deck-scope .pillar-icon svg { width: 34px; height: 34px; }
.deck-scope .pillar-title {
  font-family: var(--deck-font-display);
  font-weight: 700;
  font-size: 23px;
  color: var(--deck-midnight-700);
  margin: 0 0 10px 0;
  letter-spacing: -0.01em;
}
.deck-scope .pillar-body { font-size: 14.5px; line-height: 1.6; color: var(--deck-gray-700); margin: 0 0 20px 0; }
.deck-scope .pillar-body strong { color: var(--deck-midnight-700); }
.deck-scope .pillar-accent-strip { margin-top: auto; height: 4px; background: var(--deck-orange-500); margin-left: -22px; margin-right: -22px; }

/* SLIDE 5 — HOW IT WORKS */
.deck-scope .how-steps { display: flex; flex-direction: column; gap: 8px; max-width: 88%; }
.deck-scope .how-step { display: grid; grid-template-columns: 90px 1fr; gap: 24px; align-items: center; padding: 14px 0; position: relative; }
.deck-scope .how-step-number {
  font-family: var(--deck-font-display);
  font-weight: 700;
  font-size: 60px;
  line-height: 1;
  color: var(--deck-midnight-100);
  letter-spacing: -0.04em;
}
.deck-scope .how-step-title { font-family: var(--deck-font-sans); font-weight: 600; font-size: 18px; color: var(--deck-midnight-700); margin: 0 0 6px 0; }
.deck-scope .how-step-body { font-size: 14.5px; line-height: 1.55; color: var(--deck-gray-600); margin: 0; }
.deck-scope .how-step-arrow { position: absolute; left: 30px; bottom: -10px; width: 18px; height: 18px; color: var(--deck-orange-500); }
.deck-scope .how-pill {
  display: inline-block;
  background: var(--deck-orange-500);
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  margin-top: 14px;
  width: fit-content;
  letter-spacing: 0.01em;
}
.deck-scope .how-disclaimer { margin-top: 14px; font-size: 11px; color: var(--deck-gray-400); font-style: italic; }

/* SLIDE 6 — ECOSYSTEM */
.deck-scope .slide-ecosystem .slide-headline,
.deck-scope .slide-ecosystem .slide-subhead { max-width: 92%; }
.deck-scope .ecosystem-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: start; flex: 1; }
.deck-scope .ecosystem-diagram {
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.deck-scope .ecosystem-svg { width: 100%; max-height: 320px; }
.deck-scope .ecosystem-legend { padding: 4px 0; }
.deck-scope .ecosystem-legend-title {
  font-family: var(--deck-font-sans);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--deck-midnight-200);
  margin: 0 0 14px 0;
}
.deck-scope .legend-row {
  display: grid;
  grid-template-columns: 14px auto 1fr;
  align-items: center;
  gap: 12px;
  padding: 6px 0;
  font-size: 13px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.deck-scope .legend-row:last-child { border-bottom: 0; }
.deck-scope .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
.deck-scope .legend-label { font-weight: 600; }
.deck-scope .legend-desc { color: var(--deck-midnight-200); font-size: 12.5px; }
.deck-scope .ecosystem-flow { margin-top: 18px; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 16px 18px; }
.deck-scope .ecosystem-flow h4 {
  font-family: var(--deck-font-sans);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--deck-midnight-200);
  margin: 0 0 10px 0;
  font-weight: 600;
}
.deck-scope .flow-row { display: grid; grid-template-columns: 14px 1fr auto; align-items: center; gap: 12px; padding: 6px 0; color: #ffffff; font-size: 13px; }
.deck-scope .flow-dot { width: 10px; height: 10px; border-radius: 50%; }
.deck-scope .flow-pct { font-size: 15px; font-weight: 600; color: var(--deck-orange-400); }
.deck-scope .flow-footnote {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 11px;
  color: var(--deck-midnight-300);
  font-style: italic;
}

/* SLIDE 7 — PAVEL */
.deck-scope .pavel-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 28px; margin-top: 4px; flex: 1; }
.deck-scope .pavel-timeline { display: flex; flex-direction: column; gap: 14px; position: relative; }
.deck-scope .pavel-timeline::before {
  content: "";
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 15px;
  width: 2px;
  background: var(--deck-gray-100);
  z-index: 0;
}
.deck-scope .timeline-item { display: grid; grid-template-columns: 32px 1fr; gap: 16px; align-items: start; position: relative; z-index: 1; }
.deck-scope .timeline-dot {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid var(--deck-orange-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--deck-orange-500);
}
.deck-scope .timeline-dot svg { width: 14px; height: 14px; }
.deck-scope .timeline-day {
  font-family: var(--deck-font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--deck-orange-600);
  font-weight: 600;
  margin-bottom: 2px;
}
.deck-scope .timeline-title { font-family: var(--deck-font-display); font-weight: 600; font-size: 16px; color: var(--deck-midnight-700); margin-bottom: 4px; }
.deck-scope .timeline-desc { font-size: 12.5px; line-height: 1.5; color: var(--deck-gray-600); }
.deck-scope .pavel-split {
  background: var(--deck-midnight-700);
  color: #ffffff;
  border-radius: 20px;
  padding: 22px;
  box-shadow: var(--deck-shadow-pop);
}
.deck-scope .pavel-split-title {
  font-family: var(--deck-font-sans);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--deck-midnight-200);
  margin: 0 0 16px 0;
}
.deck-scope .split-table { display: flex; flex-direction: column; gap: 12px; }
.deck-scope .split-row { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.deck-scope .split-row:last-child { border-bottom: 0; }
.deck-scope .split-row.emphasis { padding-top: 4px; }
.deck-scope .split-row.emphasis .split-value { color: var(--deck-orange-400); }
.deck-scope .split-label { font-size: 12.5px; color: var(--deck-midnight-200); margin-bottom: 4px; font-weight: 500; }
.deck-scope .split-value {
  font-family: var(--deck-font-mono);
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}
.deck-scope .split-meta { font-size: 11.5px; color: var(--deck-midnight-300); margin-top: 2px; font-style: italic; }

/* SLIDE 8 — ROI */
.deck-scope .roi-grid { display: grid; grid-template-columns: 1.3fr 1fr; gap: 24px; align-items: start; flex: 1; }
.deck-scope .roi-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--deck-shadow-card);
}
.deck-scope .roi-table thead tr { background: var(--deck-midnight-700); color: #ffffff; }
.deck-scope .roi-table thead th {
  padding: 12px 14px;
  text-align: left;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
.deck-scope .roi-table thead th:not(:first-child) { text-align: right; }
.deck-scope .roi-table tbody td { padding: 12px 14px; border-top: 1px solid var(--deck-gray-100); color: var(--deck-gray-700); }
.deck-scope .roi-table tbody td:not(:first-child) { text-align: right; }
.deck-scope .roi-table tbody tr:nth-child(even) { background: var(--deck-gray-50); }
.deck-scope .roi-table .total-row td { font-weight: 600; color: var(--deck-midnight-700); background: var(--deck-midnight-50); }
.deck-scope .roi-table .total-row.strong td { color: var(--deck-orange-600); font-size: 15px; }
.deck-scope .roi-table .strong { font-weight: 700; }
.deck-scope .roi-assumptions { margin-top: 10px; font-size: 11px; color: var(--deck-gray-400); line-height: 1.5; font-style: italic; }
.deck-scope .roi-hero {
  background: var(--deck-midnight-700);
  color: #ffffff;
  border-radius: 20px;
  padding: 26px 24px;
  text-align: center;
  box-shadow: var(--deck-shadow-pop);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  min-height: 200px;
}
.deck-scope .roi-hero-number {
  font-family: var(--deck-font-mono);
  font-weight: 700;
  font-size: 42px;
  color: var(--deck-orange-400);
  letter-spacing: -0.02em;
  line-height: 1;
}
.deck-scope .roi-hero-label { font-size: 13px; color: var(--deck-midnight-200); max-width: 80%; line-height: 1.4; }
.deck-scope .roi-hero-cta {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.1);
  width: 100%;
  font-size: 12px;
  color: var(--deck-midnight-200);
  line-height: 1.5;
}

/* SLIDE 9 — PILOT */
.deck-scope .pilot-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 8px; }
.deck-scope .tier-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px 20px;
  border: 1px solid var(--deck-midnight-100);
  position: relative;
  display: flex;
  flex-direction: column;
}
.deck-scope .tier-card.featured {
  background: var(--deck-midnight-700);
  color: #ffffff;
  border-color: var(--deck-midnight-700);
  box-shadow: var(--deck-shadow-pop);
  transform: translateY(-4px);
}
.deck-scope .tier-badge {
  position: absolute;
  top: -10px;
  right: 16px;
  background: var(--deck-orange-500);
  color: #ffffff;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 999px;
}
.deck-scope .tier-name {
  font-family: var(--deck-font-sans);
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--deck-gray-500);
  margin-bottom: 6px;
}
.deck-scope .tier-card.featured .tier-name { color: var(--deck-midnight-200); }
.deck-scope .tier-tagline {
  font-family: var(--deck-font-display);
  font-weight: 600;
  font-size: 18px;
  color: var(--deck-midnight-700);
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}
.deck-scope .tier-card.featured .tier-tagline { color: #ffffff; }
.deck-scope .tier-price-block { padding: 12px 0 14px 0; margin-bottom: 14px; border-bottom: 1px dashed var(--deck-gray-200); }
.deck-scope .tier-card.featured .tier-price-block { border-bottom-color: rgba(255,255,255,0.15); }
.deck-scope .tier-price {
  font-family: var(--deck-font-mono);
  font-size: 32px;
  font-weight: 700;
  color: var(--deck-orange-500);
  letter-spacing: -0.02em;
  line-height: 1;
}
.deck-scope .tier-price-note { margin-top: 4px; font-size: 11.5px; color: var(--deck-gray-500); }
.deck-scope .tier-card.featured .tier-price-note { color: var(--deck-midnight-200); }
.deck-scope .tier-rows { display: flex; flex-direction: column; gap: 7px; }
.deck-scope .tier-row { display: grid; grid-template-columns: auto 1fr; gap: 10px; font-size: 12px; padding: 4px 0; align-items: baseline; }
.deck-scope .tier-row-label { color: var(--deck-gray-500); font-weight: 500; }
.deck-scope .tier-card.featured .tier-row-label { color: var(--deck-midnight-200); }
.deck-scope .tier-row-value { color: var(--deck-midnight-700); text-align: right; font-weight: 500; }
.deck-scope .tier-card.featured .tier-row-value { color: #ffffff; }
.deck-scope .pilot-footer {
  margin-top: 20px;
  padding: 14px 18px;
  background: var(--deck-midnight-50);
  border-radius: 10px;
  font-size: 13px;
  color: var(--deck-midnight-600);
  line-height: 1.55;
  border-left: 3px solid var(--deck-orange-500);
}
.deck-scope .pilot-footer strong { color: var(--deck-midnight-800); }

/* SLIDE 10 — CTA */
.deck-scope .slide-cta { display: grid; grid-template-columns: 1.3fr 1fr; gap: 40px; align-items: stretch; }
.deck-scope .cta-left { display: flex; flex-direction: column; justify-content: center; }
.deck-scope .cta-body { font-size: 14.5px; line-height: 1.6; color: var(--deck-midnight-200); max-width: 90%; margin: 0 0 30px 0; }
.deck-scope .cta-button-row { display: flex; flex-direction: column; gap: 8px; }
.deck-scope .cta-button {
  background: var(--deck-orange-500);
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  padding: 14px 24px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(249,115,22,0.35);
  display: inline-block;
  width: fit-content;
  letter-spacing: 0.01em;
}
.deck-scope .cta-url { font-family: var(--deck-font-mono); font-size: 11.5px; color: var(--deck-midnight-300); }
.deck-scope .cta-right { display: flex; align-items: center; justify-content: center; }
.deck-scope .contact-card {
  background: #ffffff;
  color: var(--deck-gray-800);
  border-radius: 20px;
  padding: 28px 26px;
  width: 100%;
  box-shadow: var(--deck-shadow-pop);
}
.deck-scope .contact-avatar {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--deck-midnight-100);
  color: var(--deck-midnight-700);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--deck-font-display);
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 14px;
  letter-spacing: 0.01em;
}
.deck-scope .contact-name { font-family: var(--deck-font-sans); font-weight: 700; font-size: 17px; color: var(--deck-midnight-700); margin-bottom: 3px; }
.deck-scope .contact-role { font-size: 13px; color: var(--deck-gray-600); margin-bottom: 2px; }
.deck-scope .contact-company { font-size: 12px; color: var(--deck-gray-500); }
.deck-scope .contact-divider { height: 1px; background: var(--deck-gray-100); margin: 16px 0; }
.deck-scope .contact-row { display: flex; align-items: center; gap: 10px; padding: 5px 0; font-size: 13px; color: var(--deck-gray-700); }
.deck-scope .contact-row svg { width: 16px; height: 16px; color: var(--deck-orange-500); flex-shrink: 0; }
.deck-scope .qr-wrap {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--deck-gray-100);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.deck-scope .qr-placeholder {
  width: 100px; height: 100px;
  background: var(--deck-gray-100);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  border: 1px dashed var(--deck-gray-300);
}
.deck-scope .qr-placeholder-label { font-size: 10px; color: var(--deck-gray-400); text-align: center; padding: 8px; }
.deck-scope .qr-image { width: 100px; height: 100px; border-radius: 10px; }
.deck-scope .qr-caption { margin-top: 8px; font-size: 10.5px; color: var(--deck-gray-500); text-align: center; font-style: italic; }
.deck-scope .cta-footer {
  position: absolute;
  bottom: 12mm;
  left: 22mm;
  right: 22mm;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 10.5px;
  color: var(--deck-midnight-300);
  text-align: center;
}
`;
