import Link from "next/link";
import { Sparkles, FileSearch, Landmark, ArrowRight } from "lucide-react";
import { Button, Card, Heading, Paragraph } from "@leapmoney/ui";
import { getProfile } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard-demo";
import { getCashFlowIntelligence } from "@/lib/cashflow-demo";
import { getFinancialIntelligence } from "@/lib/financial-demo";
import { SavingsWidget, RecommendationCard } from "@/components/financial/FinancialWidgets";
import {
  CreditSnapshot,
  HealthSnapshot,
  MatchSnapshot,
  OutcomeSnapshot,
} from "@/components/dashboard/SnapshotWidgets";
import {
  VerifiedIncomeBadge,
  IncomeIntelligenceWidget,
  CashFlowScoreWidget,
  FoirWidget,
} from "@/components/cashflow/CashFlowWidgets";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";
import { ImprovementTracker } from "@/components/dashboard/ImprovementTracker";
import { NotificationCenter } from "@/components/dashboard/NotificationCenter";

export const metadata = { title: "Dashboard — LeapMoney" };

export default async function DashboardPage() {
  const profile = await getProfile();
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const { leapScore, health, match, analytics, scoreHistory } = getDashboardData();
  const cashFlow = getCashFlowIntelligence();
  const financial = getFinancialIntelligence();
  const topRecs = financial.guidance.recommendations.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Welcome, {firstName}</Heading>
        <Paragraph color="secondary">
          Your credit intelligence at a glance. Sample data shown — your live view appears
          once your profile and consent are complete.
        </Paragraph>
      </div>

      {/* Primary entry point — start the credit-report flow */}
      <Link
        href="/credit-report/start"
        className="group flex items-center gap-4 rounded-lg border border-interactive-primary/30 bg-interactive-primary/5 p-5 transition-colors duration-fast hover:bg-interactive-primary/10"
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary text-foreground-on-dark">
          <FileSearch size={20} />
        </span>
        <div className="flex-1">
          <p className="text-body-md font-semibold text-foreground-primary">Get your free credit report</p>
          <p className="text-body-sm text-foreground-secondary">
            Soft check across all four bureaus — no impact on your score. Takes about 2 minutes.
          </p>
        </div>
        <ArrowRight size={18} className="text-interactive-primary transition-transform duration-fast group-hover:translate-x-0.5" />
      </Link>

      {/* Secondary entry point — connect bank (AA cash-flow) */}
      <Link
        href="/connect-bank"
        className="group flex items-center gap-4 rounded-lg border border-border-token-default bg-background-card p-5 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2"
      >
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-status-success/10 text-status-success">
          <Landmark size={20} />
        </span>
        <div className="flex-1">
          <p className="text-body-md font-semibold text-foreground-primary">Connect your bank for Cash Flow Intelligence</p>
          <p className="text-body-sm text-foreground-secondary">
            Verify income and strengthen your LeapScore via Account Aggregator — read-only, revocable.
          </p>
        </div>
        <ArrowRight size={18} className="text-foreground-tertiary transition-transform duration-fast group-hover:translate-x-0.5" />
      </Link>

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

      {/* Cash Flow Intelligence */}
      <section className="flex flex-col gap-4">
        <Heading level={2} size="h1">Income &amp; Cash Flow Intelligence</Heading>
        <VerifiedIncomeBadge verified={cashFlow.verified_income} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <IncomeIntelligenceWidget income={cashFlow.income} />
          <CashFlowScoreWidget score={cashFlow.cash_flow_score} />
          <FoirWidget foir={cashFlow.foir} />
        </div>
      </section>

      {/* Financial Intelligence */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Heading level={2} size="h1">Financial Intelligence</Heading>
          <Link href="/financial" className="inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <SavingsWidget savings={financial.guidance.savings} />
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          {topRecs.map((rec) => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
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
