import Link from "next/link";
import { Button, Heading, Paragraph } from "@leapmoney/ui";
import { getApplication, buildTimeline } from "@/lib/applications-demo";
import { ApplicationTimeline, StatusBadge } from "@/components/applications/ApplicationWidgets";

interface PageProps {
  params: { id: string };
}

export const metadata = { title: "Application Timeline — LeapMoney" };

export default function ApplicationTimelinePage({ params }: PageProps) {
  const app = getApplication(params.id);

  if (!app) {
    return (
      <div className="mx-auto max-w-card-md text-center">
        <Heading level={1} size="h1" className="mb-2">Application not found</Heading>
        <Button variant="primary" size="lg"><Link href="/applications">Back to applications</Link></Button>
      </div>
    );
  }

  const timeline = buildTimeline(app);

  return (
    <div className="mx-auto flex max-w-card-md flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Heading level={1} size="display-large" className="mb-1">Status timeline</Heading>
          <Paragraph color="secondary">{app.lender_name} · {app.id}</Paragraph>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="rounded-lg border border-border-token-default bg-background-card p-6 shadow-1">
        <ApplicationTimeline steps={timeline} />
      </div>

      <div>
        <Button variant="ghost" size="lg"><Link href={`/applications/${app.id}`}>Back to application</Link></Button>
      </div>
    </div>
  );
}
