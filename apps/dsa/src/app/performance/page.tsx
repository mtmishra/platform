import { Heading, Paragraph } from "@leapmoney/ui";
import { Trophy } from "lucide-react";
import { getPerformance, getAnalytics } from "@/lib/dsa-demo";
import { MiniBarChart, inr } from "@/components/DsaWidgets";

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
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-border-token-default bg-background-card p-4 text-center shadow-1">
            <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{m.value}</p>
            <p className="text-body-sm text-foreground-tertiary">{m.label}</p>
          </div>
        ))}
      </section>

      {/* Trend + leaderboard */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Heading level={2} size="h2" className="mb-3">Monthly trend</Heading>
          <MiniBarChart data={p.monthly_trend} />
        </div>
        <div className="flex flex-col justify-center gap-2 rounded-lg border border-premium/30 bg-premium/5 p-5">
          <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-premium"><Trophy size={15} /> Leaderboard</span>
          <p className="font-mono text-display-large font-bold tabular-nums text-foreground-primary">#{p.leaderboard_position}</p>
          <p className="text-body-sm text-foreground-secondary">out of {p.leaderboard_total} DSA partners this month</p>
        </div>
      </section>

      {/* Analytics */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Analytics</Heading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnalyticsList title="Top products" rows={a.top_products.map((x) => [x.name, String(x.count)])} />
          <AnalyticsList title="Top lenders" rows={a.top_lenders.map((x) => [x.name, String(x.count)])} />
          <AnalyticsList title="Best sources" rows={a.best_sources.map((x) => [x.name, String(x.conversions)])} />
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Avg ticket size</p>
            <p className="mt-2 font-mono text-h1 font-bold tabular-nums text-foreground-primary">{inr(a.avg_ticket_size)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnalyticsList({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">{title}</p>
      <ul className="flex flex-col gap-2">
        {rows.map(([name, val]) => (
          <li key={name} className="flex items-center justify-between text-body-sm">
            <span className="text-foreground-secondary">{name}</span>
            <span className="font-mono font-medium text-foreground-primary">{val}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
