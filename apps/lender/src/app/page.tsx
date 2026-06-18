import Link from "next/link";
import { Heading, Paragraph } from "@leapmoney/ui";
import { Inbox, Clock, CheckCircle2, XCircle, Banknote, Bell, ArrowRight } from "lucide-react";
import { getApplications, getStatusCounts, getNotifications, getPortfolio } from "@/lib/lender-demo";
import { KpiCard, ApplicationRow, inr } from "@/components/LenderWidgets";

export const metadata = { title: "Lender Dashboard — LeapMoney" };

const TONE: Record<string, string> = { info: "text-interactive-primary", success: "text-status-success", warning: "text-status-warning", danger: "text-status-danger" };

export default function LenderDashboardPage() {
  const counts = getStatusCounts();
  const portfolio = getPortfolio();
  const queue = getApplications().filter((a) => a.status === "new" || a.status === "under_review").slice(0, 5);
  const notifications = getNotifications();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Underwriting dashboard</Heading>
        <Paragraph color="secondary">Incoming applications, decisions, and portfolio at a glance.</Paragraph>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard icon={<Inbox size={15} />} label="New" value={String(counts.new)} />
        <KpiCard icon={<Clock size={15} />} label="Under Review" value={String(counts.under_review)} tone="text-status-warning" />
        <KpiCard icon={<CheckCircle2 size={15} />} label="Approved" value={String(counts.approved)} tone="text-status-success" />
        <KpiCard icon={<XCircle size={15} />} label="Rejected" value={String(counts.rejected)} tone="text-status-danger" />
        <KpiCard icon={<Banknote size={15} />} label="Disbursed" value={String(counts.disbursed)} tone="text-status-success" />
      </section>

      {/* Portfolio summary strip */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Total Exposure" value={inr(portfolio.total_exposure)} tone="text-interactive-primary" />
        <KpiCard label="Avg Ticket" value={inr(portfolio.avg_ticket)} />
        <KpiCard label="Avg LeapScore" value={String(portfolio.avg_leapscore)} />
        <KpiCard label="Portfolio Health" value={portfolio.portfolio_health} tone={portfolio.portfolio_health === "Healthy" ? "text-status-success" : "text-status-warning"} />
      </section>

      {/* Review queue + notifications */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <Heading level={2} size="h1">Review queue</Heading>
            <Link href="/applications" className="inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">All applications <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-col gap-3">
            {queue.map((a) => <ApplicationRow key={a.id} app={a} />)}
          </div>
        </div>

        <div className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
          <div className="mb-3 flex items-center gap-2"><Bell size={16} className="text-foreground-secondary" /><h3 className="text-h3 font-semibold text-foreground-primary">Notifications</h3></div>
          <ul className="flex flex-col divide-y divide-border-token-default">
            {notifications.map((n) => (
              <li key={n.id} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0">
                <span className="flex items-center justify-between gap-2">
                  <span className={`text-body-md font-medium ${TONE[n.tone]}`}>{n.title}</span>
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
