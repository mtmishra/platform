import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Credit Health Dashboard | LeapMoney",
  description: "Track and improve your credit health across every factor that matters. Full dashboard page coming soon.",
  path: "/credit-health",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Product"
      title="Credit Health Dashboard"
      description="Track and improve your credit health across every factor that matters. Full dashboard page coming soon."
    />
  );
}
