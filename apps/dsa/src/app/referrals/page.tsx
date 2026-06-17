import { Heading, Paragraph } from "@leapmoney/ui";
import { Share2, MousePointerClick, UserPlus, FileText, CheckCircle2 } from "lucide-react";
import { getReferral } from "@/lib/dsa-demo";
import { StatCard } from "@/components/DsaWidgets";

export const metadata = { title: "Referrals — LeapMoney DSA" };

export default function ReferralsPage() {
  const ref = getReferral();
  const conversionRate = ref.clicks > 0 ? Math.round((ref.conversions / ref.clicks) * 1000) / 10 : 0;

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Referrals</Heading>
        <Paragraph color="secondary">Share your link and earn on every loan that closes through it.</Paragraph>
      </div>

      {/* Referral link */}
      <div className="flex flex-col gap-3 rounded-lg border border-interactive-primary/30 bg-interactive-primary/5 p-5">
        <span className="inline-flex items-center gap-2 text-label-caps uppercase tracking-wider text-interactive-primary"><Share2 size={15} /> Your referral link</span>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <code className="flex-1 truncate rounded-md border border-border-token-default bg-background-card px-3 py-2 font-mono text-body-md text-foreground-primary">{ref.url}</code>
          <span className="rounded-md bg-interactive-primary px-4 py-2 text-center text-body-md font-semibold text-foreground-on-dark">Copy link</span>
        </div>
        <p className="text-body-sm text-foreground-secondary">Code <span className="font-mono font-medium text-foreground-primary">{ref.code}</span> · {conversionRate}% click→conversion rate</p>
      </div>

      {/* Funnel */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<MousePointerClick size={15} />} label="Clicks" value={ref.clicks.toLocaleString("en-IN")} />
        <StatCard icon={<UserPlus size={15} />} label="Registrations" value={ref.registrations.toLocaleString("en-IN")} />
        <StatCard icon={<FileText size={15} />} label="Applications" value={ref.applications.toLocaleString("en-IN")} />
        <StatCard icon={<CheckCircle2 size={15} />} label="Conversions" value={ref.conversions.toLocaleString("en-IN")} tone="text-status-success" />
      </section>
    </div>
  );
}
