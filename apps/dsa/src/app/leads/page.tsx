import { Heading, Paragraph } from "@leapmoney/ui";
import { getLeads, LEAD_STATUSES } from "@/lib/dsa-demo";
import { LeadRow } from "@/components/DsaWidgets";

export const metadata = { title: "Leads — LeapMoney DSA" };

export default function LeadsPage() {
  const leads = getLeads();
  const counts = LEAD_STATUSES.map((s) => ({ status: s, count: leads.filter((l) => l.status === s).length }));

  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Leads</Heading>
        <Paragraph color="secondary">{leads.length} leads across your pipeline.</Paragraph>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-7">
        {counts.map((c) => (
          <div key={c.status} className="rounded-lg border border-border-token-default bg-background-card p-3 text-center shadow-1">
            <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{c.count}</p>
            <p className="text-body-sm text-foreground-tertiary">{c.status}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {leads.map((l) => <LeadRow key={l.id} lead={l} />)}
      </div>
    </div>
  );
}
