"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Share2, Wallet, TrendingUp, Menu, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  { label: "Leads", href: "/leads", icon: <Users size={18} /> },
  { label: "Referrals", href: "/referrals", icon: <Share2 size={18} /> },
  { label: "Commissions", href: "/commissions", icon: <Wallet size={18} /> },
  { label: "Performance", href: "/performance", icon: <TrendingUp size={18} /> },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Sidebar">
      <Link href="/" className="mb-4 flex items-center gap-2 px-3" onClick={() => onNavigate?.()}>
        <span className="text-h2 font-bold tracking-tight text-foreground-primary">LEAPMONEY</span>
        <span className="rounded bg-premium/15 px-1.5 py-0.5 text-label-caps font-semibold uppercase tracking-wider text-premium">DSA</span>
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

export function DsaShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border-token-default bg-background-card lg:block">
        <NavLinks pathname={pathname} />
      </aside>

      {/* Mobile drawer */}
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
          <span className="text-body-md font-medium text-foreground-secondary">DSA Partner</span>
          <span className="text-body-sm text-foreground-tertiary">Ramesh Agarwal · dsa001</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
