"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Container } from "@leapmoney/ui";
import { useConsent } from "./ConsentProvider";

export function CookieConsent() {
  const { showBanner, acceptAll, rejectAll, savePreferences, consent } = useConsent();
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);

  if (!showBanner) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border-token-default bg-background-card shadow-3"
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
    >
      <Container className="py-5">
        {!showPrefs ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-body-md font-semibold text-foreground-primary">
                We value your privacy
              </p>
              <p className="mt-1 text-body-sm text-foreground-secondary">
                We use strictly necessary cookies to run LeapMoney, and analytics
                cookies only with your consent, in line with the DPDP Act 2023. Read our{" "}
                <Link href="/cookie-policy" className="text-interactive-primary underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowPrefs(true)}>
                Manage preferences
              </Button>
              <Button variant="secondary" size="sm" onClick={rejectAll}>
                Reject non-essential
              </Button>
              <Button variant="primary" size="sm" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-body-md font-semibold text-foreground-primary">
              Manage cookie preferences
            </p>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked
                disabled
                aria-label="Strictly necessary cookies (always on)"
                className="mt-1 h-5 w-5 accent-[var(--color-interactive-primary)]"
              />
              <div>
                <p className="text-body-md font-medium text-foreground-primary">
                  Strictly necessary
                </p>
                <p className="text-body-sm text-foreground-tertiary">
                  Required for the site to function. Always on.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                aria-label="Analytics cookies"
                className="mt-1 h-5 w-5 accent-[var(--color-interactive-primary)]"
              />
              <div>
                <p className="text-body-md font-medium text-foreground-primary">
                  Analytics
                </p>
                <p className="text-body-sm text-foreground-tertiary">
                  Helps us understand how visitors use the site (Google Analytics 4).
                  Opt-in only — never pre-selected.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowPrefs(false)}>
                Back
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => savePreferences(analytics)}
              >
                Save preferences
              </Button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
