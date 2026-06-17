import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getCashFlowIntelligence } from "@/lib/cashflow-demo";
import {
  VerifiedIncomeBadge,
  IncomeIntelligenceWidget,
  CashFlowScoreWidget,
  FoirWidget,
} from "@/components/cashflow/CashFlowWidgets";
import { CreditJourneyTimeline } from "@/components/dashboard/CreditJourneyTimeline";

export const metadata = { title: "Cash Flow Intelligence — LeapMoney" };

export default function CashFlowPage() {
  const { income, cash_flow_score, foir, verified_income } = getCashFlowIntelligence();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-8">
      <div>
        <span className="inline-flex items-center gap-2 text-status-success">
          <CheckCircle2 size={20} />
          <span className="text-label-caps uppercase tracking-wider">Bank connected</span>
        </span>
        <Heading level={1} size="display-large" className="mt-2 mb-1">Your Cash Flow Intelligence</Heading>
        <Paragraph color="secondary">
          We analysed your bank cash-flow and verified your income. This now strengthens your
          LeapScore and the lenders you match with.
        </Paragraph>
      </div>

      <VerifiedIncomeBadge verified={verified_income} />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <IncomeIntelligenceWidget income={income} />
        <CashFlowScoreWidget score={cash_flow_score} />
        <FoirWidget foir={foir} />
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
