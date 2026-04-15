import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 · Stránka nenalezena | CarMakléř",
  description:
    "Hledaná stránka neexistuje nebo byla přesunuta. Vyberte si jednu ze čtyř cest ekosystému CarMakléř.",
  robots: { index: false, follow: false },
};

const ECOSYSTEM = [
  {
    href: "/marketplace",
    kicker: "Investiční",
    title: "Marketplace",
    hint: "Spoluvlastnictví dealů §1115 OZ",
    accent: "#6366F1",
    dot: "investor",
  },
  {
    href: "/pro-makleri",
    kicker: "Síťový",
    title: "Makléřská síť",
    hint: "Prodej vozů s provizí 5 %",
    accent: "#F97316",
    dot: "broker",
  },
  {
    href: "/nabidka",
    kicker: "Prodejní",
    title: "Inzerce vozů",
    hint: "Ověřené vozy od soukromých prodejců",
    accent: "#2D4669",
    dot: "midnight",
  },
  {
    href: "/dily",
    kicker: "Náhradní",
    title: "Shop autodílů",
    hint: "Použité i aftermarket díly podle VIN",
    accent: "#10B981",
    dot: "shop",
  },
];

export default function NotFound() {
  return (
    <>
      <style>{NOT_FOUND_CSS}</style>
      <main className="nf-scope" role="main">
        <div className="nf-grid-noise" aria-hidden />

        <header className="nf-head">
          <p className="nf-kicker">Chyba 404 · Stránka nenalezena</p>
          <h1 className="nf-display" aria-label="404">
            <span className="nf-digit">4</span>
            <span className="nf-digit nf-digit--mid">
              <span className="nf-digit-inner">0</span>
              <span className="nf-digit-ring" aria-hidden />
            </span>
            <span className="nf-digit">4</span>
          </h1>
          <p className="nf-lede">
            Adresa, na kterou míříte, v ekosystému CarMakléř <em>neexistuje</em>.
            Možná byla přesunuta, možná v ní je překlep. Nechceme tě ztratit — vyber si, kam máš namířeno.
          </p>

          <div className="nf-actions">
            <Link href="/" className="nf-cta nf-cta--primary">
              Na hlavní stránku
              <svg viewBox="0 0 20 20" aria-hidden width="16" height="16">
                <path
                  d="M4 10h12M10 4l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/kontakt" className="nf-cta nf-cta--ghost">
              Napsat podpoře
            </Link>
          </div>
        </header>

        <section className="nf-eco" aria-labelledby="nf-eco-heading">
          <div className="nf-eco-head">
            <p className="nf-eco-kicker">Ekosystém CarMakléř</p>
            <h2 id="nf-eco-heading" className="nf-eco-title">
              Čtyři produkty, jedna platforma.
            </h2>
          </div>
          <ul className="nf-eco-grid" role="list">
            {ECOSYSTEM.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nf-eco-card"
                  data-dot={item.dot}
                  style={{ ["--card-accent" as never]: item.accent }}
                >
                  <span className="nf-eco-card__kicker">{item.kicker}</span>
                  <span className="nf-eco-card__title">{item.title}</span>
                  <span className="nf-eco-card__hint">{item.hint}</span>
                  <span className="nf-eco-card__arrow" aria-hidden>
                    <svg viewBox="0 0 20 20" width="18" height="18">
                      <path
                        d="M5 10h10M10 5l5 5-5 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className="nf-foot">
          <span>CarMakléř · Makléřská síť pro kvalitní ojetiny</span>
          <span aria-hidden>·</span>
          <Link href="/faq">FAQ</Link>
          <span aria-hidden>·</span>
          <Link href="/kontakt">Kontakt</Link>
        </footer>
      </main>
    </>
  );
}

const NOT_FOUND_CSS = `
.nf-scope {
  --nf-mid-50:  #F4F6FB;
  --nf-mid-100: #E4E9F2;
  --nf-mid-200: #C5CFE0;
  --nf-mid-300: #94A3BE;
  --nf-mid-400: #5C7194;
  --nf-mid-500: #2D4669;
  --nf-mid-600: #1A2F52;
  --nf-mid-700: #0D1F3C;
  --nf-mid-800: #081530;
  --nf-mid-900: #040B1F;
  --nf-broker: #F97316;
  --nf-serif: var(--font-display, 'Fraunces', Georgia, serif);
  --nf-mono: var(--font-mono, 'JetBrains Mono', ui-monospace, monospace);
  --nf-sans: var(--font-body, 'Outfit', ui-sans-serif, system-ui, sans-serif);

  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(1200px 600px at 80% -10%, rgba(249,115,22,0.22) 0%, transparent 65%),
    radial-gradient(900px 500px at 10% 110%, rgba(99,102,241,0.18) 0%, transparent 70%),
    var(--nf-mid-800);
  color: var(--nf-mid-50);
  font-family: var(--nf-sans);
  padding: clamp(3rem, 8vw, 6rem) 1.5rem clamp(2.5rem, 6vw, 4rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 6vw, 4.5rem);
  overflow: hidden;
}

.nf-grid-noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(196,207,224,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(196,207,224,0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
  opacity: 0.7;
}

.nf-head {
  position: relative;
  max-width: 880px;
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

.nf-kicker {
  font-family: var(--nf-mono);
  font-size: 0.75rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--nf-broker);
  margin: 0 0 1.25rem;
}

.nf-display {
  font-family: var(--nf-serif);
  font-weight: 400;
  font-size: clamp(6rem, 22vw, 14rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: clamp(0.25rem, 1.5vw, 1rem);
  color: #FFFFFF;
}

.nf-digit {
  display: inline-block;
  position: relative;
  font-style: italic;
  color: var(--nf-mid-50);
  text-shadow: 0 8px 40px rgba(13,31,60,0.5);
}

.nf-digit--mid {
  position: relative;
  font-style: normal;
  color: var(--nf-broker);
}

.nf-digit-inner {
  position: relative;
  z-index: 1;
}

.nf-digit-ring {
  position: absolute;
  inset: 8% -10%;
  border: 2px dashed rgba(249,115,22,0.45);
  border-radius: 50%;
  animation: nf-rot 18s linear infinite;
}

@keyframes nf-rot {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.nf-lede {
  font-size: clamp(1rem, 1.4vw, 1.125rem);
  line-height: 1.6;
  color: var(--nf-mid-200);
  max-width: 56ch;
  margin: 1.5rem auto 2rem;
}

.nf-lede em {
  font-family: var(--nf-serif);
  font-style: italic;
  font-weight: 500;
  color: #FFFFFF;
  padding: 0 0.1em;
}

.nf-actions {
  display: inline-flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.nf-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
  letter-spacing: 0.01em;
}

.nf-cta--primary {
  background: var(--nf-broker);
  color: #FFFFFF;
  box-shadow: 0 12px 30px -12px rgba(249,115,22,0.6);
}

.nf-cta--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 36px -14px rgba(249,115,22,0.75);
}

.nf-cta--ghost {
  background: transparent;
  color: var(--nf-mid-100);
  border: 1px solid rgba(196,207,224,0.25);
}

.nf-cta--ghost:hover {
  border-color: rgba(196,207,224,0.5);
  background: rgba(196,207,224,0.06);
}

.nf-eco {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  z-index: 1;
}

.nf-eco-head {
  text-align: center;
  margin-bottom: 2rem;
}

.nf-eco-kicker {
  font-family: var(--nf-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--nf-mid-300);
  margin: 0 0 0.5rem;
}

.nf-eco-title {
  font-family: var(--nf-serif);
  font-weight: 500;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: #FFFFFF;
  margin: 0;
}

.nf-eco-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.875rem;
}

.nf-eco-card {
  --card-accent: var(--nf-broker);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.5rem 1.375rem 1.625rem;
  background: rgba(13,31,60,0.55);
  border: 1px solid rgba(196,207,224,0.12);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: all 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
  backdrop-filter: blur(6px);
  overflow: hidden;
}

.nf-eco-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--card-accent);
  opacity: 0.7;
  transition: opacity 0.2s ease, width 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.nf-eco-card:hover {
  border-color: rgba(196,207,224,0.28);
  transform: translateY(-3px);
  background: rgba(13,31,60,0.75);
}

.nf-eco-card:hover::before {
  width: 5px;
  opacity: 1;
}

.nf-eco-card__kicker {
  font-family: var(--nf-mono);
  font-size: 0.625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--card-accent);
}

.nf-eco-card__title {
  font-family: var(--nf-serif);
  font-weight: 500;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin-top: 0.25rem;
}

.nf-eco-card__hint {
  font-size: 0.8125rem;
  color: var(--nf-mid-300);
  line-height: 1.5;
  margin-top: 0.375rem;
}

.nf-eco-card__arrow {
  position: absolute;
  top: 1.25rem;
  right: 1.125rem;
  color: var(--nf-mid-300);
  transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), color 0.2s ease;
}

.nf-eco-card:hover .nf-eco-card__arrow {
  transform: translate(3px, -3px);
  color: var(--card-accent);
}

.nf-eco-card:focus-visible {
  outline: 2px solid var(--card-accent);
  outline-offset: 3px;
}

.nf-cta:focus-visible {
  outline: 2px solid #FFFFFF;
  outline-offset: 3px;
}

.nf-foot {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  font-family: var(--nf-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--nf-mid-300);
}

.nf-foot a {
  color: var(--nf-mid-200);
  text-decoration: none;
  transition: color 0.18s ease;
}

.nf-foot a:hover {
  color: var(--nf-broker);
}

@media (prefers-reduced-motion: reduce) {
  .nf-digit-ring { animation: none; }
  .nf-cta, .nf-eco-card, .nf-eco-card__arrow { transition: none; }
}
`;
