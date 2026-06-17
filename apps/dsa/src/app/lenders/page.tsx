import Link from "next/link";
import { Heading, Paragraph } from "@leapmoney/ui";
import { Building2, ArrowRight } from "lucide-react";
import { getLenders, getLenderCount } from "@leapmoney/lenders";

export const metadata = { title: "Lenders — LeapMoney DSA" };

const TYPE_LABEL: Record<string, string> = { bank: "Bank", nbfc: "NBFC", fintech: "Fintech" };

export default function LendersPage() {
  const lenders = getLenders();
  const count = getLenderCount();

  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Lender directory</Heading>
        <Paragraph color="secondary">{count.total} lenders · {count.banks} banks · {count.nbfcs} NBFCs · {count.fintechs} fintechs.</Paragraph>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lenders.map((l) => (
          <Link
            key={l.lender_id}
            href={`/lenders/${l.lender_id}`}
            className="group flex items-center gap-3 rounded-lg border border-border-token-default bg-background-card p-4 shadow-1 transition-shadow duration-normal ease-standard hover:shadow-2"
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-interactive-primary/10 text-interactive-primary">
              <Building2 size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-body-md font-semibold text-foreground-primary">{l.lender_name}</p>
              <p className="text-body-sm text-foreground-tertiary">{TYPE_LABEL[l.lender_type]} · {l.region_coverage}</p>
            </div>
            <ArrowRight size={16} className="text-foreground-tertiary transition-transform duration-fast group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
