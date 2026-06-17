import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "EMI Calculator | LeapMoney",
  description: "Calculate your loan EMI, total interest, and true cost of borrowing. Full calculator coming soon.",
  path: "/emi-calculator",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Calculators"
      title="EMI Calculator"
      description="Calculate your loan EMI, total interest, and true cost of borrowing. Full calculator coming soon."
    />
  );
}
