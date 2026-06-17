import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapMatch — AI Loan Matching | LeapMoney",
  description: "Our AI engine matches you to the lenders most likely to approve you. The full LeapMatch product page is coming soon.",
  path: "/leapmatch",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Product"
      title="LeapMatch™ — AI Loan Matching"
      description="Our AI engine matches you to the lenders most likely to approve you. The full LeapMatch product page is coming soon."
    />
  );
}
