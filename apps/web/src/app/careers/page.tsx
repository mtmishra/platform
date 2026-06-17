import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Careers at LeapMoney | LeapMoney",
  description: "Help us build India's most intelligent loan marketplace. Open roles coming soon.",
  path: "/careers",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title="Careers at LeapMoney"
      description="Help us build India's most intelligent loan marketplace. Open roles coming soon."
    />
  );
}
