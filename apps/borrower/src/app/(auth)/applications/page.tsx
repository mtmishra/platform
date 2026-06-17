import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { Plus } from "lucide-react";
import { getApplications, getStatusSummary } from "@/lib/applications-demo";
import { ApplicationCard } from "@/components/applications/ApplicationWidgets";

export const metadata = { title: "My Applications — LeapMoney" };

const SUMMARY_LABEL: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  disbursed: "Disbursed",
  withdrawn: "Withdrawn",
};

export default function ApplicationsPage() {
  const apps = getApplications();
  const summary = getStatusSummary();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading level={1} size="display-large" className="mb-1">My Applications</Heading>
          <Paragraph color="secondary">Track every application and its status in one place.</Paragraph>
        </div>
        <Button variant="primary" size="lg">
          <Link href="/applications/new" className="flex items-center gap-2"><Plus size={16} /> New application</Link>
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {Object.entries(summary).map(([key, count]) => (
          <div key={key} className="rounded-lg border border-border-token-default bg-background-card p-3 text-center shadow-1">
            <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{count}</p>
            <p className="text-body-sm text-foreground-tertiary">{SUMMARY_LABEL[key]}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-3">
        {apps.map((app) => (
          <ApplicationCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
}
