import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Create Your Account | LeapMoney",
  description: "Registration and OTP verification will be handled in the borrower app. This flow is coming soon.",
  path: "/register",
});

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="Get Started"
      title="Create Your Account"
      description="Registration and OTP verification will be handled in the borrower app. This flow is coming soon."
    />
  );
}
