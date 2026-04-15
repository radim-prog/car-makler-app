import type { SVGProps } from "react";
import { ECOSYSTEM_CYCLE_CSS } from "./ecosystemCycleStyles";

// =====================================================================
//  EcosystemCycle — 4 propojené produkty CarMakléř jako cycle diagram
//  FIX-040 (F-047 continuation): Ekosystém cycle SVG pro homepage hero
//  AUDIT-028 T-028-007 / LAUNCH-CHECKLIST C7
//  Design tokens: FIX-022 (midnight paleta, Fraunces, JetBrains Mono)
//  Respektuje prefers-reduced-motion (animace vypnuté).
// =====================================================================

export type EcosystemOrientation = "circular" | "horizontal";

export interface EcosystemCycleProps extends Omit<SVGProps<SVGSVGElement>, "orientation"> {
  orientation?: EcosystemOrientation;
  /** Zapne pulse + dash-flow animace na šipkách (hero variant). */
  animated?: boolean;
  /** Skryje popisky šipek a podtitulky uzlů (kompaktní subpage variant). */
  showLabels?: boolean;
  /** Accessible label pro screen readery. */
  title?: string;
}

// ---- Node definice (shared between variants) ----

type NodeKey = "marketplace" | "makler" | "inzerce" | "shop";

interface Node {
  key: NodeKey;
  name: string;
  subtitle: string;
  accent: string;       // primary stroke / accent color
  accentBg: string;     // soft fill for node body
  accentBorder: string; // border color for soft fill
  icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode;
}

const NODE_ICONS: Record<NodeKey, (p: SVGProps<SVGSVGElement>) => React.ReactNode> = {
  marketplace: (p) => (
    <g {...p}>
      <rect x="-14" y="-10" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M-14 -4 L14 -4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="-7" cy="3" r="1.6" fill="currentColor" />
      <circle cx="0" cy="3" r="1.6" fill="currentColor" />
      <circle cx="7" cy="3" r="1.6" fill="currentColor" />
    </g>
  ),
  makler: (p) => (
    <g {...p}>
      <circle cx="0" cy="-5" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M-9 11 C-9 4, -4 1, 0 1 C4 1, 9 4, 9 11" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M0 4 L0 -0.4" stroke="currentColor" strokeWidth="1.6" />
    </g>
  ),
  inzerce: (p) => (
    <g {...p}>
      <rect x="-13" y="-10" width="26" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M-13 -2 L13 -2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M-9 3 L-2 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-9 7 L5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="9" cy="-6" r="1.4" fill="currentColor" />
    </g>
  ),
  shop: (p) => (
    <g {...p}>
      <path d="M-12 -5 L-10 -10 L10 -10 L12 -5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="-12" y="-5" width="24" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M-4 -5 L-4 1 A4 4 0 0 0 4 1 L4 -5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </g>
  ),
};

const NODES: Node[] = [
  {
    key: "marketplace",
    name: "Marketplace",
    subtitle: "Autíčkáři + investoři",
    accent: "#6366F1",
    accentBg: "#EEF2FF",
    accentBorder: "#C7D2FE",
    icon: NODE_ICONS.marketplace,
  },
  {
    key: "makler",
    name: "Makléřská síť",
    subtitle: "142 certifikovaných makléřů",
    accent: "#F97316",
    accentBg: "#FFF7ED",
    accentBorder: "#FED7AA",
    icon: NODE_ICONS.makler,
  },
  {
    key: "shop",
    name: "Shop",
    subtitle: "Díly z rozebraných aut",
    accent: "#10B981",
    accentBg: "#ECFDF5",
    accentBorder: "#A7F3D0",
    icon: NODE_ICONS.shop,
  },
  {
    key: "inzerce",
    name: "Inzerce",
    subtitle: "Publikace nabídky",
    accent: "#0D1F3C",
    accentBg: "#F4F6FB",
    accentBorder: "#C5CFE0",
    icon: NODE_ICONS.inzerce,
  },
];

const NODE_BY_KEY: Record<NodeKey, Node> = Object.fromEntries(NODES.map((n) => [n.key, n])) as Record<NodeKey, Node>;

// ---------- Main component ----------

export function EcosystemCycle({
  orientation = "circular",
  animated = false,
  showLabels = true,
  title = "Ekosystém CarMakléř: Marketplace, Makléřská síť, Inzerce, Shop — propojené cyklem obchodu",
  className,
  ...rest
}: EcosystemCycleProps) {
  const isCircular = orientation === "circular";
  const viewBox = isCircular ? "0 0 800 600" : "0 0 1200 320";

  return (
    <svg
      {...rest}
      className={className}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <title>{title}</title>
      <defs>
        <marker
          id="eco-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#94A3BE" />
        </marker>
        <marker
          id="eco-arrow-orange"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="#F97316" />
        </marker>
        {animated ? <style>{ECOSYSTEM_CYCLE_CSS}</style> : null}
      </defs>

      {isCircular ? (
        <CircularLayout animated={animated} showLabels={showLabels} />
      ) : (
        <HorizontalLayout animated={animated} showLabels={showLabels} />
      )}
    </svg>
  );
}

export default EcosystemCycle;

// ---------- Circular layout ----------

function CircularLayout({ animated, showLabels }: { animated: boolean; showLabels: boolean }) {
  // Satellite positions on circle r=210 from center (400, 300)
  const positions: Record<NodeKey, { x: number; y: number }> = {
    marketplace: { x: 400, y: 90 },   // top
    makler:      { x: 610, y: 300 },  // right
    shop:        { x: 400, y: 510 },  // bottom
    inzerce:     { x: 190, y: 300 },  // left
  };

  return (
    <>
      {/* Ambient background ring */}
      <circle cx="400" cy="300" r="235" fill="none" stroke="#E4E9F2" strokeWidth="1" strokeDasharray="2 6" />

      {/* Flow arrows (clockwise cycle: MP → Makléř → Shop → Inzerce → MP) */}
      <CircularArrow from={positions.marketplace} to={positions.makler} label={showLabels ? "přivádí auta" : ""} animated={animated} />
      <CircularArrow from={positions.makler} to={positions.shop} label={showLabels ? "díly z demontáže" : ""} animated={animated} />
      <CircularArrow from={positions.shop} to={positions.inzerce} label={showLabels ? "sdílí fleet data" : ""} animated={animated} />
      <CircularArrow from={positions.inzerce} to={positions.marketplace} label={showLabels ? "nové příležitosti" : ""} animated={animated} />

      {/* Cross-link Makléř → Inzerce (auto se publikuje) — dashed, secondary */}
      <path
        d="M 610 300 C 500 300, 300 300, 190 300"
        stroke="#94A3BE"
        strokeWidth="1.2"
        strokeDasharray="3 4"
        fill="none"
        opacity="0.45"
      />
      {showLabels ? (
        <text
          x="400"
          y="294"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.1em"
          fill="#5C7194"
          style={{ textTransform: "uppercase" }}
        >
          publikace inzerátu
        </text>
      ) : null}

      {/* Central hub */}
      <g transform="translate(400 300)">
        <circle r="76" fill="#0D1F3C" />
        <circle r="76" fill="none" stroke="#F97316" strokeWidth="1.4" />
        <circle r="64" fill="none" stroke="#1A2F52" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
        <text
          y="-6"
          textAnchor="middle"
          fontFamily="'Fraunces', Georgia, serif"
          fontSize="22"
          fontWeight="500"
          fill="#F4F6FB"
          letterSpacing="-0.01em"
        >
          CarMakléř
        </text>
        <text
          y="14"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.16em"
          fill="#F97316"
          style={{ textTransform: "uppercase" }}
        >
          ekosystém
        </text>
      </g>

      {/* Satellite nodes */}
      {NODES.map((n) => (
        <SatelliteNode
          key={n.key}
          node={n}
          cx={positions[n.key].x}
          cy={positions[n.key].y}
          showSubtitle={showLabels}
          animated={animated}
        />
      ))}
    </>
  );
}

// ---------- Satellite node (shared between layouts) ----------

function SatelliteNode({
  node,
  cx,
  cy,
  showSubtitle,
  animated,
}: {
  node: Node;
  cx: number;
  cy: number;
  showSubtitle: boolean;
  animated: boolean;
}) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle
        r="56"
        fill={node.accentBg}
        stroke={node.accentBorder}
        strokeWidth="1"
        className={animated ? "eco-node-animated" : undefined}
      />
      <circle r="56" fill="none" stroke={node.accent} strokeWidth="1.4" />
      {/* Icon (colored by accent) */}
      <g color={node.accent} transform="translate(0 -16)">{node.icon({})}</g>
      <text
        y="14"
        textAnchor="middle"
        fontFamily="'Fraunces', Georgia, serif"
        fontSize="16"
        fontWeight="500"
        fill="#0D1F3C"
        letterSpacing="-0.01em"
      >
        {node.name}
      </text>
      {showSubtitle ? (
        <text
          y="32"
          textAnchor="middle"
          fontFamily="'Outfit', system-ui, sans-serif"
          fontSize="11"
          fill="#5C7194"
        >
          {node.subtitle}
        </text>
      ) : null}
    </g>
  );
}

// ---------- Arrow along arc of main ring ----------

function CircularArrow({
  from,
  to,
  label,
  animated,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  label: string;
  animated: boolean;
}) {
  // Compute trimmed endpoints so arrows don't pierce the node circles (r=56)
  const nodeR = 58;
  const startAngle = Math.atan2(from.y - 300, from.x - 400);
  const endAngle = Math.atan2(to.y - 300, to.x - 400);
  const sx = from.x + Math.cos(startAngle + Math.PI / 2) * nodeR * 0.55 + (to.x - from.x) * 0.08;
  const sy = from.y + Math.sin(startAngle + Math.PI / 2) * nodeR * 0.55 + (to.y - from.y) * 0.08;
  const ex = to.x + Math.cos(endAngle - Math.PI / 2) * nodeR * 0.55 + (from.x - to.x) * 0.08;
  const ey = to.y + Math.sin(endAngle - Math.PI / 2) * nodeR * 0.55 + (from.y - to.y) * 0.08;

  // Curve control — bulge outward (away from center at 400,300)
  const midX = (sx + ex) / 2;
  const midY = (sy + ey) / 2;
  const dirOutX = midX - 400;
  const dirOutY = midY - 300;
  const lenOut = Math.sqrt(dirOutX * dirOutX + dirOutY * dirOutY) || 1;
  const bulge = 38;
  const cx = midX + (dirOutX / lenOut) * bulge;
  const cy = midY + (dirOutY / lenOut) * bulge;

  // Label position: same direction, pushed further out for readability
  const labelX = midX + (dirOutX / lenOut) * (bulge + 28);
  const labelY = midY + (dirOutY / lenOut) * (bulge + 28);

  return (
    <g>
      <path
        d={`M ${sx} ${sy} Q ${cx} ${cy}, ${ex} ${ey}`}
        stroke="#94A3BE"
        strokeWidth="1.6"
        fill="none"
        markerEnd="url(#eco-arrow)"
        className={animated ? "eco-flow-animated" : undefined}
        strokeLinecap="round"
      />
      {label ? (
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.12em"
          fill="#5C7194"
          style={{ textTransform: "uppercase" }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

// ---------- Horizontal layout (alternative) ----------

function HorizontalLayout({ animated, showLabels }: { animated: boolean; showLabels: boolean }) {
  // 4 nodes in a row at y=160, spaced evenly; cycle arrow below wraps back
  const order: NodeKey[] = ["marketplace", "makler", "inzerce", "shop"];
  const labels = ["přivádí auta", "publikuje inzerát", "díly z demontáže", "nové příležitosti"];
  const positions = order.map((_, i) => ({ x: 160 + i * 293, y: 160 }));

  return (
    <>
      {/* Straight flow arrows between adjacent nodes */}
      {order.map((_, i) => {
        if (i === order.length - 1) return null;
        const from = positions[i];
        const to = positions[i + 1];
        return (
          <HorizontalArrow
            key={`arr-${i}`}
            x1={from.x + 64}
            x2={to.x - 64}
            y={from.y}
            label={showLabels ? labels[i] : ""}
            animated={animated}
          />
        );
      })}

      {/* Wrap-around: last → first (curving below) */}
      <path
        d={`M ${positions[order.length - 1].x} ${positions[order.length - 1].y + 56}
           C ${positions[order.length - 1].x} 270, ${positions[0].x} 270, ${positions[0].x} ${positions[0].y + 56}`}
        stroke="#94A3BE"
        strokeWidth="1.6"
        fill="none"
        markerEnd="url(#eco-arrow)"
        className={animated ? "eco-flow-animated" : undefined}
      />
      {showLabels ? (
        <text
          x="600"
          y="296"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', ui-monospace, monospace"
          fontSize="10"
          letterSpacing="0.12em"
          fill="#5C7194"
          style={{ textTransform: "uppercase" }}
        >
          {labels[3]}
        </text>
      ) : null}

      {/* Nodes */}
      {order.map((key, i) => (
        <SatelliteNode
          key={key}
          node={NODE_BY_KEY[key]}
          cx={positions[i].x}
          cy={positions[i].y}
          showSubtitle={showLabels}
          animated={animated}
        />
      ))}
    </>
  );
}

function HorizontalArrow({
  x1,
  x2,
  y,
  label,
  animated,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  animated: boolean;
}) {
  const midX = (x1 + x2) / 2;
  return (
    <g>
      <path
        d={`M ${x1} ${y} L ${x2} ${y}`}
        stroke="#94A3BE"
        strokeWidth="1.6"
        fill="none"
        markerEnd="url(#eco-arrow)"
        className={animated ? "eco-flow-animated" : undefined}
      />
      <text
        x={midX}
        y={y - 10}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize="10"
        letterSpacing="0.12em"
        fill="#5C7194"
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </text>
    </g>
  );
}
