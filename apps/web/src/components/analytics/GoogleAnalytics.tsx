"use client";

import React from "react";
import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId?: string | undefined;
}

/**
 * Loads GA4 with Consent Mode v2 defaulting to denied. The consent layer flips
 * analytics_storage to granted only after explicit opt-in (DPDP-aware).
 * Renders nothing when no measurement ID is configured.
 */
export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) return null;

  return (
    <>
      <Script
        id="ga4-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('consent', 'default', {
              analytics_storage: 'denied',
              wait_for_update: 500
            });
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          `,
        }}
      />
      <Script
        id="ga4-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
    </>
  );
}
