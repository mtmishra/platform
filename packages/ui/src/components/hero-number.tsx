import React from "react";

// ── Hero Number System (V3.0) ─────────────────────────────────────────────────
// Typography for the platform's signature figures — LeapScore, approval odds,
// pre-approved amount, KPI values. Monospace, tabular, with a "mega" display
// scale above the token set (display-hero = 3rem) for true hero moments.

type HeroSize = "sm" | "md" | "lg" | "mega";

const sizeClasses: Record<HeroSize, string> = {
  sm: "text-h1",                 // 1.5rem  — inline KPI
  md: "text-display-large",      // 2.25rem — section figure
  lg: "text-display-hero",       // 3rem    — page figure
  mega: "text-[3.75rem] leading-none", // 3.75rem — hero moment
};

export interface HeroNumberProps {
  value: React.ReactNode;
  size?: HeroSize;
  tone?: string;        // tailwind text-* class or undefined for primary
  prefix?: string;
  suffix?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function HeroNumber({ value, size = "lg", tone, prefix, suffix, label, sublabel, className = "" }: HeroNumberProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label ? <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{label}</span> : null}
      <span className={`break-words font-mono font-bold tabular-nums ${sizeClasses[size]} ${tone ?? "text-foreground-primary"}`}>
        {prefix ? <span className="align-baseline">{prefix}</span> : null}
        {value}
        {suffix ? <span className="text-[0.5em] font-semibold text-foreground-tertiary">{suffix}</span> : null}
      </span>
      {sublabel ? <span className="text-body-sm text-foreground-tertiary">{sublabel}</span> : null}
    </div>
  );
}

// LeapScoreNumber — 300–900, band-aware tone.
export interface LeapScoreNumberProps {
  score: number;
  size?: HeroSize;
  className?: string;
}
export function LeapScoreNumber({ score, size = "mega", className = "" }: LeapScoreNumberProps) {
  const tone = score >= 750 ? "text-status-success" : score >= 650 ? "text-interactive-primary" : score >= 550 ? "text-status-warning" : "text-status-danger";
  return <HeroNumber value={Math.round(score)} size={size} tone={tone} label="LeapScore" sublabel="out of 900" className={className} />;
}

// ApprovalOddsNumber — 0–100%, odds-aware tone.
export interface ApprovalOddsNumberProps {
  odds: number;
  size?: HeroSize;
  className?: string;
}
export function ApprovalOddsNumber({ odds, size = "lg", className = "" }: ApprovalOddsNumberProps) {
  const tone = odds >= 70 ? "text-status-success" : odds >= 45 ? "text-status-warning" : "text-status-danger";
  return <HeroNumber value={Math.round(odds)} suffix="%" size={size} tone={tone} label="Approval odds" className={className} />;
}

// PreApprovedAmount — ₹ figure, the emotional high point of the apply flow.
export interface PreApprovedAmountProps {
  amount: number;
  size?: HeroSize;
  className?: string;
}
export function PreApprovedAmount({ amount, size = "mega", className = "" }: PreApprovedAmountProps) {
  return (
    <HeroNumber
      value={amount.toLocaleString("en-IN")}
      prefix="₹"
      size={size}
      tone="text-foreground-primary"
      label="Pre-approved for"
      className={className}
    />
  );
}

// KpiValue — compact KPI figure for dashboard cards.
export interface KpiValueProps {
  value: React.ReactNode;
  prefix?: string;
  suffix?: string;
  tone?: string;
  className?: string;
}
export function KpiValue({ value, prefix, suffix, tone, className = "" }: KpiValueProps) {
  return (
    <span className={`break-words font-mono text-h1 font-bold tabular-nums sm:text-display-large ${tone ?? "text-foreground-primary"} ${className}`}>
      {prefix}{value}{suffix}
    </span>
  );
}
