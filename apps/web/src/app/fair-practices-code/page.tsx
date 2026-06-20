import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Fair Practices Code | LeapMoney",
  description: "LeapMoney's commitment to transparent, fair, and ethical lending facilitation per RBI Digital Lending Guidelines 2022.",
  path: "/fair-practices-code",
});

const LAST_UPDATED = "17 June 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Purpose and Applicability",
    body: [
      "This Fair Practices Code (FPC) sets out the principles and standards that govern how LeapMoney Technology Private Limited ('LeapMoney') facilitates loan products between borrowers and Regulated Entities (REs) who are licensed Non-Banking Financial Companies (NBFCs) and Banks.",
      "LeapMoney operates as a Lending Service Provider (LSP) under the RBI Digital Lending Guidelines 2022 and is not itself a lender. All credit decisions and disbursals are made by the partnered REs. This Code applies to all borrower interactions on the LeapMoney platform.",
    ],
  },
  {
    heading: "2. Transparency in Loan Pricing",
    body: [
      "LeapMoney will present the Annual Percentage Rate (APR), processing fees, prepayment charges, and all other costs transparently to borrowers before loan acceptance. No hidden charges will be levied.",
      "The Key Fact Statement (KFS) for each loan product will be made available to borrowers prior to the loan agreement, in accordance with RBI Digital Lending Guidelines 2022.",
      "Platform fees, if any, charged to lenders will not be passed on to borrowers covertly. All charges that a borrower is liable for will be disclosed upfront.",
    ],
  },
  {
    heading: "3. Transparent Lender Ranking",
    body: [
      "LeapMoney's matching algorithm (LeapMatch AI) ranks lenders based on the borrower's approval probability, not on commission rates paid to LeapMoney by lenders. This ensures borrowers are presented with the most suitable options first.",
      "The ranking methodology is disclosed to borrowers. All eligible lenders for a borrower's profile are shown — none are suppressed. This is in compliance with RBI Digital Lending Directions 2025, effective 8 May 2025.",
    ],
  },
  {
    heading: "4. Responsible Lending",
    body: [
      "LeapMoney employs the LeapScore™ system to assess creditworthiness across four dimensions: Bureau data (55%), Cash Flow (25%), Payment behaviour (15%), and Account health (5%). This multi-dimensional assessment helps match borrowers to affordable products.",
      "We do not facilitate loans that appear unaffordable based on FOIR (Fixed Obligation to Income Ratio) analysis. Borrowers with FOIR above 65% will be advised to improve their financial health before applying.",
      "LeapMoney will not use coercive recovery practices and will not share borrower data with collection agents without explicit authorisation from the partnered RE.",
    ],
  },
  {
    heading: "5. Consent and Data Privacy",
    body: [
      "LeapMoney collects credit bureau data only with the borrower's explicit, granular consent, recorded as an append-only consent log in compliance with the DPDP Act 2023.",
      "Borrowers have the right to withdraw consent at any time. A 'right to erasure' request will be processed within 30 days of receipt, subject to legal retention requirements.",
      "Credit bureau pulls are 'soft checks' (no impact on score) by default. Hard pulls are performed only with the borrower's explicit consent at the point of loan application to a specific lender.",
    ],
  },
  {
    heading: "6. Grievance Redressal",
    body: [
      "Borrowers may raise grievances by writing to the Grievance Officer at support@leapmoney.net. All grievances will be acknowledged within 3 business days and resolved within 30 days.",
      "If a grievance is not resolved to the borrower's satisfaction, they may escalate to the partnered RE's grievance officer or to the RBI Ombudsman for Digital Transactions.",
      "For details on escalation procedures, please see our Grievance Redressal Policy.",
    ],
  },
  {
    heading: "7. Non-Discrimination",
    body: [
      "LeapMoney does not discriminate on the basis of religion, caste, gender, or region in its lending facilitation services. Credit decisions by partnered REs must comply with applicable equal-opportunity lending requirements.",
    ],
  },
  {
    heading: "8. Review and Updates",
    body: [
      "This Fair Practices Code is reviewed annually and updated to reflect changes in RBI guidelines, applicable laws, and our internal policies. The current version is binding from the date published above.",
      "Borrowers will be notified of material changes to this Code via the platform and, where required, through explicit re-consent.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Fair Practices Code"
      lastUpdated={LAST_UPDATED}
      intro="This Fair Practices Code governs how LeapMoney facilitates loans between borrowers and partner lenders. It reflects our commitment to transparency, fairness, and compliance with RBI Digital Lending Guidelines 2022 and the DPDP Act 2023."
      sections={SECTIONS}
    />
  );
}
