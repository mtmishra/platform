import { Heading, Paragraph } from "@leapmoney/ui";
import { Clock, CheckCircle2, Wallet } from "lucide-react";
import { getCommissions } from "@/lib/admin-demo";
import { KpiCard, inr } from "@/components/AdminWidgets";

export const metadata = { title: "Commissions — LeapMoney Admin" };

export default function CommissionsPage() {
  const c = getCommissions();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Commission management</Heading>
        <Paragraph color="secondary">Platform-wide DSA commission pool across the payout lifecycle.</Paragraph>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard icon={<Clock size={15} />} label="Pending" value={inr(c.pending)} tone="text-status-warning" />
        <KpiCard icon={<CheckCircle2 size={15} />} label="Approved" value={inr(c.approved)} tone="text-interactive-primary" />
        <KpiCard icon={<Wallet size={15} />} label="Paid" value={inr(c.paid)} tone="text-status-success" />
      </section>

      <section>
        <Heading level={2} size="h1" className="mb-4">Top earning DSAs</Heading>
        <div className="overflow-hidden rounded-lg border border-border-token-default bg-background-card shadow-1">
          <div className="grid grid-cols-3 gap-3 border-b border-border-token-default px-4 py-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">
            <span>DSA</span><span className="text-right">Pending</span><span className="text-right">Paid</span>
          </div>
          <ul className="flex flex-col divide-y divide-border-token-default">
            {c.by_dsa.map((d) => (
              <li key={d.dsa} className="grid grid-cols-3 gap-3 px-4 py-3">
                <span className="text-body-md font-medium text-foreground-primary">{d.dsa}</span>
                <span className="text-right font-mono text-body-md text-status-warning">{inr(d.pending)}</span>
                <span className="text-right font-mono text-body-md text-status-success">{inr(d.paid)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
