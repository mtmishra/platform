import { Heading, Paragraph } from "@leapmoney/ui";
import { getUsers } from "@/lib/admin-demo";
import { UsersTable } from "@/components/UsersTable";

export const metadata = { title: "Users — LeapMoney Admin" };

export default function UsersPage() {
  const users = getUsers();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-6">
      <div>
        <Heading level={1} size="display-large" className="mb-1">User management</Heading>
        <Paragraph color="secondary">Borrowers, DSAs, and lenders across the platform.</Paragraph>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
