import { Heading, Paragraph, DistributionChart, RiskBadge, StaggerContainer } from "@leapmoney/ui";
import { getRisk } from "@/lib/admin-demo";
import { Panel } from "@/components/AdminWidgets";

export const metadata = { title: "Risk — LeapMoney Admin" };

const BAND_TONE: Record<string, string> = {
  Excellent: "var(--color-status-success)",
  Good: "var(--color-status-success)",
  Fair: "var(--color-status-warning)",
  Poor: "var(--color-status-danger)",
};

const BAND_RISK: Record<string, "Low" | "Medium" | "High"> = {
  Excellent: "Low",
  Good: "Low",
  Fair: "Medium",
  Poor: "High",
};

export default function RiskPage() {
  const r = getRisk();

  const scoreBandRows = r.score_bands.map((s) => ({ label: s.band, value: s.count, tone: BAND_TONE[s.band] ?? "var(--color-interactive-primary)" }));
  const scoreBandMax = Math.max(...r.score_bands.map((s) => s.count), 1);

  const approvalRows = r.approval_rate_by_band.map((s) => ({ label: s.band, value: s.rate, tone: BAND_TONE[s.band] ?? "var(--color-interactive-primary)" }));

  const rejectionRows = r.rejection_reasons.map((x) => ({ label: x.label, value: x.count, tone: "var(--color-status-danger)" }));
  const rejectionMax = Math.max(...r.rejection_reasons.map((x) => x.count), 1);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Risk dashboard</Heading>
        <Paragraph color="secondary">Score-band mix, approval rates by band, and rejection drivers.</Paragraph>
      </div>

      <StaggerContainer className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Score bands">
          <DistributionChart rows={scoreBandRows} max={scoreBandMax} />
        </Panel>
        <Panel title="Approval rate by band (%)">
          <DistributionChart rows={approvalRows} max={100} />
        </Panel>
        <div className="lg:col-span-2">
          <Panel title="Rejection reasons">
            <DistributionChart rows={rejectionRows} max={rejectionMax} />
          </Panel>
        </div>
      </StaggerContainer>

      {/* Risk band summary */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Score band risk profile</Heading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {r.approval_rate_by_band.map((s) => (
            <div key={s.band} className="flex flex-col gap-2 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
              <p className="text-body-sm font-semibold text-foreground-primary">{s.band}</p>
              <RiskBadge level={BAND_RISK[s.band] ?? "Medium"} />
              <p className="font-mono text-body-md font-bold text-foreground-primary">{s.rate}% approval</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
