import Image from "next/image";

/**
 * Pavel 4-scene editorial illustration wrapper.
 * FIX-042 (Designer, 2026-04-15) — modelový scénář autíčkáře pro B2B landing.
 *
 * Scény navazují na AUDIT-028c §2.3 timeline:
 *   1 · DELIVERY  — Pavel přiveze starší vůz ze sídliště (T+0 den)
 *   2 · INVESTOR  — §1115 OZ smlouva s Tomášem, handshake nad laptopem (T+2 dny)
 *   3 · REPAIR    — dílna, vůz na zvedáku, diagnostický tablet (T+5–40 dní)
 *   4 · HANDOFF   — prodej koncovému zákazníkovi, klíče a 335 000 Kč (T+85–90 dní)
 *
 * Design tokeny (FIX-022): midnight paleta, data-broker #F97316 akcent.
 * Zdroj SVG: `public/illustrations/pavel-0X-*.svg` — servírováno Next.js staticky.
 */

export type PavelScene = 1 | 2 | 3 | 4;

export interface PavelIllustrationProps {
  scene: PavelScene;
  /** Přepíše default alt text (pro AT dle kontextu sekce). */
  alt?: string;
  className?: string;
  /** Width v px, default 480 (matches viewBox). */
  width?: number;
  /** Height v px, default 320. */
  height?: number;
  /** Předpočtená priorita načtení (hero = true). */
  priority?: boolean;
  /** Zaokrouhlený rámeček – zapnuto defaultně (SVG má clipPath rx=14). */
  rounded?: boolean;
}

interface SceneMeta {
  src: string;
  alt: string;
  label: string;
}

const SCENES: Record<PavelScene, SceneMeta> = {
  1: {
    src: "/illustrations/pavel-01-deliver.svg",
    alt: "Pavel přiveze starší vůz z panelákového sídliště, s klíči v ruce.",
    label: "Den 1 · Nábor vozu",
  },
  2: {
    src: "/illustrations/pavel-02-investor.svg",
    alt: "Pavel a investor Tomáš si podávají ruce nad smlouvou §1115 OZ a laptopem s grafem ROI.",
    label: "Den 2 · Spoluvlastnická smlouva",
  },
  3: {
    src: "/illustrations/pavel-03-repair.svg",
    alt: "Pavel v dílně, auto na zvedáku, diagnostický tablet ukazuje zdravotní stav vozu.",
    label: "Den 5–40 · Servis a příprava",
  },
  4: {
    src: "/illustrations/pavel-04-handoff.svg",
    alt: "Pavel předává klíče koncovému zákazníkovi u vyleštěného vozu, cena 335 000 Kč, cedule Prodáno.",
    label: "Den 85–90 · Prodej koncovému zákazníkovi",
  },
};

export function PavelIllustration({
  scene,
  alt,
  className,
  width = 480,
  height = 320,
  priority = false,
  rounded = true,
}: PavelIllustrationProps) {
  const meta = SCENES[scene];
  const resolvedAlt = alt ?? meta.alt;

  return (
    <figure
      className={className}
      style={{
        margin: 0,
        display: "block",
        width: "100%",
        maxWidth: `${width}px`,
      }}
    >
      <Image
        src={meta.src}
        alt={resolvedAlt}
        width={width}
        height={height}
        priority={priority}
        sizes={`(max-width: 720px) 100vw, ${width}px`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: rounded ? "14px" : undefined,
        }}
      />
      <figcaption
        style={{
          marginTop: "0.625rem",
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: "0.6875rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#5C7194",
        }}
      >
        {meta.label}
      </figcaption>
    </figure>
  );
}

/** Všechny 4 scény v pořadí – užitečné pro timeline strip komponentu. */
export const PAVEL_SCENES: PavelScene[] = [1, 2, 3, 4];

/** Programatický přístup k metadatům (např. pro ALT audit / SEO strukturovaná data). */
export function getPavelSceneMeta(scene: PavelScene): SceneMeta {
  return SCENES[scene];
}
