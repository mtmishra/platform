import { Heading, Paragraph } from "@leapmoney/ui";
import { Users, UserCog, Building2, FileStack, Banknote, TrendingUp, Wallet, Bell } from "lucide-react";
import { getKpis, getNotifications } from "@/lib/admin-demo";
import { KpiCard, inr } from "@/components/AdminWidgets";

export const metadata = { title: "Admin Control Tower — LeapMoney" };

const TONE: Record<string, string> = { info: "text-interactive-primary", success: "text-status-success", warning: "text-status-warning", danger: "text-status-danger" };

export default function AdminDashboardPage() {
  const k = getKpis();
  const notifications = getNotifications();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Control Tower</Heading>
        <Paragraph color="secondary">The whole LeapMoney ecosystem at a glance — users, applications, revenue, and commissions.</Paragraph>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard icon={<Users size={15} />} label="Total Borrowers" value={k.total_borrowers.toLocaleString("en-IN")} />
        <KpiCard icon={<UserCog size={15} />} label="Total DSAs" value={String(k.total_dsas)} />
        <KpiCard icon={<Building2 size={15} />} label="Total Lenders" value={String(k.total_lenders)} />
        <KpiCard icon={<FileStack size={15} />} label="Total Applications" value={k.total_applications.toLocaleString("en-IN")} />
        <KpiCard icon={<Banknote size={15} />} label="Total Disbursals" value={String(k.total_disbursals)} tone="text-status-success" />
        <KpiCard icon={<TrendingUp size={15} />} label="Revenue" value={inr(k.revenue)} tone="text-interactive-primary" />
        <KpiCard icon={<Wallet size={15} />} label="Commission" value={inr(k.commission)} tone="text-premium" />
        <KpiCard label="Disbursal Volume" value={inr(k.total_disbursals * 875000)} />
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
