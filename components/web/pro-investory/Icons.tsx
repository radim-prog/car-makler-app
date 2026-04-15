type IconProps = {
  size?: number;
  className?: string;
};

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function ShieldCheckIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function DocumentCheckIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6z" />
      <path d="M14 3v6h6" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

export function ArrowTrendingUpIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M14 7h7v7" />
    </svg>
  );
}

export function ScaleIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M12 3v18" />
      <path d="M5 21h14" />
      <path d="M5 8l-3 6a4 4 0 0 0 6 0l-3-6z" />
      <path d="M19 8l-3 6a4 4 0 0 0 6 0l-3-6z" />
      <path d="M5 8h14" />
    </svg>
  );
}

export function ExclamationTriangleIcon({ size, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} aria-hidden="true">
      <path d="M12 3L2 21h20L12 3z" />
      <path d="M12 10v5" />
      <path d="M12 18h.01" />
    </svg>
  );
}
