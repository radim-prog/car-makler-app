/**
 * ROI Calculator scoped styles — FIX-041 (Designer, 2026-04-15)
 *
 * Used by <RoiCalculator /> pro B2B landing /pro-autickare + /pro-bazary.
 * Scoped pod `.roi-scope` prefix aby neholil globální Tailwind.
 * Používá CSS variables z globals.css s fallback hodnotami pro standalone render.
 */

export const ROI_CALCULATOR_CSS = `
.roi-scope {
  --roi-midnight-50:  var(--color-midnight-50,  #F4F6FB);
  --roi-midnight-100: var(--color-midnight-100, #E4E9F2);
  --roi-midnight-200: var(--color-midnight-200, #C5CFE0);
  --roi-midnight-300: var(--color-midnight-300, #94A3BE);
  --roi-midnight-400: var(--color-midnight-400, #5C7194);
  --roi-midnight-500: var(--color-midnight-500, #2D4669);
  --roi-midnight-600: var(--color-midnight-600, #1A2F52);
  --roi-midnight-700: var(--color-midnight-700, #0D1F3C);
  --roi-midnight-800: var(--color-midnight-800, #081530);
  --roi-midnight-900: var(--color-midnight-900, #040B1F);
  --roi-broker:   var(--color-data-broker,   #F97316);
  --roi-investor: var(--color-data-investor, #6366F1);
  --roi-shop:     var(--color-data-shop,     #10B981);
  --roi-serif:    var(--font-display, 'Fraunces', 'Times New Roman', serif);
  --roi-mono:     var(--font-mono,    'JetBrains Mono', ui-monospace, monospace);
  --roi-sans:     var(--font-body,    'Outfit', ui-sans-serif, system-ui, sans-serif);

  position: relative;
  display: block;
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 2.75rem 2rem 2.25rem;
  color: var(--roi-midnight-700);
  font-family: var(--roi-sans);
  background: linear-gradient(180deg, var(--roi-midnight-50) 0%, #FFFFFF 70%);
  border: 1px solid var(--roi-midnight-100);
  border-radius: 18px;
  box-shadow: 0 24px 60px -32px rgba(13, 31, 60, 0.22);
}

.roi-scope * { box-sizing: border-box; }

.roi-kicker {
  font-family: var(--roi-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--roi-broker);
  margin: 0 0 0.5rem;
}

.roi-title {
  font-family: var(--roi-serif);
  font-weight: 500;
  font-size: clamp(1.5rem, 2.6vw, 2.125rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--roi-midnight-700);
  margin: 0 0 0.5rem;
}

.roi-subtitle {
  font-size: 0.9375rem;
  color: var(--roi-midnight-400);
  max-width: 62ch;
  margin: 0 0 2rem;
  line-height: 1.55;
}

/* ─────────── Layout grid ─────────── */
.roi-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 2.25rem;
  align-items: start;
}

@media (max-width: 880px) {
  .roi-scope { padding: 2rem 1.25rem 1.75rem; }
  .roi-grid { grid-template-columns: minmax(0, 1fr); gap: 1.75rem; }
}

/* ─────────── Inputs column ─────────── */
.roi-inputs {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.roi-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.roi-field__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}

.roi-field__label {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--roi-midnight-600);
}

.roi-field__value {
  font-family: var(--roi-mono);
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--roi-midnight-700);
  font-variant-numeric: tabular-nums;
}

.roi-field__value strong {
  color: var(--roi-broker);
  font-weight: 600;
}

.roi-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--roi-midnight-100);
  border-radius: 3px;
  outline: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.roi-slider:focus-visible {
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
}

.roi-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2px solid var(--roi-broker);
  box-shadow: 0 2px 6px rgba(13, 31, 60, 0.2);
  cursor: grab;
  transition: transform 0.15s ease;
}

.roi-slider::-webkit-slider-thumb:active { cursor: grabbing; transform: scale(1.08); }

.roi-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #FFFFFF;
  border: 2px solid var(--roi-broker);
  box-shadow: 0 2px 6px rgba(13, 31, 60, 0.2);
  cursor: grab;
}

.roi-field__meta {
  display: flex;
  justify-content: space-between;
  font-family: var(--roi-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--roi-midnight-300);
}

/* ─────────── Channel tabs ─────────── */
.roi-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.375rem;
  padding: 0.375rem;
  background: var(--roi-midnight-50);
  border: 1px solid var(--roi-midnight-100);
  border-radius: 12px;
}

.roi-tab {
  appearance: none;
  border: none;
  background: transparent;
  padding: 0.625rem 0.5rem;
  font-family: var(--roi-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--roi-midnight-400);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  line-height: 1.2;
}

.roi-tab__channel {
  font-family: var(--roi-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}

.roi-tab:hover:not(.is-active) {
  background: rgba(13, 31, 60, 0.04);
  color: var(--roi-midnight-600);
}

.roi-tab.is-active {
  background: #FFFFFF;
  color: var(--roi-midnight-700);
  box-shadow: 0 2px 8px -2px rgba(13, 31, 60, 0.15);
}

.roi-tab.is-active[data-channel="broker"] { border-bottom: 2px solid var(--roi-broker); }
.roi-tab.is-active[data-channel="self"]   { border-bottom: 2px solid var(--roi-investor); }
.roi-tab.is-active[data-channel="shop"]   { border-bottom: 2px solid var(--roi-shop); }

.roi-tab:focus-visible {
  outline: 2px solid var(--roi-broker);
  outline-offset: 2px;
}

/* ─────────── Output card ─────────── */
.roi-output {
  background: var(--roi-midnight-700);
  color: var(--roi-midnight-50);
  border-radius: 16px;
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
}

.roi-output::before {
  content: "";
  position: absolute;
  top: -40%;
  right: -20%;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.roi-output__kicker {
  font-family: var(--roi-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--roi-midnight-300);
  margin: 0;
}

.roi-output__value {
  font-family: var(--roi-serif);
  font-size: clamp(2.5rem, 5vw, 3.25rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  margin: 0;
}

.roi-output__value span {
  font-family: var(--roi-mono);
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--roi-broker);
  margin-left: 0.5rem;
  vertical-align: middle;
}

.roi-output__caption {
  font-size: 0.875rem;
  color: var(--roi-midnight-200);
  line-height: 1.5;
  margin: 0;
}

/* Monthly bar chart */
.roi-chart {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 4px;
  align-items: end;
  height: 100px;
  padding: 0.75rem 0.25rem 0.25rem;
  border-top: 1px solid rgba(196, 207, 224, 0.15);
}

.roi-chart__bar {
  background: linear-gradient(180deg, var(--roi-broker) 0%, rgba(249, 115, 22, 0.5) 100%);
  border-radius: 2px 2px 0 0;
  min-height: 4px;
  transition: height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
}

.roi-chart__bar[data-channel="self"]  { background: linear-gradient(180deg, var(--roi-investor) 0%, rgba(99, 102, 241, 0.5) 100%); }
.roi-chart__bar[data-channel="shop"]  { background: linear-gradient(180deg, var(--roi-shop)     0%, rgba(16, 185, 129, 0.5) 100%); }

.roi-chart__labels {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 4px;
  font-family: var(--roi-mono);
  font-size: 0.5625rem;
  letter-spacing: 0.08em;
  color: var(--roi-midnight-300);
  text-align: center;
  margin-top: 0.375rem;
}

/* Breakdown rows */
.roi-breakdown {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.375rem 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(196, 207, 224, 0.15);
  font-size: 0.8125rem;
}

.roi-breakdown__label {
  color: var(--roi-midnight-200);
}

.roi-breakdown__value {
  font-family: var(--roi-mono);
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.roi-breakdown__row--total {
  padding-top: 0.5rem;
  margin-top: 0.25rem;
  border-top: 1px dashed rgba(196, 207, 224, 0.2);
  font-weight: 600;
}

.roi-breakdown__row--total .roi-breakdown__label { color: #FFFFFF; }
.roi-breakdown__row--total .roi-breakdown__value { color: var(--roi-broker); }

/* ─────────── Disclaimer ─────────── */
.roi-disclaimer {
  margin-top: 1.75rem;
  padding: 1rem 1.125rem;
  background: #FEF3C7;
  border-left: 3px solid #D97706;
  border-radius: 8px;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #78350F;
}

.roi-disclaimer strong {
  display: block;
  font-family: var(--roi-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  color: #92400E;
}

/* ─────────── Accessibility ─────────── */
@media (prefers-reduced-motion: reduce) {
  .roi-chart__bar { transition: none; }
  .roi-slider::-webkit-slider-thumb { transition: none; }
}
`;
