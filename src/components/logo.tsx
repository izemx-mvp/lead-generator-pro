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
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#lg-primary)" />
        <path d="M14 34V14h4.5l11 14V14H34v20h-4.5l-11-14v14H14z" fill="url(#lg-gold)" />
        <circle cx="38" cy="10" r="3" fill="url(#lg-gold)" />
      </svg>
      {withText && (
        <div className="leading-tight">
          <div className="font-display text-base font-semibold tracking-tight">Naïma <span className="text-gradient-gold">AI</span></div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Prospection Immo</div>
        </div>
      )}
    </div>
  );
}
