"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { EmptyState } from "./EmptyState";

export interface FunnelStage {
  label: string;
  value: number; // raw quantity, e.g. number of leads
  color?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  className?: string;
}

export function FunnelChart({ stages, className = "" }: FunnelChartProps) {
  if (!stages || stages.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No Funnel Data"
        description="Ecosystem funnel statistics and conversion levels will display here."
        className="w-full border-none shadow-none"
      />
    );
  }

  const maxVal = stages[0]?.value || 1;

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-1 w-full">
        {stages.map((stage, idx) => {
          const pctOfMax = maxVal > 0 ? (stage.value / maxVal) * 100 : 0;
          const prevValue = idx > 0 ? stages[idx - 1]?.value || 0 : maxVal;
          const pctOfPrev = prevValue > 0 ? (stage.value / prevValue) * 100 : 0;
          const bgCol = stage.color || "#2563EB";

          return (
            <React.Fragment key={idx}>
              {/* Connection drop-off indicator */}
              {idx > 0 && (
                <div className="flex justify-center my-0.5">
                  <div className="flex items-center gap-1.5 rounded-full bg-background-page px-2 py-0.5 text-[10px] font-mono font-bold text-foreground-tertiary border border-border-token-default/50">
                    <ChevronDown size={10} className="text-foreground-tertiary" />
                    <span>{pctOfPrev.toFixed(0)}% conversion</span>
                  </div>
                </div>
              )}

              {/* Stage Block Row */}
              <div className="flex items-center gap-4">
                {/* Stage Title */}
                <div className="w-24 text-left">
                  <span className="text-body-sm font-semibold text-foreground-secondary block leading-snug">
                    {stage.label}
                  </span>
                </div>

                {/* Tapered Funnel Bar Container */}
                <div className="flex-1 bg-gray-200-lm/10 border border-border-token-default/30 rounded h-10 relative overflow-hidden flex items-center px-4">
                  {/* Tapered bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 opacity-85 rounded-r transition-all duration-slow"
                    style={{
                      width: `${pctOfMax}%`,
                      backgroundColor: bgCol,
                    }}
                  />

                  {/* Text labels inside the bar */}
                  <div className="relative z-10 w-full flex justify-between items-center text-body-sm font-bold">
                    <span className={pctOfMax > 30 ? "text-white" : "text-foreground-primary"}>
                      {stage.value.toLocaleString("en-IN")}
                    </span>
                    <span className={pctOfMax > 30 ? "text-white/80 font-mono text-[10px]" : "text-foreground-tertiary font-mono text-[10px]"}>
                      {idx === 0 ? "100%" : `${pctOfMax.toFixed(0)}% of initial`}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
