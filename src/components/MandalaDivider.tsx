export function MandalaDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-10" aria-hidden="true">
      <span className="h-px w-16 sm:w-32 bg-gradient-to-r from-transparent to-[var(--saffron)]" />
      <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="text-saffron">
        <g stroke="currentColor" strokeWidth="1.2" fill="none">
          <circle cx="32" cy="32" r="6" />
          <circle cx="32" cy="32" r="14" opacity="0.7" />
          <circle cx="32" cy="32" r="22" opacity="0.4" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const x1 = 32 + Math.cos(a) * 14;
            const y1 = 32 + Math.sin(a) * 14;
            const x2 = 32 + Math.cos(a) * 28;
            const y2 = 32 + Math.sin(a) * 28;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity="0.6" />;
          })}
        </g>
        <circle cx="32" cy="32" r="2.5" fill="currentColor" />
      </svg>
      <span className="h-px w-16 sm:w-32 bg-gradient-to-l from-transparent to-[var(--saffron)]" />
    </div>
  );
}