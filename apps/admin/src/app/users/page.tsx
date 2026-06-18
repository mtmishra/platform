import { Heading, Paragraph, DistributionChart, AnimatedCard, StaggerContainer, CountUp } from "@leapmoney/ui";
import { getUsers, getKpis } from "@/lib/admin-demo";
import { UsersTable } from "@/components/UsersTable";

export const metadata = { title: "Users — LeapMoney Admin" };

export default function UsersPage() {
  const users = getUsers();
  const k = getKpis();

  const roleMax = Math.max(k.total_borrowers, k.total_dsas, k.total_lenders);
  const roleRows = [
    { label: "Borrowers", value: k.total_borrowers, tone: "var(--color-interactive-primary)" },
    { label: "DSAs", value: k.total_dsas, tone: "var(--color-status-success)" },
    { label: "Lenders", value: k.total_lenders, tone: "var(--color-status-warning)" },
  ];

  const statusCount = (s: string) => users.filter((u) => u.status === s).length;
  const statusRows = [
    { label: "Active", value: statusCount("Active"), tone: "var(--color-status-success)" },
    { label: "Pending", value: statusCount("Pending"), tone: "var(--color-status-warning)" },
    { label: "Suspended", value: statusCount("Suspended"), tone: "var(--color-status-danger)" },
  ];
  const statusMax = Math.max(...statusRows.map((r) => r.value), 1);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">User management</Heading>
        <Paragraph color="secondary">Borrowers, DSAs, and lenders across the platform.</Paragraph>
      </div>

      {/* Role analytics */}
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AnimatedCard className="flex flex-col gap-2">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Borrowers</p>
          <CountUp value={k.total_borrowers} className="block font-mono text-display-large font-bold tabular-nums text-foreground-primary" />
        </AnimatedCard>
        <AnimatedCard delayMs={80} className="flex flex-col gap-2">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">DSA Partners</p>
          <CountUp value={k.total_dsas} className="block font-mono text-display-large font-bold tabular-nums text-foreground-primary" />
        </AnimatedCard>
        <AnimatedCard delayMs={160} className="flex flex-col gap-2">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Lenders</p>
          <CountUp value={k.total_lenders} className="block font-mono text-display-large font-bold tabular-nums text-foreground-primary" />
        </AnimatedCard>
      </StaggerContainer>

      {/* Role & status visuals */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Platform role distribution</p>
          <DistributionChart rows={roleRows} max={roleMax} />
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">User status (sample)</p>
          <DistributionChart rows={statusRows} max={statusMax} />
        </div>
      </section>

      <UsersTable users={users} />
    </div>
  );
}
