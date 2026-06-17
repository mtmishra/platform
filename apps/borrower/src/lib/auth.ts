import { redirect } from "next/navigation";
import { isSupabaseConfigured, type AppRole, type UsersProfileRow } from "@leapmoney/supabase";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SessionUser {
  id: string;
  email: string | null;
}

/** Returns the authenticated auth user, or null. Never throws when unconfigured. */
export async function getUser(): Promise<SessionUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email ?? null };
}

/** Returns the user's profile row, or null. */
export async function getProfile(): Promise<UsersProfileRow | null> {
  if (!isSupabaseConfigured()) return null;
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
