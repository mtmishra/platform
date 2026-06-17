import type { Metadata } from "next";
import {
  Container,
  Heading,
  Label,
  Paragraph,
  Section,
} from "@leapmoney/ui";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { BLOG_CATEGORIES, BLOG_POSTS, getPostsByCategory } from "@/data/blog";

export const metadata: Metadata = buildMetadata({
  title: "Blog — Credit & Loan Guides | LeapMoney",
  description:
    "Practical credit education and loan guides for India. Learn about CIBIL scores, FOIR, eligibility, and choosing the right loan. Read the LeapMoney blog.",
  path: "/blog",
});

export default function Page() {
  return (
    <>
      <Header />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <main>
        <Section background="page" className="py-12 lg:py-16">
          <Container>
            <div className="mb-10 max-w-2xl">
              <Label caps className="mb-3 block">Blog</Label>
              <Heading level={1} size="display-large" className="mb-3">
                Credit &amp; loan guides
              </Heading>
              <Paragraph size="lg" color="secondary">
                Clear, jargon-free guides to help you borrow smarter — from credit
                scores to choosing the right loan.
              </Paragraph>
            </div>

            {BLOG_CATEGORIES.map((category) => {
              const posts = getPostsByCategory(category);
              if (posts.length === 0) return null;
              return (
                <div key={category} className="mb-12">
                  <Heading level={2} size="h1" className="mb-6">{category}</Heading>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>
                </div>
              );
            })}

            <p className="text-body-sm text-foreground-tertiary">
              {BLOG_POSTS.length} articles · more coming soon
            </p>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
