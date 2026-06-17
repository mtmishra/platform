import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { LOAN_PRODUCTS } from "@/data/loans";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/leapmatch",
    "/leapscore",
    "/credit-health",
    "/compare",
    "/dsa",
    "/lenders",
    "/partners",
    "/about",
    "/careers",
    "/press",
    "/contact",
    "/blog",
    "/emi-calculator",
    "/privacy-policy",
    "/terms-of-service",
    "/grievance-redressal",
    "/fair-practices-code",
    "/cookie-policy",
  ];

  const loanPaths = LOAN_PRODUCTS.map((p) => `/${p.slug}`);

  const lastModified = new Date();

  return [...staticPaths, ...loanPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
