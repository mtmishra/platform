import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About LeapMoney | LeapMoney",
  description: "We believe AI should match you, not just compare. Full about page coming soon.",
  path: "/about",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title="About LeapMoney"
      description="We believe AI should match you, not just compare. Full about page coming soon."
    />
  );
}
