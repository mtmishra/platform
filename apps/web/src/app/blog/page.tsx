import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapMoney Blog | LeapMoney",
  description: "Credit education, product explainers, and money guides. Articles coming soon.",
  path: "/blog",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Blog"
      title="LeapMoney Blog"
      description="Credit education, product explainers, and money guides. Articles coming soon."
    />
  );
}
