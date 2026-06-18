import { Heading, Paragraph, MetricCardV2, RevenueChart, FunnelChart, TrustBar } from "@leapmoney/ui";
import { Users, UserCog, Building2, FileStack, Banknote, TrendingUp, Wallet, Bell } from "lucide-react";
import { getKpis, getNotifications } from "@/lib/admin-demo";
import { inr } from "@/components/AdminWidgets";

export const metadata = { title: "Admin Control Tower — LeapMoney" };

const TONE: Record<string, string> = {
  info: "text-interactive-primary",
  success: "text-status-success",
  warning: "text-status-warning",
  danger: "text-status-danger"
};

export default function AdminDashboardPage() {
  const k = getKpis();
  const notifications = getNotifications();

  const revenueHistory = [
    { label: "Jan", primaryValue: 120000, secondaryValue: 80000 },
    { label: "Feb", primaryValue: 145000, secondaryValue: 95000 },
    { label: "Mar", primaryValue: 190000, secondaryValue: 110000 },
    { label: "Apr", primaryValue: 240000, secondaryValue: 135000 },
    { label: "May", primaryValue: 310000, secondaryValue: 175000 },
    { label: "Jun", primaryValue: k.revenue, secondaryValue: k.commission }
  ];

  const ecosystemFunnel = [
    { label: "Leads Received", value: k.total_borrowers, color: "#2563EB" },
    { label: "Applications", value: k.total_applications, color: "#14B8A6" },
    { label: "Disbursals", value: k.total_disbursals, color: "#16A34A" }
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b border-border-token-default/50">
        <div>
          <Heading level={1} size="display-large" className="mb-1">Control Tower</Heading>
          <Paragraph color="secondary">The whole LeapMoney ecosystem at a glance — users, applications, revenue, and commissions.</Paragraph>
        </div>
        <TrustBar variant="default" />
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCardV2 icon={<Users size={15} />} label="Total Borrowers" value={k.total_borrowers.toLocaleString("en-IN")} sparklineData={[4000, 4800, 5200, k.total_borrowers]} />
        <MetricCardV2 icon={<UserCog size={15} />} label="Total DSAs" value={String(k.total_dsas)} sparklineData={[120, 135, 140, k.total_dsas]} />
        <MetricCardV2 icon={<Building2 size={15} />} label="Total Lenders" value={String(k.total_lenders)} sparklineData={[12, 14, 15, k.total_lenders]} />
        <MetricCardV2 icon={<FileStack size={15} />} label="Total Applications" value={k.total_applications.toLocaleString("en-IN")} sparklineData={[1100, 1300, 1420, k.total_applications]} />
        <MetricCardV2 icon={<Banknote size={15} />} label="Total Disbursals" value={String(k.total_disbursals)} statusBorder="success" sparklineData={[300, 340, 390, k.total_disbursals]} />
        <MetricCardV2 icon={<TrendingUp size={15} />} label="Revenue MTD" value={inr(k.revenue)} statusBorder="info" sparklineData={[150000, 220000, 280000, k.revenue]} />
        <MetricCardV2 icon={<Wallet size={15} />} label="Commission MTD" value={inr(k.commission)} statusBorder="success" sparklineData={[80000, 110000, 140000, k.commission]} />
        <MetricCardV2 label="Disbursal Volume" value={inr(k.total_disbursals * 875000)} sparklineData={[20000000, 30000000, 45000000, k.total_disbursals * 875000]} />
      </section>

      {/* Revenue and Funnel Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border-token-default bg-background-card p-6 shadow-1">
          <Heading level={2} size="h2" className="mb-4 text-foreground-primary">Revenue &amp; Commission History</Heading>
          <RevenueChart data={revenueHistory} primaryName="Platform Revenue" secondaryName="DSA Commissions" />
        </div>
        <div className="rounded-lg border border-border-token-default bg-background-card p-6 shadow-1">
          <Heading level={2} size="h2" className="mb-4 text-foreground-primary">Platform Conversion Funnel</Heading>
          <FunnelChart stages={ecosystemFunnel} />
        </div>
      </section>

      {/* Notifications center */}
      <section>
        <div className="mb-3 flex items-center gap-2"><Bell size={18} className="text-foreground-secondary" /><Heading level={2} size="h1">Notifications center</Heading></div>
        <div className="rounded-lg border border-border-token-default bg-background-card shadow-1">
          <ul className="flex flex-col divide-y divide-border-token-default">
            {notifications.map((n) => (
              <li key={n.id} className="flex flex-col gap-0.5 px-5 py-4">
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-body-md font-semibold ${TONE[n.tone]}`}>{n.title}</span>
                  <span className="text-body-sm text-foreground-tertiary">{n.when}</span>
                </span>
                <span className="text-body-sm text-foreground-secondary">{n.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
