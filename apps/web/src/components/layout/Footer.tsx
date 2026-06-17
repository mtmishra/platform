import React from "react";
import Link from "next/link";
import { Container } from "@leapmoney/ui";

const footerLinks = {
  Products: [
    { label: "Home Loan",     href: "/loans/home-loan" },
    { label: "Personal Loan", href: "/loans/personal-loan" },
    { label: "Business Loan", href: "/loans/business-loan" },
    { label: "EMI Calculator",href: "/emi-calculator" },
  ],
  Company: [
    { label: "About",   href: "/about" },
    { label: "Blog",    href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
    { label: "Grievance Redressal", href: "/grievance" },
    { label: "Fair Practices Code", href: "/fair-practices" },
  ],
} as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-feature text-foreground-on-dark">
      <Container>
        {/* Top section */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <span className="text-h2 font-bold tracking-tight">LEAPMONEY</span>
            <p className="text-body-sm text-foreground-tertiary leading-relaxed">
              India&apos;s AI-powered loan marketplace. Intelligent matching.
              Transparent terms. Your financial leap starts here.
            </p>
          </div>

          {/* Nav columns */}
          {(Object.entries(footerLinks) as [string, readonly { label: string; href: string }[]][]).map(
            ([category, links]) => (
              <div key={category} className="flex flex-col gap-3">
                <span className="text-label-caps font-semibold uppercase tracking-wider text-foreground-tertiary">
                  {category}
                </span>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-body-sm text-foreground-tertiary hover:text-foreground-on-dark transition-colors duration-fast ease-standard"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-body-sm text-foreground-tertiary">
            &copy; {currentYear} LeapMoney. All rights reserved.
          </p>
          <p className="text-body-sm text-foreground-tertiary text-center sm:text-right">
            Regulated under RBI Digital Lending Guidelines 2022.
            Data stored in India (AWS Mumbai).
          </p>
        </div>
      </Container>
    </footer>
  );
}
