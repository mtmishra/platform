import { Heading, Paragraph } from "@leapmoney/ui";
import { getApplications } from "@/lib/lender-demo";
import { ApplicationInbox } from "@/components/ApplicationInbox";

export const metadata = { title: "Application Inbox — LeapMoney Lender" };

export default function ApplicationsPage() {
  const applications = getApplications();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Application inbox</Heading>
        <Paragraph color="secondary">{applications.length} applications · filter by product, status, or score band.</Paragraph>
      </div>
      <ApplicationInbox applications={applications} />
    </div>
  );
}
