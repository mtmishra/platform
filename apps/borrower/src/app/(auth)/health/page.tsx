import React from "react";
import { Card, Heading, Paragraph } from "@leapmoney/ui";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { getDemoCreditHealth } from "@/lib/health-demo";
import { HealthGauge } from "@/components/health/HealthGauge";
import { RiskCard } from "@/components/health/RiskCard";
import { ProgressTracker } from "@/components/health/ProgressTracker";
import { ImprovementTimeline } from "@/components/health/ImprovementTimeline";

export const metadata = { title: "Credit Health — LeapMoney" };

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function CreditHealthPage() {
  const { leapScore, health, dpdInsights, improvementPlan, simulations } = getDemoCreditHealth();
  const cost = leapScore.credit_cost_indicator;

  return (
    <div className="mx-auto flex max-w-content flex-col gap-10">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Credit Health</Heading>
        <Paragraph color="secondary">
          A living view of your credit health, what&apos;s helping or hurting it, and exactly
          what to do next. Sample data shown — your real view appears once your profile is complete.
        </Paragraph>
      </div>

      {/* Gauge + factor breakdown */}
      <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        <Card className="flex items-center justify-center">
          <HealthGauge score={health.health_score} band={health.health_band} />
        </Card>
        <div className="flex flex-col gap-3">
          <Heading level={2} size="h1">What drives your health</Heading>
          <ProgressTracker impacts={health.impact_scores} />
        </div>
      </section>

      {/* Credit cost indicator */}
      {cost ? (
        <Card variant="feature" className="flex flex-col gap-4">
          <span className="inline-flex items-center gap-2 text-premium">
            <TrendingUp size={20} />
            <span className="text-label-caps uppercase tracking-wider">What your score is costing you</span>
          </span>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <p className="font-mono text-display-large font-bold text-foreground-on-dark">{cost.current_rate_estimate}%</p>
              <p className="text-body-sm text-white/60">Your estimated rate today</p>
            </div>
            <div>
              <p className="font-mono text-display-large font-bold text-status-success">{cost.at_750_rate}%</p>
              <p className="text-body-sm text-white/60">Rate at a 750 score</p>
            </div>
            <div>
              <p className="font-mono text-display-large font-bold text-premium">{inr(cost.total_saving_5yr)}</p>
              <p className="text-body-sm text-white/60">Potential saving over 5 yrs (₹10L loan)</p>
            </div>
          </div>
          <p className="text-body-sm text-white/50">
            Reaching a 750 score could save you about {inr(cost.monthly_saving_on_10L_5yr)}/month on a ₹10 lakh, 5-year loan.
          </p>
        </Card>
      ) : null}

      {/* Risk indicators */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Risk indicators</Heading>
        {health.risk_indicators.length === 0 ? (
          <Paragraph color="secondary">No active risks — your credit profile looks healthy.</Paragraph>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {health.risk_indicators.map((r) => (
              <RiskCard key={r.id} risk={r} />
            ))}
          </div>
        )}
      </section>

      {/* DPD translator */}
      <section>
        <Heading level={2} size="h1" className="mb-1">Your accounts, in plain English</Heading>
        <Paragraph color="secondary" className="mb-4">
          We translate the bureau&apos;s codes into clear language so you know exactly what each account means.
        </Paragraph>
        <div className="flex flex-col gap-3">
          {dpdInsights.map((d, i) => (
            <div
              key={`${d.lender}-${i}`}
              className="flex flex-col gap-1 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-body-md font-semibold text-foreground-primary">
                  {d.lender} · {d.account_type.replace(/_/g, " ")}
                </p>
                <p className="text-body-sm text-foreground-secondary">{d.plain_english}</p>
              </div>
              <span className="font-mono text-body-sm text-foreground-tertiary">
                worst DPD: {d.worst_dpd}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Improvement plan */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Your improvement plan</Heading>
        <ImprovementTimeline plan={improvementPlan} />
      </section>

      {/* Score simulator */}
      <section>
        <Heading level={2} size="h1" className="mb-1">Score simulator</Heading>
        <Paragraph color="secondary" className="mb-4">
          See how much each action could move your score — and what it unlocks.
        </Paragraph>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {simulations.map((s) => (
            <Card key={s.id} className="flex flex-col gap-2">
              <p className="text-body-md font-semibold text-foreground-primary">{s.label}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 font-mono text-h2 font-bold text-status-success">
                  <ArrowUpRight size={18} />+{s.estimated_delta}
                </span>
                <span className="text-body-sm text-foreground-tertiary">
                  {s.current_score} → {s.estimated_new_score}
                </span>
              </div>
              {s.unlocked_options.length > 0 ? (
                <p className="text-body-sm text-foreground-secondary">
                  Unlocks: {s.unlocked_options.join("; ")}
                </p>
              ) : (
                <p className="text-body-sm text-foreground-tertiary">Keeps you on track for your next milestone.</p>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
