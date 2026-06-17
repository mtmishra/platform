"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button, Container } from "@leapmoney/ui";
import {
  HEADER_LINKS,
  LOANS_MENU,
  PRODUCTS_MENU,
  type NavLink,
} from "@/data/navigation";

const APP_URL = "https://app.leapmoney.net";

function DesktopDropdown({ label, links }: { label: string; links: NavLink[] }) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 text-body-md font-medium text-foreground-secondary hover:text-foreground-primary transition-colors duration-fast"
        aria-haspopup="true"
      >
        {label}
        <ChevronDown size={16} className="transition-transform duration-fast group-hover:rotate-180" />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[240px] pt-3 opacity-0 transition-opacity duration-fast group-hover:visible group-hover:opacity-100">
        <div className="rounded-lg border border-border-token-default bg-background-card p-2 shadow-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-body-md text-foreground-secondary hover:bg-background-page hover:text-foreground-primary transition-colors duration-fast"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-token-default bg-background-card shadow-2">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-h2 font-bold text-foreground-primary tracking-tight"
            aria-label="LeapMoney home"
          >
            LEAPMONEY
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <DesktopDropdown label="Products" links={PRODUCTS_MENU} />
            <DesktopDropdown label="Loans" links={LOANS_MENU} />
            {HEADER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-md font-medium text-foreground-secondary hover:text-foreground-primary transition-colors duration-fast"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`${APP_URL}/login`}
              className="text-body-md font-medium text-foreground-secondary hover:text-foreground-primary transition-colors duration-fast"
            >
              Login
            </a>
            <Button variant="primary" size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            <Button variant="primary" size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
            <button
              type="button"
              className="flex items-center justify-center h-10 w-10 rounded-md text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu — B2B links first per Phase 5 mobile guidance */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border-token-default bg-background-card">
          <Container>
            <nav className="flex flex-col py-4 gap-1" aria-label="Mobile navigation">
              {HEADER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-3 text-body-lg font-medium text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
                >
                  {link.label}
                </Link>
              ))}

              <p className="px-3 pt-4 pb-1 text-label-caps font-semibold uppercase tracking-wider text-foreground-tertiary">
                Products
              </p>
              {PRODUCTS_MENU.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-body-md text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
                >
                  {link.label}
                </Link>
              ))}

              <p className="px-3 pt-4 pb-1 text-label-caps font-semibold uppercase tracking-wider text-foreground-tertiary">
                Loans
              </p>
              {LOANS_MENU.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-body-md text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
                >
                  {link.label}
                </Link>
              ))}

              <a
                href={`${APP_URL}/login`}
                className="mt-4 rounded-md px-3 py-3 text-body-lg font-medium text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast border-t border-border-token-default"
              >
                Login
              </a>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
