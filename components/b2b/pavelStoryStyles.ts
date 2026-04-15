export const PAVEL_STORY_CSS = `
.pavel-scope {
  --p-mid-50:  var(--midnight-50,  #F4F6FB);
  --p-mid-100: var(--midnight-100, #E4E9F2);
  --p-mid-200: var(--midnight-200, #C5CFE0);
  --p-mid-300: var(--midnight-300, #94A3BE);
  --p-mid-400: var(--midnight-400, #5C7194);
  --p-mid-500: var(--midnight-500, #2D4669);
  --p-mid-600: var(--midnight-600, #1A2F52);
  --p-mid-700: var(--midnight-700, #0D1F3C);
  --p-mid-800: var(--midnight-800, #081530);
  --p-mid-900: var(--midnight-900, #040B1F);
  --p-broker:   var(--data-broker,   #F97316);
  --p-investor: var(--data-investor, #6366F1);
  --p-shop:     #10B981;
  --p-amber:    #F59E0B;

  --p-font-display: var(--font-display, 'Fraunces', Georgia, serif);
  --p-font-sans:    var(--font-sans, 'Outfit', system-ui, sans-serif);
  --p-font-mono:    var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);

  font-family: var(--p-font-sans);
  color: var(--p-mid-900);
  background: var(--p-mid-50);
  line-height: 1.55;
}

.pavel-scope * { box-sizing: border-box; }

/* === Disclaimer banner === */
.pavel-disclaimer {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px 22px;
  background: #FFFBEB;
  border: 1px solid #FCD34D;
  border-left: 4px solid var(--p-amber);
  border-radius: 10px;
  color: #78350F;
  font-size: 14px;
  line-height: 1.5;
  max-width: 1120px;
  margin: 0 auto 48px;
}
.pavel-disclaimer-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  color: var(--p-amber);
  margin-top: 1px;
}
.pavel-disclaimer strong { color: #451A03; font-weight: 600; }

/* === Hero === */
.pavel-hero {
  max-width: 1120px;
  margin: 0 auto 72px;
  padding: 0 24px;
}
.pavel-hero-eyebrow {
  font-family: var(--p-font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-broker);
  margin-bottom: 18px;
}
.pavel-hero-eyebrow::before {
  content: "";
  display: inline-block;
  width: 32px;
  height: 1px;
  background: var(--p-broker);
  vertical-align: middle;
  margin-right: 12px;
}
.pavel-hero-headline {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--p-mid-900);
  margin: 0 0 20px;
  max-width: 820px;
}
.pavel-hero-headline em {
  font-style: italic;
  font-weight: 400;
  color: var(--p-mid-600);
}
.pavel-hero-sub {
  font-size: 18px;
  color: var(--p-mid-500);
  max-width: 680px;
  margin: 0 0 40px;
}

/* === Hero metric strip === */
.pavel-metric-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--p-mid-200);
  border-bottom: 1px solid var(--p-mid-200);
  background: #fff;
}
.pavel-metric {
  padding: 24px 28px;
  border-right: 1px solid var(--p-mid-100);
}
.pavel-metric:last-child { border-right: 0; }
.pavel-metric-label {
  font-family: var(--p-font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--p-mid-400);
  margin-bottom: 10px;
}
.pavel-metric-value {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: 32px;
  line-height: 1;
  color: var(--p-mid-900);
  letter-spacing: -0.015em;
}
.pavel-metric-value .unit {
  font-family: var(--p-font-sans);
  font-size: 14px;
  font-weight: 400;
  color: var(--p-mid-400);
  margin-left: 6px;
  letter-spacing: 0;
}

/* === Capital-flow hero SVG === */
.pavel-flow {
  max-width: 1120px;
  margin: 0 auto 88px;
  padding: 0 24px;
}
.pavel-flow-title {
  font-family: var(--p-font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-mid-400);
  margin-bottom: 16px;
}
.pavel-flow-svg {
  width: 100%;
  height: auto;
  display: block;
  background: #fff;
  border: 1px solid var(--p-mid-100);
  border-radius: 16px;
  padding: 36px 28px;
}

/* === Timeline === */
.pavel-timeline-wrap {
  max-width: 1120px;
  margin: 0 auto 88px;
  padding: 0 24px;
}
.pavel-timeline-head {
  margin-bottom: 40px;
}
.pavel-timeline-eyebrow {
  font-family: var(--p-font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-broker);
  margin-bottom: 14px;
}
.pavel-timeline-h2 {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: clamp(28px, 3.2vw, 40px);
  line-height: 1.12;
  letter-spacing: -0.015em;
  color: var(--p-mid-900);
  margin: 0;
  max-width: 760px;
}
.pavel-timeline {
  position: relative;
  display: grid;
  gap: 28px;
}
.pavel-timeline::before {
  content: "";
  position: absolute;
  left: 47px;
  top: 32px;
  bottom: 32px;
  width: 1px;
  background: linear-gradient(to bottom,
    transparent 0,
    var(--p-mid-200) 6%,
    var(--p-mid-200) 94%,
    transparent 100%);
  z-index: 0;
}
.pavel-step {
  position: relative;
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 28px;
  align-items: flex-start;
  background: #fff;
  border: 1px solid var(--p-mid-100);
  border-radius: 14px;
  padding: 26px 28px;
  transition: border-color .2s ease, transform .2s ease;
}
.pavel-step:hover {
  border-color: var(--p-mid-200);
  transform: translateY(-1px);
}
.pavel-step-icon {
  grid-column: 1;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--p-mid-50);
  border: 1px solid var(--p-mid-100);
  color: var(--p-mid-700);
  position: relative;
  z-index: 1;
}
.pavel-step[data-accent="broker"] .pavel-step-icon { color: var(--p-broker); background: #FFF7ED; border-color: #FED7AA; }
.pavel-step[data-accent="investor"] .pavel-step-icon { color: var(--p-investor); background: #EEF2FF; border-color: #C7D2FE; }
.pavel-step[data-accent="shop"] .pavel-step-icon { color: var(--p-shop); background: #ECFDF5; border-color: #A7F3D0; }
.pavel-step-body { grid-column: 2; min-width: 0; }
.pavel-step-day {
  font-family: var(--p-font-mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--p-mid-400);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.pavel-step-title {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--p-mid-900);
  margin: 0 0 10px;
}
.pavel-step-text {
  font-size: 15px;
  color: var(--p-mid-500);
  line-height: 1.6;
  margin: 0;
}
.pavel-step-kpi {
  grid-column: 3;
  text-align: right;
  min-width: 140px;
  padding-left: 12px;
}
.pavel-step-kpi-value {
  font-family: var(--p-font-mono);
  font-weight: 600;
  font-size: 18px;
  color: var(--p-mid-800);
  letter-spacing: -0.01em;
  white-space: nowrap;
}
.pavel-step-kpi-label {
  font-size: 11px;
  font-family: var(--p-font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--p-mid-400);
  margin-top: 4px;
}

/* === Final breakdown === */
.pavel-breakdown {
  max-width: 1120px;
  margin: 0 auto 72px;
  padding: 0 24px;
}
.pavel-breakdown-head {
  margin-bottom: 32px;
}
.pavel-breakdown-eyebrow {
  font-family: var(--p-font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--p-mid-400);
  margin-bottom: 12px;
}
.pavel-breakdown-h2 {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: clamp(26px, 2.8vw, 36px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: var(--p-mid-900);
  margin: 0;
}
.pavel-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.pavel-persona-card {
  background: #fff;
  border: 1px solid var(--p-mid-100);
  border-top: 4px solid var(--p-mid-300);
  border-radius: 14px;
  padding: 28px 26px;
}
.pavel-persona-card[data-role="pavel"]    { border-top-color: var(--p-broker); }
.pavel-persona-card[data-role="tomas"]    { border-top-color: var(--p-investor); }
.pavel-persona-card[data-role="platform"] { border-top-color: var(--p-mid-700); }
.pavel-persona-role {
  font-family: var(--p-font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--p-mid-400);
  margin-bottom: 6px;
}
.pavel-persona-name {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: 20px;
  color: var(--p-mid-900);
  margin-bottom: 20px;
  letter-spacing: -0.01em;
}
.pavel-persona-amount {
  font-family: var(--p-font-display);
  font-weight: 500;
  font-size: 36px;
  line-height: 1;
  color: var(--p-mid-900);
  letter-spacing: -0.02em;
  margin-bottom: 8px;
}
.pavel-persona-amount .unit {
  font-family: var(--p-font-sans);
  font-size: 15px;
  font-weight: 400;
  color: var(--p-mid-400);
  margin-left: 6px;
}
.pavel-persona-meta {
  font-size: 13px;
  color: var(--p-mid-400);
  line-height: 1.5;
  border-top: 1px dashed var(--p-mid-100);
  padding-top: 16px;
  margin-top: 14px;
}
.pavel-persona-meta b {
  font-weight: 600;
  color: var(--p-mid-700);
}

/* === Footer disclaimer === */
.pavel-footer-note {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px 72px;
  font-size: 13px;
  color: var(--p-mid-400);
  line-height: 1.6;
  font-style: italic;
  max-width: 820px;
}

/* === Responsive === */
@media (max-width: 880px) {
  .pavel-metric-strip { grid-template-columns: repeat(2, 1fr); }
  .pavel-metric:nth-child(2) { border-right: 0; }
  .pavel-metric:nth-child(-n+2) { border-bottom: 1px solid var(--p-mid-100); }
  .pavel-breakdown-grid { grid-template-columns: 1fr; }
  .pavel-step {
    grid-template-columns: 56px 1fr;
    gap: 18px;
    padding: 20px;
  }
  .pavel-step-icon { width: 48px; height: 48px; border-radius: 10px; }
  .pavel-step-icon svg { width: 22px; height: 22px; }
  .pavel-step-kpi {
    grid-column: 1 / -1;
    text-align: left;
    padding-left: 0;
    padding-top: 14px;
    margin-top: 4px;
    border-top: 1px dashed var(--p-mid-100);
  }
  .pavel-timeline::before { left: 27px; }
}
`;
