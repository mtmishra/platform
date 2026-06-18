"use client";

import { HeartPulse, CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

export interface HealthMetric {
  name: string;
  value: string | number;
  target: string;
  status: "success" | "warning" | "danger" | "info";
  impact: "HIGH" | "MEDIUM" | "LOW";
}

export interface CreditHealthCardProps {
  healthScore: number;
  healthBand: "Excellent" | "Good" | "Fair" | "Poor" | string;
  risksCount?: number;
  metrics?: HealthMetric[];
  className?: string;
}

export function CreditHealthCard({
  healthScore,
  healthBand,
  risksCount = 0,
  metrics = [],
  className = "",
}: CreditHealthCardProps) {
  const getBandColor = () => {
    if (healthScore >= 80) return "text-status-success bg-status-success/15 border-status-success/30";
    if (healthScore >= 50) return "text-status-warning bg-status-warning/15 border-status-warning/30";
    return "text-status-danger bg-status-danger/15 border-status-danger/30";
  };

  const getMetricStatusIcon = (status: HealthMetric["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle2 size={14} className="text-status-success mt-0.5" />;
      case "warning":
        return <AlertTriangle size={14} className="text-status-warning mt-0.5" />;
      case "danger":
        return <AlertOctagon size={14} className="text-status-danger mt-0.5" />;
      default:
        return <CheckCircle2 size={14} className="text-interactive-primary mt-0.5" />;
    }
  };

  return (
    <div
      className={`rounded-xl border border-border-token-default bg-background-card p-6 shadow-1 transition-shadow duration-normal hover:shadow-2 ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-border-token-default/40 pb-3">
        <span className="inline-flex items-center gap-1.5 text-label-caps uppercase tracking-wider text-foreground-tertiary font-bold">
          <HeartPulse size={14} className="text-interactive-primary" /> Credit Health Portfolio
        </span>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-label-caps font-bold uppercase ${getBandColor()}`}>
          {healthBand}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Large Score Indicator */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-r md:border-r border-border-token-default/40 pr-0 md:pr-6">
          <span className="font-mono text-display-large font-bold tracking-tight text-foreground-primary">
            {healthScore}
          </span>
          <span className="text-body-sm text-foreground-tertiary font-semibold">/ 100 Health Index</span>
          <span className="mt-2 text-body-sm font-medium text-foreground-secondary text-center">
            {risksCount === 0 ? "✓ No active risks" : `⚠️ ${risksCount} active risk${risksCount > 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Health Factor metrics list */}
        <div className="md:col-span-8 flex flex-col gap-3">
          {metrics && metrics.length > 0 ? (
            metrics.map((metric, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-2.5 rounded bg-background-page/30 border border-border-token-default/20 text-body-sm"
              >
                <div className="flex gap-2.5">
                  {getMetricStatusIcon(metric.status)}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground-primary">{metric.name}</span>
                    <span className="text-foreground-secondary text-body-sm">
                      Current: <span className="font-bold">{metric.value}</span> (Target: {metric.target})
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[8px] font-mono font-bold text-foreground-tertiary bg-background-page px-1.5 py-0.5 rounded border border-border-token-default/40">
                    {metric.impact} IMPACT
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-body-sm text-foreground-tertiary">
              No individual metrics loaded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
