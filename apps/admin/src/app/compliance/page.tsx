import { Heading, Paragraph, MetricCardV2, CountUp, TrustBar, StaggerContainer, AnimatedCard } from "@leapmoney/ui";
import { ShieldCheck, FileSearch } from "lucide-react";
import { getCompliance } from "@/lib/admin-demo";
import { Panel } from "@/components/AdminWidgets";

export const metadata = { title: "Compliance — LeapMoney Admin" };

export default function CompliancePage() {
  const c = getCompliance();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-border-token-default/50 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Heading level={1} size="display-large" className="mb-1">Compliance dashboard</Heading>
          <Paragraph color="secondary">DPDP consents, audit trail, and bureau-pull logs.</Paragraph>
        </div>
        <TrustBar variant="regulatory" />
      </div>

      {/* Consents */}
      <section>
        <div className="mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-foreground-secondary" /><Heading level={2} size="h1">Consents</Heading></div>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCardV2 label="Granted" value={c.consents.granted.toLocaleString("en-IN")} sparklineData={[8400, 8700, 8900, c.consents.granted]} />
          <MetricCardV2 label="Active" value={c.consents.active.toLocaleString("en-IN")} statusBorder="success" sparklineData={[8100, 8400, 8600, c.consents.active]} />
          <MetricCardV2 label="Withdrawn" value={c.consents.withdrawn.toLocaleString("en-IN")} statusBorder="warning" sparklineData={[280, 310, 350, c.consents.withdrawn]} />
        </StaggerContainer>
      </section>

      {/* Bureau pulls */}
      <section>
        <div className="mb-3 flex items-center gap-2"><FileSearch size={18} className="text-foreground-secondary" /><Heading level={2} size="h1">Bureau pull logs</Heading></div>
        <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <AnimatedCard className="flex flex-col gap-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Total Pulls</p>
            <CountUp value={c.bureau_pulls.total} className="block font-mono text-h1 font-bold tabular-nums text-foreground-primary" />
          </AnimatedCard>
          <AnimatedCard delayMs={80} className="flex flex-col gap-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Soft</p>
            <CountUp value={c.bureau_pulls.soft} className="block font-mono text-h1 font-bold tabular-nums text-foreground-primary" />
          </AnimatedCard>
          <AnimatedCard delayMs={160} className="flex flex-col gap-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Hard</p>
            <CountUp value={c.bureau_pulls.hard} className="block font-mono text-h1 font-bold tabular-nums text-foreground-primary" />
          </AnimatedCard>
          <AnimatedCard delayMs={240} className="flex flex-col gap-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Consented</p>
            <p className="font-mono text-h1 font-bold tabular-nums text-status-success">100%</p>
          </AnimatedCard>
        </StaggerContainer>
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
