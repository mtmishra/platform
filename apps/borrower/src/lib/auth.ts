import { redirect } from "next/navigation";
import { isSupabaseConfigured, type AppRole, type UsersProfileRow } from "@leapmoney/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string | null;
}

// Demo guest used end-to-end when Supabase isn't configured, so the borrower
// experience has no dead ends in an investor demo. Never used in production
// (where isSupabaseConfigured() is true and real sessions apply).
const DEMO_USER: SessionUser = { id: "demo-user", email: "demo@leapmoney.net" };
const DEMO_PROFILE: UsersProfileRow = {
  id: "demo-user",
  auth_user_id: "demo-user",
  email: "demo@leapmoney.net",
  phone: null,
  full_name: "Demo User",
  role: "borrower",
  profile_completed: true,
  onboarding_step: "complete",
  created_at: "2026-06-17T00:00:00.000Z",
  updated_at: "2026-06-17T00:00:00.000Z",
};

/** Returns the authenticated auth user, or null. Demo guest when unconfigured. */
export async function getUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return DEMO_USER;
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}

/** Returns the user's profile row, or null. Demo profile when unconfigured. */
export async function getProfile(): Promise<UsersProfileRow | null> {
  if (!isSupabaseConfigured()) return DEMO_PROFILE;
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("users_profile")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  return data ?? null;
}

/** Redirects to /login if there is no session; otherwise returns the user. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Enforces that the current user holds one of `allowed` roles.
 * Redirects to /login when unauthenticated, or /forbidden on role mismatch.
 */
export async function requireRole(
  allowed: AppRole | AppRole[]
): Promise<UsersProfileRow> {
  const profile = await getProfile();
  if (!profile) redirect("/login");
  const allowedList = Array.isArray(allowed) ? allowed : [allowed];
  if (!allowedList.includes(profile.role)) redirect("/forbidden");
  return profile;
}
