import React from "react";
import type { ImpactScore } from "@leapmoney/credit";

const STATUS_TONE: Record<ImpactScore["status"], string> = {
  good: "bg-status-success",
  watch: "bg-status-warning",
  risk: "bg-status-danger",
};

/**
 * Factor breakdown / progress tracker: each Credit Health category as a labelled
 * progress bar, coloured by status.
 */
export function ProgressTracker({ impacts }: { impacts: ImpactScore[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-token-default bg-background-card p-6 shadow-1">
      {impacts.map((impact) => {
        const pct = impact.max === 0 ? 0 : Math.round((impact.points / impact.max) * 100);
        return (
          <div key={impact.category} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-body-sm">
              <span className="font-medium text-foreground-primary">{impact.label}</span>
              <span className="font-mono text-foreground-tertiary tabular-nums">
                {impact.points}/{impact.max}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-background-page">
              <div
                className={`h-full origin-left rounded-full ${STATUS_TONE[impact.status]}`}
                style={{ transform: `scaleX(${pct / 100})`, transition: "transform 800ms cubic-bezier(0,0,0.2,1)" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
