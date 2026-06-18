import Link from "next/link";
import { Button, Card, Heading, Paragraph, LeapScoreGauge, DistributionChart, RiskBadge } from "@leapmoney/ui";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buildCreditReport } from "@/lib/credit-report-demo";
import { FlowSteps } from "@/components/credit-report/FlowSteps";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";

export const metadata = { title: "Your Credit Report — LeapMoney" };

interface PageProps {
  searchParams: { pan?: string };
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
      <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">{label}</p>
      <p className="mt-1 font-mono text-h1 font-bold tabular-nums text-foreground-primary">{value}</p>
      {sub ? <p className="text-body-sm text-foreground-tertiary">{sub}</p> : null}
    </div>
  );
}

export default function CreditReportReadyPage({ searchParams }: PageProps) {
  const report = buildCreditReport(searchParams.pan);
  const { leapScore, bureauScores } = report;
  const ageYears = (report.creditAgeMonths / 12).toFixed(1);

  const bureauRows: Array<{ name: string; score: number | null; scale: string }> = [
    { name: "CIBIL", score: bureauScores.cibil, scale: "/ 900" },
    { name: "Experian", score: bureauScores.experian, scale: "/ 900" },
    { name: "CRIF", score: bureauScores.crif, scale: "/ 900" },
    { name: "Equifax", score: bureauScores.equifax, scale: "/ 999" },
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <FlowSteps current="report" />
        <span className="inline-flex items-center gap-2 text-status-success">
          <CheckCircle2 size={20} />
          <span className="text-label-caps uppercase tracking-wider">Report ready</span>
        </span>
        <Heading level={1} size="display-large" className="mt-2 mb-1">Your credit report is ready</Heading>
        <Paragraph color="secondary">
          Pulled across all four bureaus. Your LeapScore and Credit Health are now live on your dashboard.
        </Paragraph>
      </div>

      {/* LeapScore headline */}
      <Card variant="feature" className="flex flex-col items-start gap-2">
        <span className="text-label-caps uppercase tracking-wider text-premium">Your LeapScore</span>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-display-hero font-bold tabular-nums text-status-success">
            {leapScore.leapscore ?? "—"}
          </span>
          <span className="text-body-lg text-white/70">/ 900 · {leapScore.score_band}</span>
        </div>
        {leapScore.credit_cost_indicator ? (
          <Paragraph color="on-dark" className="opacity-80">
            At this score your estimated rate is {leapScore.credit_cost_indicator.current_rate_estimate}% p.a.
          </Paragraph>
        ) : null}
      </Card>

      {/* LeapScore gauge */}
      {leapScore.leapscore !== null ? (
        <section className="flex justify-center">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border-token-default bg-background-card p-8 shadow-1">
            <LeapScoreGauge value={leapScore.leapscore} min={300} max={900} bandLabel={leapScore.score_band} label="LeapScore" size={200} />
            <p className="text-body-sm text-foreground-tertiary">across all four bureaus</p>
          </div>
        </section>
      ) : null}

      {/* Bureau scores */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Bureau scores</Heading>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bureauRows.map((b) => (
            <Metric key={b.name} label={b.name} value={b.score === null ? "No hit" : String(b.score)} sub={b.score === null ? "No file on record" : b.scale} />
          ))}
        </div>
        <div className="mt-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Bureau comparison (300–900)</p>
          <DistributionChart
            rows={bureauRows
              .filter((b) => b.score !== null && b.scale === "/ 900")
              .map((b) => ({ label: b.name, value: b.score as number, tone: "var(--color-interactive-primary)" }))}
            max={900}
          />
        </div>
      </section>

      {/* Key metrics */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Your credit profile</Heading>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active accounts" value={String(report.activeAccounts)} />
          <Metric label="Utilization" value={`${report.utilizationPct}%`} sub={report.utilizationPct <= 30 ? "Healthy" : "Reduce below 30%"} />
          <Metric label="Enquiries (6m)" value={String(report.enquiries6m)} />
          <Metric label="Credit age" value={`${ageYears} yr`} />
        </div>
      </section>

      {/* DPD summary */}
      <section>
        <div className="mb-1 flex items-center gap-3">
          <Heading level={2} size="h1">Payment history (DPD)</Heading>
          <RiskBadge level={report.accountsWithDpd === 0 ? "Low" : report.worstDpd <= 30 ? "Medium" : "High"} />
        </div>
        <Paragraph color="secondary" className="mb-4">
          {report.accountsWithDpd === 0
            ? "All accounts paid on time — no days past due on record."
            : `${report.accountsWithDpd} account(s) show late payments. Worst delay: ${report.worstDpd} days.`}
        </Paragraph>
        <div className="flex flex-col gap-3">
          {report.dpdInsights.slice(0, 3).map((d, i) => (
            <div key={`${d.lender}-${i}`} className="rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
              <p className="text-body-md font-semibold text-foreground-primary">
                {d.lender} · {d.account_type.replace(/_/g, " ")}
              </p>
              <p className="text-body-sm text-foreground-secondary">{d.plain_english}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Where you are</h2>
        <CreditJourneyTimeline current="apply" />
      </section>

      <div>
        <Button variant="primary" size="lg">
          <Link href="/dashboard" className="flex items-center gap-2">
            Go to your dashboard <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
