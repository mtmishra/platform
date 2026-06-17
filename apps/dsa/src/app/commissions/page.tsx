import { Heading, Paragraph } from "@leapmoney/ui";
import { Clock, CheckCircle2, Wallet } from "lucide-react";
import { getCommissions, getLeads } from "@/lib/dsa-demo";
import { StatCard, LeadStatusBadge, inr } from "@/components/DsaWidgets";

export const metadata = { title: "Commissions — LeapMoney DSA" };

export default function CommissionsPage() {
  const c = getCommissions();
  const earning = getLeads().filter((l) => l.commission > 0).sort((a, b) => b.commission - a.commission);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Commissions</Heading>
        <Paragraph color="secondary">Track what you&apos;ve earned, what&apos;s approved, and what&apos;s on the way.</Paragraph>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<Clock size={15} />} label="Pending Commission" value={inr(c.pending)} tone="text-status-warning" />
        <StatCard icon={<CheckCircle2 size={15} />} label="Approved Commission" value={inr(c.approved)} tone="text-interactive-primary" />
        <StatCard icon={<Wallet size={15} />} label="Paid Commission" value={inr(c.paid)} tone="text-status-success" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Monthly earnings</p>
          <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{inr(c.monthly)}</p>
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Yearly earnings</p>
          <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{inr(c.yearly)}</p>
        </div>
        <div className="rounded-lg border border-premium/30 bg-premium/5 p-5">
          <p className="text-label-caps uppercase tracking-wider text-premium">Projected earnings</p>
          <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{inr(c.projected)}</p>
        </div>
      </section>

      <section>
        <Heading level={2} size="h1" className="mb-4">Commission by lead</Heading>
        <div className="flex flex-col gap-2">
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
        </div>
      </section>
    </div>
  );
}
