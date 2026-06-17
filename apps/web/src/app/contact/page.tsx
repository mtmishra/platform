import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us | LeapMoney",
  description: "Get in touch with the LeapMoney team at support@leapmoney.net. Full contact page coming soon.",
  path: "/contact",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Company"
      title="Contact Us"
      description="Get in touch with the LeapMoney team at support@leapmoney.net. Full contact page coming soon."
    />
  );
}
