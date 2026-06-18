import { Heading, Paragraph } from "@leapmoney/ui";
import { getUnderwriting } from "@/lib/lender-demo";
import { BarList, ColumnChart } from "@/components/LenderWidgets";

export const metadata = { title: "Underwriting — LeapMoney Lender" };

const BAND_TONE: Record<string, string> = { Excellent: "bg-status-success", Good: "bg-interactive-primary", Fair: "bg-status-warning", Poor: "bg-status-danger" };

export default function UnderwritingPage() {
  const u = getUnderwriting();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Underwriting</Heading>
        <Paragraph color="secondary">Risk distribution, score bands, approval-probability spread, and decision trends.</Paragraph>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Risk distribution">
          <BarList rows={u.risk_distribution} />
        </Panel>
        <Panel title="Score bands">
          <BarList rows={u.score_bands.map((s) => ({ label: s.band, count: s.count, tone: BAND_TONE[s.band] ?? "bg-interactive-primary" }))} />
        </Panel>
        <Panel title="Approval probability distribution">
          <BarList rows={u.approval_prob_distribution.map((b) => ({ label: b.bucket, count: b.count }))} />
        </Panel>
        <div>
          <h2 className="mb-3 text-h3 font-semibold text-foreground-primary">Approval &amp; rejection trends</h2>
          <ColumnChart
            data={u.approval_trend.map((t) => ({
              label: t.month,
              values: [{ value: t.approved, tone: "bg-status-success" }, { value: t.rejected, tone: "bg-status-danger" }],
            }))}
          />
          <div className="mt-3 flex gap-4 text-body-sm">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-success" /> Approved</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-danger" /> Rejected</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <h2 className="mb-4 text-h3 font-semibold text-foreground-primary">{title}</h2>
      {children}
    </div>
  );
}
