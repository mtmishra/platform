import React from "react";
import { ShieldCheck, Lock, Landmark, Star, BadgeCheck } from "lucide-react";

// ── Trust Layer System (V3.0) ─────────────────────────────────────────────────
// Reusable, regulatory-aware trust signals. Light, token-driven, no motion.
// Shared across Website, Borrower, DSA, Lender, Admin.

type TrustTone = "neutral" | "success" | "premium";

const toneClasses: Record<TrustTone, string> = {
  neutral: "bg-background-page text-foreground-secondary",
  success: "bg-status-success/10 text-status-success",
  premium: "bg-premium/15 text-premium",
};

interface BaseBadgeProps {
  className?: string;
}

// SecurityBadge — "256-bit secure", "soft check, no score impact", etc.
export interface SecurityBadgeProps extends BaseBadgeProps {
  label?: string;
}
export function SecurityBadge({ label = "256-bit secure", className = "" }: SecurityBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-body-sm font-medium ${toneClasses.success} ${className}`}>
      <Lock size={13} aria-hidden="true" /> {label}
    </span>
  );
}

// BureauBadge — names a credit bureau as the source of an insight.
export interface BureauBadgeProps extends BaseBadgeProps {
  bureau: "CIBIL" | "Experian" | "CRIF" | "Equifax" | string;
}
export function BureauBadge({ bureau, className = "" }: BureauBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-caps font-semibold uppercase tracking-wider ${toneClasses.neutral} ${className}`}>
      <Landmark size={12} aria-hidden="true" /> {bureau}
    </span>
  );
}

// ComplianceBadge — RBI / DPDP / FAIR Practices regulatory signal.
export interface ComplianceBadgeProps extends BaseBadgeProps {
  framework: "RBI" | "DPDP" | "FAIR" | string;
  label?: string;
}
const COMPLIANCE_LABEL: Record<string, string> = {
  RBI: "RBI Digital Lending",
  DPDP: "DPDP compliant",
  FAIR: "Fair Practices Code",
};
export function ComplianceBadge({ framework, label, className = "" }: ComplianceBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-body-sm font-medium ${toneClasses.neutral} ${className}`}>
      <BadgeCheck size={13} aria-hidden="true" /> {label ?? COMPLIANCE_LABEL[framework] ?? framework}
    </span>
  );
}

// RatingBadge — social proof (rating + optional count).
export interface RatingBadgeProps extends BaseBadgeProps {
  rating: number;
  count?: number;
}
export function RatingBadge({ rating, count, className = "" }: RatingBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-body-sm font-medium ${toneClasses.premium} ${className}`}>
      <Star size={13} aria-hidden="true" className="fill-current" /> {rating.toFixed(1)}
      {typeof count === "number" ? <span className="text-foreground-tertiary">({count.toLocaleString("en-IN")})</span> : null}
    </span>
  );
}

// TrustBar — a row of trust signals, used at decision points (apply, match, hero).
export interface TrustBarProps extends BaseBadgeProps {
  items?: React.ReactNode[];
  /** When no items are passed, render the default regulatory + security set. */
  variant?: "default" | "regulatory" | "security";
  align?: "start" | "center";
}
export function TrustBar({ items, variant = "default", align = "start", className = "" }: TrustBarProps) {
  const defaults: React.ReactNode[] =
    variant === "regulatory"
      ? [<ComplianceBadge key="rbi" framework="RBI" />, <ComplianceBadge key="dpdp" framework="DPDP" />, <ComplianceBadge key="fair" framework="FAIR" />]
      : variant === "security"
        ? [<SecurityBadge key="sec" />, <SecurityBadge key="soft" label="Soft check — no score impact" />]
        : [<ComplianceBadge key="rbi" framework="RBI" />, <SecurityBadge key="sec" />, <ComplianceBadge key="dpdp" framework="DPDP" />];
  const content = items ?? defaults;
  return (
    <div className={`flex flex-wrap items-center gap-2 ${align === "center" ? "justify-center" : ""} ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-label-caps uppercase tracking-wider text-foreground-tertiary">
        <ShieldCheck size={13} aria-hidden="true" /> Trusted &amp; compliant
      </span>
      {content}
    </div>
  );
}
