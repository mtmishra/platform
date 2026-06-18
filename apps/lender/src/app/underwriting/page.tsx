import { type ReactNode } from "react";
import { Heading, Paragraph, DistributionChart, TrendChart, StaggerContainer } from "@leapmoney/ui";
import { getUnderwriting } from "@/lib/lender-demo";

export const metadata = { title: "Underwriting — LeapMoney Lender" };

const BAND_TONE: Record<string, string> = {
  Excellent: "var(--color-status-success)",
  Good: "var(--color-status-success)",
  Fair: "var(--color-status-warning)",
  Poor: "var(--color-status-danger)",
};

const RISK_TONE: Record<string, string> = {
  "bg-status-success": "var(--color-status-success)",
  "bg-status-warning": "var(--color-status-warning)",
  "bg-status-danger": "var(--color-status-danger)",
};

export default function UnderwritingPage() {
  const u = getUnderwriting();
  const approvedTrend = u.approval_trend.map((t) => t.approved);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Underwriting</Heading>
        <Paragraph color="secondary">Risk distribution, score bands, approval-probability spread, and decision trends.</Paragraph>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Risk distribution">
          <DistributionChart
            rows={u.risk_distribution.map((r) => ({ label: r.label, value: r.count, tone: RISK_TONE[r.tone] ?? "var(--color-interactive-primary)" }))}
            max={Math.max(...u.risk_distribution.map((r) => r.count), 1)}
          />
        </Panel>
        <Panel title="Score bands">
          <DistributionChart
            rows={u.score_bands.map((s) => ({ label: s.band, value: s.count, tone: BAND_TONE[s.band] ?? "var(--color-interactive-primary)" }))}
            max={Math.max(...u.score_bands.map((s) => s.count), 1)}
          />
        </Panel>
        <Panel title="Approval probability distribution">
          <DistributionChart
            rows={u.approval_prob_distribution.map((b) => ({ label: b.bucket, value: b.count, tone: "var(--color-interactive-primary)" }))}
            max={Math.max(...u.approval_prob_distribution.map((b) => b.count), 1)}
          />
        </Panel>
        <div>
          <h2 className="mb-3 text-h3 font-semibold text-foreground-primary">Approval trend</h2>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <TrendChart data={approvedTrend} className="w-full" />
            <div className="mt-2 flex justify-between text-label-caps text-foreground-tertiary">
              {u.approval_trend.map((t) => <span key={t.month}>{t.month}</span>)}
            </div>
          </div>
          <div className="mt-3 flex gap-4 text-body-sm">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-success" /> Approved</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-status-danger" /> Rejected</span>
          </div>
        </div>
      </StaggerContainer>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <h2 className="mb-4 text-h3 font-semibold text-foreground-primary">{title}</h2>
      {children}
    </div>
  );
}
