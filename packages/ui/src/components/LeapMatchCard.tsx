"use client";

import { Check, AlertCircle, Info } from "lucide-react";
import { ApprovalGauge } from "./ApprovalGauge";
import { MatchStrengthMeter } from "./MatchStrengthMeter";
import { RatingBadge } from "./trust";
import { Button } from "./button";

export interface DocumentCheck {
  name: string;
  isReady: boolean;
}

export interface LeapMatchCardProps {
  rank?: number;
  lenderName: string;
  lenderLogo?: string;
  rating?: number;
  reviewsCount?: number;
  approvalProbability: number;
  interestRateMin: number;
  interestRateMax: number;
  estimatedEmi: number;
  totalCostOfBorrowing: number;
  tenureMonths: number;
  documents: DocumentCheck[];
  aiReason?: string;
  isBestMatch?: boolean;
  onApply?: () => void;
  className?: string;
}

export function LeapMatchCard({
  lenderName,
  lenderLogo,
  rating = 4.2,
  reviewsCount = 120,
  approvalProbability,
  interestRateMin,
  interestRateMax,
  estimatedEmi,
  totalCostOfBorrowing,
  tenureMonths,
  documents = [],
  aiReason,
  isBestMatch = false,
  onApply,
  className = "",
}: LeapMatchCardProps) {
  // Format currency
  const formatInr = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  const docsReadyCount = documents.filter((d) => d.isReady).length;

  return (
    <div
      className={`rounded-xl border ${
        isBestMatch ? "border-premium/50 shadow-[0_0_15px_rgba(212,175,55,0.08)] bg-background-card" : "border-border-token-default bg-background-card"
      } p-6 relative overflow-hidden transition-all duration-normal hover:shadow-2 ${className}`}
    >
      {/* Best Match Flag */}
      {isBestMatch && (
        <div className="absolute top-0 right-0 bg-premium text-foreground-on-dark px-3.5 py-1 text-label-caps font-bold rounded-bl-lg">
          #1 BEST MATCH
        </div>
      )}

      {/* Lender Identity Row */}
      <div className="flex items-center gap-3 mb-5">
        <div className="h-10 w-10 bg-interactive-primary/10 rounded-full flex items-center justify-center font-bold text-interactive-primary text-body-lg shrink-0 border border-border-token-default/50">
          {lenderLogo || lenderName.substring(0, 1)}
        </div>
        <div className="flex flex-col items-start">
          <h3 className="text-h2 font-bold text-foreground-primary tracking-tight">
            {lenderName}
          </h3>
          <RatingBadge rating={rating} count={reviewsCount} className="mt-1" />
        </div>
      </div>

      {/* Approval Odds & APE Score */}
      <div className="border-t border-border-token-default/40 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider block mb-1">
            Approval Odds
          </span>
          <ApprovalGauge probability={approvalProbability} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider block">
            Confidence Rating
          </span>
          <MatchStrengthMeter level={approvalProbability >= 75 ? "HIGH" : approvalProbability >= 50 ? "MEDIUM" : "LOW"} />
          <p className="text-[10px] text-foreground-tertiary italic mt-1 leading-snug">
            Calculated instantly via Approval Probability Engine (APE)
          </p>
        </div>
      </div>

      {/* Parameters Overview Grid */}
      <div className="grid grid-cols-3 gap-4 border-t border-border-token-default/40 py-4 text-left">
        <div>
          <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider">
            Rate Range
          </span>
          <p className="font-mono text-body-md font-bold text-foreground-primary mt-0.5">
            {interestRateMin.toFixed(2)}% - {interestRateMax.toFixed(2)}%
          </p>
        </div>
        <div>
          <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider">
            Est. EMI
          </span>
          <p className="font-mono text-body-md font-bold text-foreground-primary mt-0.5">
            {formatInr(estimatedEmi)}/mo
          </p>
        </div>
        <div>
          <span className="text-[10px] text-foreground-tertiary uppercase font-bold tracking-wider">
            Total TCB ({tenureMonths}m)
          </span>
          <p className="font-mono text-body-md font-bold text-status-success mt-0.5">
            {formatInr(totalCostOfBorrowing)}
          </p>
        </div>
      </div>

      {/* Document readiness */}
      {documents && documents.length > 0 && (
        <div className="border-t border-border-token-default/40 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center text-body-sm font-semibold">
            <span className="text-foreground-secondary">Document Readiness</span>
            <span className="text-foreground-tertiary font-mono">
              {docsReadyCount}/{documents.length} verified
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {documents.map((doc, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-body-sm font-medium border ${
                  doc.isReady
                    ? "bg-status-success/5 text-status-success border-status-success/20"
                    : "bg-status-danger/5 text-status-danger border-status-danger/20"
                }`}
              >
                {doc.isReady ? <Check size={11} /> : <AlertCircle size={11} />}
                {doc.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation Reason */}
      {aiReason && (
        <div className="bg-background-page/40 border border-border-token-default/30 rounded p-3 mb-4 flex gap-2">
          <Info size={16} className="text-interactive-primary shrink-0 mt-0.5" />
          <p className="text-body-sm text-foreground-secondary leading-relaxed">
            <span className="font-bold text-foreground-primary">AI Recommendation:</span> {aiReason}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-2">
        <Button variant={isBestMatch ? "primary" : "secondary"} className="flex-1" {...(onApply ? { onClick: onApply } : {})}>
          Apply Now
        </Button>
      </div>
    </div>
  );
}
