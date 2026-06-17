// ── SEO helpers ─────────────────────────────────────────────────────────────
// Centralises site constants, canonical/OG metadata, and Schema.org structured
// data builders per the Phase 5 SEO migration strategy.

import type { Metadata } from "next";
import type { FaqItem } from "@/data/loans";

export const SITE_URL = "https://leapmoney.net";
export const SITE_NAME = "LeapMoney";
export const DEFAULT_OG_IMAGE = "/og/leapmoney-default.svg"; // 1200×630 branded placeholder

interface PageMetaInput {
  title: string;
  description: string;
  /** Path beginning with "/" — used for canonical + OG url. */
  path: string;
  ogImage?: string;
}

/**
 * Build Next.js Metadata with a self-referential canonical, Open Graph, and
 * Twitter card. Title/description must already follow Phase 5 length rules.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ── Structured data (JSON-LD) ────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og/leapmoney-logo.png`,
    description:
      "India's AI-powered loan marketplace. Intelligent matching, transparent terms.",
    sameAs: ["https://twitter.com/LEAPMONEY"],
  };
}

export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function loanOrCreditSchema(input: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LoanOrCredit",
    name: input.name,
    description: input.description,
    url: `${SITE_URL}${input.url}`,
    loanType: input.name,
    currency: "INR",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
