import type { BureauName, BureauReport, PullType } from "../types";

/** Identity passed to a bureau on pull. PAN is the bureau key; never logged. */
export interface BureauPullRequest {
  pan: string;
  mobile: string;
  full_name: string;
  date_of_birth: string;
  pull_type: PullType;
  /** DPDP purpose string recorded in user_consent before the pull. */
  consent_purpose: string;
}

export type BureauPullStatus = "ok" | "no_hit" | "error";

export interface BureauPullResponse {
  bureau: BureauName;
  status: BureauPullStatus;
  /** Present when status === "ok". A "no_hit" means the bureau has no file. */
  report: BureauReport | null;
  error_code: string | null;
}

/**
 * Common contract every bureau integration implements. Year-1 uses mock
 * adapters (no live integration — Sprint 7 scope). A live adapter (Decentro,
 * CIBIL Direct, etc.) implements the same interface with no engine changes.
 */
export interface BureauAdapter {
  readonly bureau: BureauName;
  /** True for live integrations; false for the Sprint 7 mock adapters. */
  readonly live: boolean;
  pull(request: BureauPullRequest): Promise<BureauPullResponse>;
}
