import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy | LeapMoney",
  description: "How LeapMoney uses cookies and similar technologies. Full policy coming soon.",
  path: "/cookie-policy",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Cookie Policy"
      description="How LeapMoney uses cookies and similar technologies. Full policy coming soon."
    />
  );
}
