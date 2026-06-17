import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button, Card, Heading, Paragraph } from "@leapmoney/ui";
import { getProfile } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-demo";
import {
  CreditSnapshot,
  HealthSnapshot,
  MatchSnapshot,
  OutcomeSnapshot,
} from "@/components/dashboard/SnapshotWidgets";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";
import { ImprovementTracker } from "@/components/dashboard/ImprovementTracker";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

export const metadata = { title: "Dashboard — LeapMoney" };

export default async function DashboardPage() {
  const profile = await getProfile();
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const { leapScore, health, match, analytics, scoreHistory } = getDashboardData();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Welcome, {firstName}</Heading>
        <Paragraph color="secondary">
          Your credit intelligence at a glance. Sample data shown — your live view appears
          once your profile and consent are complete.
        </Paragraph>
      </div>

      {/* Credit journey */}
      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Your credit journey</h2>
        <CreditJourneyTimeline current="apply" />
      </section>

      {/* Snapshot widgets */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CreditSnapshot score={leapScore} />
        <HealthSnapshot health={health} />
        <MatchSnapshot match={match} />
        <OutcomeSnapshot analytics={analytics} />
      </section>

      {/* Tracker + alerts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ImprovementTracker
          currentScore={leapScore.leapscore ?? scoreHistory[scoreHistory.length - 1]?.score ?? 742}
          milestone={leapScore.next_milestone}
          history={scoreHistory}
        />
        <NotificationCenter />
      </section>

      {/* Next step */}
      <Card variant="feature" className="flex flex-col gap-3">
        <Sparkles size={24} className="text-premium" />
        <Heading level={2} size="h2" color="on-dark">Ready to apply?</Heading>
        <Paragraph color="on-dark" className="opacity-80">
          {match.matched_lenders.length > 0
            ? `${match.matched_lenders.length} lenders match your profile. Review your Credit Health and apply where you're most likely to be approved.`
            : "Complete your profile so we can match you to lenders."}
        </Paragraph>
        <div>
          <Button variant="secondary" size="md">
            <Link href="/health">View Credit Health</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
