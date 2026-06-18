import { Heading, Paragraph, MetricCardV2, CountUp, TrendChart, StaggerContainer } from "@leapmoney/ui";
import { Clock, CheckCircle2, Wallet } from "lucide-react";
import { getCommissions, getRevenue } from "@/lib/admin-demo";
import { inr } from "@/components/AdminWidgets";

export const metadata = { title: "Commissions — LeapMoney Admin" };

export default function CommissionsPage() {
  const c = getCommissions();
  const rev = getRevenue();
  const revenueTrend = rev.monthly.map((m) => m.revenue);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Commission management</Heading>
        <Paragraph color="secondary">Platform-wide DSA commission pool across the payout lifecycle.</Paragraph>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCardV2 icon={<Clock size={15} />} label="Pending" value={inr(c.pending)} statusBorder="warning" sparklineData={[c.pending * 0.7, c.pending * 0.8, c.pending * 0.9, c.pending]} />
        <MetricCardV2 icon={<CheckCircle2 size={15} />} label="Approved" value={inr(c.approved)} statusBorder="info" sparklineData={[c.approved * 0.6, c.approved * 0.75, c.approved * 0.9, c.approved]} />
        <MetricCardV2 icon={<Wallet size={15} />} label="Paid" value={inr(c.paid)} statusBorder="success" sparklineData={[c.paid * 0.5, c.paid * 0.65, c.paid * 0.82, c.paid]} />
      </StaggerContainer>

      {/* Revenue trend */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <Heading level={2} size="h2" className="mb-3 text-foreground-primary">Monthly platform revenue</Heading>
        <TrendChart data={revenueTrend} className="w-full" />
        <div className="mt-2 flex justify-between text-label-caps text-foreground-tertiary">
          {rev.monthly.map((m) => <span key={m.month}>{m.month}</span>)}
        </div>
      </section>

      {/* DSA payouts */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Top earning DSAs</Heading>
        <StaggerContainer className="flex flex-col gap-2">
          {c.by_dsa.map((d, i) => (
            <div key={d.dsa} className="flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary/10 font-mono text-body-sm font-bold text-interactive-primary">#{i + 1}</span>
                <span className="text-body-md font-semibold text-foreground-primary">{d.dsa}</span>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-body-sm text-foreground-tertiary">Pending</p>
                  <CountUp value={d.pending} prefix="₹" className="block font-mono text-body-md font-semibold text-status-warning" />
                </div>
                <div className="text-right">
                  <p className="text-body-sm text-foreground-tertiary">Paid</p>
                  <CountUp value={d.paid} prefix="₹" className="block font-mono text-body-md font-semibold text-status-success" />
                </div>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
