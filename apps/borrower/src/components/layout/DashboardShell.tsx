"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { SignOutButton } from "./SignOutButton";

interface DashboardShellProps {
  userEmail: string | null;
  role: string;
  children: React.ReactNode;
}

export function DashboardShell({ userEmail, role, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh bg-background-page">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border-token-default bg-background-card lg:block">
        <div className="sticky top-0 h-dvh">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy-deep/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-border-token-default bg-background-card">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-token-default bg-background-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-md text-foreground-secondary hover:bg-background-page lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-label-caps uppercase tracking-wider text-foreground-tertiary">
              {role}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden text-body-sm text-foreground-secondary sm:inline">
                {userEmail}
              </span>
            )}
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
