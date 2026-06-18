"use client";

import { CheckCircle2, AlertTriangle, HelpCircle, RefreshCw } from "lucide-react";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "STALE";

export interface MatchStrengthMeterProps {
  level: ConfidenceLevel;
  className?: string;
  checklist?: {
    bureauChecked: boolean;
    incomeVerified: boolean;
    bankingParsed: boolean;
    kycCompleted: boolean;
  };
}

export function MatchStrengthMeter({ level, className = "", checklist }: MatchStrengthMeterProps) {
  let badgeColor = "bg-status-success/10 text-status-success border-status-success/20";
  let Icon = CheckCircle2;
  let explanation = "All critical details are verified. Ready to apply.";

  if (level === "MEDIUM") {
    badgeColor = "bg-status-warning/10 text-status-warning border-status-warning/20";
    Icon = AlertTriangle;
    explanation = "Income self-declared. Verify income to unlock higher confidence matches.";
  } else if (level === "LOW") {
    badgeColor = "bg-status-danger/10 text-status-danger border-status-danger/20";
    Icon = HelpCircle;
    explanation = "Estimated profile. Check credit score to get accurate matches.";
  } else if (level === "STALE") {
    badgeColor = "bg-gray-400-lm/10 text-gray-400-lm border-gray-400-lm/20";
    Icon = RefreshCw;
    explanation = "Bureau data is over 60 days old. Refresh to retrieve current matches.";
  }

  // Fallback defaults for checklist
  const finalChecklist = checklist ?? {
    bureauChecked: level === "HIGH" || level === "MEDIUM",
    incomeVerified: level === "HIGH",
    bankingParsed: level === "HIGH",
    kycCompleted: level !== "LOW",
  };

  return (
    <div className={`rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-body-sm font-semibold text-foreground-secondary">
          Match Strength
        </span>
        <div className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-label-caps font-bold uppercase tracking-wider ${badgeColor}`}>
          <Icon size={12} /> {level} CONFIDENCE
        </div>
      </div>

      <p className="text-body-sm text-foreground-secondary mb-4">
        {explanation}
      </p>

      {/* Completion checklist items */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 text-body-sm">
          <span className={finalChecklist.bureauChecked ? "text-status-success" : "text-foreground-tertiary"}>
            {finalChecklist.bureauChecked ? "✓" : "○"}
          </span>
          <span className={finalChecklist.bureauChecked ? "text-foreground-primary font-medium" : "text-foreground-secondary"}>
            Bureau Pull
          </span>
        </div>
        <div className="flex items-center gap-2 text-body-sm">
          <span className={finalChecklist.incomeVerified ? "text-status-success" : "text-foreground-tertiary"}>
            {finalChecklist.incomeVerified ? "✓" : "○"}
          </span>
          <span className={finalChecklist.incomeVerified ? "text-foreground-primary font-medium" : "text-foreground-secondary"}>
            Income Verified
          </span>
        </div>
        <div className="flex items-center gap-2 text-body-sm">
          <span className={finalChecklist.bankingParsed ? "text-status-success" : "text-foreground-tertiary"}>
            {finalChecklist.bankingParsed ? "✓" : "○"}
          </span>
          <span className={finalChecklist.bankingParsed ? "text-foreground-primary font-medium" : "text-foreground-secondary"}>
            Banking Connected
          </span>
        </div>
        <div className="flex items-center gap-2 text-body-sm">
          <span className={finalChecklist.kycCompleted ? "text-status-success" : "text-foreground-tertiary"}>
            {finalChecklist.kycCompleted ? "✓" : "○"}
          </span>
          <span className={finalChecklist.kycCompleted ? "text-foreground-primary font-medium" : "text-foreground-secondary"}>
            KYC Verified
          </span>
        </div>
      </div>
    </div>
  );
}
