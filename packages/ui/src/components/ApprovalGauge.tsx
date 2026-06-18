"use client";

import { useEffect, useState } from "react";

export interface ApprovalGaugeProps {
  probability: number;
  className?: string;
  size?: number;
}

export function ApprovalGauge({ probability, className = "", size = 64 }: ApprovalGaugeProps) {
  const [progress, setProgress] = useState(0);
  const clamped = Math.max(0, Math.min(100, probability));

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(clamped);
    }, 100);
    return () => clearTimeout(timer);
  }, [clamped]);

  // Determine tone color
  let strokeColor = "#DC2626"; // red
  if (probability >= 70) {
    strokeColor = "#16A34A"; // green
  } else if (probability >= 40) {
    strokeColor = "#D97706"; // amber
  }

  const r = 24;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * r; // ~150.8
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress circle */}
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-slow ease-standard"
            style={{
              willChange: "stroke-dashoffset",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-body-md font-bold tracking-tight text-foreground-primary">
            {probability}%
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-body-sm font-semibold text-foreground-primary">
          {probability >= 70 ? "High odds" : probability >= 40 ? "Medium odds" : "Low odds"}
        </span>
        <span className="text-body-sm text-foreground-tertiary">
          Approval Probability
        </span>
      </div>
    </div>
  );
}
