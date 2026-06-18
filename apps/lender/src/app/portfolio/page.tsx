import { Heading, Paragraph, MetricCardV2, CountUp, StaggerContainer, TrendChart } from "@leapmoney/ui";
import { Banknote, Ticket, Gauge, CheckCircle2 } from "lucide-react";
import { getPortfolio, getApplications } from "@/lib/lender-demo";
import { inr } from "@/components/LenderWidgets";

export const metadata = { title: "Portfolio — LeapMoney Lender" };

export default function PortfolioPage() {
  const p = getPortfolio();
  const disbursed = getApplications().filter((a) => a.status === "disbursed").sort((a, b) => b.amount - a.amount);
  const portfolioTrend = [p.portfolio_quality - 8, p.portfolio_quality - 5, p.portfolio_quality - 3, p.portfolio_quality - 1, p.portfolio_quality];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Portfolio</Heading>
        <Paragraph color="secondary">Exposure, ticket size, and quality across disbursed loans.</Paragraph>
      </div>

      <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCardV2 label="Total Exposure" value={inr(p.total_exposure)} icon={<Banknote size={15} />} statusBorder="info" sparklineData={[120000000, 145000000, 162000000, 178000000, p.total_exposure]} />
        <MetricCardV2 label="Average Ticket" value={inr(p.avg_ticket)} icon={<Ticket size={15} />} sparklineData={[420000, 435000, 448000, 460000, p.avg_ticket]} />
        <MetricCardV2 label="Average LeapScore" value={String(p.avg_leapscore)} icon={<Gauge size={15} />} statusBorder="success" sparklineData={[710, 718, 724, 731, p.avg_leapscore]} />
        <MetricCardV2 label="Disbursed Loans" value={String(p.disbursed_loans)} icon={<CheckCircle2 size={15} />} statusBorder="success" sparklineData={[14, 17, 19, 21, p.disbursed_loans]} />
      </StaggerContainer>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="text-label-caps uppercase tracking-wider text-foreground-tertiary">Portfolio quality</p>
          <CountUp value={p.portfolio_quality} suffix="%" className="block font-mono text-display-large font-bold tabular-nums text-foreground-primary" />
          <p className="text-body-sm text-foreground-secondary">disbursed loans in Good / Excellent score bands</p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-background-page">
            <div className="h-full origin-left rounded-full bg-status-success" style={{ transform: `scaleX(${p.portfolio_quality / 100})` }} />
          </div>
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <p className="mb-2 text-label-caps uppercase tracking-wider text-foreground-tertiary">Quality trend</p>
          <TrendChart data={portfolioTrend} className="w-full" />
        </div>
      </section>

      <section>
        <Heading level={2} size="h1" className="mb-4">Disbursed loans</Heading>
        <StaggerContainer className="flex flex-col gap-2">
          {disbursed.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-border-token-default bg-background-card p-4 shadow-1">
              <div>
                <p className="text-body-md font-semibold text-foreground-primary">{a.applicant} · {a.product}</p>
                <p className="text-body-sm text-foreground-tertiary">{a.id} · {a.city} · LeapScore {a.leapscore}</p>
              </div>
              <span className="font-mono text-body-md font-semibold text-foreground-primary">{inr(a.amount)}</span>
            </div>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
