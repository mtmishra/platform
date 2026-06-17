import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";
import { getSupabasePublicEnv } from "./env";

// ── Browser client ───────────────────────────────────────────────────────────
// For use in Client Components. Server-side clients are created per-app with the
// framework's cookie adapter (see apps/*/src/lib/supabase/server.ts).

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
