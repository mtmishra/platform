import { Card, Heading, Label, Paragraph } from "@leapmoney/ui";
import { getUser, getProfile } from "@/lib/auth";

export const metadata = { title: "Profile — LeapMoney" };

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border-token-default py-3 last:border-b-0">
      <Label caps>{label}</Label>
      <span className="text-body-lg text-foreground-primary">
        {value && value.length > 0 ? value : <span className="text-foreground-tertiary">Not set</span>}
      </span>
    </div>
  );
}

export default async function ProfilePage() {
  const user = await getUser();
  const profile = await getProfile();

  return (
    <div className="mx-auto flex max-w-card-md flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">Your profile</Heading>
        <Paragraph color="secondary">
          Your account details. Editing and profile completion will be enabled in a
          later sprint.
        </Paragraph>
      </div>

      <Card className="flex flex-col">
        <Field label="Email" value={user?.email ?? profile?.email} />
        <Field label="Full name" value={profile?.full_name} />
        <Field label="Phone" value={profile?.phone} />
        <Field label="Role" value={profile?.role ?? "borrower"} />
        <Field
          label="Profile completed"
          value={profile ? (profile.profile_completed ? "Yes" : "No") : "No"}
        />
        <Field label="Onboarding step" value={profile?.onboarding_step ?? "registered"} />
      </Card>
    </div>
  );
}
