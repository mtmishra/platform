"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileStack, Wallet, ShieldAlert, TrendingUp, ScrollText, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  { label: "Users", href: "/users", icon: <Users size={18} /> },
  { label: "Applications", href: "/applications", icon: <FileStack size={18} /> },
  { label: "Commissions", href: "/commissions", icon: <Wallet size={18} /> },
  { label: "Risk", href: "/risk", icon: <ShieldAlert size={18} /> },
  { label: "Revenue", href: "/revenue", icon: <TrendingUp size={18} /> },
  { label: "Compliance", href: "/compliance", icon: <ScrollText size={18} /> },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Sidebar">
      <Link href="/" className="mb-4 flex items-center gap-2 px-3" onClick={() => onNavigate?.()}>
        <span className="text-h2 font-bold tracking-tight text-foreground-primary">LEAPMONEY</span>
        <span className="rounded bg-foreground-primary px-1.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider text-foreground-on-dark">Admin</span>
      </Link>
      {NAV.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onNavigate?.()}
            aria-current={active ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-body-md font-medium transition-colors duration-fast",
              active ? "bg-background-page text-interactive-primary" : "text-foreground-secondary hover:bg-background-page hover:text-foreground-primary",
            ].join(" ")}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-64 flex-shrink-0 border-r border-border-token-default bg-background-card lg:block">
        <NavLinks pathname={pathname} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-background-card shadow-3">
            <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 text-foreground-tertiary" aria-label="Close menu"><X size={20} /></button>
            <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border-token-default bg-background-card px-4 py-3">
          <button type="button" className="text-foreground-secondary lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <span className="text-body-md font-medium text-foreground-secondary">Control Tower</span>
          <span className="text-body-sm text-foreground-tertiary">admin@leapmoney.net</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
