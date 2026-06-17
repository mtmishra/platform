import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { getLenderProfile, estimatedCommission, payoutDisplay } from "@leapmoney/lenders";

interface PageProps {
  params: { id: string };
}

export const metadata = { title: "Lender — LeapMoney DSA" };

const inr = (n: number): string => `₹${Math.round(n).toLocaleString("en-IN")}`;
const TYPE_LABEL: Record<string, string> = { bank: "Bank", nbfc: "NBFC", fintech: "Fintech" };
const BAND_TONE: Record<string, string> = { excellent: "text-status-success", good: "text-status-success", moderate: "text-status-warning", difficult: "text-status-danger" };
const PRODUCT_LABEL: Record<string, string> = { personal: "Personal Loan", home: "Home Loan", business: "Business Loan", lap: "Loan Against Property", credit_card: "Credit Card" };
const TAG_LABEL: Record<string, string> = {
  low_score: "Low score", high_score: "High score", self_employed: "Self-employed", salaried: "Salaried",
  balance_transfer: "Balance transfer", debt_consolidation: "Debt consolidation", new_to_credit: "New to credit",
};

export default function LenderProfilePage({ params }: PageProps) {
  const p = getLenderProfile(params.id);

  if (!p) {
    return (
      <div className="mx-auto max-w-card-md text-center">
        <Heading level={1} size="h1" className="mb-2">Lender not found</Heading>
        <Button variant="primary" size="lg"><Link href="/lenders">Back to lenders</Link></Button>
      </div>
    );
  }

  const { master, products, policy, approval, payouts, match } = p;
  const bandTone = BAND_TONE[approval.band] ?? "text-foreground-primary";

  const policyRows: Array<[string, string]> = [
    ["Primary bureau", policy.primary_bureau.toUpperCase()],
    ["Secondary bureau", policy.secondary_bureau ? policy.secondary_bureau.toUpperCase() : "—"],
    ["Min score", String(policy.min_score)],
    ["Preferred score", String(policy.preferred_score)],
    ["Min income", `${inr(policy.min_income)}/mo`],
    ["Max FOIR", `${Math.round(policy.max_foir * 100)}%`],
    ["Age", `${policy.min_age}–${policy.max_age}`],
    ["Employment", policy.employment_types.map((e) => e.replace("_", " ")).join(", ")],
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Heading level={1} size="display-large" className="mb-1">{master.lender_name}</Heading>
          <Paragraph color="secondary">{TYPE_LABEL[master.lender_type]} · {master.region_coverage} · {master.support_email}</Paragraph>
        </div>
        <span className={`text-label-caps uppercase tracking-wider ${bandTone}`}>{approval.band} approval</span>
      </div>

      {/* Approval intelligence */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Approval rate" value={`${approval.approval_rate}%`} tone={bandTone} />
        <Stat label="Avg TAT" value={`${approval.avg_tat_days} days`} />
        <Stat label="Disbursal" value={`${approval.avg_disbursal_days} days`} />
        <Stat label="Match strength" value={`${match.match_strength}/100`} tone="text-interactive-primary" />
      </section>

      {/* Credit policy */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Credit policy</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {policyRows.map(([k, v]) => (
            <div key={k}><p className="text-body-sm text-foreground-tertiary">{k}</p><p className="text-body-md font-semibold text-foreground-primary">{v}</p></div>
          ))}
        </div>
      </section>

      {/* Products + payouts */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Products &amp; payouts</Heading>
        <div className="flex flex-col gap-3">
          {products.map((prod) => {
            const payout = payouts.find((x) => x.product === prod.product);
            const commission = payout ? estimatedCommission(payout, 1000000) : 0;
            return (
              <div key={prod.product} className="flex flex-col gap-1 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body-md font-semibold text-foreground-primary">{PRODUCT_LABEL[prod.product]}</p>
                  <p className="text-body-sm text-foreground-tertiary">{inr(prod.min_amount)}–{inr(prod.max_amount)} · {prod.min_tenure}–{prod.max_tenure} mo</p>
                </div>
                <div className="text-right">
                  <p className="text-body-sm text-foreground-secondary">{payout ? payoutDisplay(payout) : "—"}</p>
                  {commission > 0 ? <p className="text-body-sm text-premium">~{inr(commission)} on ₹10L</p> : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Match profile */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Best for</h2>
        <div className="flex flex-wrap gap-2">
          {match.best_for.map((t) => (
            <span key={t} className="rounded-full bg-interactive-primary/10 px-3 py-1 text-body-sm font-medium text-interactive-primary">{TAG_LABEL[t]}</span>
          ))}
        </div>
      </section>

      <div><Button variant="ghost" size="lg"><Link href="/lenders">Back to lenders</Link></Button></div>
    </div>
  );
}

function Stat({ label, value, tone = "text-foreground-primary" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
      <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{label}</p>
      <p className={`font-mono text-h1 font-bold tabular-nums ${tone}`}>{value}</p>
    </div>
  );
}
