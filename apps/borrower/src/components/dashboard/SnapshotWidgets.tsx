"use client";

import React from "react";
import Link from "next/link";
import { Gauge, HeartPulse, Sparkles, BarChart3 } from "lucide-react";
import type { CreditHealthResult, LeapScoreResult } from "@leapmoney/credit";
import type { MatchResult } from "@leapmoney/match";
import type { AnalyticsSummary } from "@leapmoney/outcomes";
import { MetricCardV2 } from "@leapmoney/ui";

export function CreditSnapshot({ score }: { score: LeapScoreResult }) {
  const scoreVal = score.leapscore ?? 742;
  const band = score.score_band || "Good";
  const factors = score.what_is_helping?.[0]?.detail ? `✓ ${score.what_is_helping[0].detail}` : "Score updated recently";
  
  // Custom mock history sparkline data
  const historyData = [710, 715, 730, 725, 735, scoreVal];

  return (
    <Link href="/health" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <MetricCardV2
        label="LeapScore™"
        value={scoreVal}
        icon={<Gauge size={18} className="text-interactive-primary" />}
        sparklineData={historyData}
        footerText={factors}
        complianceTag={band}
        statusBorder={scoreVal >= 80 ? "success" : scoreVal >= 50 ? "info" : "warning"}
      />
    </Link>
  );
}

export function HealthSnapshot({ health }: { health: CreditHealthResult }) {
  const healthVal = health.health_score ?? 85;
  const band = health.health_band || "Strong";
  const risks = health.risk_indicators?.length || 0;
  const riskLabel = risks === 0 ? "No active risks" : `${risks} active risk${risks > 1 ? "s" : ""}`;

  // Custom mock history sparkline data
  const historyData = [80, 82, 85, 83, 86, healthVal];

  return (
    <Link href="/health" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <MetricCardV2
        label="Credit Health"
        value={`${healthVal}/100`}
        icon={<HeartPulse size={18} className="text-status-success" />}
        sparklineData={historyData}
        footerText={riskLabel}
        complianceTag={band}
        statusBorder={healthVal >= 80 ? "success" : healthVal >= 50 ? "warning" : "danger"}
      />
    </Link>
  );
}

export function MatchSnapshot({ match }: { match: MatchResult }) {
  const best = match.matched_lenders?.[0];
  const count = match.matched_lenders?.length || 0;
  const prob = best ? `${best.approval_probability}%` : "0%";
  const footer = best ? `${best.lender_name} matched` : "No matches yet";

  // Custom mock history sparkline data
  const historyData = [55, 60, 62, 65, 70, best?.approval_probability || 72];

  return (
    <Link href="/matches/review" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <MetricCardV2
        label="LeapMatch™ Odds"
        value={prob}
        icon={<Sparkles size={18} className="text-premium" />}
        sparklineData={historyData}
        footerText={footer}
        complianceTag={`${count} Lenders`}
        statusBorder={count > 0 ? "success" : "none"}
      />
    </Link>
  );
}

export function OutcomeSnapshot({ analytics }: { analytics: AnalyticsSummary }) {
  const rate = analytics.approval_rate ?? 75;
  const total = analytics.total_applications ?? 0;
  const footer = `${total} application${total !== 1 ? "s" : ""} · ${analytics.conversion_rate ?? 0}% conversion`;

  // Custom mock history sparkline data
  const historyData = [40, 50, 55, 60, 68, rate];

  return (
    <Link href="/health" className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <MetricCardV2
        label="Your Outcomes"
        value={`${rate}%`}
        icon={<BarChart3 size={18} className="text-status-info" />}
        sparklineData={historyData}
        footerText={footer}
        complianceTag="Disbursed"
        statusBorder={rate >= 70 ? "success" : "info"}
      />
    </Link>
  );
}
