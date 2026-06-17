import type { BureauName, BureauReport } from "../types";
import { BUREAUS } from "../types";
import type { BureauAdapter, BureauPullRequest } from "./adapter";
import { CibilAdapter, CrifAdapter, EquifaxAdapter, ExperianAdapter } from "./adapters";

/**
 * Multi-bureau abstraction layer. Holds one adapter per bureau and pulls them
 * concurrently, returning only successful reports. The LeapScore engine never
 * talks to a bureau directly — it consumes the reports this layer assembles.
 */
export class BureauRegistry {
  private readonly adapters: Map<BureauName, BureauAdapter>;

  constructor(adapters?: BureauAdapter[]) {
    const list =
      adapters ?? [new CibilAdapter(), new ExperianAdapter(), new CrifAdapter(), new EquifaxAdapter()];
    this.adapters = new Map(list.map((a) => [a.bureau, a]));
  }

  get(bureau: BureauName): BureauAdapter | undefined {
    return this.adapters.get(bureau);
  }

  /**
   * Pull a specific set of bureaus (defaults to all configured). Returns the
   * reports that came back with a file; "no_hit" and "error" are dropped so the
   * engine can apply its thin-file path on whatever is available.
   */
  async pull(request: BureauPullRequest, bureaus: readonly BureauName[] = BUREAUS): Promise<BureauReport[]> {
    const results = await Promise.all(
      bureaus.map(async (name) => {
        const adapter = this.adapters.get(name);
        if (!adapter) return null;
        const response = await adapter.pull(request);
        return response.status === "ok" ? response.report : null;
      }),
    );
    return results.filter((r): r is BureauReport => r !== null);
  }
}

/** Default registry wired with the Sprint 7 mock adapters for all four bureaus. */
export function createDefaultBureauRegistry(): BureauRegistry {
  return new BureauRegistry();
}
