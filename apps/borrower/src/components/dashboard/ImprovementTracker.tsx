import React from "react";
import type { NextMilestone } from "@leapmoney/credit";

interface ImprovementTrackerProps {
  currentScore: number;
  milestone: NextMilestone | null;
  /** Oldest → newest score points for the trend. */
  history: Array<{ month: string; score: number }>;
}

/**
 * Improvement tracker: progress toward the next score milestone, plus a compact
 * month-by-month trend. Progress bar animates via transform (Phase 6 GPU rule).
 */
export function ImprovementTracker({ currentScore, milestone, history }: ImprovementTrackerProps) {
  const target = milestone?.target_score ?? currentScore;
  const start = history[0]?.score ?? currentScore;
  const span = Math.max(1, target - start);
  const progress = Math.min(1, Math.max(0, (currentScore - start) / span));
  const gap = Math.max(0, target - currentScore);
  const max = Math.max(...history.map((h) => h.score), target);
  const min = Math.min(...history.map((h) => h.score), start);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <div className="flex items-center justify-between">
        <h3 className="text-h3 font-semibold text-foreground-primary">Improvement tracker</h3>
        <span className="font-mono text-body-sm text-foreground-tertiary tabular-nums">
          {currentScore} → {target}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-background-page">
          <div
            className="h-full origin-left rounded-full bg-interactive-primary"
            style={{ transform: `scaleX(${progress})`, transition: "transform 800ms cubic-bezier(0,0,0.2,1)" }}
          />
        </div>
        <p className="text-body-sm text-foreground-secondary">
          {gap > 0
            ? `${gap} points to your next milestone${milestone ? ` — ${milestone.what_unlocks}` : ""}`
            : "You've reached your next milestone — set a new goal."}
        </p>
      </div>

      {/* Compact trend */}
      <div className="flex items-end gap-2" aria-hidden>
        {history.map((h) => {
          const ratio = max === min ? 1 : (h.score - min) / (max - min);
          const heightPct = 30 + ratio * 70; // 30–100%
          return (
            <div key={h.month} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-16 w-full items-end">
                <div
                  className="w-full rounded-sm bg-interactive-primary/30"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="font-mono text-label-caps text-foreground-tertiary tabular-nums">{h.score}</span>
              <span className="text-label-caps uppercase text-foreground-tertiary">{h.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
