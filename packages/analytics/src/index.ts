// ── LeapMoney Analytics ─────────────────────────────────────────────────────
// GA4-oriented, consent-gated event tracking. The GA4 <script> itself is mounted
// in the app (needs next/script); this package owns the event taxonomy and the
// dispatch logic that pushes to gtag/dataLayer only when consent is granted.

// Event taxonomy — Phase 7 §3.5 + Website V2 marketing events.
export type EventName =
  // Marketing / website
  | "page_view"
  | "cta_click"
  | "form_start"
  | "form_submit"
  | "form_error"
  | "calculator_used"
  // Product funnel (Phase 7)
  | "registration_start"
  | "otp_verified"
  | "leapscore_viewed"
  | "match_results_viewed"
  | "application_submitted"
  // Lead capture forms
  | "eligibility_check_start"
  | "dsa_registration_start"
  | "lender_partnership_request";

export interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, unknown>;
}

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let consentGranted = false;

/** Called by the consent layer when the user opts in/out of analytics. */
export function setAnalyticsConsent(granted: boolean): void {
  consentGranted = granted;
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

export function hasAnalyticsConsent(): boolean {
  return consentGranted;
}

/** Track a typed event. No-op on the server or before consent is granted. */
export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (!consentGranted) return;

  if (window.gtag) {
    window.gtag("event", event.name, event.properties ?? {});
  } else if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log("[Analytics]", event.name, event.properties ?? {});
  }
}

/** Track a virtual page view (App Router route change). */
export function trackPageView(path: string): void {
  track({ name: "page_view", properties: { page_path: path } });
}

/** Convenience helpers for the most common website events. */
export function trackCtaClick(label: string, location?: string): void {
  track({ name: "cta_click", properties: { label, location } });
}

export function trackFormSubmit(formId: string, success: boolean): void {
  track({
    name: success ? "form_submit" : "form_error",
    properties: { form_id: formId },
  });
}

export function trackCalculatorUsed(calculator: string): void {
  track({ name: "calculator_used", properties: { calculator } });
}
