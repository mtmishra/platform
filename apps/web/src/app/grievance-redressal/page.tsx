import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Grievance Redressal | LeapMoney",
  description: "LeapMoney's grievance redressal mechanism per RBI Digital Lending Guidelines 2022. Raise, track, and escalate complaints.",
  path: "/grievance-redressal",
});

const LAST_UPDATED = "17 June 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Our Commitment",
    body: [
      "LeapMoney Technology Private Limited ('LeapMoney') is committed to resolving all borrower and user grievances in a fair, timely, and transparent manner. This policy is published in compliance with RBI Digital Lending Guidelines 2022 and the Digital Personal Data Protection (DPDP) Act 2023.",
    ],
  },
  {
    heading: "2. How to Raise a Grievance",
    body: [
      "You may raise a grievance through any of the following channels:",
      "Email: support@leapmoney.net (preferred — maintains a timestamped audit trail).",
      "Written correspondence: LeapMoney Technology Pvt. Ltd., [Registered Office Address], India.",
      "Please include your registered mobile number, User ID (if available), a description of the issue, and any supporting documentation.",
    ],
  },
  {
    heading: "3. Grievance Officer",
    body: [
      "Name: Grievance Officer, LeapMoney Technology Private Limited",
      "Email: support@leapmoney.net",
      "Working hours: Monday to Friday, 10:00 AM to 6:00 PM IST (excluding public holidays)",
      "The Grievance Officer is responsible for overseeing the resolution of all complaints in accordance with this policy.",
    ],
  },
  {
    heading: "4. Resolution Timelines",
    body: [
      "Acknowledgement: All grievances will be acknowledged within 3 business days of receipt.",
      "Resolution: LeapMoney aims to resolve all grievances within 30 days of receipt. Complex cases requiring information from partner lenders may take up to 45 days; the borrower will be informed of the expected timeline.",
      "Closure: A grievance is considered closed only when the borrower receives a satisfactory resolution or when the escalation period has expired without further response from the borrower.",
    ],
  },
  {
    heading: "5. Categories of Grievances",
    body: [
      "Platform and matching issues: Incorrect lender matching, missing loan offers, technical errors on the platform.",
      "Data and privacy: Unauthorised bureau pulls, consent not recorded, data erasure requests, data accuracy issues.",
      "Loan facilitation: Incorrect KFS, hidden charges disclosed after disbursement, application status discrepancies.",
      "Partner lender conduct: Coercive recovery, incorrect EMI calculations, early closure disputes — these will be forwarded to the relevant Regulated Entity (RE) within 5 business days.",
    ],
  },
  {
    heading: "6. Escalation",
    body: [
      "Level 1 — LeapMoney Grievance Officer (support@leapmoney.net): Initial point of contact. Response within 3 business days.",
      "Level 2 — Partner Lender Grievance Officer: For issues related to the loan product, disbursement, or repayment, grievances will be escalated to the relevant RE's grievance officer. Contact details are provided in the loan agreement and the Key Fact Statement.",
      "Level 3 — RBI Ombudsman for Digital Transactions: If your grievance is not resolved within 30 days, or you are unsatisfied with the resolution, you may file a complaint with the RBI Integrated Ombudsman Scheme at https://ombudsman.rbi.org.in.",
    ],
  },
  {
    heading: "7. DPDP Act 2023 — Data-Related Grievances",
    body: [
      "Requests related to data access, correction, or erasure under the DPDP Act 2023 will be treated as grievances and processed within 30 days.",
      "To exercise your right to erasure, write to support@leapmoney.net with the subject line 'Right to Erasure Request'. We will process your request subject to legal and regulatory retention obligations.",
    ],
  },
  {
    heading: "8. Record-Keeping",
    body: [
      "All grievances and their resolutions are recorded in a timestamped, append-only log in compliance with RBI requirements. Records are retained for a minimum of 5 years.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Grievance Redressal"
      lastUpdated={LAST_UPDATED}
      intro="This policy describes how LeapMoney handles borrower and user grievances in compliance with RBI Digital Lending Guidelines 2022. We are committed to fair, transparent, and timely resolution of all complaints."
      sections={SECTIONS}
    />
  );
}
