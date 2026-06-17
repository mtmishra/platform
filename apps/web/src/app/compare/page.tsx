import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Bank Comparison | LeapMoney",
  description: "Compare lenders on true cost of borrowing, not just headline rates. Full comparison page coming soon.",
  path: "/compare",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Product"
      title="AI Bank Comparison"
      description="Compare lenders on true cost of borrowing, not just headline rates. Full comparison page coming soon."
    />
  );
}
