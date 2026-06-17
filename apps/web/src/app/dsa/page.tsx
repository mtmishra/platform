import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "LeapMoney DSA Suite | LeapMoney",
  description: "Earn more and work smarter with the LeapMoney DSA Suite. Full DSA landing page coming soon.",
  path: "/dsa",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="For DSAs"
      title="LeapMoney DSA Suite"
      description="Earn more and work smarter with the LeapMoney DSA Suite. Full DSA landing page coming soon."
    />
  );
}
