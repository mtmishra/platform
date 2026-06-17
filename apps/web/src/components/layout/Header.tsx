"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@leapmoney/ui";
import { Container } from "@leapmoney/ui";

const navLinks = [
  { label: "Loans",          href: "/loans" },
  { label: "EMI Calculator", href: "/emi-calculator" },
  { label: "Blog",           href: "/blog" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-token-default bg-background-card shadow-2">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Wordmark */}
          <Link
            href="/"
            className="text-h2 font-bold text-foreground-primary tracking-tight"
            aria-label="LeapMoney home"
          >
            LEAPMONEY
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-md font-medium text-foreground-secondary hover:text-foreground-primary transition-colors duration-fast ease-standard"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-body-md font-medium text-foreground-secondary hover:text-foreground-primary transition-colors duration-fast ease-standard"
            >
              Login
            </Link>
            <Button variant="primary" size="sm" onClick={() => undefined}>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="flex md:hidden items-center justify-center h-10 w-10 rounded-md text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border-token-default bg-background-card">
          <Container>
            <nav
              className="flex flex-col py-4 gap-1"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-3 text-body-lg font-medium text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-border-token-default">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-3 text-body-lg font-medium text-foreground-secondary hover:text-foreground-primary hover:bg-background-page transition-colors duration-fast"
                >
                  Login
                </Link>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setMobileOpen(false)}
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
