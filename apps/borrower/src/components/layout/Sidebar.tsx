"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Gauge,
  HeartPulse,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  /** Foundation routes not yet built render as disabled. */
  disabled?: boolean;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Profile", href: "/profile", icon: <User size={18} /> },
  { label: "Applications", href: "/applications", icon: <FileText size={18} /> },
  { label: "LeapScore", href: "/score", icon: <Gauge size={18} />, disabled: true },
  { label: "Credit Health", href: "/health", icon: <HeartPulse size={18} /> },
  { label: "Settings", href: "/settings", icon: <Settings size={18} />, disabled: true },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-4" aria-label="Sidebar">
      <Link
        href="/dashboard"
        className="mb-4 px-3 text-h2 font-bold tracking-tight text-foreground-primary"
      >
        LEAPMONEY
      </Link>

      {NAV.map((item) => {
        const active = pathname === item.href;
        if (item.disabled) {
          return (
            <span
              key={item.href}
              className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2.5 text-body-md text-foreground-tertiary opacity-60"
              title="Coming soon"
            >
              {item.icon}
              {item.label}
              <span className="ml-auto text-label-caps uppercase tracking-wider">Soon</span>
            </span>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onNavigate?.()}
            aria-current={active ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-body-md font-medium transition-colors duration-fast",
              active
                ? "bg-background-page text-interactive-primary"
                : "text-foreground-secondary hover:bg-background-page hover:text-foreground-primary",
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
