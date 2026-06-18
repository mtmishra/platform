"use client";

import React from "react";
import { Gauge, Calendar } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { ScoreBandBadge } from "./badges";
import { BureauBadge } from "./trust";

export interface LeapScoreFactor {
  factor: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  isPositive: boolean;
  detail: string;
}

export interface LeapScoreCardProps {
  score: number;
  band: "Excellent" | "Good" | "Fair" | "Poor";
  cibilScore?: number;
  experianScore?: number;
  pullDate?: string;
  factors?: LeapScoreFactor[];
  onActionClick?: () => void;
  className?: string;
}

export function LeapScoreCard({
  score,
  band,
  cibilScore = 742,
  experianScore = 758,
  pullDate = "Updated 3 days ago",
  factors = [],
  className = "",
}: LeapScoreCardProps) {
  return (
    <div
      className={`rounded-xl border border-border-token-default bg-background-card p-6 shadow-1 transition-shadow duration-normal hover:shadow-2 ${className}`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border-token-default/40 pb-3">
        <span className="inline-flex items-center gap-1.5 text-label-caps uppercase tracking-wider text-foreground-tertiary font-bold">
          <Gauge size={14} className="text-interactive-primary" /> Proprietary LeapScore™
        </span>
        <ScoreBandBadge band={band} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Gauge section */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <ScoreGauge score={score} size={150} />
        </div>

        {/* Bureau Scores */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded bg-background-page/40 border border-border-token-default/30 p-3 flex flex-col gap-1">
              <BureauBadge bureau="CIBIL" className="self-start mb-1" />
              <span className="font-mono text-h1 font-bold text-foreground-primary">
                {cibilScore}
              </span>
              <span className="text-[10px] text-foreground-tertiary">Official Bureau soft-pull</span>
            </div>
            <div className="rounded bg-background-page/40 border border-border-token-default/30 p-3 flex flex-col gap-1">
              <BureauBadge bureau="Experian" className="self-start mb-1" />
              <span className="font-mono text-h1 font-bold text-foreground-primary">
                {experianScore}
              </span>
              <span className="text-[10px] text-foreground-tertiary">Official Bureau soft-pull</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-body-sm text-foreground-tertiary">
            <Calendar size={13} />
            <span>{pullDate}</span>
          </div>
        </div>
      </div>

      {/* Score Factors */}
      {factors && factors.length > 0 && (
        <div className="mt-6 border-t border-border-token-default/40 pt-4">
          <h4 className="text-body-sm font-bold text-foreground-secondary mb-3">Key Score Factors</h4>
          <div className="flex flex-col gap-2.5">
            {factors.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-2.5 rounded bg-background-page/30 border border-border-token-default/20 text-body-sm"
              >
                <span
                  className={`mt-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-mono font-bold ${
                    f.isPositive
                      ? "bg-status-success/15 text-status-success"
                      : "bg-status-danger/15 text-status-danger"
                  }`}
                >
                  {f.isPositive ? "✓" : "✗"}
                </span>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground-primary">{f.factor}</span>
                  <span className="text-foreground-secondary text-body-sm">{f.detail}</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-foreground-tertiary bg-background-page px-1.5 py-0.5 rounded border border-border-token-default/40 shrink-0">
                  {f.impact} IMPACT
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
