export function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="lg-primary" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.28 0.06 265)" />
            <stop offset="1" stopColor="oklch(0.5 0.14 265)" />
          </linearGradient>
          <linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="oklch(0.85 0.12 85)" />
            <stop offset="1" stopColor="oklch(0.7 0.14 65)" />
          </linearGradient>
        </defs>
        {/* Rounded tile background */}
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#lg-primary)" />
        {/* Abstract building / signal mark: three ascending bars behind a roof arch */}
        <rect x="12" y="26" width="4" height="10" rx="1.2" fill="url(#lg-gold)" opacity="0.55" />
        <rect x="18" y="22" width="4" height="14" rx="1.2" fill="url(#lg-gold)" opacity="0.75" />
        <rect x="24" y="18" width="4" height="18" rx="1.2" fill="url(#lg-gold)" />
        {/* Roof / apex line */}
        <path d="M10 20 L26 10 L38 18" stroke="url(#lg-gold)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* AI signal dot */}
        <circle cx="38" cy="18" r="2.4" fill="url(#lg-gold)" />
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className="font-display text-base font-semibold tracking-tight">Vendra <span className="text-gradient-gold">AI</span></div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Prospection Immo</div>
        </div>
      )}
    </div>
  );
}
