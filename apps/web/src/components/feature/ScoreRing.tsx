import React from "react";

interface ScoreRingProps {
  /** 0–100 score. */
  score: number;
  band: string;
  label: string;
  /** Tailwind text-color class for the arc + score, e.g. "text-status-success". */
  tone?: string;
}

/**
 * Static SVG score gauge (server-renderable). Illustrative — represents how a
 * LeapScore is shown in the dashboard.
 */
export function ScoreRing({
  score,
  band,
  label,
  tone = "text-interactive-primary",
}: ScoreRingProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[200px] w-[200px]">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="14"
            className="stroke-border-token-default"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            className={`${tone} stroke-current`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-display-large font-bold ${tone}`}>{clamped}</span>
          <span className="text-body-sm text-foreground-tertiary">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-h3 font-semibold text-foreground-primary">{band}</p>
        <p className="text-body-sm text-foreground-tertiary">{label}</p>
      </div>
    </div>
  );
}
