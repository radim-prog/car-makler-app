/**
 * B2B Hero Accent — editorial visual asset pro B2B landing hery
 * FIX-055 (Designer, 2026-04-15, nice-to-have polish)
 *
 * Drop-in SVG composition pro `/pro-makleri`, `/pro-investory`, `/pro-bazary`.
 * Každá varianta má vlastní persona-focal composition:
 *   - makleri   → síť uzlů + centrální hub + 5% badge
 *   - investory → váhy (kapitál vs. vozidlo) + §1115 OZ + flow arrows
 *   - bazary    → stack vozových siluet + throughput arrow + volume pill
 *
 * Design tokeny: FIX-022 (midnight paleta, Fraunces, JetBrains Mono,
 * data-broker #F97316, data-investor #6366F1).
 *
 * Usage:
 *   <B2BHeroAccent variant="investory" />
 *
 * Integrace v existujících hero sekcích (2-col grid: text vlevo, accent vpravo).
 * Integrace NENÍ součástí této commity — implementátor napojí až bude připraven.
 */

import { B2B_HERO_ACCENT_CSS } from "./b2bHeroAccentStyles";

export type B2BHeroVariant = "makleri" | "investory" | "bazary";

interface Meta {
  kicker: string;
  title: string;
  hint: string;
  accent: string;
}

const META: Record<B2BHeroVariant, Meta> = {
  makleri: {
    kicker: "Makléřská síť",
    title: "3 regiony · 1 hub",
    hint: "Provize 5 % z prodejní ceny",
    accent: "#F97316",
  },
  investory: {
    kicker: "Investor · §1115 OZ",
    title: "Vklad → Vůz → Zisk",
    hint: "Spolumajitelství konkrétních vozů",
    accent: "#6366F1",
  },
  bazary: {
    kicker: "Bazar · B2B",
    title: "30+ vozů · jeden dashboard",
    hint: "Větší throughput, nižší frikce",
    accent: "#F97316",
  },
};

export interface B2BHeroAccentProps {
  variant: B2BHeroVariant;
  className?: string;
  /** Skrýt overlay meta card (jen pure SVG). Default false. */
  hideCaption?: boolean;
}

export function B2BHeroAccent({ variant, className, hideCaption = false }: B2BHeroAccentProps) {
  const meta = META[variant];

  return (
    <>
      <style>{B2B_HERO_ACCENT_CSS}</style>
      <figure
        className={`b2b-accent-scope b2b-accent--${variant}${className ? ` ${className}` : ""}`}
        aria-label={`${meta.kicker} — ${meta.title}. ${meta.hint}.`}
      >
        <div className="b2b-accent-canvas" aria-hidden>
          {variant === "makleri" && <MaklerSVG />}
          {variant === "investory" && <InvestorSVG />}
          {variant === "bazary" && <BazarySVG />}
        </div>

        {!hideCaption && (
          <figcaption className="b2b-accent-caption">
            <span className="b2b-accent-kicker">{meta.kicker}</span>
            <strong className="b2b-accent-title">{meta.title}</strong>
            <span className="b2b-accent-hint">{meta.hint}</span>
          </figcaption>
        )}
      </figure>
    </>
  );
}

export default B2BHeroAccent;

// ────────────────────────────────────────────────────────────
//  VARIANT: Makléřská síť
// ────────────────────────────────────────────────────────────
function MaklerSVG() {
  return (
    <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>Síť makléřů s centrálním hubem CarMakléř a provizí 5 %</title>
      <defs>
        <radialGradient id="mak-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F97316" stopOpacity="0.28" />
          <stop offset="1" stopColor="#F97316" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mak-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#F97316" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F97316" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background halo */}
      <circle cx="240" cy="190" r="160" fill="url(#mak-glow)" />

      {/* Orbit rings (dashed) */}
      <circle cx="240" cy="190" r="130" fill="none" stroke="rgba(196,207,224,0.22)" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="240" cy="190" r="80" fill="none" stroke="rgba(249,115,22,0.35)" strokeWidth="1" strokeDasharray="2 4" />

      {/* Connection lines — node to hub */}
      <path d="M100 90 L240 190" stroke="url(#mak-beam)" strokeWidth="1.5" />
      <path d="M380 90 L240 190" stroke="url(#mak-beam)" strokeWidth="1.5" />
      <path d="M80 280 L240 190" stroke="url(#mak-beam)" strokeWidth="1.5" />
      <path d="M400 280 L240 190" stroke="url(#mak-beam)" strokeWidth="1.5" />

      {/* Agent nodes (4 regions) */}
      {[
        { cx: 100, cy: 90, label: "Praha" },
        { cx: 380, cy: 90, label: "Brno" },
        { cx: 80, cy: 280, label: "Plzeň" },
        { cx: 400, cy: 280, label: "Ostrava" },
      ].map((n, i) => (
        <g key={i} transform={`translate(${n.cx} ${n.cy})`}>
          <circle r="26" fill="#0D1F3C" stroke="#FED7AA" strokeWidth="1.5" />
          <circle r="26" fill="none" stroke="#F97316" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
          {/* Agent silhouette (head + shoulders) */}
          <circle cx="0" cy="-6" r="6" fill="#F4F6FB" />
          <path d="M-10 12 Q0 2 10 12 L10 18 L-10 18 Z" fill="#F4F6FB" />
          {/* Region label */}
          <text y="44" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#C5CFE0" letterSpacing="0.1em">
            {n.label.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Central hub (CarMakléř) */}
      <g transform="translate(240 190)">
        <circle r="54" fill="#F97316" />
        <circle r="54" fill="none" stroke="#FED7AA" strokeWidth="1.5" />
        <text y="-6" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="16" fontWeight="500" fill="#FFFFFF" letterSpacing="-0.01em">
          CarMakléř
        </text>
        <text y="12" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#FFF7ED" letterSpacing="0.14em">
          HUB
        </text>
      </g>

      {/* 5% provize badge (top-right corner) */}
      <g transform="translate(410 40)">
        <rect x="-34" y="-14" width="68" height="28" rx="14" fill="#FFFFFF" />
        <text x="0" y="-1" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#7C2D12" letterSpacing="0.16em">
          PROVIZE
        </text>
        <text x="0" y="10" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="11" fontWeight="500" fill="#C2410C">
          5 %
        </text>
      </g>

      {/* Small car icon orbiting */}
      <g transform="translate(240 110) scale(0.7)">
        <rect x="-20" y="-8" width="40" height="16" rx="3" fill="#F97316" />
        <circle cx="-12" cy="10" r="4" fill="#0D1F3C" />
        <circle cx="12" cy="10" r="4" fill="#0D1F3C" />
        <path d="M-14 -8 L-8 -14 L8 -14 L14 -8" stroke="#0D1F3C" strokeWidth="1.2" fill="none" />
      </g>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
//  VARIANT: Investor / Spolumajitelství
// ────────────────────────────────────────────────────────────
function InvestorSVG() {
  return (
    <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>Spolumajitelský model podle §1115 OZ — kapitál investora a vozidlo ve vahách</title>
      <defs>
        <radialGradient id="inv-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6366F1" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="inv-beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6366F1" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F97316" stopOpacity="0.5" />
          <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background halo */}
      <circle cx="240" cy="200" r="180" fill="url(#inv-glow)" />

      {/* §1115 OZ banner top */}
      <g transform="translate(240 55)">
        <rect x="-80" y="-16" width="160" height="32" rx="16" fill="#0D1F3C" stroke="#C7D2FE" strokeWidth="1" />
        <text y="-2" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#C7D2FE" letterSpacing="0.22em">
          SPOLUMAJITELSTVÍ
        </text>
        <text y="11" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="12" fontWeight="500" fill="#FFFFFF" fontStyle="italic">
          §1115 OZ
        </text>
      </g>

      {/* Central beam */}
      <path d="M80 220 L400 220" stroke="url(#inv-beam)" strokeWidth="2" />

      {/* Scale fulcrum */}
      <g transform="translate(240 220)">
        <path d="M-12 0 L0 -26 L12 0 Z" fill="#0D1F3C" />
        <rect x="-22" y="0" width="44" height="8" rx="2" fill="#0D1F3C" />
      </g>

      {/* Left pan: kapitál */}
      <g transform="translate(120 140)">
        <path d="M-50 0 Q0 10 50 0 L40 60 Q0 70 -40 60 Z" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
        <path d="M-45 4 L120 80" stroke="#94A3BE" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
        <path d="M45 4 L120 80" stroke="#94A3BE" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
        {/* Coin stack */}
        <g transform="translate(0 22)">
          <ellipse cx="0" cy="10" rx="22" ry="5" fill="#6366F1" />
          <ellipse cx="0" cy="4" rx="22" ry="5" fill="#818CF8" />
          <ellipse cx="0" cy="-2" rx="22" ry="5" fill="#6366F1" />
          <text textAnchor="middle" y="6" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#FFFFFF" letterSpacing="0.1em">
            KAPITÁL
          </text>
        </g>
      </g>

      {/* Right pan: vozidlo */}
      <g transform="translate(360 140)">
        <path d="M-50 0 Q0 10 50 0 L40 60 Q0 70 -40 60 Z" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1.5" />
        <path d="M-45 4 L-120 80" stroke="#94A3BE" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
        <path d="M45 4 L-120 80" stroke="#94A3BE" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.4" />
        {/* Car silhouette */}
        <g transform="translate(0 30)">
          <rect x="-30" y="-8" width="60" height="16" rx="3" fill="#F97316" />
          <path d="M-22 -8 L-14 -16 L14 -16 L22 -8" stroke="#0D1F3C" strokeWidth="1.4" fill="#FED7AA" />
          <circle cx="-18" cy="10" r="5" fill="#0D1F3C" />
          <circle cx="18" cy="10" r="5" fill="#0D1F3C" />
          <circle cx="-18" cy="10" r="2" fill="#FED7AA" />
          <circle cx="18" cy="10" r="2" fill="#FED7AA" />
        </g>
      </g>

      {/* Bottom label: poměr podílu */}
      <g transform="translate(240 315)">
        <rect x="-70" y="-14" width="140" height="28" rx="14" fill="#FFFFFF" stroke="#E4E9F2" strokeWidth="1" />
        <text y="-2" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#5C7194" letterSpacing="0.18em">
          ROZDĚLENÍ ZISKU
        </text>
        <text y="10" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="11" fontWeight="500" fill="#0D1F3C" letterSpacing="-0.01em">
          40 / 40 / 20
        </text>
      </g>
    </svg>
  );
}

// ────────────────────────────────────────────────────────────
//  VARIANT: Bazary / Throughput
// ────────────────────────────────────────────────────────────
function BazarySVG() {
  return (
    <svg viewBox="0 0 480 380" xmlns="http://www.w3.org/2000/svg" role="img">
      <title>Autobazar — stack 30+ vozů a dashboard throughput pro B2B segment</title>
      <defs>
        <radialGradient id="baz-glow" cx="60%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F97316" stopOpacity="0.2" />
          <stop offset="1" stopColor="#F97316" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="baz-arrow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#F97316" stopOpacity="0" />
          <stop offset="1" stopColor="#F97316" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Background halo */}
      <circle cx="290" cy="190" r="190" fill="url(#baz-glow)" />

      {/* Grid of car silhouettes (5×4 = 20 visible, stylized as stock) */}
      <g transform="translate(60 80)">
        {Array.from({ length: 20 }, (_, i) => {
          const col = i % 5;
          const row = Math.floor(i / 5);
          const x = col * 42;
          const y = row * 48;
          const opacity = 0.35 + ((col + row) % 3) * 0.22;
          const isAccent = i === 7 || i === 14;
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={opacity}>
              <rect x="0" y="8" width="34" height="14" rx="2" fill={isAccent ? "#F97316" : "#2D4669"} />
              <path d="M4 8 L9 2 L25 2 L30 8" stroke={isAccent ? "#F97316" : "#2D4669"} strokeWidth="1.2" fill="none" />
              <circle cx="8" cy="24" r="3" fill="#0D1F3C" />
              <circle cx="26" cy="24" r="3" fill="#0D1F3C" />
            </g>
          );
        })}
      </g>

      {/* Dashed frame around stock */}
      <rect x="48" y="66" width="226" height="208" rx="8" fill="none" stroke="rgba(196,207,224,0.3)" strokeWidth="1" strokeDasharray="4 4" />

      {/* Throughput arrow (stock → dashboard) */}
      <g transform="translate(290 190)">
        <path d="M0 0 L60 0" stroke="url(#baz-arrow)" strokeWidth="2.5" />
        <path d="M50 -7 L60 0 L50 7" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Dashboard card (right side) */}
      <g transform="translate(360 120)">
        <rect x="0" y="0" width="100" height="140" rx="8" fill="#0D1F3C" stroke="#C5CFE0" strokeWidth="1" />
        <rect x="10" y="14" width="60" height="6" rx="2" fill="#F97316" />
        <rect x="10" y="28" width="80" height="4" rx="1" fill="#94A3BE" opacity="0.5" />
        <rect x="10" y="38" width="65" height="4" rx="1" fill="#94A3BE" opacity="0.4" />

        {/* Mini bar chart */}
        <g transform="translate(10 60)">
          <rect x="0" y="40" width="10" height="20" fill="#F97316" opacity="0.6" />
          <rect x="14" y="30" width="10" height="30" fill="#F97316" opacity="0.75" />
          <rect x="28" y="18" width="10" height="42" fill="#F97316" />
          <rect x="42" y="26" width="10" height="34" fill="#F97316" opacity="0.85" />
          <rect x="56" y="10" width="10" height="50" fill="#F97316" opacity="0.9" />
          <rect x="70" y="22" width="10" height="38" fill="#F97316" opacity="0.7" />
        </g>

        <rect x="10" y="128" width="80" height="4" rx="1" fill="#5C7194" />
      </g>

      {/* Volume pill */}
      <g transform="translate(161 46)">
        <rect x="-54" y="-14" width="108" height="28" rx="14" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="1" />
        <text y="-2" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#7C2D12" letterSpacing="0.18em">
          TVŮJ STOCK
        </text>
        <text y="10" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="12" fontWeight="500" fill="#C2410C">
          30+ vozů
        </text>
      </g>
    </svg>
  );
}
