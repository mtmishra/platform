import React from "react";
import Link from "next/link";
import { Container } from "@leapmoney/ui";
import { FOOTER_GROUPS } from "@/data/navigation";
import { RbiDisclaimer } from "@/components/trust/RbiDisclaimer";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-feature text-foreground-on-dark">
      <Container>
        {/* Link grid */}
        <div className="grid grid-cols-2 gap-8 py-12 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <span className="text-h2 font-bold tracking-tight">LEAPMONEY</span>
            <p className="text-body-sm text-foreground-tertiary leading-relaxed">
              India&apos;s AI-powered loan marketplace. Intelligent matching.
              Transparent terms.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <span className="text-label-caps font-semibold uppercase tracking-wider text-foreground-tertiary">
                {group.label}
              </span>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={`${group.label}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-foreground-tertiary hover:text-foreground-on-dark transition-colors duration-fast"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 py-6">
          {["CIBIL Partner", "Experian Partner", "RBI Registered", "DPDP Compliant"].map(
            (badge) => (
              <span
                key={badge}
                className="rounded-full border border-white/15 px-3 py-1 text-body-sm text-foreground-tertiary"
              >
                {badge}
              </span>
            )
          )}
        </div>

        {/* RBI / facilitation disclaimer */}
        <div className="border-t border-white/10 py-6">
          <RbiDisclaimer />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-body-sm text-foreground-tertiary">
            &copy; {currentYear} LeapMoney. All rights reserved.
          </p>
          <p className="text-body-sm text-foreground-tertiary text-center sm:text-right">
            Regulated under RBI Digital Lending Guidelines 2022. Data stored in India (AWS Mumbai).
          </p>
        </div>
      </Container>
    </footer>
  );
}
