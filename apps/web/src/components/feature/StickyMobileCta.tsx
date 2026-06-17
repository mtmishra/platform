"use client";

import React from "react";
import Link from "next/link";

interface StickyMobileCtaProps {
  label: string;
  href: string;
  /** Sub-label reinforcing low friction, e.g. "No credit score impact". */
  note?: string;
}

/**
 * Thumb-zone sticky CTA shown only on mobile (<lg). Appears after the user
 * scrolls past the hero so it never competes with the primary above-the-fold
 * CTA. Slides in via opacity/transform only (Phase 6 motion rule).
 */
export function StickyMobileCta({ label, href, note }: StickyMobileCtaProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = (): void => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-40 border-t border-border-token-default bg-background-card/95 p-3 backdrop-blur lg:hidden",
        "transition-all duration-normal ease-standard",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      ].join(" ")}
    >
      <Link
        href={href}
        className="flex w-full flex-col items-center rounded-md bg-interactive-primary px-4 py-3 text-center text-body-md font-semibold text-foreground-on-dark transition-colors duration-fast hover:bg-interactive-hover"
      >
        {label}
        {note ? <span className="text-body-sm font-normal opacity-80">{note}</span> : null}
      </Link>
    </div>
  );
}
