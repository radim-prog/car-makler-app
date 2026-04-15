export const ECOSYSTEM_CYCLE_CSS = `
@keyframes eco-cycle-dash {
  from { stroke-dashoffset: 24; }
  to   { stroke-dashoffset: 0; }
}
@keyframes eco-cycle-pulse {
  0%, 100% { opacity: 0.85; }
  50%      { opacity: 0.45; }
}
.eco-flow-animated {
  stroke-dasharray: 6 4;
  animation: eco-cycle-dash 2.6s linear infinite;
}
.eco-node-animated {
  animation: eco-cycle-pulse 3.2s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: center;
}
@media (prefers-reduced-motion: reduce) {
  .eco-flow-animated,
  .eco-node-animated {
    animation: none;
  }
}
`;

// Design tokens (FIX-022 editorial) — exported for reuse in composed UIs.
export const ECOSYSTEM_TOKENS = {
  midnight: {
    50:  "#F4F6FB",
    100: "#E4E9F2",
    200: "#C5CFE0",
    300: "#94A3BE",
    400: "#5C7194",
    500: "#2D4669",
    600: "#1A2F52",
    700: "#0D1F3C",
    800: "#081530",
    900: "#040B1F",
  },
  broker:   "#F97316",
  investor: "#6366F1",
  shop:     "#10B981",
  inzerce:  "#0D1F3C",
  arrow:    "#94A3BE",
} as const;
