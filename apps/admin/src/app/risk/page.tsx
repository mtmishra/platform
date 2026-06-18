import { Heading, Paragraph } from "@leapmoney/ui";
import { getRisk } from "@/lib/admin-demo";
import { Panel, BarList } from "@/components/AdminWidgets";

export const metadata = { title: "Risk — LeapMoney Admin" };

const BAND_TONE: Record<string, string> = { Excellent: "bg-status-success", Good: "bg-interactive-primary", Fair: "bg-status-warning", Poor: "bg-status-danger" };

export default function RiskPage() {
  const r = getRisk();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Risk dashboard</Heading>
        <Paragraph color="secondary">Score-band mix, approval rates by band, and rejection drivers.</Paragraph>
      </div>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Score bands">
          <BarList rows={r.score_bands.map((s) => ({ label: s.band, count: s.count, tone: BAND_TONE[s.band] ?? "bg-interactive-primary" }))} />
        </Panel>
        <Panel title="Approval rate by band (%)">
          <BarList rows={r.approval_rate_by_band.map((s) => ({ label: s.band, count: s.rate, tone: BAND_TONE[s.band] ?? "bg-interactive-primary" }))} max={100} />
        </Panel>
        <div className="lg:col-span-2">
          <Panel title="Rejection reasons">
            <BarList rows={r.rejection_reasons.map((x) => ({ label: x.label, count: x.count, tone: "bg-status-danger" }))} />
          </Panel>
        </div>
      </section>
    </div>
  );
}
