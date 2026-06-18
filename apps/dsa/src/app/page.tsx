import Link from "next/link";
import { Heading, Paragraph, MetricCardV2, FunnelChart, TrustBar, StaggerContainer, StatusBadge } from "@leapmoney/ui";
import { Users, FileText, CheckCircle2, Wallet, Bell, ArrowRight } from "lucide-react";
import { getKpis, getLeads, getPipeline, getNotifications } from "@/lib/dsa-demo";
import { LeadRow, inr } from "@/components/DsaWidgets";

export const metadata = { title: "DSA Dashboard — LeapMoney" };

export default function DsaDashboardPage() {
  const kpis = getKpis();
  const pipeline = getPipeline();
  const recent = [...getLeads()].sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()).slice(0, 5);
  const notifications = getNotifications();

  const funnelStages = pipeline.map((p) => ({
    label: p.stage,
    value: p.count,
    color: p.stage === "Disbursed" ? "#16A34A" : p.stage === "Approved" ? "#14B8A6" : "#2563EB"
  }));

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b border-border-token-default/50">
        <div>
          <Heading level={1} size="display-large" className="mb-1">Welcome, Ramesh</Heading>
          <Paragraph color="secondary">Your lead pipeline, applications, and earnings at a glance.</Paragraph>
        </div>
        <TrustBar variant="regulatory" />
      </div>

      {/* KPIs */}
      <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCardV2
          label="Total Leads"
          value={String(kpis.total_leads)}
          icon={<Users size={16} />}
          sparklineData={[12, 18, 22, 28, 35, kpis.total_leads]}
        />
        <MetricCardV2
          label="Active Applications"
          value={String(kpis.active_applications)}
          icon={<FileText size={16} />}
          sparklineData={[5, 10, 12, 11, 14, kpis.active_applications]}
          statusBorder="info"
        />
        <MetricCardV2
          label="Approved Loans"
          value={String(kpis.approved_loans)}
          icon={<CheckCircle2 size={16} />}
          sparklineData={[2, 6, 8, 9, 11, kpis.approved_loans]}
          statusBorder="success"
        />
        <MetricCardV2
          label="Total Earnings"
          value={inr(kpis.total_earnings)}
          icon={<Wallet size={16} />}
          sparklineData={[45000, 75000, 95000, 120000, 145000, kpis.total_earnings]}
          statusBorder="success"
        />
      </StaggerContainer>

      {/* Pipeline */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-6 shadow-1">
        <Heading level={2} size="h1" className="mb-4">Customer Pipeline</Heading>
        <FunnelChart stages={funnelStages} />
      </section>

      {/* Recent leads + notifications */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Heading level={2} size="h1">Recent leads</Heading>
            <Link href="/leads" className="inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">View all <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {recent.map((l) => <LeadRow key={l.id} lead={l} />)}
          </div>
        </div>

        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <div className="mb-3 flex items-center gap-2">
            <Bell size={16} className="text-foreground-secondary" />
            <h3 className="text-h3 font-semibold text-foreground-primary">Notifications</h3>
          </div>
          <ul className="flex flex-col divide-y divide-border-token-default">
            {notifications.map((n) => (
              <li key={n.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-body-md font-medium text-foreground-primary">{n.title}</span>
                  <span className="flex items-center gap-2">
                    <StatusBadge status={n.tone === "success" ? "active" : "new"} />
                    <span className="text-body-sm text-foreground-tertiary">{n.when}</span>
                  </span>
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
