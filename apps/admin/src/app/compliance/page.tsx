import { Heading, Paragraph } from "@leapmoney/ui";
import { ShieldCheck, FileSearch } from "lucide-react";
import { getCompliance } from "@/lib/admin-demo";
import { KpiCard, Panel } from "@/components/AdminWidgets";

export const metadata = { title: "Compliance — LeapMoney Admin" };

export default function CompliancePage() {
  const c = getCompliance();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Compliance dashboard</Heading>
        <Paragraph color="secondary">DPDP consents, audit trail, and bureau-pull logs.</Paragraph>
      </div>

      {/* Consents */}
      <section>
        <div className="mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-foreground-secondary" /><Heading level={2} size="h1">Consents</Heading></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Granted" value={c.consents.granted.toLocaleString("en-IN")} />
          <KpiCard label="Active" value={c.consents.active.toLocaleString("en-IN")} tone="text-status-success" />
          <KpiCard label="Withdrawn" value={c.consents.withdrawn.toLocaleString("en-IN")} tone="text-status-warning" />
        </div>
      </section>

      {/* Bureau pulls */}
      <section>
        <div className="mb-3 flex items-center gap-2"><FileSearch size={18} className="text-foreground-secondary" /><Heading level={2} size="h1">Bureau pull logs</Heading></div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <KpiCard label="Total Pulls" value={c.bureau_pulls.total.toLocaleString("en-IN")} />
          <KpiCard label="Soft" value={c.bureau_pulls.soft.toLocaleString("en-IN")} />
          <KpiCard label="Hard" value={c.bureau_pulls.hard.toLocaleString("en-IN")} />
          <KpiCard label="Consented" value="100%" tone="text-status-success" />
        </div>
      </section>

      {/* Audit log */}
      <section>
        <Panel title="Audit log">
          <ul className="flex flex-col divide-y divide-border-token-default">
            {c.audit_logs.map((l, i) => (
              <li key={i} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span className="text-body-md text-foreground-primary">{l.action}</span>
                <span className="flex-shrink-0 text-body-sm text-foreground-tertiary">{l.actor} · {l.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </section>
    </div>
  );
}
