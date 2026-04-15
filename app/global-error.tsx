"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const digest = error?.digest ?? "unknown";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API může selhat (file:// , iframe bez permissions) — tichý fallback
    }
  };

  return (
    <html lang="cs">
      <body>
        <style>{GLOBAL_ERROR_CSS}</style>
        <main className="ge-scope" role="main">
          <div className="ge-grid-noise" aria-hidden />

          <div className="ge-card">
            <p className="ge-kicker">Chyba 500 · Server error</p>

            <div className="ge-art" aria-hidden>
              <svg viewBox="0 0 120 120" width="88" height="88">
                <defs>
                  <linearGradient id="ge-grad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0" stopColor="#F97316" />
                    <stop offset="1" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
                <path
                  d="M60 10 L112 100 L8 100 Z"
                  fill="url(#ge-grad)"
                  opacity="0.18"
                />
                <path
                  d="M60 18 L104 96 L16 96 Z"
                  fill="none"
                  stroke="url(#ge-grad)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M60 48 L60 74"
                  stroke="#F97316"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="84" r="3" fill="#F97316" />
              </svg>
            </div>

            <h1 className="ge-display">
              <span>Něco se zlomilo</span>
              <em>v zákulisí.</em>
            </h1>

            <p className="ge-lede">
              Narazili jsme na neočekávanou chybu. Tým už dostal signál přes Sentry
              — zkoušíme to spravit. Zkus prosím znovu nebo nám pošli kód níže.
            </p>

            <div className="ge-digest">
              <span className="ge-digest__label">Kód chyby</span>
              <code className="ge-digest__value" title="Sentry digest">
                {digest}
              </code>
              <button
                type="button"
                className="ge-digest__copy"
                onClick={handleCopy}
                aria-label="Zkopírovat kód chyby"
              >
                {copied ? "Zkopírováno ✓" : "Zkopírovat"}
              </button>
            </div>

            <div className="ge-actions">
              <button
                type="button"
                onClick={reset}
                className="ge-cta ge-cta--primary"
              >
                Zkusit znovu
                <svg viewBox="0 0 20 20" aria-hidden width="16" height="16">
                  <path
                    d="M4 10a6 6 0 1011.2-3M15 5v3.5h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <a href="/" className="ge-cta ge-cta--ghost">
                Na hlavní stránku
              </a>
              <a
                href="mailto:podpora@carmakler.cz?subject=Chyba%20500%20na%20webu&body=Dobrý%20den,%20narazil%20jsem%20na%20chybu%20s%20kódem%3A%20"
                className="ge-cta ge-cta--ghost"
              >
                Napsat podpoře
              </a>
            </div>

            <p className="ge-foot">
              CarMakléř · Pokud chyba trvá, napište nám na{" "}
              <a href="mailto:podpora@carmakler.cz">podpora@carmakler.cz</a> s kódem výše.
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}

const GLOBAL_ERROR_CSS = `
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }

.ge-scope {
  --ge-mid-50:  #F4F6FB;
  --ge-mid-100: #E4E9F2;
  --ge-mid-200: #C5CFE0;
  --ge-mid-300: #94A3BE;
  --ge-mid-400: #5C7194;
  --ge-mid-600: #1A2F52;
  --ge-mid-700: #0D1F3C;
  --ge-mid-800: #081530;
  --ge-broker: #F97316;
  --ge-serif: 'Fraunces', Georgia, serif;
  --ge-mono: 'JetBrains Mono', ui-monospace, monospace;
  --ge-sans: 'Outfit', ui-sans-serif, system-ui, sans-serif;

  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(900px 500px at 85% -20%, rgba(249,115,22,0.25) 0%, transparent 65%),
    radial-gradient(700px 400px at 10% 120%, rgba(13,31,60,0.6) 0%, transparent 65%),
    var(--ge-mid-800);
  color: var(--ge-mid-50);
  font-family: var(--ge-sans);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  overflow: hidden;
}

.ge-grid-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(196,207,224,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196,207,224,0.05) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
  opacity: 0.6;
}

.ge-card {
  position: relative;
  z-index: 1;
  max-width: 560px;
  width: 100%;
  background: rgba(8,21,48,0.75);
  border: 1px solid rgba(196,207,224,0.15);
  border-radius: 20px;
  padding: clamp(2rem, 4vw, 3rem);
  backdrop-filter: blur(10px);
  box-shadow: 0 40px 80px -30px rgba(0,0,0,0.6);
  text-align: left;
}

.ge-kicker {
  font-family: var(--ge-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--ge-broker);
  margin: 0 0 1.5rem;
}

.ge-art {
  margin-bottom: 1rem;
}

.ge-display {
  font-family: var(--ge-serif);
  font-weight: 400;
  font-size: clamp(2rem, 4vw, 2.75rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  color: #FFFFFF;
}

.ge-display span { display: block; }

.ge-display em {
  display: block;
  font-style: italic;
  color: var(--ge-broker);
}

.ge-lede {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--ge-mid-200);
  margin: 0 0 1.75rem;
}

.ge-digest {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: rgba(4,11,31,0.6);
  border: 1px solid rgba(196,207,224,0.15);
  border-radius: 10px;
  margin-bottom: 1.75rem;
}

.ge-digest__label {
  font-family: var(--ge-mono);
  font-size: 0.625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ge-mid-300);
}

.ge-digest__value {
  font-family: var(--ge-mono);
  font-size: 0.8125rem;
  color: #FFFFFF;
  background: transparent;
  padding: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ge-digest__copy {
  appearance: none;
  background: transparent;
  border: 1px solid rgba(196,207,224,0.25);
  color: var(--ge-mid-100);
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-family: var(--ge-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.18s ease;
}

.ge-digest__copy:hover {
  border-color: var(--ge-broker);
  color: var(--ge-broker);
}

.ge-digest__copy:focus-visible {
  outline: 2px solid var(--ge-broker);
  outline-offset: 2px;
}

.ge-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 1.75rem;
}

.ge-cta {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8125rem 1.375rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: var(--ge-sans);
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.18s ease;
  letter-spacing: 0.01em;
}

.ge-cta--primary {
  background: var(--ge-broker);
  color: #FFFFFF;
  box-shadow: 0 12px 28px -12px rgba(249,115,22,0.6);
}

.ge-cta--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px -14px rgba(249,115,22,0.75);
}

.ge-cta--ghost {
  background: transparent;
  color: var(--ge-mid-100);
  border: 1px solid rgba(196,207,224,0.25);
}

.ge-cta--ghost:hover {
  border-color: rgba(196,207,224,0.5);
  background: rgba(196,207,224,0.06);
}

.ge-cta:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 3px;
}

.ge-foot {
  font-size: 0.75rem;
  color: var(--ge-mid-300);
  margin: 0;
  padding-top: 1rem;
  border-top: 1px solid rgba(196,207,224,0.1);
  line-height: 1.6;
}

.ge-foot a {
  color: var(--ge-mid-100);
  text-decoration: underline;
  text-decoration-color: rgba(249,115,22,0.4);
  text-underline-offset: 3px;
}

.ge-foot a:hover {
  color: var(--ge-broker);
}

@media (prefers-reduced-motion: reduce) {
  .ge-cta { transition: none; }
  .ge-cta--primary:hover { transform: none; }
}
`;
