import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoanPageTemplate } from "@/components/loan/LoanPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLoanProduct } from "@/data/loans";
import {
  buildMetadata,
  breadcrumbSchema,
  faqPageSchema,
  loanOrCreditSchema,
} from "@/lib/seo";

const SLUG = "personal-loan";

export function generateMetadata(): Metadata {
  const product = getLoanProduct(SLUG);
  if (!product) return {};
  return buildMetadata({
    title: product.seoTitle,
    description: product.seoDescription,
    path: `/${SLUG}`,
  });
}

export default function Page() {
  const product = getLoanProduct(SLUG);
  if (!product) notFound();

  return (
    <>
      <Header />
      <JsonLd
        data={[
          loanOrCreditSchema({
            name: product.name,
            description: product.seoDescription,
            url: `/${SLUG}`,
          }),
          faqPageSchema(product.faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: product.name, path: `/${SLUG}` },
          ]),
        ]}
      />
      <LoanPageTemplate product={product} />
      <Footer />
    </>
  );
}
