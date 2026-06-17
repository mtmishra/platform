import { Heading, Paragraph } from "@leapmoney/ui";
import { Sparkles, Info } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-demo";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";

export const metadata = { title: "Your matches — LeapMoney" };

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;

function tone(pct: number): string {
  if (pct >= 70) return "text-status-success";
  if (pct >= 40) return "text-status-warning";
  return "text-status-danger";
}

export default function MatchesPage() {
  const { match } = getDashboardData();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Your matched lenders</Heading>
        <Paragraph color="secondary">
          Ranked by how likely each lender is to approve you — and what it really costs. All eligible
          and ineligible lenders are shown, with no commission influence (RBI Digital Lending Directions 2025).
        </Paragraph>
      </div>

      {/* Matched */}
      <section className="flex flex-col gap-4">
        {match.matched_lenders.map((m) => (
          <div key={m.product_id} className="relative flex flex-col gap-3 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            {m.match_badge === "best_match" ? (
              <span className="absolute -top-2.5 left-5 inline-flex items-center rounded-full bg-premium px-2.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider text-navy-deep">
                Best match
              </span>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-h3 font-semibold text-foreground-primary">{m.lender_name}</p>
                <p className="text-body-sm text-foreground-tertiary">{m.match_reason}</p>
              </div>
              <div className="text-right">
                <p className={`font-mono text-h1 font-bold tabular-nums ${tone(m.approval_probability)}`}>{m.approval_probability}%</p>
                <p className="text-body-sm text-foreground-tertiary">{m.approval_probability_label}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-body-sm sm:grid-cols-4">
              <div><p className="text-foreground-tertiary">Rate</p><p className="font-medium text-foreground-primary">{m.interest_rate_min}%–{m.interest_rate_max}%</p></div>
              <div><p className="text-foreground-tertiary">EMI</p><p className="font-medium text-foreground-primary">{inr(m.emi_estimate)}/mo</p></div>
              <div><p className="text-foreground-tertiary">APR</p><p className="font-medium text-foreground-primary">{m.annual_percentage_rate}%</p></div>
              <div><p className="text-foreground-tertiary">Disbursal</p><p className="font-medium text-foreground-primary">~{m.avg_disbursal_days}d</p></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-foreground-tertiary">{m.processing_fee_display} · ⭐ {m.user_review_score} ({m.review_count})</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-interactive-primary px-3 py-1.5 text-body-sm font-semibold text-foreground-on-dark">
                <Sparkles size={14} /> Apply
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Not matched */}
      {match.not_matched_lenders.length > 0 ? (
        <section>
          <Heading level={2} size="h2" className="mb-3">Not matched yet</Heading>
          <div className="flex flex-col gap-2">
            {match.not_matched_lenders.map((n) => (
              <div key={n.product_id} className="flex items-start gap-2 rounded-lg border border-border-token-default bg-background-page p-4">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-foreground-tertiary" />
                <div>
                  <p className="text-body-md font-medium text-foreground-primary">{n.lender_name}</p>
                  <p className="text-body-sm text-foreground-secondary">{n.what_you_need}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-body-sm text-foreground-tertiary">{match.ranking_methodology}</p>

      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Where you are</h2>
        <CreditJourneyTimeline current="apply" />
      </section>
    </div>
  );
}
