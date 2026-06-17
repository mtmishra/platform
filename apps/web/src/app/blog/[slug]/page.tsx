import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BlogArticleTemplate } from "@/components/blog/BlogArticleTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { BLOG_POSTS, getBlogPost } from "@/data/blog";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle,
    description: post.seoDescription,
    path: `/blog/${post.slug}`,
  });
}

export default function Page({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.seoDescription,
            url: `/blog/${post.slug}`,
            datePublished: post.publishedAt,
            author: post.author,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <BlogArticleTemplate post={post} />
      <Footer />
    </>
  );
}
