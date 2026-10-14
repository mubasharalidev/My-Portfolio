/** Monogram: M and A drawn as one continuous signal path, nodes at each vertex. */
export function LogoMark({ className }: { className?: string }) {
  const pts: [number, number][] = [
    [3, 23], [3, 7], [11, 16], [19, 7], [19, 23], [25, 7], [31, 23],
  ];
  return (
    <svg viewBox="0 0 34 30" fill="none" className={className} aria-hidden>
      <polyline
        points={pts.map((p) => p.join(",")).join(" ")}
        stroke="url(#logo-g)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <line x1="22" y1="17" x2="28" y2="17" stroke="url(#logo-g)" strokeWidth="2" strokeLinecap="round" />
      {pts.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" fill="#080B12" stroke="#59E5E8" strokeWidth="1.2" />
      ))}
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="34" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#59E5E8" />
          <stop offset="1" stopColor="#6488FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}
