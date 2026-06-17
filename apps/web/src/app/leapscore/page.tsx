import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapScore — Your Credit Intelligence | LeapMoney",
  description: "A 0-100 score that shows your loan readiness. The full LeapScore product page is coming soon.",
  path: "/leapscore",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Product"
      title="LeapScore™ — Your Credit Intelligence"
      description="A 0-100 score that shows your loan readiness. The full LeapScore product page is coming soon."
    />
  );
}
