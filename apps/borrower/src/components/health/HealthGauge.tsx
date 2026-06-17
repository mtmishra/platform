"use client";

import React from "react";

interface HealthGaugeProps {
  /** 0–100 health score. */
  score: number;
  band: string;
}

const TONE: Record<string, string> = {
  Excellent: "text-status-success",
  Good: "text-status-success",
  Fair: "text-status-warning",
  Poor: "text-status-danger",
};

/**
 * Animated 0–100 Credit Health gauge. Counts up and sweeps the arc on mount.
 * Animation uses opacity/stroke transitions only (Phase 6 motion rule).
 */
export function HealthGauge({ score, band }: HealthGaugeProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, score / 100));
  const tone = TONE[band] ?? "text-interactive-primary";

  const [display, setDisplay] = React.useState(0);
  const [armed, setArmed] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    if (!armed) return undefined;
    const duration = 1100;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(score * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [armed, score]);

  return (
    <div className="flex flex-col items-center gap-3">
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
            strokeDashoffset={armed ? circumference - fraction * circumference : circumference}
            className={`${tone} stroke-current`}
            style={{ transition: "stroke-dashoffset 1100ms cubic-bezier(0,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-display-large font-bold tabular-nums ${tone}`}>{display}</span>
          <span className="text-body-sm text-foreground-tertiary">/ 100</span>
        </div>
      </div>
      <p className={`text-h3 font-semibold ${tone}`}>{band}</p>
    </div>
  );
}
