import Link from "next/link";
import { Button, Heading, Paragraph, LeapScoreGauge, ApprovalOddsNumber, ConfidenceBadge, FOIRMeter, RiskBadge, TrustBar } from "@leapmoney/ui";
import { CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { getApplication } from "@/lib/lender-demo";
import { StatusBadge, ScoreBandBadge, inr } from "@/components/LenderWidgets";
import { DecisionWorkspace } from "@/components/DecisionWorkspace";

interface PageProps {
  params: { id: string };
}

export const metadata = { title: "Application Review — LeapMoney Lender" };

const TIMELINE = ["Application created", "Documents uploaded", "KYC completed", "Under review", "Decision generated", "Disbursal"];
const STATUS_PROGRESS: Record<string, number> = { new: 2, under_review: 4, approved: 5, rejected: 5, disbursed: 6 };

export default function ApplicationReviewPage({ params }: PageProps) {
  const app = getApplication(params.id);
  if (!app) {
    return (
      <div className="mx-auto max-w-card-md text-center">
        <Heading level={1} size="h1" className="mb-2">Application not found</Heading>
        <Button variant="primary" size="lg"><Link href="/applications">Back to inbox</Link></Button>
      </div>
    );
  }

  const done = STATUS_PROGRESS[app.status] ?? 0;

  const profile: Array<[string, string]> = [
    ["Product", app.product],
    ["Amount", inr(app.amount)],
    ["Tenure", `${app.tenure_months} mo`],
    ["Rate", `${app.rate}%`],
    ["City", app.city],
    ["Source", app.source],
  ];
  const intel: Array<{ label: string; value: string }> = [
    { label: "Credit Health", value: `${app.credit_health} / 100` },
    { label: "Cash Flow", value: `${app.cash_flow_score} / 100` },
    { label: "Verified income", value: `${inr(app.verified_income)}/mo` },
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <TrustBar variant="security" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1} size="display-large" className="mb-1">{app.applicant}</Heading>
          <Paragraph color="secondary">{app.id} · {app.product} · <ScoreBandBadge band={app.score_band} /></Paragraph>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Visual intelligence */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">LeapScore</p>
          <LeapScoreGauge value={app.leapscore} min={300} max={900} bandLabel="" label="LeapScore" size={140} />
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">FOIR</p>
          <FOIRMeter foir={app.foir_pct} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Approval odds</p>
          <ApprovalOddsNumber odds={app.approval_probability} size="lg" />
          <ConfidenceBadge level={app.confidence} />
        </div>
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Employer stability</p>
          <RiskBadge level={app.employer_stability} />
          <p className="text-body-sm text-foreground-secondary">{app.employer_category}</p>
        </div>
      </section>

      {/* Borrower profile */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Borrower profile</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profile.map(([k, v]) => (
            <div key={k}><p className="text-body-sm text-foreground-tertiary">{k}</p><p className="text-body-md font-semibold text-foreground-primary">{v}</p></div>
          ))}
        </div>
      </section>

      {/* Credit intel grid */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {intel.map((m) => (
          <div key={m.label} className="rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
            <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{m.label}</p>
            <p className="font-mono text-h1 font-bold tabular-nums text-foreground-primary">{m.value}</p>
          </div>
        ))}
      </section>

      {/* Employer intelligence */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Employer intelligence</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div><p className="text-body-sm text-foreground-tertiary">Category</p><p className="text-body-md font-semibold text-foreground-primary">{app.employer_category}</p></div>
          <div><p className="text-body-sm text-foreground-tertiary">Stability</p><RiskBadge level={app.employer_stability} /></div>
          <div><p className="text-body-sm text-foreground-tertiary">Job tenure</p><p className="text-body-md font-semibold text-foreground-primary">{(app.job_tenure_months / 12).toFixed(1)} yrs</p></div>
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Recommendations</Heading>
        <div className="flex flex-col gap-3">
          {app.recommendations.map((r) => (
            <div key={r.title} className="flex gap-3 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
              <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-premium" />
              <div><p className="text-body-md font-semibold text-foreground-primary">{r.title}</p><p className="text-body-sm text-foreground-secondary">{r.detail}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Decision workspace */}
      <DecisionWorkspace initialDecision={app.decision} initialReasons={app.reason_codes} />

      {/* Timeline + documents */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Application timeline</h2>
          <ol className="flex flex-col">
            {TIMELINE.map((step, i) => {
              const isDone = i < done;
              const last = i === TIMELINE.length - 1;
              return (
                <li key={step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={isDone ? "text-status-success" : "text-foreground-tertiary"}>{isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}</span>
                    {!last ? <span className={`my-1 w-px flex-1 ${isDone ? "bg-status-success/40" : "bg-border-token-default"}`} style={{ minHeight: 18 }} /> : null}
                  </div>
                  <p className={`pb-5 text-body-md ${isDone ? "font-medium text-foreground-primary" : "text-foreground-tertiary"}`}>{step}</p>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Documents</h2>
          <ul className="flex flex-col gap-2">
            {app.documents.map((d) => (
              <li key={d.type} className="flex items-center justify-between text-body-md">
                <span className="text-foreground-primary">{d.type}</span>
                {d.status === "uploaded"
                  ? <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-status-success"><CheckCircle2 size={15} /> Uploaded</span>
                  : <span className="text-body-sm font-medium text-status-warning">Missing</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div><Button variant="ghost" size="lg"><Link href="/applications">Back to inbox</Link></Button></div>
    </div>
  );
}
