import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { CheckCircle2, Circle } from "lucide-react";
import { getLead } from "@/lib/dsa-demo";
import { LeadStatusBadge, inr } from "@/components/DsaWidgets";

interface PageProps {
  params: { id: string };
}

export const metadata = { title: "Lead — LeapMoney DSA" };

const TIMELINE = ["New", "Qualified", "Matched", "Applied", "Approved", "Disbursed"] as const;

export default function LeadDetailPage({ params }: PageProps) {
  const lead = getLead(params.id);

  if (!lead) {
    return (
      <div className="mx-auto max-w-card-md text-center">
        <Heading level={1} size="h1" className="mb-2">Lead not found</Heading>
        <Button variant="primary" size="lg"><Link href="/leads">Back to leads</Link></Button>
      </div>
    );
  }

  // Timeline progress: index of current status within the happy path.
  const rejected = lead.status === "Rejected";
  const reachedIdx = rejected ? TIMELINE.indexOf("Applied") : TIMELINE.indexOf(lead.status as (typeof TIMELINE)[number]);

  const profile: Array<[string, string]> = [
    ["Product", lead.product],
    ["Amount", inr(lead.amount)],
    ["LeapScore", `${lead.leapscore} / 900`],
    ["Health Score", `${lead.health_score} / 100`],
    ["Approval Odds", `${lead.approval_odds}%`],
    ["Source", lead.source],
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1} size="display-large" className="mb-1">{lead.borrower_name}</Heading>
          <Paragraph color="secondary">{lead.id} · {lead.product}</Paragraph>
        </div>
        <LeadStatusBadge status={lead.status} />
      </div>

      {/* Borrower profile */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Borrower profile</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profile.map(([k, v]) => (
            <div key={k}>
              <p className="text-body-sm text-foreground-tertiary">{k}</p>
              <p className="text-body-md font-semibold text-foreground-primary">{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Matched lender + application status */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <h2 className="mb-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">Matched lender</h2>
          {lead.lender ? (
            <>
              <p className="text-h3 font-semibold text-foreground-primary">{lead.lender}</p>
              <p className="text-body-sm text-foreground-secondary">Approval odds {lead.approval_odds}% · {inr(lead.amount)} {lead.product}</p>
            </>
          ) : (
            <p className="text-body-md text-foreground-secondary">Not matched yet — qualify the lead to see matched lenders.</p>
          )}
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <h2 className="mb-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">Application status</h2>
          <LeadStatusBadge status={lead.status} />
          {lead.commission > 0 ? <p className="mt-2 text-body-sm text-foreground-secondary">Commission: <span className="font-mono font-medium text-premium">{inr(lead.commission)}</span></p> : null}
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Timeline</h2>
        <ol className="flex flex-col">
          {TIMELINE.map((step, i) => {
            const done = i <= reachedIdx;
            const last = i === TIMELINE.length - 1;
            return (
              <li key={step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={done ? "text-status-success" : "text-foreground-tertiary"}>{done ? <CheckCircle2 size={18} /> : <Circle size={18} />}</span>
                  {!last ? <span className={`my-1 w-px flex-1 ${done ? "bg-status-success/40" : "bg-border-token-default"}`} style={{ minHeight: 20 }} /> : null}
                </div>
                <p className={`pb-5 text-body-md ${done ? "font-medium text-foreground-primary" : "text-foreground-tertiary"}`}>{step}{rejected && step === "Applied" ? " · then rejected" : ""}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <div><Button variant="ghost" size="lg"><Link href="/leads">Back to leads</Link></Button></div>
    </div>
  );
}
