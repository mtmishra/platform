import { Heading, Paragraph } from "@leapmoney/ui";
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
        <div className="overflow-hidden rounded-lg border border-border-token-default bg-background-card shadow-1">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-token-default text-label-caps uppercase tracking-wider text-foreground-tertiary">
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3 text-right">Applications</th>
                <th className="px-4 py-3 text-right">Approvals</th>
                <th className="px-4 py-3 text-right">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.source} className="border-b border-border-token-default last:border-0">
                  <td className="px-4 py-3 text-body-md font-medium text-foreground-primary">{s.source}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground-primary">{s.applications}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground-primary">{s.approvals}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-status-success">{s.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Product analytics */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Product analytics</Heading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RankList title="Top products" rows={products.top_products.map((x) => [x.name, String(x.count)])} />
          <RankList title="Top amounts" rows={products.top_amounts.map((x) => [x.range, String(x.count)])} />
          <RankList title="Top cities" rows={products.top_cities.map((x) => [x.name, String(x.count)])} />
          <RankList title="Top score bands" rows={products.top_score_bands.map((x) => [x.name, String(x.count)])} />
        </div>
      </section>
    </div>
  );
}

function RankList({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
      <p className="mb-3 text-label-caps uppercase tracking-wider text-foreground-tertiary">{title}</p>
      <ul className="flex flex-col gap-2">
        {rows.map(([name, val]) => (
          <li key={name} className="flex items-center justify-between text-body-sm">
            <span className="text-foreground-secondary">{name}</span>
            <span className="font-mono font-medium text-foreground-primary">{val}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
