import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = { title: "Sign in — LeapMoney" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background-page p-4">
      <LoginForm />
    </main>
  );
}
