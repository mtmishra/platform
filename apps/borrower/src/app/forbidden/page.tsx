import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";

export const metadata = { title: "Access denied — LeapMoney" };

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background-page p-4 text-center">
      <Heading level={1} size="display-large">Access denied</Heading>
      <Paragraph color="secondary" className="max-w-md">
        You don&apos;t have permission to view this page. If you think this is a
        mistake, contact support@leapmoney.net.
      </Paragraph>
      <Button variant="primary" size="lg">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </main>
  );
}
