/**
 * B2B Hero Accent — scoped styles
 * FIX-055 (Designer, 2026-04-15)
 *
 * Scoped pod `.b2b-accent-scope` prefixem. FIX-022 design tokeny.
 * Caption card overlays canvas s glass effect.
 */

export const B2B_HERO_ACCENT_CSS = `
.b2b-accent-scope {
  --b2b-mid-50:  var(--midnight-50,  #F4F6FB);
  --b2b-mid-100: var(--midnight-100, #E4E9F2);
  --b2b-mid-200: var(--midnight-200, #C5CFE0);
  --b2b-mid-300: var(--midnight-300, #94A3BE);
  --b2b-mid-400: var(--midnight-400, #5C7194);
  --b2b-mid-600: var(--midnight-600, #1A2F52);
  --b2b-mid-700: var(--midnight-700, #0D1F3C);
  --b2b-mid-800: var(--midnight-800, #081530);
  --b2b-broker:  var(--data-broker,  #F97316);
  --b2b-investor: var(--data-investor, #6366F1);
  --b2b-serif: var(--font-display, 'Fraunces', Georgia, serif);
  --b2b-mono:  var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
  --b2b-sans:  var(--font-sans, 'Outfit', system-ui, sans-serif);

  position: relative;
  display: block;
  margin: 0;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 480 / 380;
  border-radius: 20px;
  overflow: hidden;
  background:
    radial-gradient(600px 400px at 20% 10%, rgba(249,115,22,0.16) 0%, transparent 65%),
    radial-gradient(500px 400px at 90% 100%, rgba(99,102,241,0.14) 0%, transparent 70%),
    linear-gradient(160deg, var(--b2b-mid-800) 0%, var(--b2b-mid-700) 100%);
  border: 1px solid rgba(196,207,224,0.14);
  box-shadow: 0 30px 70px -40px rgba(13,31,60,0.5);
  font-family: var(--b2b-sans);
  color: var(--b2b-mid-50);
  isolation: isolate;
}

.b2b-accent-scope * { box-sizing: border-box; }

/* Grid noise overlay */
.b2b-accent-scope::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(196,207,224,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196,207,224,0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 85%);
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}

.b2b-accent-canvas {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.b2b-accent-canvas svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ─────────── Caption card (bottom-left overlay) ─────────── */
.b2b-accent-caption {
  position: absolute;
  left: 20px;
  bottom: 20px;
  right: auto;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 1rem;
  background: rgba(4,11,31,0.55);
  border: 1px solid rgba(196,207,224,0.18);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  max-width: calc(100% - 40px);
}

.b2b-accent-kicker {
  font-family: var(--b2b-mono);
  font-size: 0.625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--b2b-mid-200);
}

.b2b-accent-title {
  font-family: var(--b2b-serif);
  font-weight: 500;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.2;
}

.b2b-accent-hint {
  font-size: 0.8125rem;
  color: var(--b2b-mid-300);
  line-height: 1.45;
}

/* Per-variant kicker color accent */
.b2b-accent--makleri .b2b-accent-kicker { color: var(--b2b-broker); }
.b2b-accent--investory .b2b-accent-kicker { color: #A5B4FC; }
.b2b-accent--bazary .b2b-accent-kicker { color: var(--b2b-broker); }

/* ─────────── Mobile ─────────── */
@media (max-width: 640px) {
  .b2b-accent-scope {
    max-width: 100%;
    border-radius: 16px;
  }
  .b2b-accent-caption {
    left: 12px;
    bottom: 12px;
    padding: 0.625rem 0.875rem;
  }
  .b2b-accent-hint {
    display: none;
  }
}
`;
