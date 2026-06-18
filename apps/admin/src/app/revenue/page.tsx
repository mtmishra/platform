import { Heading, Paragraph, MetricCardV2, CountUp, TrendChart, StaggerContainer } from "@leapmoney/ui";
import { TrendingUp, Banknote, Percent } from "lucide-react";
import { getRevenue, getKpis } from "@/lib/admin-demo";
import { inr } from "@/components/AdminWidgets";

export const metadata = { title: "Revenue — LeapMoney Admin" };

const compact = (n: number): string => (n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n}`);

export default function RevenuePage() {
  const r = getRevenue();
  const k = getKpis();
  const revenueTrend = r.monthly.map((m) => m.revenue);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Revenue dashboard</Heading>
        <Paragraph color="secondary">Platform revenue, disbursal volume, and conversion.</Paragraph>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCardV2 icon={<TrendingUp size={15} />} label="Revenue" value={inr(r.revenue)} statusBorder="info" sparklineData={[2800000, 3200000, 3600000, 3900000, r.revenue]} />
        <MetricCardV2 icon={<Banknote size={15} />} label="Disbursal Volume" value={compact(r.disbursal_volume)} statusBorder="success" sparklineData={[250000000, 290000000, 320000000, 350000000, r.disbursal_volume]} />
        <MetricCardV2 icon={<Percent size={15} />} label="Conversion Rate" value={`${r.conversion_rate}%`} sparklineData={[28, 30, 31, 32, r.conversion_rate]} />
      </StaggerContainer>

      {/* Monthly revenue trend */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <Heading level={2} size="h2" className="mb-3 text-foreground-primary">Monthly revenue trend</Heading>
        <TrendChart data={revenueTrend} className="w-full" />
        <div className="mt-2 flex justify-between text-label-caps text-foreground-tertiary">
          {r.monthly.map((m) => <span key={m.month}>{m.month}</span>)}
        </div>
      </section>

      {/* Commission pool */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">DSA Commission pool</p>
          <CountUp value={k.commission} prefix="₹" className="block font-mono text-display-large font-bold tabular-nums text-foreground-primary" />
          <p className="text-body-sm text-foreground-secondary">1.5% of disbursed volume</p>
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Platform take-rate revenue</p>
          <CountUp value={r.revenue} prefix="₹" className="block font-mono text-display-large font-bold tabular-nums text-interactive-primary" />
          <p className="text-body-sm text-foreground-secondary">1.1% of disbursed volume</p>
        </div>
      </section>
    </div>
  );
}
