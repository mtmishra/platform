import { Heading, Paragraph } from "@leapmoney/ui";
import { TrendingUp, Banknote, Percent } from "lucide-react";
import { getRevenue } from "@/lib/admin-demo";
import { KpiCard, ColumnChart, inr } from "@/components/AdminWidgets";

export const metadata = { title: "Revenue — LeapMoney Admin" };

const compact = (n: number): string => (n >= 10000000 ? `₹${(n / 10000000).toFixed(1)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n}`);

export default function RevenuePage() {
  const r = getRevenue();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Revenue dashboard</Heading>
        <Paragraph color="secondary">Platform revenue, disbursal volume, and conversion.</Paragraph>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard icon={<TrendingUp size={15} />} label="Revenue" value={inr(r.revenue)} tone="text-interactive-primary" />
        <KpiCard icon={<Banknote size={15} />} label="Disbursal Volume" value={compact(r.disbursal_volume)} tone="text-status-success" />
        <KpiCard icon={<Percent size={15} />} label="Conversion Rate" value={`${r.conversion_rate}%`} />
      </section>

      <section>
        <Heading level={2} size="h2" className="mb-3">Monthly revenue</Heading>
        <ColumnChart data={r.monthly.map((m) => ({ label: m.month, value: m.revenue }))} format={compact} />
      </section>
    </div>
  );
}
