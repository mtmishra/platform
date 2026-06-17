import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { Lightbulb, ArrowRight } from "lucide-react";
import { getFinancialIntelligence } from "@/lib/financial-demo";
import { RecommendationCard } from "@/components/financial/FinancialWidgets";

export const metadata = { title: "Before you match — LeapMoney" };

/**
 * User Approval Layer (Sprint 13.5 #11). Shown before LeapMatch: we surface the
 * highest-impact recommended actions and let the borrower either improve first
 * (View Opportunities) or proceed to matches (Continue Anyway).
 */
export default function MatchReviewPage() {
  const { guidance } = getFinancialIntelligence();
  const topRecs = guidance.recommendations.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-card-md flex-col gap-6">
      <div>
        <span className="inline-flex items-center gap-2 text-premium">
          <Lightbulb size={20} />
          <span className="text-label-caps uppercase tracking-wider">Before you match</span>
        </span>
        <Heading level={1} size="display-large" className="mt-2 mb-1">Improve before you apply?</Heading>
        <Paragraph color="secondary">
          We found a few actions that could raise your approval odds and save you money. You can act
          on them first, or continue straight to your lender matches.
        </Paragraph>
      </div>

      <div className="flex flex-col gap-3">
        {topRecs.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" size="lg" className="sm:flex-1">
          <Link href="/financial" className="flex items-center justify-center gap-2">
            View opportunities
          </Link>
        </Button>
        <Button variant="primary" size="lg" className="sm:flex-1">
          <Link href="/matches" className="flex items-center justify-center gap-2">
            Continue anyway <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
}
