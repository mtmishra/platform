"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card } from "./card";

// ─────────────────────────────────────────────────────────────────────────────
// 1. PremiumCard — high-end dark background card with gold details & glows.
// ─────────────────────────────────────────────────────────────────────────────
export interface PremiumCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PremiumCard({
  title,
  description,
  icon,
  action,
  children,
  className = "",
}: PremiumCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-navy-deep to-dark-surface p-6 shadow-3 transition-all duration-normal ease-standard hover:border-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] ${className}`}
    >
      {/* Premium glow overlay */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/5 blur-3xl transition-opacity duration-normal group-hover:bg-gold/10" />
      
      {(title || icon || action) && (
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            {icon && <span className="text-gold">{icon}</span>}
            <div>
              {title && <h3 className="text-h2 font-bold tracking-tight text-white">{title}</h3>}
              {description && <p className="text-body-sm text-gray-400 mt-0.5">{description}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="text-foreground-on-dark">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. MetricCardV2 — upgraded KPI metric display.
// ─────────────────────────────────────────────────────────────────────────────
export interface MetricCardV2Props {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    trend: "up" | "down" | "neutral";
  };
  sparklineData?: number[];
  footerText?: string;
  complianceTag?: string;
  icon?: React.ReactNode;
  statusBorder?: "success" | "warning" | "danger" | "info" | "none";
  className?: string;
}

export function MetricCardV2({
  label,
  value,
  delta,
  sparklineData,
  footerText,
  complianceTag,
  icon,
  statusBorder = "none",
  className = "",
}: MetricCardV2Props) {
  const getBorderClass = () => {
    switch (statusBorder) {
      case "success":
        return "border-l-4 border-l-status-success";
      case "warning":
        return "border-l-4 border-l-status-warning";
      case "danger":
        return "border-l-4 border-l-status-danger";
      case "info":
        return "border-l-4 border-l-interactive-primary";
      default:
        return "";
    }
  };

  const getDeltaBadge = () => {
    if (!delta) return null;
    switch (delta.trend) {
      case "up":
        return (
          <span className="inline-flex items-center gap-0.5 rounded bg-status-success/10 px-1.5 py-0.5 text-body-sm font-semibold text-status-success">
            <ArrowUpRight size={12} /> {delta.value}
          </span>
        );
      case "down":
        return (
          <span className="inline-flex items-center gap-0.5 rounded bg-status-danger/10 px-1.5 py-0.5 text-body-sm font-semibold text-status-danger">
            <ArrowDownRight size={12} /> {delta.value}
          </span>
        );
      case "neutral":
      default:
        return (
          <span className="inline-flex items-center gap-0.5 rounded bg-background-page px-1.5 py-0.5 text-body-sm font-semibold text-foreground-tertiary border border-border-token-default/50">
            <Minus size={12} /> {delta.value}
          </span>
        );
    }
  };

  // Mini inline SVG sparkline background
  const renderMiniSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 100;
    const height = 30;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;
    const points = sparklineData
      .map((val, i) => {
        const x = (i / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute bottom-2 right-4 text-interactive-primary/25"
        aria-hidden="true"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2 ${getBorderClass()} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary font-bold">
            {label}
          </span>
          <span className="font-mono text-display-large font-bold tracking-tight text-foreground-primary">
            {value}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {icon && <span className="text-foreground-secondary">{icon}</span>}
          {getDeltaBadge()}
        </div>
      </div>

      {/* Mini sparkline renders behind the text layout on the bottom-right */}
      {renderMiniSparkline()}

      {(footerText || complianceTag) && (
        <div className="mt-3 flex items-center justify-between border-t border-border-token-default/40 pt-2 text-body-sm">
          {footerText && <span className="text-foreground-secondary">{footerText}</span>}
          {complianceTag && (
            <span className="rounded bg-interactive-primary/10 px-1.5 py-0.5 text-body-sm font-semibold text-interactive-primary">
              {complianceTag}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. AnalyticsCard — layout container built for data visualization display.
// ─────────────────────────────────────────────────────────────────────────────
export interface AnalyticsCardProps {
  title: string;
  subtitle?: string;
  metric?: string | number;
  chart: React.ReactNode;
  legend?: React.ReactNode;
  footerText?: string;
  className?: string;
}

export function AnalyticsCard({
  title,
  subtitle,
  metric,
  chart,
  legend,
  footerText,
  className = "",
}: AnalyticsCardProps) {
  return (
    <Card className={`flex flex-col gap-4 bg-background-card ${className}`}>
      <div className="flex flex-col gap-1">
        <h3 className="text-h2 font-bold text-foreground-primary tracking-tight">{title}</h3>
        {subtitle && <p className="text-body-sm text-foreground-tertiary">{subtitle}</p>}
      </div>

      {metric && (
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-h1 font-bold text-foreground-primary">{metric}</span>
        </div>
      )}

      {/* Main visualization container */}
      <div className="relative flex-1 min-h-[160px] flex items-center justify-center border border-border-token-default/45 rounded bg-background-page/30 p-2">
        {chart}
      </div>

      {legend && <div className="border-t border-border-token-default/40 pt-2">{legend}</div>}

      {footerText && (
        <p className="text-body-sm text-foreground-tertiary italic text-center mt-1">
          {footerText}
        </p>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DashboardCard — robust standard wrapper block.
// ─────────────────────────────────────────────────────────────────────────────
export interface DashboardCardProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function DashboardCard({
  title,
  description,
  actions,
  children,
  footer,
  className = "",
  scrollable = false,
}: DashboardCardProps) {
  return (
    <div className={`flex flex-col rounded-lg border border-border-token-default bg-background-card shadow-1 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-border-token-default/60 p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-h2 font-bold text-foreground-primary tracking-tight">{title}</h3>
          {description && <p className="text-body-sm text-foreground-tertiary">{description}</p>}
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
      </div>

      {/* Body */}
      <div className={`flex-1 p-4 ${scrollable ? "max-h-[300px] overflow-y-auto" : ""}`}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border-token-default/60 bg-background-page/30 p-3 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
}
