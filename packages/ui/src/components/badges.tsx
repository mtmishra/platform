import { Sparkles } from "lucide-react";

// ── Badge System (V3.0) ───────────────────────────────────────────────────────
// One source of truth for status / score-band / risk / confidence / best-match
// pills. Token-driven, accessible, shared across all five surfaces.

const pill = "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider";

// StatusBadge — application / user / generic lifecycle status.
export type StatusKind =
  | "new" | "draft" | "submitted" | "under_review" | "approved" | "rejected"
  | "disbursed" | "active" | "pending" | "suspended" | "withdrawn";

export interface StatusBadgeProps {
  status: StatusKind | string;
  className?: string;
}
const STATUS_META: Record<string, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-interactive-primary/10 text-interactive-primary" },
  draft: { label: "Draft", cls: "bg-background-page text-foreground-secondary" },
  submitted: { label: "Submitted", cls: "bg-interactive-primary/10 text-interactive-primary" },
  under_review: { label: "Under Review", cls: "bg-status-warning/10 text-status-warning" },
  approved: { label: "Approved", cls: "bg-status-success/10 text-status-success" },
  rejected: { label: "Rejected", cls: "bg-status-danger/10 text-status-danger" },
  disbursed: { label: "Disbursed", cls: "bg-status-success text-foreground-on-dark" },
  active: { label: "Active", cls: "bg-status-success/10 text-status-success" },
  pending: { label: "Pending", cls: "bg-status-warning/10 text-status-warning" },
  suspended: { label: "Suspended", cls: "bg-status-danger/10 text-status-danger" },
  withdrawn: { label: "Withdrawn", cls: "bg-background-page text-foreground-tertiary" },
};
export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const m = STATUS_META[status] ?? { label: String(status), cls: "bg-background-page text-foreground-secondary" };
  return <span className={`${pill} ${m.cls} ${className}`}>{m.label}</span>;
}

// ScoreBandBadge — Excellent / Good / Fair / Poor.
export type ScoreBand = "Excellent" | "Good" | "Fair" | "Poor";
export interface ScoreBandBadgeProps {
  band: ScoreBand;
  className?: string;
}
const BAND_CLS: Record<ScoreBand, string> = {
  Excellent: "bg-status-success/10 text-status-success",
  Good: "bg-status-success/10 text-status-success",
  Fair: "bg-status-warning/10 text-status-warning",
  Poor: "bg-status-danger/10 text-status-danger",
};
export function ScoreBandBadge({ band, className = "" }: ScoreBandBadgeProps) {
  return <span className={`${pill} ${BAND_CLS[band]} ${className}`}>{band}</span>;
}

// RiskBadge — underwriting risk band.
export type RiskLevel = "Low" | "Medium" | "High";
export interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}
const RISK_CLS: Record<RiskLevel, string> = {
  Low: "bg-status-success/10 text-status-success",
  Medium: "bg-status-warning/10 text-status-warning",
  High: "bg-status-danger/10 text-status-danger",
};
export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  return <span className={`${pill} ${RISK_CLS[level]} ${className}`}>{level} risk</span>;
}

// ConfidenceBadge — model/decision confidence.
export type Confidence = "high" | "medium" | "low";
export interface ConfidenceBadgeProps {
  level: Confidence;
  className?: string;
}
const CONF_CLS: Record<Confidence, string> = {
  high: "bg-status-success/10 text-status-success",
  medium: "bg-status-warning/10 text-status-warning",
  low: "bg-status-danger/10 text-status-danger",
};
export function ConfidenceBadge({ level, className = "" }: ConfidenceBadgeProps) {
  return <span className={`${pill} ${CONF_CLS[level]} ${className}`}>{level} confidence</span>;
}

// BestMatchBadge — marketplace "best match" / "pre-approved" highlight.
export interface BestMatchBadgeProps {
  label?: string;
  className?: string;
}
export function BestMatchBadge({ label = "Best match", className = "" }: BestMatchBadgeProps) {
  return (
    <span className={`${pill} bg-premium/15 text-premium ${className}`}>
      <Sparkles size={11} aria-hidden="true" /> {label}
    </span>
  );
}
