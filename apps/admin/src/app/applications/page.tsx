import { Heading, Paragraph, DistributionChart, StaggerContainer } from "@leapmoney/ui";
import { getApplications } from "@/lib/admin-demo";
import type { AppStatus, LeadSource } from "@/lib/admin-demo";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export const metadata = { title: "Applications — LeapMoney Admin" };

export default function ApplicationsPage() {
  const applications = getApplications();

  const statusCount = (s: AppStatus) => applications.filter((a) => a.status === s).length;
  const sourceCount = (s: LeadSource) => applications.filter((a) => a.source === s).length;

  const pipelineRows = [
    { label: "New", value: statusCount("new"), tone: "var(--color-interactive-primary)" },
    { label: "Under Review", value: statusCount("under_review"), tone: "var(--color-status-warning)" },
    { label: "Approved", value: statusCount("approved"), tone: "var(--color-status-success)" },
    { label: "Rejected", value: statusCount("rejected"), tone: "var(--color-status-danger)" },
    { label: "Disbursed", value: statusCount("disbursed"), tone: "var(--color-status-success)" },
  ];
  const pipelineMax = Math.max(...pipelineRows.map((r) => r.value), 1);

  const sourceRows: Array<{ label: LeadSource; value: number; tone: string }> = [
    { label: "Borrower Direct", value: sourceCount("Borrower Direct"), tone: "var(--color-interactive-primary)" },
    { label: "DSA", value: sourceCount("DSA"), tone: "var(--color-status-success)" },
    { label: "Referral", value: sourceCount("Referral"), tone: "var(--color-status-warning)" },
    { label: "Organic", value: sourceCount("Organic"), tone: "var(--color-status-danger)" },
  ];
  const sourceMax = Math.max(...sourceRows.map((r) => r.value), 1);

  const approvedCount = statusCount("approved") + statusCount("disbursed");
  const approvalRate = Math.round((approvedCount / applications.length) * 100);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Application management</Heading>
        <Paragraph color="secondary">All applications across the platform — pipeline, source analytics, and approval metrics.</Paragraph>
      </div>

      {/* Pipeline + Source analytics */}
      <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Pipeline by status</p>
          <DistributionChart rows={pipelineRows} max={pipelineMax} />
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Applications by source</p>
          <DistributionChart rows={sourceRows} max={sourceMax} />
        </div>
        <div className="flex flex-col justify-center rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 sm:col-span-2 lg:col-span-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Approval rate</p>
          <p className="font-mono text-display-large font-bold tabular-nums text-status-success">{approvalRate}%</p>
          <p className="text-body-sm text-foreground-secondary">{approvedCount} of {applications.length} applications approved or disbursed</p>
        </div>
      </StaggerContainer>

      <ApplicationsTable applications={applications} />
    </div>
  );
}
