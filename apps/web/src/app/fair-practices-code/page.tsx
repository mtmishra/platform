import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Fair Practices Code | LeapMoney",
  description: "Our commitment to transparent, fair lending practices per RBI requirements. Full text coming soon.",
  path: "/fair-practices-code",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Fair Practices Code"
      description="Our commitment to transparent, fair lending practices per RBI requirements. Full text coming soon."
    />
  );
}
