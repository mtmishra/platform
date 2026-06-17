import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { ArrowRight } from "lucide-react";
import { getApplication, buildTimeline } from "@/lib/applications-demo";
import {
  StatusBadge,
  ApprovalCard,
  KycCard,
  DocumentVault,
  ApplicationTimeline,
  ApplicationNotifications,
} from "@/components/applications/ApplicationWidgets";

interface PageProps {
  params: { id: string };
}

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

export const metadata = { title: "Application — LeapMoney" };

export default function ApplicationDetailPage({ params }: PageProps) {
  const app = getApplication(params.id);

  if (!app) {
    return (
      <div className="mx-auto max-w-card-md text-center">
        <Heading level={1} size="h1" className="mb-2">Application not found</Heading>
        <Paragraph color="secondary" className="mb-4">We couldn&apos;t find that application.</Paragraph>
        <Button variant="primary" size="lg"><Link href="/applications">Back to applications</Link></Button>
      </div>
    );
  }

  const timeline = buildTimeline(app);
  const summary: Array<[string, string]> = [
    ["Lender", app.lender_name],
    ["Loan type", app.loan_type],
    ["Amount", inr(app.amount)],
    ["Tenure", `${app.tenure_months} months`],
    ["Rate", `${app.rate}% p.a.`],
    ["EMI", `${inr(app.emi)}/mo`],
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1} size="display-large" className="mb-1">{app.lender_name}</Heading>
          <Paragraph color="secondary">{app.id} · {app.loan_type}</Paragraph>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Summary */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Application summary</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {summary.map(([k, v]) => (
            <div key={k}>
              <p className="text-body-sm text-foreground-tertiary">{k}</p>
              <p className="text-body-md font-semibold text-foreground-primary">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ApprovalCard app={app} />
        <KycCard status={app.kyc_status} />
      </section>

      {/* Documents */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Document vault</Heading>
        <DocumentVault documents={app.documents} />
      </section>

      {/* Timeline + notifications */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Status timeline</h2>
            <Link href={`/applications/${app.id}/timeline`} className="inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">
              Full timeline <ArrowRight size={14} />
            </Link>
          </div>
          <ApplicationTimeline steps={timeline} />
        </div>
        <ApplicationNotifications app={app} />
      </section>
    </div>
  );
}
