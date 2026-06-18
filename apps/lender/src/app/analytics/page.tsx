import { Heading, Paragraph, DistributionChart, StaggerContainer } from "@leapmoney/ui";
import { getSourceAnalytics, getProductAnalytics } from "@/lib/lender-demo";

export const metadata = { title: "Analytics — LeapMoney Lender" };

export default function AnalyticsPage() {
  const sources = getSourceAnalytics();
  const products = getProductAnalytics();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Analytics</Heading>
        <Paragraph color="secondary">Lead-source performance and product distribution.</Paragraph>
      </div>

      {/* Lead source analytics */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Lead source analytics</Heading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Applications by source</p>
            <DistributionChart
              rows={sources.map((s) => ({ label: s.source, value: s.applications, tone: "var(--color-interactive-primary)" }))}
              max={Math.max(...sources.map((s) => s.applications), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Conversion by source</p>
            <DistributionChart
              rows={sources.map((s) => ({ label: s.source, value: s.conversion, tone: "var(--color-status-success)" }))}
              max={Math.max(...sources.map((s) => s.conversion), 1)}
            />
          </div>
        </div>
      </section>

      {/* Product analytics */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Product analytics</Heading>
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Top products</p>
            <DistributionChart
              rows={products.top_products.map((x) => ({ label: x.name, value: x.count, tone: "var(--color-interactive-primary)" }))}
              max={Math.max(...products.top_products.map((x) => x.count), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Top amounts</p>
            <DistributionChart
              rows={products.top_amounts.map((x) => ({ label: x.range, value: x.count, tone: "var(--color-status-warning)" }))}
              max={Math.max(...products.top_amounts.map((x) => x.count), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Top cities</p>
            <DistributionChart
              rows={products.top_cities.map((x) => ({ label: x.name, value: x.count, tone: "var(--color-status-success)" }))}
              max={Math.max(...products.top_cities.map((x) => x.count), 1)}
            />
          </div>
          <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
            <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">Score bands</p>
            <DistributionChart
              rows={products.top_score_bands.map((x) => ({ label: x.name, value: x.count, tone: "var(--color-interactive-primary)" }))}
              max={Math.max(...products.top_score_bands.map((x) => x.count), 1)}
            />
          </div>
        </StaggerContainer>
      </section>
    </div>
  );
}
