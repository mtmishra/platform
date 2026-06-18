"use client";

import { useState } from "react";
import { ScoreGauge } from "./ScoreGauge";
import { ApprovalGauge } from "./ApprovalGauge";
import { FOIRMeter } from "./FOIRMeter";
import { MatchStrengthMeter } from "./MatchStrengthMeter";
import { Sliders } from "lucide-react";

// Re-export gauges for clean imports
export { ScoreGauge } from "./ScoreGauge";
export { ApprovalGauge } from "./ApprovalGauge";
export { FOIRMeter } from "./FOIRMeter";
export { MatchStrengthMeter } from "./MatchStrengthMeter";

export interface GaugeShowcaseProps {
  initialScore?: number;
  initialProbability?: number;
  initialFoir?: number;
  className?: string;
}

export function GaugeShowcase({
  initialScore = 75,
  initialProbability = 82,
  initialFoir = 38,
  className = "",
}: GaugeShowcaseProps) {
  const [score, setScore] = useState(initialScore);
  const [prob, setProb] = useState(initialProbability);
  const [foir, setFoir] = useState(initialFoir);

  return (
    <div className={`rounded-xl border border-border-token-default bg-background-card p-6 shadow-2 flex flex-col gap-6 ${className}`}>
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-border-token-default/60 pb-3">
        <Sliders className="text-interactive-primary" size={18} />
        <h3 className="text-h2 font-bold text-foreground-primary tracking-tight">Interactive Visual Dials</h3>
      </div>

      {/* Grid of Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Score Gauge */}
        <div className="flex flex-col items-center p-4 bg-background-page/30 rounded border border-border-token-default/30">
          <span className="text-label-caps text-foreground-tertiary mb-3 font-bold">LeapScore™ Dial</span>
          <ScoreGauge score={score} size={150} />
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full mt-4 h-1 bg-gray-200-lm rounded appearance-none cursor-pointer accent-blue-primary"
          />
        </div>

        {/* Approval Gauge */}
        <div className="flex flex-col items-center p-4 bg-background-page/30 rounded border border-border-token-default/30">
          <span className="text-label-caps text-foreground-tertiary mb-3 font-bold">Approval Odds Dial</span>
          <ApprovalGauge probability={prob} />
          <input
            type="range"
            min="0"
            max="100"
            value={prob}
            onChange={(e) => setProb(parseInt(e.target.value))}
            className="w-full mt-6 h-1 bg-gray-200-lm rounded appearance-none cursor-pointer accent-blue-primary"
          />
        </div>
      </div>

      {/* Horizontal Meters */}
      <div className="flex flex-col gap-4 border-t border-border-token-default/60 pt-4">
        {/* FOIR Meter */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-body-sm font-semibold">
            <span className="text-foreground-secondary">FOIR Burden Meter</span>
            <span className="text-interactive-primary font-mono">{foir}%</span>
          </div>
          <FOIRMeter foir={foir} />
          <input
            type="range"
            min="0"
            max="100"
            value={foir}
            onChange={(e) => setFoir(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-200-lm rounded appearance-none cursor-pointer accent-blue-primary"
          />
        </div>

        {/* Match Strength Meter */}
        <div className="flex flex-col gap-2">
          <span className="text-body-sm font-semibold text-foreground-secondary">Match Confidence Rating</span>
          <MatchStrengthMeter level={score >= 80 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW"} />
        </div>
      </div>
    </div>
  );
}
