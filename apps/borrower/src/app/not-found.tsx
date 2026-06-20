import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background-page p-4 text-center">
      <p className="font-mono text-display-large font-bold tabular-nums text-interactive-primary/20">404</p>
      <Heading level={1} size="display-large">Page not found</Heading>
      <Paragraph color="secondary" className="max-w-md">
        This page doesn&apos;t exist in your borrower portal. Head back to your dashboard to continue.
      </Paragraph>
      <Button variant="primary" size="lg">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </main>
  );
}
