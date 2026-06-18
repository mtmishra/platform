"use client";

import React from "react";

// ── Chart System (V3.0) ───────────────────────────────────────────────────────
// SVG-based, token-driven primitives. Animate stroke/transform/opacity only
// (GPU-safe), respect prefers-reduced-motion, and SSR cleanly. Shared everywhere.

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);
  return reduced;
}

// Maps a value within [min,max] to a red→amber→green spectrum CSS variable.
function spectrum(pct: number): string {
  if (pct >= 0.8) return "var(--color-status-success)";
  if (pct >= 0.6) return "var(--color-interactive-primary)";
  if (pct >= 0.4) return "var(--color-status-warning)";
  return "var(--color-status-danger)";
}

// ── ScoreGauge — radial gauge for LeapScore (300–900) or any 0–N band. ──────────
export interface ScoreGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  bandLabel?: string;
  size?: number;
  className?: string;
}
export function ScoreGauge({ value, min = 300, max = 900, label, bandLabel, size = 180, className = "" }: ScoreGaugeProps) {
  const reduced = usePrefersReducedMotion();
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const stroke = 12;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  // 270° arc (gauge style), starting bottom-left.
  const circumference = 2 * Math.PI * r;
  const arcFraction = 0.75;
  const arcLen = circumference * arcFraction;
  const [progress, setProgress] = React.useState(reduced ? pct : 0);
  React.useEffect(() => { const id = requestAnimationFrame(() => setProgress(pct)); return () => cancelAnimationFrame(id); }, [pct]);
  const color = spectrum(pct);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label ?? "Score"}: ${Math.round(value)}`}>
        <g transform={`rotate(135 ${cx} ${cx})`}>
          <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--color-border-default)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${arcLen} ${circumference}`} />
          <circle
            cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${arcLen} ${circumference}`}
            strokeDashoffset={arcLen * (1 - progress)}
            style={{ transition: reduced ? undefined : "stroke-dashoffset 900ms cubic-bezier(0,0,0.2,1)" }}
          />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-display-large font-bold tabular-nums text-foreground-primary">{Math.round(value)}</span>
        {bandLabel ? <span className="text-body-sm font-medium" style={{ color }}>{bandLabel}</span> : null}
        {label ? <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{label}</span> : null}
      </div>
    </div>
  );
}

// ── TrendChart — sparkline/line for a time series. ──────────────────────────────
export interface TrendChartProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}
export function TrendChart({ data, width = 280, height = 64, className = "" }: TrendChartProps) {
  if (data.length < 2) return <div className={className} />;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${height - ((d - min) / span) * (height - 8) - 4}`);
  const path = `M ${pts.join(" L ")}`;
  const area = `${path} L ${width},${height} L 0,${height} Z`;
  const up = data[data.length - 1]! >= data[0]!;
  const color = up ? "var(--color-status-success)" : "var(--color-status-danger)";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label="Trend">
      <path d={area} fill={color} opacity={0.08} />
      <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── DistributionChart — labelled horizontal bars. ───────────────────────────────
export interface DistributionRow { label: string; value: number; tone?: string }
export interface DistributionChartProps {
  rows: DistributionRow[];
  max?: number;
  className?: string;
}
export function DistributionChart({ rows, max, className = "" }: DistributionChartProps) {
  const m = max ?? Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-28 flex-shrink-0 truncate text-body-sm text-foreground-secondary">{r.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-background-page">
            <div
              className="h-full origin-left rounded-full transition-transform duration-normal ease-standard"
              style={{ transform: `scaleX(${Math.max(0.02, r.value / m)})`, backgroundColor: r.tone ?? "var(--color-interactive-primary)" }}
            />
          </div>
          <span className="w-10 flex-shrink-0 text-right font-mono text-body-sm tabular-nums text-foreground-primary">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── FOIRMeter — obligations vs a safe limit. ────────────────────────────────────
export interface FOIRMeterProps {
  foirPct: number;
  safeLimitPct?: number;
  className?: string;
}
export function FOIRMeter({ foirPct, safeLimitPct = 50, className = "" }: FOIRMeterProps) {
  const reduced = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, foirPct));
  const tone = foirPct <= safeLimitPct * 0.8 ? "var(--color-status-success)" : foirPct <= safeLimitPct ? "var(--color-status-warning)" : "var(--color-status-danger)";
  const [w, setW] = React.useState(reduced ? clamped : 0);
  React.useEffect(() => { const id = requestAnimationFrame(() => setW(clamped)); return () => cancelAnimationFrame(id); }, [clamped]);
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-h1 font-bold tabular-nums" style={{ color: tone }}>{Math.round(foirPct)}%</span>
        <span className="text-body-sm text-foreground-tertiary">safe limit {safeLimitPct}%</span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-background-page">
        <div className="h-full origin-left rounded-full" style={{ transform: `scaleX(${w / 100})`, backgroundColor: tone, transition: reduced ? undefined : "transform 700ms cubic-bezier(0,0,0.2,1)" }} />
        <div className="absolute top-0 h-full w-px bg-foreground-tertiary" style={{ left: `${safeLimitPct}%` }} aria-hidden="true" />
      </div>
    </div>
  );
}

// ── MatchStrengthChart — 0–100 match-strength meter. ────────────────────────────
export interface MatchStrengthChartProps {
  value: number;
  label?: string;
  className?: string;
}
export function MatchStrengthChart({ value, label = "Match strength", className = "" }: MatchStrengthChartProps) {
  const reduced = usePrefersReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  const tone = spectrum(clamped / 100);
  const [w, setW] = React.useState(reduced ? clamped : 0);
  React.useEffect(() => { const id = requestAnimationFrame(() => setW(clamped)); return () => cancelAnimationFrame(id); }, [clamped]);
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between">
        <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{label}</span>
        <span className="font-mono text-body-md font-semibold tabular-nums" style={{ color: tone }}>{Math.round(value)}/100</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-background-page">
        <div className="h-full origin-left rounded-full" style={{ transform: `scaleX(${w / 100})`, backgroundColor: tone, transition: reduced ? undefined : "transform 700ms cubic-bezier(0,0,0.2,1)" }} />
      </div>
    </div>
  );
}
