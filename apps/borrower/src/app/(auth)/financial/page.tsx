import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { ArrowRight } from "lucide-react";
import { getFinancialIntelligence } from "@/lib/financial-demo";
import {
  SavingsWidget,
  EmployerWidget,
  IncomeStabilityWidget,
  AdvancedFoirWidget,
  BalanceTransferWidget,
  ConsolidationWidget,
  RecommendationsList,
} from "@/components/financial/FinancialWidgets";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";

export const metadata = { title: "Financial Intelligence — LeapMoney" };

export default function FinancialIntelligencePage() {
  const { employer, incomeStability, foir, balanceTransfer, consolidation, guidance } = getFinancialIntelligence();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Financial Intelligence</Heading>
        <Paragraph color="secondary">
          Beyond your score — here&apos;s what to do before you apply: savings to capture, your FOIR
          headroom, and the actions that most improve your approval odds.
        </Paragraph>
      </div>

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

      <div>
        <Button variant="primary" size="lg">
          <Link href="/dashboard" className="flex items-center gap-2">
            Back to dashboard <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
