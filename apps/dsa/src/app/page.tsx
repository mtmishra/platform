import Link from "next/link";
import { Heading, Paragraph } from "@leapmoney/ui";
import { Users, FileText, CheckCircle2, Wallet, Bell, ArrowRight } from "lucide-react";
import { getKpis, getLeads, getPipeline, getNotifications } from "@/lib/dsa-demo";
import { StatCard, LeadRow, Pipeline, inr } from "@/components/DsaWidgets";

export const metadata = { title: "DSA Dashboard — LeapMoney" };

export default function DsaDashboardPage() {
  const kpis = getKpis();
  const pipeline = getPipeline();
  const recent = [...getLeads()].sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()).slice(0, 5);
  const notifications = getNotifications();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Welcome, Ramesh</Heading>
        <Paragraph color="secondary">Your lead pipeline, applications, and earnings at a glance.</Paragraph>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Users size={15} />} label="Total Leads" value={String(kpis.total_leads)} />
        <StatCard icon={<FileText size={15} />} label="Active Applications" value={String(kpis.active_applications)} />
        <StatCard icon={<CheckCircle2 size={15} />} label="Approved Loans" value={String(kpis.approved_loans)} tone="text-status-success" />
        <StatCard icon={<Wallet size={15} />} label="Total Earnings" value={inr(kpis.total_earnings)} tone="text-premium" />
      </section>

      {/* Pipeline */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Customer pipeline</Heading>
        <Pipeline stages={pipeline} />
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
                  <span className={`text-body-md font-medium ${n.tone === "success" ? "text-status-success" : "text-foreground-primary"}`}>{n.title}</span>
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
