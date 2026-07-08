"use client";

// ── Customer AI mount ─────────────────────────────────────────────────────
// Sprint 29 T16 — borrower-portal configuration of the shared LeapAIWidget.
// DSA/Founder/Operations portals mount the SAME widget with their own
// props (PRD §5) — configuration, never a duplicate implementation.
// Feature-flagged: NEXT_PUBLIC_LEAPAI_ENABLED (off = zero footprint).

import { LeapAIWidget } from "@leapmoney/ui";

// UX §9.3 thinking-verb copy map (Conversation OS tool ids).
const THINKING_LABELS: Record<string, string> = {
  "credit.get_report": "Fetching your bureau report…",
  "credit.get_leapscore": "Checking your LeapScore…",
  "credit.explain_factors": "Analysing score factors…",
  "match.get_matches": "Running LeapMatch…",
  "match.explain_match": "Explaining this match…",
  "application.status": "Looking up your application…",
  "application.list": "Looking up your applications…",
  "kb.search": "Searching LeapMoney knowledge…",
};

export function CustomerAI({ userName }: { userName: string }) {
  if (process.env["NEXT_PUBLIC_LEAPAI_ENABLED"] !== "true") return null;
  return (
    <LeapAIWidget
      endpoint="/api/ai/chat"
      experienceLabel="CUSTOMER AI"
      greeting={`Hi ${userName} — I'm LeapAI`}
      subtitle="I can explain your credit, find your best lenders, and track applications — grounded in your real data."
      suggestedPrompts={["Explain my LeapScore", "Find my best loan offers", "Where is my application?"]}
      demoBanner // PRD Risk R1 — mandatory until persistence wiring is live
      thinkingLabels={THINKING_LABELS}
    />
  );
}
