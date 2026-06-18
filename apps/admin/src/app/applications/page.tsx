import { Heading, Paragraph } from "@leapmoney/ui";
import { getApplications } from "@/lib/admin-demo";
import { ApplicationsTable } from "@/components/ApplicationsTable";

export const metadata = { title: "Applications — LeapMoney Admin" };

export default function ApplicationsPage() {
  const applications = getApplications();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Application management</Heading>
        <Paragraph color="secondary">All applications across the platform — filter by status and source.</Paragraph>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
