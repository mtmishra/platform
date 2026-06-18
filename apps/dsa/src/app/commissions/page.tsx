import { Heading, Paragraph, MetricCardV2, CountUp, TrendChart, StaggerContainer } from "@leapmoney/ui";
import { Clock, CheckCircle2, Wallet } from "lucide-react";
import { getCommissions, getLeads } from "@/lib/dsa-demo";
import { LeadStatusBadge, inr } from "@/components/DsaWidgets";

export const metadata = { title: "Commissions — LeapMoney DSA" };

export default function CommissionsPage() {
  const c = getCommissions();
  const earning = getLeads().filter((l) => l.commission > 0).sort((a, b) => b.commission - a.commission);
  const commissionTrend = [22000, 35000, 48000, 55000, 72000, c.monthly];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Commissions</Heading>
        <Paragraph color="secondary">Track what you&apos;ve earned, what&apos;s approved, and what&apos;s on the way.</Paragraph>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCardV2
          label="Pending Commission"
          value={inr(c.pending)}
          icon={<Clock size={16} />}
          sparklineData={[5000, 8000, 12000, 9000, 11000, c.pending]}
          statusBorder="warning"
        />
        <MetricCardV2
          label="Approved Commission"
          value={inr(c.approved)}
          icon={<CheckCircle2 size={16} />}
          sparklineData={[15000, 22000, 28000, 32000, 38000, c.approved]}
          statusBorder="info"
        />
        <MetricCardV2
          label="Paid Commission"
          value={inr(c.paid)}
          icon={<Wallet size={16} />}
          sparklineData={[10000, 18000, 24000, 30000, 36000, c.paid]}
          statusBorder="success"
        />
      </StaggerContainer>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Monthly earnings</p>
          <CountUp value={c.monthly} prefix="₹" className="block font-mono text-h1 font-bold tabular-nums text-foreground-primary" />
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Yearly earnings</p>
          <CountUp value={c.yearly} prefix="₹" className="block font-mono text-h1 font-bold tabular-nums text-foreground-primary" />
        </div>
        <div className="rounded-lg border border-premium/30 bg-premium/5 p-5">
          <p className="text-label-caps uppercase tracking-wider text-premium">Projected earnings</p>
          <CountUp value={c.projected} prefix="₹" className="block font-mono text-h1 font-bold tabular-nums text-foreground-primary" />
        </div>
      </section>

      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Earnings trend (Jan–Jun)</p>
        <TrendChart data={commissionTrend} className="w-full" />
        <div className="mt-2 flex justify-between text-label-caps text-foreground-tertiary">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => <span key={m}>{m}</span>)}
        </div>
      </section>

      <section>
        <Heading level={2} size="h1" className="mb-4">Commission by lead</Heading>
        <StaggerContainer className="flex flex-col gap-2">
          {earning.map((l) => (
            <div key={l.id} className="flex items-center justify-between rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
              <div>
                <p className="text-body-md font-semibold text-foreground-primary">{l.borrower_name} · {l.lender}</p>
                <p className="text-body-sm text-foreground-tertiary">{l.id} · {inr(l.amount)} {l.product}</p>
              </div>
              <div className="flex items-center gap-3">
                <LeadStatusBadge status={l.status} />
                <span className="font-mono text-body-md font-semibold text-premium">{inr(l.commission)}</span>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
