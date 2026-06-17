import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/layout/LegalPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | LeapMoney",
  description:
    "How LeapMoney collects, uses, and protects your personal data in compliance with India's DPDP Act 2023 and RBI Digital Lending Guidelines 2022.",
  path: "/privacy-policy",
});

const LAST_UPDATED = "17 June 2026";

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Information We Collect",
    body: [
      "We collect personal and financial information you provide when you use LeapMoney, including your name, contact details, income information, employment details, and identity documents (KYC) required for loan facilitation.",
      "We also collect credit bureau information with your explicit consent, and technical data such as device and usage information.",
    ],
  },
  {
    heading: "2. How We Use Your Information",
    body: [
      "Your information is used solely to match you with suitable lenders, facilitate loan applications, comply with regulatory requirements, and improve our services.",
      "We follow the principles of data minimisation and purpose limitation as required under the Digital Personal Data Protection (DPDP) Act 2023.",
    ],
  },
  {
    heading: "3. Consent",
    body: [
      "We collect your explicit consent at the point of data collection. You may withdraw consent at any time, subject to legal and regulatory retention requirements.",
    ],
  },
  {
    heading: "4. Data Storage and Security",
    body: [
      "All personal data is stored within India (AWS Mumbai, ap-south-1) in compliance with applicable data-residency requirements. We apply industry-standard security controls to protect your data.",
    ],
  },
  {
    heading: "5. Data Sharing",
    body: [
      "We share your information only with lenders you choose to apply to, and with service providers acting on our behalf under contractual confidentiality obligations. We do not sell your personal data.",
    ],
  },
  {
    heading: "6. Your Rights",
    body: [
      "Under the DPDP Act 2023, you have the right to access, correct, and erase your personal data, and to nominate a person to exercise these rights on your behalf.",
    ],
  },
  {
    heading: "7. Grievance Officer",
    body: [
      "For any privacy-related concerns, contact our Grievance Officer at support@leapmoney.net. We aim to resolve grievances within 30 days as required under RBI Digital Lending Guidelines 2022.",
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="This Privacy Policy explains how LeapMoney collects, uses, stores, and protects your personal information. It is published placeholder content pending final legal review and will be updated before public launch."
      sections={SECTIONS}
    />
  );
}
