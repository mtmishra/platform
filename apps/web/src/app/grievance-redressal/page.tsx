import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Grievance Redressal | LeapMoney",
  description: "Our grievance redressal mechanism per RBI Digital Lending Guidelines 2022. Full details coming soon.",
  path: "/grievance-redressal",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Legal"
      title="Grievance Redressal"
      description="Our grievance redressal mechanism per RBI Digital Lending Guidelines 2022. Full details coming soon."
    />
  );
}
