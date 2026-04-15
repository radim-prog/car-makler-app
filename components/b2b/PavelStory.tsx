import type { ReactNode, SVGProps } from "react";
import { PAVEL_STORY_CSS } from "./pavelStoryStyles";
import {
  PavelIllustration,
  type PavelScene,
} from "../illustrations/PavelIllustration";

// =====================================================================
//  PavelStory — modelový scénář autíčkáře pro /pro-autickare landing
//  FIX-036 (F-047 continuation): Editorial B2B illustration + timeline
//  Design tokens: FIX-022 (midnight paleta, Fraunces, JetBrains Mono)
//  Copy reference: AUDIT-028c §2.3
//  Disclaimer: povinný nad + pod sekcí (modelový scénář, ne projekce)
// =====================================================================

// ---------- Icons (inline Lucide-style, no runtime dep) ----------

type IconProps = SVGProps<SVGSVGElement>;

const iconBase: IconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 28,
  height: 28,
  "aria-hidden": true,
};

const Sparkles = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    <path d="M5 15l.5 1.5L7 17l-1.5.5L5 19l-.5-1.5L3 17l1.5-.5L5 15z" />
  </svg>
);

const FileText = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
    <path d="M14 3v6h6" />
    <path d="M8 13h8M8 17h5" />
  </svg>
);

const ShieldCheck = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.2 8.5-8 10-4.8-1.5-8-5.5-8-10V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const UserCheck = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <circle cx="10" cy="8" r="4" />
    <path d="M2 21c0-4 3.6-6 8-6 1.6 0 3 .3 4.2.8" />
    <path d="M17 17l2 2 4-4" />
  </svg>
);

const Wallet = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M3 7V6a2 2 0 012-2h12v4" />
    <path d="M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    <circle cx="17" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const Wrench = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M14.7 6.3a4 4 0 015.7 5.2l-2.1-2.1-2.1.7-.7 2.1 2.1 2.1a4 4 0 01-5.2-.7L4 20l-2-2 8.4-8.4a4 4 0 014.3-3.3z" />
  </svg>
);

const Handshake = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M11 17l-2 2a1.5 1.5 0 01-2.1-2.1L11 12.7" />
    <path d="M14 20l-1 1a1.5 1.5 0 01-2.1-2.1l1-1" />
    <path d="M16 17l2 2a1.5 1.5 0 002.1-2.1L16 12.7" />
    <path d="M18.5 11l-4-4-3 1-3-3-5 5 3 3 2-1 3 3" />
  </svg>
);

const PieChart = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M21 12a9 9 0 11-9-9v9h9z" />
    <path d="M12 3a9 9 0 019 9h-9V3z" />
  </svg>
);

const AlertTriangle = (p: IconProps) => (
  <svg {...iconBase} {...p}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v4" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

// ---------- Capital-flow hero SVG ----------

function CapitalFlowSVG() {
  // Editorial flow: Investor Tomáš (indigo) → Pavel (orange) → Makléři + Platform + Shop (midnight/green)
  return (
    <svg
      className="pavel-flow-svg"
      viewBox="0 0 1040 280"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Tok kapitálu a zisku — Tomáš (investor) → Pavel (autíčkář) → makléři, platforma, Shop"
    >
      <defs>
        <marker
          id="arr-mid"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#94A3BE" />
        </marker>
        <linearGradient id="beam" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6366F1" stopOpacity="0.12" />
          <stop offset="0.5" stopColor="#F97316" stopOpacity="0.22" />
          <stop offset="1" stopColor="#0D1F3C" stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* Beam background */}
      <rect x="80" y="120" width="880" height="40" rx="20" fill="url(#beam)" />

      {/* ---- Investor node (left) ---- */}
      <g transform="translate(140 140)">
        <circle r="54" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        <circle r="54" fill="none" stroke="#6366F1" strokeWidth="1.2" strokeDasharray="2 4" opacity="0.5" />
        <text y="-8" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="22" fontWeight="500" fill="#3730A3">
          Tomáš
        </text>
        <text y="14" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.1em" fill="#4F46E5">
          INVESTOR
        </text>
      </g>
      <text x="140" y="232" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.08em" fill="#5C7194">
        vklad kapitálu
      </text>
      <text x="140" y="252" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="22" fontWeight="500" fill="#0D1F3C" letterSpacing="-0.01em">
        2 100 000 Kč
      </text>

      {/* ---- Arrow investor → Pavel ---- */}
      <path
        d="M200 140 C 260 140, 290 140, 346 140"
        stroke="#94A3BE"
        strokeWidth="1.4"
        fill="none"
        markerEnd="url(#arr-mid)"
      />
      <text x="273" y="128" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="0.1em" fill="#5C7194">
        §1115 OZ
      </text>

      {/* ---- Pavel node (center) ---- */}
      <g transform="translate(410 140)">
        <circle r="62" fill="#FFF7ED" stroke="#FED7AA" strokeWidth="1" />
        <circle r="62" fill="none" stroke="#F97316" strokeWidth="1.4" strokeDasharray="3 5" opacity="0.6" />
        <text y="-8" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="22" fontWeight="500" fill="#7C2D12">
          Pavel
        </text>
        <text y="14" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.1em" fill="#C2410C">
          AUTÍČKÁŘ
        </text>
      </g>
      <text x="410" y="234" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.08em" fill="#5C7194">
        10× Škoda Octavia • 90 dní
      </text>

      {/* ---- Fan-out arrows Pavel → 3 outputs ---- */}
      <path d="M472 140 C 540 140, 560 90, 620 90" stroke="#94A3BE" strokeWidth="1.4" fill="none" markerEnd="url(#arr-mid)" />
      <path d="M472 140 C 540 140, 560 140, 620 140" stroke="#94A3BE" strokeWidth="1.4" fill="none" markerEnd="url(#arr-mid)" />
      <path d="M472 140 C 540 140, 560 190, 620 190" stroke="#94A3BE" strokeWidth="1.4" fill="none" markerEnd="url(#arr-mid)" />

      {/* ---- Output 1: Makléři (top) ---- */}
      <g transform="translate(700 90)">
        <rect x="-60" y="-22" width="200" height="44" rx="22" fill="#FFF7ED" stroke="#FED7AA" />
        <text x="40" y="-3" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="15" fontWeight="500" fill="#7C2D12">
          Makléři síť
        </text>
        <text x="40" y="14" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.06em" fill="#C2410C">
          5 % provize
        </text>
      </g>

      {/* ---- Output 2: Prodej zákazníkům (middle) ---- */}
      <g transform="translate(700 140)">
        <rect x="-60" y="-22" width="200" height="44" rx="22" fill="#F4F6FB" stroke="#C5CFE0" />
        <text x="40" y="-3" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="15" fontWeight="500" fill="#0D1F3C">
          Koncoví zákazníci
        </text>
        <text x="40" y="14" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.06em" fill="#2D4669">
          8 vozů × 340 000 Kč
        </text>
      </g>

      {/* ---- Output 3: CarMakléř Shop (bottom) ---- */}
      <g transform="translate(700 190)">
        <rect x="-60" y="-22" width="200" height="44" rx="22" fill="#ECFDF5" stroke="#A7F3D0" />
        <text x="40" y="-3" textAnchor="middle" fontFamily="'Fraunces', Georgia, serif" fontSize="15" fontWeight="500" fill="#065F46">
          Shop odkup
        </text>
        <text x="40" y="14" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="11" letterSpacing="0.06em" fill="#047857">
          2 vozy • 75 000 Kč
        </text>
      </g>

      {/* ---- Aggregate arrow to profit split ---- */}
      <path d="M880 140 C 930 140, 940 140, 990 140" stroke="#94A3BE" strokeWidth="1.4" fill="none" markerEnd="url(#arr-mid)" />

      {/* ---- Profit split label (right edge) ---- */}
      <g transform="translate(1000 140)">
        <text textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="0.1em" fill="#5C7194" y="-24">
          ZISK K DĚLENÍ
        </text>
        <text textAnchor="end" fontFamily="'Fraunces', Georgia, serif" fontSize="24" fontWeight="500" fill="#0D1F3C" letterSpacing="-0.015em" y="4">
          534 000 Kč
        </text>
        <text textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontSize="10" letterSpacing="0.06em" fill="#5C7194" y="22">
          40 / 40 / 20
        </text>
      </g>
    </svg>
  );
}

// ---------- Timeline steps ----------

type Accent = "default" | "broker" | "investor" | "shop";

type Step = {
  day: string;
  title: string;
  body: string;
  kpiValue?: string;
  kpiLabel?: string;
  icon: ReactNode;
  accent?: Accent;
  /** FIX-043 — pokud je vyplněno, renderuje se PavelIllustration vedle step textu. */
  illustrationScene?: PavelScene;
  /** Strana illustration na desktopu (alternate). */
  illustrationSide?: "left" | "right";
};

const STEPS: Step[] = [
  {
    day: "Den 1",
    title: "Příležitost",
    body:
      "Leasingová firma ALD odprodává balík 10 kusů Škoda Octavia 2020–2021. Balíková cena 2 050 000 Kč, tržní hodnota po přípravě odhadem 280 000 Kč na vůz. Pavel má na účtu 180 000 Kč, potřebuje dofinancovat 1,9 mil. Kč.",
    kpiValue: "2 050 000 Kč",
    kpiLabel: "balíková cena",
    icon: <Sparkles />,
    accent: "broker",
  },
  {
    day: "Den 2",
    title: "Založení příležitosti na Marketplace",
    body:
      "Pavel vyplní formulář: 10× Škoda Octavia, VIN listy, fotky ze showroomu, nákupní a odhadovaný prodejní mix, časový plán 90 dní. Platforma ověří VIN přes NHTSA + vindecoder.eu a založí nabídku jako Pending verification.",
    kpiValue: "10 VIN",
    kpiLabel: "ověřeno v registrech",
    icon: <FileText />,
  },
  {
    day: "Den 3–4",
    title: "Ověření a publikace",
    body:
      "BackOffice ověří Pavlovu historii — 4 předchozí dealy, reference od 2 makléřů, KYC z daňového přiznání 2024. Nabídka publikována na Marketplace s projekcí ROI 35–45 % p. a.",
    kpiValue: "Verified",
    kpiLabel: "KYC + 2 reference",
    icon: <ShieldCheck />,
  },
  {
    day: "Den 5–8",
    title: "Investor se přihlásí",
    body:
      'Tomáš z Prahy, investor v síti od prosince 2025, najde nabídku přes filtr \u201Edo 3 mil. Kč, Škoda, 60\u201390 dní\u201C. Video-call Pavel + Tomáš + account manager (30 min). Smlouva elektronicky podle §1115 OZ (spolumajitelský model).',
    kpiValue: "2 100 000 Kč",
    kpiLabel: "odsouhlaseno",
    icon: <UserCheck />,
    accent: "investor",
    illustrationScene: 2,
    illustrationSide: "right",
  },
  {
    day: "Den 9",
    title: "Peníze na účtu",
    body:
      "Kapitál přichází na Pavlův firemní účet. Pavel vyjede na Kladno, uhradí ALD, převezme klíče a technické průkazy 10 vozů a odveze je do servisu.",
    kpiValue: "T+0",
    kpiLabel: "převod kapitálu",
    icon: <Wallet />,
    accent: "investor",
    illustrationScene: 1,
    illustrationSide: "left",
  },
  {
    day: "Den 10–35",
    title: "Příprava",
    body:
      "STK, servis, detailing a drobné opravy — průměr 22 000 Kč na vůz. Studiové fotografie přes Cloudinary PWA upload. Vozy v dashboardu označené jako Ready to sell.",
    kpiValue: "220 000 Kč",
    kpiLabel: "náklady na přípravu",
    icon: <Wrench />,
    illustrationScene: 3,
    illustrationSide: "right",
  },
  {
    day: "Den 36–84",
    title: "Prodej přes makléřskou síť",
    body:
      "Vozy přebírají 3 makléři (Petr Malá • Jan Dvořák • Lukáš Novák) ve 4 regionech. Průměrná prodejní cena 340 000 Kč. 8 z 10 vozů prodáno do 75. dne, dva zbývající předány na odkup Shopu (skrytá závada + neatraktivní barva).",
    kpiValue: "8 × 340 000 Kč",
    kpiLabel: "realizované prodeje",
    icon: <Handshake />,
    accent: "broker",
    illustrationScene: 4,
    illustrationSide: "left",
  },
  {
    day: "Den 85–90",
    title: "Shop odkup + vyúčtování",
    body:
      "CarMakléř Shop odkupuje poslední 2 vozy za 75 000 Kč (na díly). Kapitál 2 100 000 Kč vrácen Tomášovi. Provize makléřům 136 000 Kč, platforma 106 800 Kč, zbývající zisk 534 000 Kč jde do finálního rozdělení 40/40/20.",
    kpiValue: "534 000 Kč",
    kpiLabel: "hrubý zisk k dělení",
    icon: <PieChart />,
    accent: "shop",
  },
];

// ---------- Public props ----------

export interface PavelStoryProps {
  headingId?: string;
  className?: string;
}

// ---------- Main component ----------

export function PavelStory({ headingId = "pavel-story", className }: PavelStoryProps) {
  return (
    <section className={`pavel-scope${className ? ` ${className}` : ""}`} aria-labelledby={headingId}>
      <style>{PAVEL_STORY_CSS}</style>

      <div className="pavel-disclaimer" role="note">
        <AlertTriangle className="pavel-disclaimer-icon" />
        <div>
          <strong>Modelový scénář.</strong> Příběh Pavla vznikl na základě průměrných dat z pilotní skupiny Q1 2026. Není to záruka ani projekce zisku — ilustruje, jak platforma funguje. První verifikované case studies se souhlasem klientů zveřejníme v H2 2026.
        </div>
      </div>

      <header className="pavel-hero">
        <div className="pavel-hero-eyebrow">Modelový příběh — Pavel z Kolína</div>
        <h2 id={headingId} className="pavel-hero-headline">
          10 Octavií, <em>90 dní</em>, 534 000 Kč hrubého zisku.
        </h2>
        <p className="pavel-hero-sub">
          Jeden dealer, jeden investor, jedna makléřská síť. Takhle vypadá konkrétní cash-flow na platformě CarMakléř Marketplace — od příležitosti k vyúčtování.
        </p>

        <div className="pavel-metric-strip" role="list">
          <Metric label="Balíková cena" value="2 050 000" unit="Kč" />
          <Metric label="Kapitál investora" value="2 100 000" unit="Kč" />
          <Metric label="Horizont" value="90" unit="dní" />
          <Metric label="Hrubý zisk" value="534 000" unit="Kč" />
        </div>
      </header>

      <div className="pavel-flow">
        <div className="pavel-flow-title">Tok kapitálu a zisku</div>
        <CapitalFlowSVG />
      </div>

      <div className="pavel-timeline-wrap">
        <header className="pavel-timeline-head">
          <div className="pavel-timeline-eyebrow">Průběh dealu</div>
          <h3 className="pavel-timeline-h2">Od prvního telefonátu k vyúčtování za 90 dní</h3>
        </header>
        <ol className="pavel-timeline" role="list">
          {STEPS.map((step, i) => {
            const hasIllustration = step.illustrationScene !== undefined;
            return (
              <li
                key={i}
                className="pavel-step"
                data-accent={step.accent ?? "default"}
                data-illustration={hasIllustration ? "true" : undefined}
                data-side={hasIllustration ? step.illustrationSide ?? "right" : undefined}
              >
                <div className="pavel-step-icon" aria-hidden>
                  {step.icon}
                </div>
                <div className="pavel-step-body">
                  <div className="pavel-step-day">{step.day}</div>
                  <h4 className="pavel-step-title">{step.title}</h4>
                  <p className="pavel-step-text">{step.body}</p>
                </div>
                {step.kpiValue ? (
                  <div className="pavel-step-kpi">
                    <div className="pavel-step-kpi-value">{step.kpiValue}</div>
                    {step.kpiLabel ? <div className="pavel-step-kpi-label">{step.kpiLabel}</div> : null}
                  </div>
                ) : null}
                {step.illustrationScene !== undefined ? (
                  <div className="pavel-step-illustration" aria-hidden>
                    <PavelIllustration scene={step.illustrationScene} width={480} height={320} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="pavel-breakdown">
        <header className="pavel-breakdown-head">
          <div className="pavel-breakdown-eyebrow">Finální rozdělení zisku</div>
          <h3 className="pavel-breakdown-h2">40 % autíčkář · 40 % investor · 20 % platforma (z toho provize makléřům).</h3>
        </header>
        <div className="pavel-breakdown-grid" role="list">
          <PersonaCard
            role="pavel"
            roleLabel="Autíčkář"
            name="Pavel"
            amount="293 600"
            meta={
              <>
                <b>213 600 Kč</b> z hrubého zisku (40 %) + <b>80 000 Kč</b> vrácených vlastních nákladů. Horizont <b>90 dní</b>.
              </>
            }
          />
          <PersonaCard
            role="tomas"
            roleLabel="Investor"
            name="Tomáš"
            amount="213 600"
            meta={
              <>
                Zisk na kapitál <b>2 100 000 Kč</b>. Annualized ROI přibližně <b>40,7 %</b>. Kapitál vrácen v den 90.
              </>
            }
          />
          <PersonaCard
            role="platform"
            roleLabel="Platforma"
            name="CarMakléř"
            amount="242 800"
            meta={
              <>
                <b>106 800 Kč</b> podíl platformy (20 % ze zisku) + <b>136 000 Kč</b> provize vyplacené makléřské síti (5 % z prodejní ceny).
              </>
            }
          />
        </div>
      </div>

      <p className="pavel-footer-note">
        Skutečné výnosy závisí na tržních podmínkách, kvalitě nákupu a rychlosti prodeje. Marketplace je ve fázi invite-only beta — vstup po úspěšném KYC a pilotním dealu s limitem kapitálu 500 000 Kč. Rozdělení zisku <strong>40 / 40 / 20</strong> platí pro všechny dealy na platformě; odchylky pouze po písemné dohodě všech stran před podpisem smlouvy §1115 OZ.
      </p>
    </section>
  );
}

// ---------- Small presentational primitives ----------

function Metric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="pavel-metric" role="listitem">
      <div className="pavel-metric-label">{label}</div>
      <div className="pavel-metric-value">
        {value}
        <span className="unit">{unit}</span>
      </div>
    </div>
  );
}

function PersonaCard({
  role,
  roleLabel,
  name,
  amount,
  meta,
}: {
  role: "pavel" | "tomas" | "platform";
  roleLabel: string;
  name: string;
  amount: string;
  meta: ReactNode;
}) {
  return (
    <div className="pavel-persona-card" data-role={role} role="listitem">
      <div className="pavel-persona-role">{roleLabel}</div>
      <div className="pavel-persona-name">{name}</div>
      <div className="pavel-persona-amount">
        {amount}
        <span className="unit">Kč</span>
      </div>
      <div className="pavel-persona-meta">{meta}</div>
    </div>
  );
}

export default PavelStory;
