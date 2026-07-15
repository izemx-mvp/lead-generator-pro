export function BackgroundFx() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "var(--gradient-mesh)" }}
      />
      <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl animate-pulse [animation-duration:8s]" />
      <div className="absolute top-1/3 -right-24 h-[380px] w-[380px] rounded-full bg-gold/20 blur-3xl animate-pulse [animation-duration:11s]" />
      <div className="absolute -bottom-32 left-1/3 h-[500px] w-[500px] rounded-full bg-success/10 blur-3xl animate-pulse [animation-duration:14s]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-fx">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-fx)" />
      </svg>
    </div>
  );
}
