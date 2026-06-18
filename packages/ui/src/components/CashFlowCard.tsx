"use client";

import { Landmark, ShieldCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { FOIRMeter } from "./FOIRMeter";

export interface CashFlowCardProps {
  verifiedIncome: boolean;
  monthlyInflow: number;
  monthlyOutflow: number;
  cashFlowScore: number;
  foirRatio: number;
  bankName?: string;
  className?: string;
}

export function CashFlowCard({
  verifiedIncome,
  monthlyInflow,
  monthlyOutflow,
  cashFlowScore,
  foirRatio,
  bankName = "Connected Bank (via AA)",
  className = "",
}: CashFlowCardProps) {
  const formatInr = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const getFoirColor = (foir: number) => {
    if (foir <= 35) return "text-status-success";
    if (foir <= 50) return "text-status-warning";
    return "text-status-danger";
  };

  return (
    <div
      className={`rounded-xl border border-border-token-default bg-background-card p-6 shadow-1 transition-shadow duration-normal hover:shadow-2 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border-token-default/40 pb-3">
        <span className="inline-flex items-center gap-1.5 text-label-caps uppercase tracking-wider text-foreground-tertiary font-bold">
          <Landmark size={14} className="text-interactive-primary" /> Cash Flow Intelligence
        </span>
        {verifiedIncome ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-status-success/10 px-2 py-0.5 text-body-sm font-semibold text-status-success border border-status-success/20">
            <ShieldCheck size={12} /> Verified Income
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-foreground-tertiary/10 px-2 py-0.5 text-body-sm font-semibold text-foreground-tertiary border border-border-token-default/50">
            Unverified
          </span>
        )}
      </div>

      {/* Main Income Inflows and Outflows */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="p-3.5 rounded bg-background-page/40 border border-border-token-default/30 flex items-start gap-2.5">
          <span className="mt-0.5 rounded bg-status-success/10 p-1 text-status-success shrink-0">
            <ArrowUpRight size={14} />
          </span>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider">
              Avg Inflow
            </span>
            <span className="font-mono text-body-lg font-bold text-foreground-primary mt-1">
              {formatInr(monthlyInflow)}
            </span>
            <span className="text-[10px] text-foreground-tertiary mt-0.5">Monthly average</span>
          </div>
        </div>

        <div className="p-3.5 rounded bg-background-page/40 border border-border-token-default/30 flex items-start gap-2.5">
          <span className="mt-0.5 rounded bg-status-danger/10 p-1 text-status-danger shrink-0">
            <ArrowDownRight size={14} />
          </span>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider">
              Avg Outflow
            </span>
            <span className="font-mono text-body-lg font-bold text-foreground-primary mt-1">
              {formatInr(monthlyOutflow)}
            </span>
            <span className="text-[10px] text-foreground-tertiary mt-0.5">Rent, EMIs & Bills</span>
          </div>
        </div>
      </div>

      {/* FOIR Meter Slider */}
      <div className="border-t border-border-token-default/40 py-4 flex flex-col gap-2.5">
        <div className="flex justify-between items-baseline">
          <span className="text-body-sm font-semibold text-foreground-secondary">
            Fixed Obligation to Income (FOIR)
          </span>
          <span className={`font-mono text-body-md font-bold ${getFoirColor(foirRatio)}`}>
            {foirRatio}%
          </span>
        </div>
        <FOIRMeter foir={foirRatio} />
        <p className="text-[10px] text-foreground-tertiary italic">
          Safe limit: &lt;35% of net monthly income. Cap limit: 65%.
        </p>
      </div>

      {/* Cash Flow score & details */}
      <div className="border-t border-border-token-default/40 pt-4 flex justify-between items-center text-body-sm">
        <span className="text-foreground-secondary">{bankName}</span>
        <div className="flex items-center gap-1.5 font-semibold">
          <span className="text-foreground-tertiary">Flow Rating:</span>
          <span className="font-mono text-foreground-primary">{cashFlowScore} / 100</span>
        </div>
      </div>
    </div>
  );
}
