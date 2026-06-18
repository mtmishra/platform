import Link from "next/link";
import { Heading, Paragraph, MetricCardV2, PortfolioChart, TrustBar, StaggerContainer, StatusBadge } from "@leapmoney/ui";
import { Inbox, Clock, CheckCircle2, XCircle, Banknote, Bell, ArrowRight } from "lucide-react";
import { getApplications, getStatusCounts, getNotifications, getPortfolio } from "@/lib/lender-demo";
import { ApplicationRow, inr } from "@/components/LenderWidgets";

export const metadata = { title: "Lender Dashboard — LeapMoney" };

const NOTIF_STATUS: Record<string, string> = { info: "submitted", success: "active", warning: "under_review", danger: "rejected" };

export default function LenderDashboardPage() {
  const counts = getStatusCounts();
  const portfolio = getPortfolio();
  const queue = getApplications().filter((a) => a.status === "new" || a.status === "under_review").slice(0, 5);
  const notifications = getNotifications();

  const portfolioSegments = [
    { label: "Personal Loans", value: portfolio.total_exposure * 0.45, count: counts.approved + counts.disbursed, color: "#2563EB" },
    { label: "Home Loans", value: portfolio.total_exposure * 0.35, count: 12, color: "#14B8A6" },
    { label: "Business Loans", value: portfolio.total_exposure * 0.20, count: 5, color: "#EA580C" }
  ];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-4 border-b border-border-token-default/50">
        <div>
          <Heading level={1} size="display-large" className="mb-1">Underwriting Dashboard</Heading>
          <Paragraph color="secondary">Incoming applications, decisions, and portfolio at a glance.</Paragraph>
        </div>
        <TrustBar variant="security" />
      </div>

      {/* KPIs */}
      <StaggerContainer className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCardV2 label="New" value={String(counts.new)} icon={<Inbox size={15} />} sparklineData={[4, 6, 8, 5, 10, counts.new]} />
        <MetricCardV2 label="Under Review" value={String(counts.under_review)} icon={<Clock size={15} />} statusBorder="warning" sparklineData={[2, 3, 5, 4, 6, counts.under_review]} />
        <MetricCardV2 label="Approved" value={String(counts.approved)} icon={<CheckCircle2 size={15} />} statusBorder="success" sparklineData={[8, 12, 15, 14, 18, counts.approved]} />
        <MetricCardV2 label="Rejected" value={String(counts.rejected)} icon={<XCircle size={15} />} statusBorder="danger" sparklineData={[1, 2, 0, 1, 3, counts.rejected]} />
        <MetricCardV2 label="Disbursed" value={String(counts.disbursed)} icon={<Banknote size={15} />} statusBorder="success" sparklineData={[6, 9, 11, 10, 15, counts.disbursed]} />
      </StaggerContainer>

      {/* Portfolio Asset Split */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-6 shadow-1">
        <Heading level={2} size="h2" className="mb-4 text-foreground-primary">Portfolio Asset Allocation</Heading>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <PortfolioChart segments={portfolioSegments} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCardV2 label="Avg Ticket" value={inr(portfolio.avg_ticket)} />
            <MetricCardV2 label="Avg LeapScore" value={String(portfolio.avg_leapscore)} statusBorder="success" />
            <MetricCardV2 label="Portfolio Health" value={portfolio.portfolio_health} statusBorder={portfolio.portfolio_health === "Healthy" ? "success" : "warning"} />
            <MetricCardV2 label="Total Exposure" value={inr(portfolio.total_exposure)} statusBorder="info" />
          </div>
        </div>
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
                  <span className="flex items-center gap-1.5">
                    <StatusBadge status={NOTIF_STATUS[n.tone] ?? "submitted"} />
                    <span className="text-body-md font-medium text-foreground-primary">{n.title}</span>
                  </span>
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
