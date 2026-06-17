import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Partner with LeapMoney | LeapMoney",
  description: "Access pre-qualified, document-ready leads. Full lender landing page coming soon.",
  path: "/lenders",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="For Lenders"
      title="Partner with LeapMoney"
      description="Access pre-qualified, document-ready leads. Full lender landing page coming soon."
    />
  );
}
