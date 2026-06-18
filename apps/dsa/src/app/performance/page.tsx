import { Heading, Paragraph, TrendChart, DistributionChart, KpiValue, StaggerContainer } from "@leapmoney/ui";
import { Trophy } from "lucide-react";
import { getPerformance, getAnalytics } from "@/lib/dsa-demo";
import { inr } from "@/components/DsaWidgets";

export const metadata = { title: "Performance — LeapMoney DSA" };

export default function PerformancePage() {
  const p = getPerformance();
  const a = getAnalytics();

  const metrics = [
    { label: "Leads Generated", value: String(p.leads_generated) },
    { label: "Applications Submitted", value: String(p.applications_submitted) },
    { label: "Approval Rate", value: `${p.approval_rate}%` },
    { label: "Disbursal Rate", value: `${p.disbursal_rate}%` },
    { label: "Conversion Rate", value: `${p.conversion_rate}%` },
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Performance</Heading>
        <Paragraph color="secondary">Your funnel metrics, monthly trend, and leaderboard standing.</Paragraph>
      </div>

      {/* Metrics */}
      <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-border-token-default bg-background-card p-4 text-center shadow-1">
            <KpiValue value={m.value} className="block" />
            <p className="text-body-sm text-foreground-tertiary">{m.label}</p>
          </div>
        ))}
      </StaggerContainer>

      {/* Trend + leaderboard */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Heading level={2} size="h2" className="mb-3">Monthly trend</Heading>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <TrendChart data={p.monthly_trend.map((d) => d.leads)} className="w-full" />
            <div className="mt-2 flex justify-between text-label-caps text-foreground-tertiary">
              {p.monthly_trend.map((d) => <span key={d.month}>{d.month}</span>)}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2 rounded-lg border border-premium/30 bg-premium/5 p-5">
          <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-premium"><Trophy size={15} /> Leaderboard</span>
          <KpiValue value={`#${p.leaderboard_position}`} className="block" />
          <p className="text-body-sm text-foreground-secondary">out of {p.leaderboard_total} DSA partners this month</p>
        </div>
      </section>

      {/* Analytics */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Analytics</Heading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Top products</p>
            <DistributionChart
              rows={a.top_products.map((x) => ({ label: x.name, value: x.count, tone: "var(--color-interactive-primary)" }))}
              max={Math.max(...a.top_products.map((x) => x.count), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Top lenders</p>
            <DistributionChart
              rows={a.top_lenders.map((x) => ({ label: x.name, value: x.count, tone: "var(--color-status-success)" }))}
              max={Math.max(...a.top_lenders.map((x) => x.count), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Best sources</p>
            <DistributionChart
              rows={a.best_sources.map((x) => ({ label: x.name, value: x.conversions, tone: "var(--color-status-warning)" }))}
              max={Math.max(...a.best_sources.map((x) => x.conversions), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Avg ticket size</p>
            <KpiValue value={inr(a.avg_ticket_size)} className="mt-2 block" />
          </div>
        </div>
      </section>
    </div>
  );
}
