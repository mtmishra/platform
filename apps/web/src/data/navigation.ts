// ── Navigation IA ───────────────────────────────────────────────────────────
// Source of truth: Phase 5 Website V2 Gap Analysis §11 (header + footer).
// Subdomain links (app/dsa/lender) are external; everything else is on-site.

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

// Header mega-menus
export const PRODUCTS_MENU: NavLink[] = [
  { label: "LeapMatch™",      href: "/leapmatch" },
  { label: "LeapScore™",      href: "/leapscore" },
  { label: "Credit Health",   href: "/credit-health" },
  { label: "AI Comparison",   href: "/compare" },
];

export const LOANS_MENU: NavLink[] = [
  { label: "Personal Loan",        href: "/personal-loan" },
  { label: "Home Loan",            href: "/home-loan" },
  { label: "Business Loan",        href: "/business-loan" },
  { label: "Loan Against Property",href: "/loan-against-property" },
];

export const HEADER_LINKS: NavLink[] = [
  { label: "For DSAs",    href: "/dsa" },
  { label: "For Lenders", href: "/lenders" },
  { label: "Blog",        href: "/blog" },
  { label: "Calculators", href: "/emi-calculator" },
];

// Footer columns
export const FOOTER_GROUPS: NavGroup[] = [
  {
    label: "Products",
    links: [
      { label: "LeapMatch™",            href: "/leapmatch" },
      { label: "LeapScore™",            href: "/leapscore" },
      { label: "Credit Health Dashboard", href: "/credit-health" },
      { label: "AI Bank Comparison",    href: "/compare" },
      { label: "EMI Calculator",        href: "/emi-calculator" },
    ],
  },
  {
    label: "Loans",
    links: LOANS_MENU,
  },
  {
    label: "For Partners",
    links: [
      { label: "For DSA Agents",      href: "/dsa" },
      { label: "DSA Suite Features",  href: "/dsa" },
      { label: "Commission Structure",href: "/dsa" },
      { label: "For Lenders",         href: "/lenders" },
      { label: "Partner Programme",   href: "/partners" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog",     href: "/blog" },
      { label: "Careers",  href: "/careers" },
      { label: "Press",    href: "/press" },
      { label: "Contact",  href: "/contact" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Privacy Policy",      href: "/privacy-policy" },
      { label: "Terms of Service",    href: "/terms-of-service" },
      { label: "Disclaimer",          href: "/disclaimer" },
      { label: "Grievance Redressal", href: "/grievance-redressal" },
      { label: "Fair Practices Code", href: "/fair-practices-code" },
      { label: "Cookie Policy",       href: "/cookie-policy" },
    ],
  },
];
