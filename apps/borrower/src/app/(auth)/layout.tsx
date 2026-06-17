import { requireUser, getProfile } from "@/lib/auth";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const profile = await getProfile();

  return (
    <DashboardShell userEmail={user.email} role={profile?.role ?? "borrower"}>
      {children}
    </DashboardShell>
  );
}
