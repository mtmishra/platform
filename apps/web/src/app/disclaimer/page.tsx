import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer | LeapMoney",
  description:
    "LeapMoney is a loan facilitation platform, not a lender. Read our full disclaimer on loan products, indicative results, and third-party lenders.",
  path: "/disclaimer",
});

const LAST_UPDATED = "17 June 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Not a Lender",
    body: [
      "LeapMoney is a loan facilitation and matching platform. We are not a lender, bank, or NBFC, and we do not lend money or guarantee loan approval.",
      "All lending decisions, interest rates, fees, and terms are determined solely by the regulated lending partners you choose to apply to.",
    ],
  },
  {
    heading: "2. Indicative Results",
    body: [
      "Eligibility checks, EMI calculations, and LeapMatch™ results are indicative and based on the information you provide. They do not constitute an offer of credit and do not guarantee approval or any specific rate.",
    ],
  },
  {
    heading: "3. Third-Party Lenders",
    body: [
      "Any loan you take is governed by a direct agreement between you and the lender. LeapMoney is not a party to that agreement and is not liable for the acts or decisions of any lender.",
    ],
  },
  {
    heading: "4. No Financial Advice",
    body: [
      "Content on this website is for general information only and does not constitute financial, legal, or tax advice. Please consult a qualified professional before making borrowing decisions.",
    ],
  },
  {
    heading: "5. Accuracy of Information",
    body: [
      "While we strive to keep information accurate and current, rates and product details change frequently. Always verify final terms with the lender before signing any agreement.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Disclaimer"
      lastUpdated={LAST_UPDATED}
      intro="This disclaimer governs your use of information and tools on the LeapMoney website. This is published placeholder content pending final legal review and will be updated before public launch."
      sections={SECTIONS}
    />
  );
}
