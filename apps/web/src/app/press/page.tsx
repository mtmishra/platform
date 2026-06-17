import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Press & Media | LeapMoney",
  description: "LeapMoney news, media resources, and press enquiries. Coming soon.",
  path: "/press",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title="Press & Media"
      description="LeapMoney news, media resources, and press enquiries. Coming soon."
    />
  );
}
