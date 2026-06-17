import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { RiskIndicator, Severity } from "@leapmoney/credit";

const SEVERITY: Record<Severity, { tone: string; ring: string; icon: React.ReactNode; label: string }> = {
  critical: { tone: "text-status-danger", ring: "border-status-danger/40", icon: <AlertTriangle size={18} />, label: "Critical" },
  high: { tone: "text-status-danger", ring: "border-status-danger/30", icon: <AlertTriangle size={18} />, label: "High" },
  medium: { tone: "text-status-warning", ring: "border-status-warning/40", icon: <AlertCircle size={18} />, label: "Medium" },
  low: { tone: "text-status-success", ring: "border-status-success/30", icon: <Info size={18} />, label: "Low" },
};

export function RiskCard({ risk }: { risk: RiskIndicator }) {
  const meta = SEVERITY[risk.severity];
  return (
    <div className={`flex flex-col gap-2 rounded-lg border ${meta.ring} bg-background-card p-5 shadow-1`}>
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 text-body-md font-semibold ${meta.tone}`}>
          {meta.icon}
          {risk.title}
        </span>
        <span className={`text-label-caps uppercase tracking-wider ${meta.tone}`}>{meta.label}</span>
      </div>
      <p className="text-body-sm text-foreground-secondary">{risk.detail}</p>
    </div>
  );
}
