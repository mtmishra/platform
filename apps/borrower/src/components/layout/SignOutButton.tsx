"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@leapmoney/supabase";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-body-md font-medium text-foreground-secondary transition-colors duration-fast hover:bg-background-page hover:text-foreground-primary disabled:opacity-50"
    >
      <LogOut size={16} />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
