import { Heading, Paragraph } from "@leapmoney/ui";
import { ApplicationWizard } from "@/components/applications/ApplicationWizard";

export const metadata = { title: "New Application — LeapMoney" };

export default function NewApplicationPage() {
  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <div className="mx-auto max-w-card-md">
        <Heading level={1} size="display-large" className="mb-1">Apply for a loan</Heading>
        <Paragraph color="secondary">A few quick steps — most of it is pre-filled from your profile.</Paragraph>
      </div>
      <ApplicationWizard />
    </div>
  );
}
