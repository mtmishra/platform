"use client";

import React from "react";
import { Sparkles, BadgePercent, ArrowRight } from "lucide-react";
import { Button } from "./button";

export interface FinancialFinding {
  id: string;
  category: string;
  title: string;
  description: string;
  tone: "success" | "warning" | "danger" | "info";
}

export interface FinancialRecommendation {
  id: string;
  action: string;
  impact: string;
  estimatedLift: string;
}

export interface FinancialAnalysisCardProps {
  savingsPotential: number;
  savingsDescription?: string;
  findings?: FinancialFinding[];
  recommendations?: FinancialRecommendation[];
  onActionClick?: () => void;
  className?: string;
}

export function FinancialAnalysisCard({
  savingsPotential,
  savingsDescription = "Savings available by consolidating high-interest credit card debt into a personal loan.",
  findings = [],
  recommendations = [],
  onActionClick,
  className = "",
}: FinancialAnalysisCardProps) {
  const formatInr = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const getToneBadge = (tone: FinancialFinding["tone"]) => {
    switch (tone) {
      case "success":
        return "bg-status-success/15 text-status-success border-status-success/30";
      case "warning":
        return "bg-status-warning/15 text-status-warning border-status-warning/30";
      case "danger":
        return "bg-status-danger/15 text-status-danger border-status-danger/30";
      case "info":
      default:
        return "bg-interactive-primary/15 text-interactive-primary border-interactive-primary/30";
    }
  };

  return (
    <div
      className={`rounded-xl border border-border-token-default bg-background-card p-6 shadow-1 transition-shadow duration-normal hover:shadow-2 ${className}`}
    >
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-border-token-default/40 pb-3">
        <span className="inline-flex items-center gap-1.5 text-label-caps uppercase tracking-wider text-foreground-tertiary font-bold">
          <Sparkles size={14} className="text-premium" /> AI Financial Intelligence
        </span>
        <span className="inline-flex items-center gap-1 rounded bg-premium/15 px-2 py-0.5 text-body-sm font-semibold text-premium border border-premium/20">
          <BadgePercent size={12} /> Restructure Alert
        </span>
      </div>

      {/* Savings Potential Highlight Box */}
      <div className="rounded-lg bg-gradient-to-r from-blue-900/10 to-teal-900/10 border border-interactive-primary/20 p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider">
            Savings Opportunity
          </span>
          <span className="font-mono text-display-large font-bold text-status-success">
            {formatInr(savingsPotential)}
          </span>
          <p className="text-body-sm text-foreground-secondary leading-relaxed mt-0.5">
            {savingsDescription}
          </p>
        </div>
        {onActionClick && (
          <Button variant="primary" size="md" onClick={onActionClick} className="shrink-0 flex items-center gap-1">
            Consolidate Now <ArrowRight size={14} />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Findings */}
        <div>
          <h4 className="text-body-sm font-bold text-foreground-secondary mb-3">Key Findings</h4>
          <div className="flex flex-col gap-2.5">
            {findings.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded bg-background-page/30 border border-border-token-default/20 flex flex-col gap-1 text-body-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground-primary">{f.title}</span>
                  <span className={`text-[8px] font-mono font-bold uppercase rounded border px-1.5 py-0.5 ${getToneBadge(f.tone)}`}>
                    {f.category}
                  </span>
                </div>
                <p className="text-foreground-secondary text-body-sm mt-0.5 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Plan Actions */}
        <div>
          <h4 className="text-body-sm font-bold text-foreground-secondary mb-3">Recommended Actions</h4>
          <div className="flex flex-col gap-2.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3 rounded bg-background-page/30 border border-border-token-default/20 flex flex-col gap-1 text-body-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-foreground-primary">{rec.action}</span>
                  <span className="text-[8px] font-mono font-bold text-foreground-tertiary bg-background-page px-1.5 py-0.5 rounded border border-border-token-default/40">
                    {rec.impact}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-foreground-tertiary mt-1 border-t border-border-token-default/10 pt-1.5 font-mono">
                  <span>Est. Lift: {rec.estimatedLift}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
