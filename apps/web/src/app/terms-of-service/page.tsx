import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | LeapMoney",
  description:
    "The terms governing your use of LeapMoney's loan marketplace. LeapMoney is a loan facilitation platform and not a lender. Read our terms before applying.",
  path: "/terms-of-service",
});

const LAST_UPDATED = "17 June 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of Terms",
    body: [
      "By accessing or using LeapMoney, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.",
    ],
  },
  {
    heading: "2. Nature of Service",
    body: [
      "LeapMoney is a loan facilitation and matching platform. We are not a lender, bank, or NBFC. We do not lend money or make credit decisions.",
      "All lending decisions, terms, and disbursals are made solely by the regulated lenders you choose to apply to.",
    ],
  },
  {
    heading: "3. Eligibility",
    body: [
      "You must be at least 18 years old and a resident of India to use LeapMoney. You agree to provide accurate and complete information.",
    ],
  },
  {
    heading: "4. LeapMatch™ and Eligibility Checks",
    body: [
      "LeapMatch™ provides indicative eligibility and matching based on the information you provide and a soft credit inquiry. Indicative results do not guarantee loan approval, which remains at the lender's discretion.",
    ],
  },
  {
    heading: "5. No Hidden Charges",
    body: [
      "LeapMoney does not charge borrowers for using the matching service. Any fees charged by lenders (such as processing fees) are disclosed transparently before you apply.",
    ],
  },
  {
    heading: "6. Limitation of Liability",
    body: [
      "LeapMoney is not liable for the acts, decisions, or terms of any lender. Your relationship for any loan is directly with the lender.",
    ],
  },
  {
    heading: "7. Governing Law",
    body: [
      "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts of India.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro="These Terms of Service govern your use of the LeapMoney platform. This is published placeholder content pending final legal review and will be updated before public launch."
      sections={SECTIONS}
    />
  );
}
