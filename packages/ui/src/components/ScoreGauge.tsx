"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export interface ScoreGaugeProps {
  score: number;
  className?: string;
  size?: number;
}

interface BandInfo {
  label: string;
  color: string;
  bgClass: string;
  textClass: string;
  description: string;
}

export function getBandInfo(score: number): BandInfo {
  if (score >= 80) {
    return {
      label: "Loan Ready",
      color: "#16A34A",
      bgClass: "bg-status-success/10",
      textClass: "text-status-success",
      description: "Strong credit profile. Eligible for top-tier lenders.",
    };
  }
  if (score >= 65) {
    return {
      label: "Strong Candidate",
      color: "#2563EB",
      bgClass: "bg-status-info/10",
      textClass: "text-status-info",
      description: "Good profile with minor gaps. Eligible for 10+ lenders.",
    };
  }
  if (score >= 50) {
    return {
      label: "Improvable",
      color: "#D97706",
      bgClass: "bg-status-warning/10",
      textClass: "text-status-warning",
      description: "Moderate profile. Credit health plan auto-activated.",
    };
  }
  if (score >= 35) {
    return {
      label: "Developing",
      color: "#EA580C",
      bgClass: "bg-orange-600-lm/10",
      textClass: "text-orange-600-lm",
      description: "Weak profile for most lenders. Limited specialist NBFC matches.",
    };
  }
  return {
    label: "Not Ready",
    color: "#DC2626",
    bgClass: "bg-status-danger/10",
    textClass: "text-status-danger",
    description: "Below minimum threshold. Credit health counselling activated.",
  };
}

export function ScoreGauge({ score, className = "", size = 200 }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const band = getBandInfo(score);

  // Clean bounds check
  const clampedScore = Math.max(0, Math.min(100, score));

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const initialScore = animatedScore;
    const delta = clampedScore - initialScore;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      
      setAnimatedScore(initialScore + delta * ease);

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [clampedScore]);

  // Circumference calculations for 3/4 circle
  const r = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * r; // ~314.16
  const gaugeLength = circumference * 0.75; // ~235.6
  const strokeDashoffset = gaugeLength - (animatedScore / 100) * gaugeLength;

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          className="w-full h-full transform -rotate-[225deg]"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          {/* Background Arc */}
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeDasharray={`${gaugeLength} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Mapped Band Gradient Segment Arcs or single dynamic progress arc */}
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={band.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${gaugeLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-colors duration-normal ease-standard"
            style={{
              willChange: "stroke-dashoffset, stroke",
            }}
          />
        </svg>

        {/* Floating text inside gauge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-display-hero font-bold tracking-tight text-foreground-primary">
            {Math.round(animatedScore)}
          </span>
          <span className="text-body-sm font-medium text-foreground-tertiary">
            LeapScore™ v1.0
          </span>
          <div className={`mt-2 flex items-center gap-1 rounded-full px-3 py-0.5 text-label-caps font-semibold uppercase tracking-wider ${band.bgClass} ${band.textClass}`}>
            {score >= 80 && <Sparkles size={11} className="fill-current" />}
            {band.label}
          </div>
        </div>
      </div>
    </div>
  );
}
