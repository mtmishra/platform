// ── Loan product catalogue ──────────────────────────────────────────────────
// Single source of truth for all loan category pages. URLs follow the Phase 5
// Website V2 IA: flat slugs (/personal-loan, /home-loan, …), never /loans/*.

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface LoanProduct {
  /** Flat URL slug, e.g. "personal-loan" → /personal-loan */
  slug: string;
  name: string;
  /** Short tagline shown in the hero. */
  tagline: string;
  /** SEO <title> — 60 chars max, format "[Keyword] | LeapMoney". */
  seoTitle: string;
  /** SEO meta description — 150–160 chars, ends with a CTA. */
  seoDescription: string;
  /** Primary keyword (used in structured data + OG). */
  keyword: string;
  amountRange: string;
  rateFrom: string;
  tenureRange: string;
  eligibility: string[];
  documents: string[];
  benefits: { title: string; description: string }[];
  process: ProcessStep[];
  faqs: FaqItem[];
  /** Related loan slugs for internal linking. */
  related: string[];
}

const SHARED_PROCESS: ProcessStep[] = [
  {
    title: "Check your eligibility",
    description:
      "Share a few details about your income and requirement. LeapMatch™ screens you against 30+ lenders in under 2 minutes — with no impact on your credit score.",
  },
  {
    title: "Compare your matches",
    description:
      "See the lenders most likely to approve you, ranked by approval probability and true cost of borrowing — not just the headline interest rate.",
  },
  {
    title: "Apply with confidence",
    description:
      "Pick your preferred lender and submit a single application. We pre-fill your documents and track the status end to end.",
  },
  {
    title: "Get disbursed",
    description:
      "On approval, funds are disbursed directly to your bank account by the lender. Transparent terms, no hidden charges.",
  },
];

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    slug: "personal-loan",
    name: "Personal Loan",
    tagline: "Funds for life's plans — matched to your profile, not just the lowest rate.",
    seoTitle: "Personal Loan in India — Instant Eligibility | LeapMoney",
    seoDescription:
      "Compare personal loans up to ₹40 lakh from 30+ lenders. Check your eligibility free with LeapMatch™ AI — no credit score impact. See your real rate now.",
    keyword: "personal loan India",
    amountRange: "₹50,000 – ₹40 lakh",
    rateFrom: "10.5% p.a. onwards",
    tenureRange: "12 – 60 months",
    eligibility: [
      "Salaried or self-employed, aged 21–60 years",
      "Minimum net monthly income of ₹20,000 (varies by lender and city)",
      "Minimum 1 year of total work experience",
      "A valid CIBIL / bureau score — we check with a soft pull only",
    ],
    documents: [
      "PAN card and Aadhaar (KYC)",
      "Last 3 months' salary slips or 6 months' bank statements",
      "Latest Form 16 or income tax returns (self-employed)",
      "Proof of current address",
    ],
    benefits: [
      { title: "Collateral-free", description: "No security or guarantor required — approval is based on your income and credit profile." },
      { title: "Fast disbursal", description: "Eligible applicants can receive funds within 24–72 hours of approval." },
      { title: "Flexible end-use", description: "Use it for a wedding, medical emergency, travel, or debt consolidation — no restrictions." },
      { title: "Transparent pricing", description: "See the full Total Cost of Borrowing upfront — processing fees and charges included." },
    ],
    process: SHARED_PROCESS,
    faqs: [
      { question: "Will checking my eligibility affect my credit score?", answer: "No. LeapMatch™ uses a soft inquiry to check your eligibility, which has no impact on your CIBIL or bureau score." },
      { question: "How much personal loan can I get?", answer: "Loan amounts range from ₹50,000 to ₹40 lakh, depending on your income, obligations, and the lender's policy. Your personalised limit is shown after eligibility check." },
      { question: "What interest rate will I get?", answer: "Personal loan rates start from 10.5% p.a. Your actual rate depends on your credit profile, income, and the lender. LeapMatch™ shows your real qualifying rate, not just the advertised one." },
      { question: "How long does disbursal take?", answer: "Once approved and documents are verified, most lenders disburse within 24–72 hours directly to your bank account." },
      { question: "Can self-employed individuals apply?", answer: "Yes. Self-employed applicants can apply with income tax returns and bank statements as income proof." },
    ],
    related: ["home-loan", "business-loan", "loan-against-property"],
  },
  {
    slug: "home-loan",
    name: "Home Loan",
    tagline: "Own your home with the lender most likely to say yes.",
    seoTitle: "Home Loan in India — Lowest EMI, Best Rates | LeapMoney",
    seoDescription:
      "Get matched to home loans up to ₹5 crore from 30+ banks and NBFCs. Check eligibility free with LeapMatch™ AI — no credit impact. Find your best rate today.",
    keyword: "home loan India",
    amountRange: "₹5 lakh – ₹5 crore",
    rateFrom: "8.5% p.a. onwards",
    tenureRange: "Up to 30 years",
    eligibility: [
      "Salaried or self-employed, aged 23–65 years",
      "Stable income with a healthy FOIR (fixed-obligation-to-income ratio)",
      "Property within an approved location and clear legal title",
      "A valid bureau score — checked via soft pull only",
    ],
    documents: [
      "PAN, Aadhaar and address proof (KYC)",
      "Last 6 months' bank statements and income proof",
      "Property documents (sale agreement, title deed, approved plan)",
      "Income tax returns for the last 2 years",
    ],
    benefits: [
      { title: "Long tenure", description: "Repay over up to 30 years to keep your monthly EMI comfortable." },
      { title: "High loan-to-value", description: "Finance up to 90% of the property value, subject to lender policy." },
      { title: "Tax benefits", description: "Claim deductions on principal and interest under Sections 80C and 24(b)." },
      { title: "Balance transfer", description: "Already have a home loan? We help you move to a lower rate and save on interest." },
    ],
    process: SHARED_PROCESS,
    faqs: [
      { question: "How much home loan am I eligible for?", answer: "Eligibility depends on your income, existing obligations, property value, and FOIR. Loans range up to ₹5 crore. Your personalised limit appears after the eligibility check." },
      { question: "What is the minimum interest rate on a home loan?", answer: "Home loan rates start from 8.5% p.a. Your actual rate depends on your credit profile, loan amount, and the lender. LeapMatch™ shows your real qualifying rate." },
      { question: "Can I transfer my existing home loan?", answer: "Yes. A home loan balance transfer lets you move your outstanding loan to a lender offering a lower rate, reducing your total interest outgo." },
      { question: "Does checking eligibility affect my credit score?", answer: "No. We use a soft inquiry that has no impact on your CIBIL or bureau score." },
      { question: "What tenure can I choose?", answer: "Home loans can be repaid over up to 30 years. A longer tenure lowers your EMI but increases total interest paid." },
    ],
    related: ["loan-against-property", "personal-loan", "business-loan"],
  },
  {
    slug: "business-loan",
    name: "Business Loan",
    tagline: "Working capital and growth finance, matched to your business.",
    seoTitle: "Business Loan in India — Quick Approval | LeapMoney",
    seoDescription:
      "Compare business loans up to ₹2 crore from 30+ lenders. Check eligibility free with LeapMatch™ AI — no credit impact. Fund your growth at your real rate.",
    keyword: "business loan India",
    amountRange: "₹1 lakh – ₹2 crore",
    rateFrom: "14% p.a. onwards",
    tenureRange: "12 – 48 months",
    eligibility: [
      "Business vintage of at least 2 years",
      "Minimum annual turnover as per lender policy",
      "Proprietor / partner aged 25–65 years",
      "GST registration and a valid bureau score (soft pull)",
    ],
    documents: [
      "PAN and Aadhaar of proprietor / partners (KYC)",
      "Last 12 months' bank statements",
      "GST returns and business registration proof",
      "Income tax returns and audited financials (last 2 years)",
    ],
    benefits: [
      { title: "Collateral-free options", description: "Unsecured working-capital loans are available for eligible businesses." },
      { title: "Fast turnaround", description: "Streamlined documentation means quicker approvals for established businesses." },
      { title: "Flexible repayment", description: "Choose a tenure that aligns with your cash-flow cycle." },
      { title: "Grow on your terms", description: "Use funds for inventory, equipment, expansion, or working capital." },
    ],
    process: SHARED_PROCESS,
    faqs: [
      { question: "What is the maximum business loan I can get?", answer: "Business loans range up to ₹2 crore, depending on your turnover, vintage, and creditworthiness. Your personalised limit is shown after the eligibility check." },
      { question: "Do I need collateral for a business loan?", answer: "Many lenders offer collateral-free (unsecured) business loans for eligible businesses. Larger amounts may require security." },
      { question: "What is the interest rate on a business loan?", answer: "Business loan rates start from 14% p.a. and depend on your business profile, financials, and the lender. LeapMatch™ shows your real qualifying rate." },
      { question: "How old must my business be to qualify?", answer: "Most lenders require a minimum business vintage of 2 years with demonstrable turnover." },
      { question: "Will the eligibility check affect my credit score?", answer: "No. We use a soft inquiry with no impact on your or your business's bureau score." },
    ],
    related: ["loan-against-property", "personal-loan", "home-loan"],
  },
  {
    slug: "loan-against-property",
    name: "Loan Against Property",
    tagline: "Unlock the value of your property at competitive rates.",
    seoTitle: "Loan Against Property (LAP) in India | LeapMoney",
    seoDescription:
      "Get matched to loans against property up to ₹10 crore from 30+ lenders. Check eligibility free with LeapMatch™ AI — no credit impact. See your real rate.",
    keyword: "loan against property India",
    amountRange: "₹5 lakh – ₹10 crore",
    rateFrom: "9.5% p.a. onwards",
    tenureRange: "Up to 15 years",
    eligibility: [
      "Owner of a residential or commercial property with clear title",
      "Salaried or self-employed, aged 25–65 years",
      "Stable income and a healthy FOIR",
      "A valid bureau score — checked via soft pull only",
    ],
    documents: [
      "PAN, Aadhaar and address proof (KYC)",
      "Property ownership documents and approved plan",
      "Last 6 months' bank statements and income proof",
      "Income tax returns for the last 2 years",
    ],
    benefits: [
      { title: "Lower rates", description: "Secured against property, LAP offers lower rates than unsecured loans." },
      { title: "High value", description: "Borrow up to 70% of your property's market value, subject to lender policy." },
      { title: "Long tenure", description: "Repay over up to 15 years for a manageable EMI." },
      { title: "Retain ownership", description: "Continue to use and own your property while it secures the loan." },
    ],
    process: SHARED_PROCESS,
    faqs: [
      { question: "How much can I borrow against my property?", answer: "You can typically borrow up to 70% of your property's market value, up to ₹10 crore, depending on the lender and your income profile." },
      { question: "What interest rate applies to a loan against property?", answer: "LAP rates start from 9.5% p.a. and depend on your credit profile, property type, and lender. LeapMatch™ shows your real qualifying rate." },
      { question: "Can I use a commercial property as collateral?", answer: "Yes. Both residential and commercial properties with clear legal title are accepted by most lenders." },
      { question: "Do I retain ownership of my property?", answer: "Yes. You continue to own and use your property; it simply serves as security for the loan." },
      { question: "Will checking eligibility affect my credit score?", answer: "No. We use a soft inquiry that has no impact on your bureau score." },
    ],
    related: ["home-loan", "business-loan", "personal-loan"],
  },
];

export function getLoanProduct(slug: string): LoanProduct | undefined {
  return LOAN_PRODUCTS.find((p) => p.slug === slug);
}

export function getLoanProducts(slugs: string[]): LoanProduct[] {
  return slugs
    .map((slug) => getLoanProduct(slug))
    .filter((p): p is LoanProduct => Boolean(p));
}
