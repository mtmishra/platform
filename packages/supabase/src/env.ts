// ── Supabase environment ─────────────────────────────────────────────────────
// Public (anon) config is safe to read on the client. Falls back to harmless
// placeholders so the app builds and runs before a live project is configured —
// real auth simply no-ops until NEXT_PUBLIC_SUPABASE_* are set.

const PLACEHOLDER_URL = "https://placeholder.supabase.co";
const PLACEHOLDER_ANON_KEY = "public-anon-placeholder-key";

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
  /** True when real credentials are present (not the placeholders). */
  configured: boolean;
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  const configured = Boolean(url && anonKey);
  return {
    url: url ?? PLACEHOLDER_URL,
    anonKey: anonKey ?? PLACEHOLDER_ANON_KEY,
    configured,
  };
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv().configured;
}
