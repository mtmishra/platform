import React from "react";
import Link from "next/link";
import { Container } from "@leapmoney/ui";

export function FeatureBreadcrumb({ title }: { title: string }) {
  return (
    <Container className="pt-6">
      <nav aria-label="Breadcrumb" className="text-body-sm text-foreground-tertiary">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-foreground-primary">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground-secondary">{title}</li>
        </ol>
      </nav>
    </Container>
  );
}
