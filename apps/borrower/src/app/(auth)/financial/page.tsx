import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { ArrowRight } from "lucide-react";
import { getFinancialIntelligence } from "@/lib/financial-demo";
import { getDashboardData } from "@/lib/dashboard-demo";
import { getCashFlowIntelligence } from "@/lib/cashflow-demo";
import {
  CurrentPositionWidget,
  FindingsList,
  SavingsWidget,
  EmployerWidget,
  IncomeStabilityWidget,
  AdvancedFoirWidget,
  BalanceTransferWidget,
  ConsolidationWidget,
  RecommendationsList,
} from "@/components/financial/FinancialWidgets";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";

export const metadata = { title: "Financial Analysis — LeapMoney" };

export default function FinancialAnalysisPage() {
  const { employer, incomeStability, foir, balanceTransfer, consolidation, findings, guidance } = getFinancialIntelligence();
  const { leapScore, health } = getDashboardData();
  const cashFlow = getCashFlowIntelligence();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Financial Analysis</Heading>
        <Paragraph color="secondary">
          A complete read on your profile before you apply — your current position, what we found,
          the savings on the table, and the actions that most improve your approval odds.
        </Paragraph>
      </div>

      {/* Current position */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Current position</Heading>
        <CurrentPositionWidget
          position={{
            leapscore: leapScore.leapscore,
            health_score: health.health_score,
            cash_flow_score: cashFlow.cash_flow_score.score,
            foir_pct: Math.round(foir.current_foir * 100),
          }}
        />
      </section>

      {/* Findings */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Findings</Heading>
        <FindingsList findings={findings} />
      </section>

      {/* Potential savings */}
      <SavingsWidget savings={guidance.savings} />

      {/* Recommended actions */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Recommended actions</Heading>
        <RecommendationsList recommendations={guidance.recommendations} />
      </section>

      {/* Opportunities */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Your opportunities</Heading>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BalanceTransferWidget bt={balanceTransfer} />
          <ConsolidationWidget c={consolidation} />
        </div>
      </section>

      {/* FOIR optimization */}
      <section>
        <Heading level={2} size="h1" className="mb-4">FOIR optimization</Heading>
        <AdvancedFoirWidget foir={foir} />
      </section>

      {/* Approval improvement */}
      <section>
        <Heading level={2} size="h1" className="mb-4">Approval improvement</Heading>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <EmployerWidget employer={employer} />
          <IncomeStabilityWidget stability={incomeStability} />
        </div>
      </section>

      <section className="rounded-lg border border-border-token-default bg-background-card p-5 shadow-1">
        <h2 className="mb-4 text-label-caps uppercase tracking-wider text-foreground-tertiary">Where you are</h2>
        <CreditJourneyTimeline current="match" />
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="primary" size="lg">
          <Link href="/matches/review" className="flex items-center gap-2">
            Continue to lender matches <ArrowRight size={16} />
          </Link>
        </Button>
        <Button variant="ghost" size="lg">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
