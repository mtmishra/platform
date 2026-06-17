import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardBody, CardHeader, Heading, Label } from "@leapmoney/ui";
import type { BlogPost } from "@/data/blog";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card hoverable className="h-full">
        <CardHeader>
          <div className="mb-3 flex items-center gap-3">
            <Label caps>{post.category}</Label>
            <span className="text-body-sm text-foreground-tertiary">
              {post.readingMinutes} min read
            </span>
          </div>
          <Heading level={3} size="h3">{post.title}</Heading>
        </CardHeader>
        <CardBody>
          <p className="text-body-sm text-foreground-secondary">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-body-sm text-foreground-tertiary">
              {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1 text-body-sm font-medium text-interactive-primary">
              Read <ArrowRight size={14} />
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
