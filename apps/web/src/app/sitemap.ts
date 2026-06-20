import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { LOAN_PRODUCTS } from "@/data/loans";
import { BLOG_POSTS } from "@/data/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/leapmatch",
    "/leapscore",
    "/leapai",
    "/how-it-works",
    "/credit-health",
    "/compare",
    "/dsa",
    "/lenders",
    "/partners",
    "/about",
    "/careers",
    "/press",
    "/register",
    "/contact",
    "/blog",
    "/calculators",
    "/emi-calculator",
    "/loan-eligibility-calculator",
    "/affordability-calculator",
    "/privacy-policy",
    "/terms-of-service",
    "/disclaimer",
    "/grievance-redressal",
    "/fair-practices-code",
    "/cookie-policy",
  ];

  const loanPaths = LOAN_PRODUCTS.map((p) => `/${p.slug}`);
  const blogPaths = BLOG_POSTS.map((p) => `/blog/${p.slug}`);

  const lastModified = new Date();

  return [...staticPaths, ...loanPaths, ...blogPaths].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
