import type { BureauName } from "../types";
import type { BureauAdapter, BureauPullRequest, BureauPullResponse } from "./adapter";
import { buildMockReport } from "./mock-data";

/**
 * Mock adapter used for all four bureaus in Sprint 7. Produces deterministic
 * data and never makes a network call. Each bureau gets its own subclass so
 * the registry and call sites are identical to the eventual live adapters.
 */
class MockBureauAdapter implements BureauAdapter {
  public readonly live = false;

  constructor(public readonly bureau: BureauName) {}

  async pull(request: BureauPullRequest): Promise<BureauPullResponse> {
    const report = buildMockReport(this.bureau, request.pan, request.pull_type);
    if (report.score === null && report.tradelines.length === 0) {
      // Bureau has no file on this borrower (thin-file / new-to-credit).
      return { bureau: this.bureau, status: "no_hit", report: null, error_code: null };
    }
    return { bureau: this.bureau, status: "ok", report, error_code: null };
  }
}

// ── Per-bureau adapter interfaces (R3 §1.2–§1.5) ──────────────────────────────
// Named subclasses document each integration point. Swapping a mock for a live
// implementation (e.g. Decentro for CIBIL+Experian) requires no engine change.
export class CibilAdapter extends MockBureauAdapter {
  constructor() {
    super("cibil");
  }
}

export class ExperianAdapter extends MockBureauAdapter {
  constructor() {
    super("experian");
  }
}

export class CrifAdapter extends MockBureauAdapter {
  constructor() {
    super("crif");
  }
}

export class EquifaxAdapter extends MockBureauAdapter {
  constructor() {
    super("equifax");
  }
}
