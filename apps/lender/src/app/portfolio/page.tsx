import { Heading, Paragraph } from "@leapmoney/ui";
import { Banknote, Ticket, Gauge, CheckCircle2 } from "lucide-react";
import { getPortfolio, getApplications } from "@/lib/lender-demo";
import { KpiCard, inr } from "@/components/LenderWidgets";

export const metadata = { title: "Portfolio — LeapMoney Lender" };

export default function PortfolioPage() {
  const p = getPortfolio();
  const disbursed = getApplications().filter((a) => a.status === "disbursed").sort((a, b) => b.amount - a.amount);
  const healthTone = p.portfolio_health === "Healthy" ? "text-status-success" : p.portfolio_health === "Watch" ? "text-status-warning" : "text-status-danger";

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Portfolio</Heading>
        <Paragraph color="secondary">Exposure, ticket size, and quality across disbursed loans.</Paragraph>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={<Banknote size={15} />} label="Total Exposure" value={inr(p.total_exposure)} tone="text-interactive-primary" />
        <KpiCard icon={<Ticket size={15} />} label="Average Ticket" value={inr(p.avg_ticket)} />
        <KpiCard icon={<Gauge size={15} />} label="Average LeapScore" value={String(p.avg_leapscore)} />
        <KpiCard icon={<CheckCircle2 size={15} />} label="Disbursed Loans" value={String(p.disbursed_loans)} tone="text-status-success" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Portfolio quality</p>
          <p className="font-mono text-display-large font-bold tabular-nums text-foreground-primary">{p.portfolio_quality}%</p>
          <p className="text-body-sm text-foreground-secondary">disbursed loans in Good / Excellent score bands</p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-background-page">
            <div className="h-full origin-left rounded-full bg-status-success" style={{ transform: `scaleX(${p.portfolio_quality / 100})` }} />
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Portfolio health</p>
          <p className={`font-mono text-display-large font-bold ${healthTone}`}>{p.portfolio_health}</p>
          <p className="text-body-sm text-foreground-secondary">based on score-band mix and FOIR distribution</p>
        </div>
      </section>

      <section>
        <Heading level={2} size="h1" className="mb-4">Disbursed loans</Heading>
        <div className="flex flex-col gap-2">
          {disbursed.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
              <div>
                <p className="text-body-md font-semibold text-foreground-primary">{a.applicant} · {a.product}</p>
                <p className="text-body-sm text-foreground-tertiary">{a.id} · {a.city} · LeapScore {a.leapscore}</p>
              </div>
              <span className="font-mono text-body-md font-semibold text-foreground-primary">{inr(a.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
