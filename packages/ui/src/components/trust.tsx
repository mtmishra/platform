"use client";

import React from "react";
import { ShieldCheck, Lock, Landmark, BadgeCheck, KeyRound, Info, Star } from "lucide-react";

// ── Standardised Trust Layer System (V4.0) ────────────────────────────────────

export interface BaseBadgeProps {
  className?: string;
}

// 1. RBI Alignment Badge
export function RbiAlignmentBadge({ className = "" }: BaseBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-status-success/10 px-2.5 py-1 text-body-sm font-semibold text-status-success border border-status-success/20 ${className}`}>
      <BadgeCheck size={13} aria-hidden="true" />
      <span>RBI Lending Aligned</span>
    </span>
  );
}

// 2. DPDP Compliance Badge
export function DpdpComplianceBadge({ className = "" }: BaseBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-teal-accent/10 px-2.5 py-1 text-body-sm font-semibold text-teal-600 border border-teal-accent/20 ${className}`}>
      <ShieldCheck size={13} aria-hidden="true" />
      <span>DPDP Compliant</span>
    </span>
  );
}

// 3. Consent Protected Badge
export function ConsentProtectedBadge({ className = "" }: BaseBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-primary/10 px-2.5 py-1 text-body-sm font-semibold text-blue-600 border border-blue-primary/20 ${className}`}>
      <Info size={13} aria-hidden="true" />
      <span>Consent Protected (Revocable)</span>
    </span>
  );
}

// 4. Bank-Level Security Badge
export function BankLevelSecurityBadge({ className = "" }: BaseBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-status-warning/10 px-2.5 py-1 text-body-sm font-semibold text-status-warning border border-status-warning/20 ${className}`}>
      <Lock size={13} aria-hidden="true" />
      <span>Bank-Grade Security</span>
    </span>
  );
}

// 5. Encryption Badge
export function EncryptionBadge({ className = "" }: BaseBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-violet-600/10 px-2.5 py-1 text-body-sm font-semibold text-violet-600 border border-violet-600/20 ${className}`}>
      <KeyRound size={13} aria-hidden="true" />
      <span>AES-256 Encrypted</span>
    </span>
  );
}

// BureauBadge — credit bureau tag.
export interface BureauBadgeProps extends BaseBadgeProps {
  bureau: "CIBIL" | "Experian" | "CRIF" | "Equifax" | string;
}
export function BureauBadge({ bureau, className = "" }: BureauBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-background-page px-2.5 py-1 text-label-caps font-semibold uppercase tracking-wider border border-border-token-default/60 text-foreground-secondary ${className}`}>
      <Landmark size={12} aria-hidden="true" /> {bureau}
    </span>
  );
}

// TrustBar — regulatory row.
export interface TrustBarProps extends BaseBadgeProps {
  items?: React.ReactNode[];
  variant?: "default" | "regulatory" | "security";
  align?: "start" | "center";
}
export function TrustBar({ items, variant = "default", align = "start", className = "" }: TrustBarProps) {
  const defaults: React.ReactNode[] =
    variant === "regulatory"
      ? [<RbiAlignmentBadge key="rbi" />, <DpdpComplianceBadge key="dpdp" />, <ConsentProtectedBadge key="consent" />]
      : variant === "security"
        ? [<BankLevelSecurityBadge key="sec" />, <EncryptionBadge key="enc" />]
        : [<RbiAlignmentBadge key="rbi" />, <DpdpComplianceBadge key="dpdp" />, <BankLevelSecurityBadge key="sec" />];
  const content = items ?? defaults;
  return (
    <div className={`flex flex-wrap items-center gap-3 ${align === "center" ? "justify-center" : ""} ${className}`}>
      <span className="inline-flex items-center gap-1.5 text-label-caps uppercase tracking-wider text-foreground-tertiary font-bold shrink-0">
        <ShieldCheck size={14} aria-hidden="true" /> Trusted &amp; compliant
      </span>
      <div className="flex flex-wrap gap-2">
        {content}
      </div>
    </div>
  );
}

// Expose legacy versions as aliases or direct wrappers to prevent build breaks
export interface SecurityBadgeProps extends BaseBadgeProps {
  label?: string;
}
export function SecurityBadge({ className = "" }: SecurityBadgeProps) {
  return <BankLevelSecurityBadge className={className} />;
}

export interface ComplianceBadgeProps extends BaseBadgeProps {
  framework: string;
  label?: string;
}
export function ComplianceBadge({ framework, label, className = "" }: ComplianceBadgeProps) {
  if (framework === "RBI") return <RbiAlignmentBadge className={className} />;
  if (framework === "DPDP") return <DpdpComplianceBadge className={className} />;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-background-page px-2.5 py-1 text-body-sm font-medium border border-border-token-default/50 text-foreground-secondary ${className}`}>
      <BadgeCheck size={13} aria-hidden="true" /> {label ?? framework}
    </span>
  );
}

export interface RatingBadgeProps extends BaseBadgeProps {
  rating: number;
  count?: number;
}
export function RatingBadge({ rating, count, className = "" }: RatingBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded bg-premium/10 px-2 py-0.5 text-body-sm font-semibold text-premium border border-premium/20 ${className}`}>
      <Star size={13} aria-hidden="true" className="fill-current inline mr-1" /> {rating.toFixed(1)}
      {typeof count === "number" ? <span className="text-foreground-tertiary font-normal"> ({count})</span> : null}
    </span>
  );
}
