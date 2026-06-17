import { redirect } from "next/navigation";

export default function Page() {
  // Entry point. Middleware + the (auth) layout enforce the session; an
  // authenticated user lands on the dashboard, otherwise on /login.
  redirect("/dashboard");
}
