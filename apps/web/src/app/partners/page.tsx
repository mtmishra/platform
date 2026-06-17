import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Referral Partner Programme | LeapMoney",
  description: "Refer borrowers and earn commissions. Full partner programme page coming soon.",
  path: "/partners",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Partner Programme"
      title="Referral Partner Programme"
      description="Refer borrowers and earn commissions. Full partner programme page coming soon."
    />
  );
}
