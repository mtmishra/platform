// ── The LeapMoney borrower journey ───────────────────────────────────────────
// Credit Report → LeapScore → Credit Health → LeapMatch → Compare → Apply.
// Rendered as a strip on every product page so visitors always see where a
// feature sits in the end-to-end flow (and as rich internal linking).

export interface JourneyStep {
  key: string;
  label: string;
  blurb: string;
  href?: string;
}

export const JOURNEY: JourneyStep[] = [
  {
    key: "credit-report",
    label: "Credit Report",
    blurb: "We securely pull your bureau report with a soft inquiry — no score impact.",
  },
  {
    key: "leapscore",
    label: "LeapScore™",
    blurb: "A simple 0–100 score that shows how loan-ready you are.",
    href: "/leapscore",
  },
  {
    key: "credit-health",
    label: "Credit Health",
    blurb: "See the factors behind your score and how to improve them.",
    href: "/credit-health",
  },
  {
    key: "leapmatch",
    label: "LeapMatch™",
    blurb: "Our AI matches you to the lenders most likely to approve you.",
    href: "/leapmatch",
  },
  {
    key: "compare",
    label: "Compare",
    blurb: "Compare matches on true cost of borrowing, not just the rate.",
    href: "/compare",
  },
  {
    key: "apply",
    label: "Apply",
    blurb: "Apply to your chosen lender with documents pre-filled.",
    href: "/register",
  },
];
