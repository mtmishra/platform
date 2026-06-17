// ── Blog content ─────────────────────────────────────────────────────────────
// Article inventory seeded from Phase 5 §10 editorial recommendations.
// Body content is placeholder-grade but real prose, ready for editorial upgrade.

export type BlogCategory =
  | "Credit Education"
  | "Loan Guides"
  | "Product";

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  category: BlogCategory;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  /** ISO date. */
  publishedAt: string;
  readingMinutes: number;
  author: string;
  sections: BlogSection[];
  /** Slugs of related loan products / posts for internal linking. */
  relatedLoans: string[];
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Credit Education",
  "Loan Guides",
  "Product",
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "home-loan-vs-personal-loan",
    title: "Home Loan vs Personal Loan: Which Should You Choose?",
    category: "Loan Guides",
    excerpt:
      "Both can fund big plans, but they work very differently. Here's how to choose between a home loan and a personal loan in India.",
    seoTitle: "Home Loan vs Personal Loan — Which Is Better? | LeapMoney",
    seoDescription:
      "Home loan or personal loan? Compare interest rates, tenure, collateral, and tax benefits to choose the right loan for your needs in India. Read the full guide.",
    publishedAt: "2026-06-10",
    readingMinutes: 6,
    author: "LeapMoney Editorial",
    sections: [
      {
        paragraphs: [
          "Choosing between a home loan and a personal loan comes down to what you need the money for, how much you need, and how long you want to repay it.",
        ],
      },
      {
        heading: "Interest rates and tenure",
        paragraphs: [
          "Home loans are secured against the property, so they carry lower interest rates (from around 8.5% p.a.) and longer tenures of up to 30 years.",
          "Personal loans are unsecured, which means higher rates (from around 10.5% p.a.) and shorter tenures of up to five years.",
        ],
      },
      {
        heading: "When to choose which",
        paragraphs: [
          "Choose a home loan when you're buying or constructing property and want a low EMI spread over many years, with tax benefits on principal and interest.",
          "Choose a personal loan for shorter-term needs like a wedding, medical emergency, or debt consolidation, where speed and flexibility matter more than the lowest rate.",
        ],
      },
    ],
    relatedLoans: ["home-loan", "personal-loan"],
  },
  {
    slug: "improve-cibil-score",
    title: "How to Improve Your CIBIL Score: A Practical Guide",
    category: "Credit Education",
    excerpt:
      "Your CIBIL score shapes every loan offer you get. Here are the habits that move it in the right direction.",
    seoTitle: "How to Improve Your CIBIL Score | LeapMoney",
    seoDescription:
      "Learn practical, proven ways to improve your CIBIL score in India — from paying on time to managing credit utilisation. Build credit health with LeapMoney.",
    publishedAt: "2026-06-12",
    readingMinutes: 7,
    author: "LeapMoney Editorial",
    sections: [
      {
        paragraphs: [
          "Your CIBIL score is a three-digit summary of how you handle credit. A higher score unlocks better rates and higher approval odds.",
        ],
      },
      {
        heading: "Pay every bill on time",
        paragraphs: [
          "Payment history is the single biggest factor. Even one missed EMI or card payment can dent your score. Set up auto-pay to never miss a due date.",
        ],
      },
      {
        heading: "Keep credit utilisation low",
        paragraphs: [
          "Using a large share of your credit limit signals risk. Aim to keep utilisation below 30% of your total limit.",
        ],
      },
    ],
    relatedLoans: ["personal-loan"],
  },
  {
    slug: "personal-loan-eligibility",
    title: "Personal Loan Eligibility in India: What Lenders Look For",
    category: "Loan Guides",
    excerpt:
      "Income, credit score, employment, and obligations all shape your personal loan eligibility. Here's what matters most.",
    seoTitle: "Personal Loan Eligibility Criteria in India | LeapMoney",
    seoDescription:
      "Understand personal loan eligibility in India — income, CIBIL score, FOIR, and employment criteria lenders check. Then see your real eligibility with LeapMatch.",
    publishedAt: "2026-06-13",
    readingMinutes: 5,
    author: "LeapMoney Editorial",
    sections: [
      {
        paragraphs: [
          "Lenders assess a mix of factors to decide whether to approve your personal loan and at what rate.",
        ],
      },
      {
        heading: "The key factors",
        paragraphs: [
          "Your net monthly income, credit score, employment stability, and existing obligations (your FOIR) are the main drivers of eligibility.",
          "LeapMatch™ screens your profile against many lenders at once so you only apply where you're likely to be approved.",
        ],
      },
    ],
    relatedLoans: ["personal-loan"],
  },
  {
    slug: "processing-fee-guide",
    title: "Loan Processing Fees and Hidden Charges, Explained",
    category: "Credit Education",
    excerpt:
      "The interest rate isn't the whole story. Processing fees and other charges affect the true cost of your loan.",
    seoTitle: "Loan Processing Fees & Hidden Charges Guide | LeapMoney",
    seoDescription:
      "Processing fees, prepayment charges, and more — learn the hidden costs that affect your loan's true cost of borrowing in India. Compare smarter with LeapMoney.",
    publishedAt: "2026-06-14",
    readingMinutes: 5,
    author: "LeapMoney Editorial",
    sections: [
      {
        paragraphs: [
          "Two loans with the same interest rate can cost very different amounts once fees are included.",
        ],
      },
      {
        heading: "Common charges to watch",
        paragraphs: [
          "Processing fees (typically 0.5%–3% of the loan), prepayment or foreclosure charges, and late-payment penalties all add to your total cost of borrowing (TCB).",
          "Always compare loans on TCB, not just the headline rate.",
        ],
      },
    ],
    relatedLoans: ["personal-loan", "business-loan"],
  },
  {
    slug: "foir-meaning",
    title: "What Is FOIR and Why It Matters for Your Loan",
    category: "Credit Education",
    excerpt:
      "FOIR — the fixed-obligation-to-income ratio — is one of the most important numbers in loan approval. Here's what it means.",
    seoTitle: "FOIR Meaning — How It Affects Loan Approval | LeapMoney",
    seoDescription:
      "FOIR (fixed-obligation-to-income ratio) decides how much you can borrow. Learn what FOIR means and how to improve it for better loan approval in India.",
    publishedAt: "2026-06-15",
    readingMinutes: 4,
    author: "LeapMoney Editorial",
    sections: [
      {
        paragraphs: [
          "FOIR measures what share of your monthly income already goes toward fixed obligations like EMIs and rent.",
        ],
      },
      {
        heading: "Why lenders care",
        paragraphs: [
          "Most lenders cap FOIR around 50%. A lower FOIR means more room for a new EMI — and a higher loan eligibility.",
          "Paying down existing obligations before applying can meaningfully increase how much you can borrow.",
        ],
      },
    ],
    relatedLoans: ["home-loan", "personal-loan"],
  },
  {
    slug: "credit-utilisation",
    title: "Credit Utilisation: The Quiet Driver of Your Score",
    category: "Credit Education",
    excerpt:
      "How much of your credit limit you use has an outsized effect on your score. Here's how to manage it.",
    seoTitle: "Credit Utilisation and Your CIBIL Score | LeapMoney",
    seoDescription:
      "Credit utilisation is a major factor in your CIBIL score. Learn the ideal ratio and how to manage it to keep your credit health strong with LeapMoney.",
    publishedAt: "2026-06-16",
    readingMinutes: 4,
    author: "LeapMoney Editorial",
    sections: [
      {
        paragraphs: [
          "Credit utilisation is the ratio of your outstanding card balances to your total credit limit.",
        ],
      },
      {
        heading: "The 30% rule",
        paragraphs: [
          "Keeping utilisation under 30% signals healthy credit behaviour. Spreading spends across cards or requesting a limit increase can help.",
        ],
      },
    ],
    relatedLoans: ["personal-loan"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.category === category);
}
