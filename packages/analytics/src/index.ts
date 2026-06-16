export type EventName =
  | "loan_application_started"
  | "loan_application_submitted"
  | "loan_offer_viewed"
  | "loan_offer_accepted"
  | "dsa_registered"
  | "dsa_lead_submitted"
  | "page_viewed";

export interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, unknown>;
  userId?: string;
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  console.log("[Analytics]", event);
}

export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  console.log("[Analytics] identify", userId, traits);
}
