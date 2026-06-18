"use client";

import React from "react";
import { StatusBadge } from "@/components/AdminWidgets";
import type { AdminUser, UserRole } from "@/lib/admin-demo";

const ROLES: Array<UserRole | "All"> = ["All", "Borrower", "DSA", "Lender"];

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [role, setRole] = React.useState<UserRole | "All">("All");
  const filtered = users.filter((u) => role === "All" || u.role === role);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-full px-3 py-1.5 text-body-sm font-medium transition-colors duration-fast ${role === r ? "bg-interactive-primary text-foreground-on-dark" : "bg-background-card text-foreground-secondary hover:bg-background-page"}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border-token-default bg-background-card shadow-1">
        <div className="hidden grid-cols-[1.4fr_0.8fr_1.2fr_0.8fr] gap-3 border-b border-border-token-default px-4 py-3 text-label-caps uppercase tracking-wider text-foreground-tertiary sm:grid">
          <span>User</span><span>Role</span><span>Detail</span><span className="text-right">Status</span>
        </div>
        <ul className="flex flex-col divide-y divide-border-token-default">
          {filtered.map((u) => (
            <li key={u.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 sm:grid-cols-[1.4fr_0.8fr_1.2fr_0.8fr]">
              <div className="min-w-0"><p className="truncate text-body-md font-semibold text-foreground-primary">{u.name}</p><p className="text-body-sm text-foreground-tertiary">{u.id}</p></div>
              <span className="hidden text-body-sm text-foreground-secondary sm:block">{u.role}</span>
              <span className="hidden truncate text-body-sm text-foreground-secondary sm:block">{u.detail}</span>
              <div className="text-right"><StatusBadge status={u.status} /></div>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-body-sm text-foreground-tertiary">{filtered.length} user{filtered.length === 1 ? "" : "s"}</p>
    </div>
  );
}
