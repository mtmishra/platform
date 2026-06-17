"use client";

import React from "react";

interface AnimatedScoreRingProps {
  /** Final score value. */
  score: number;
  /** Scale bounds — defaults to the LeapScore 300–900 range (Sprint 7 engine). */
  min?: number;
  max?: number;
  band: string;
  label: string;
  /** Tailwind text-color class for the arc + number, e.g. "text-status-success". */
  tone?: string;
  /** Render on a dark feature surface (adjusts band/label text colors). */
  onDark?: boolean;
}

/**
 * Animated SVG score gauge. Counts the number up and sweeps the arc on mount
 * (and whenever it scrolls into view). Animation uses opacity/stroke transitions
 * only — no layout-affecting properties (Phase 6 motion rule).
 */
export function AnimatedScoreRing({
  score,
  min = 300,
  max = 900,
  band,
  label,
  tone = "text-interactive-primary",
  onDark = false,
}: AnimatedScoreRingProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, (score - min) / (max - min)));
  const targetDash = fraction * circumference;

  const [display, setDisplay] = React.useState(min);
  const [armed, setArmed] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) setArmed(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!armed) return undefined;
    const duration = 1200;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(min + (score - min) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, score, min]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-3">
      <div className="relative h-[200px] w-[200px]">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="14" className="stroke-border-token-default" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={armed ? circumference - targetDash : circumference}
            className={`${tone} stroke-current`}
            style={{ transition: "stroke-dashoffset 1200ms cubic-bezier(0,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{display}</span>
          <span className={onDark ? "text-body-sm text-white/50" : "text-body-sm text-foreground-tertiary"}>/ {max}</span>
        </div>
      </div>
      <div className="text-center">
        <p className={onDark ? "text-h3 font-semibold text-foreground-on-dark" : "text-h3 font-semibold text-foreground-primary"}>{band}</p>
        <p className={onDark ? "text-body-sm text-white/60" : "text-body-sm text-foreground-tertiary"}>{label}</p>
      </div>
    </div>
  );
}
