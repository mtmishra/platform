import { describe, expect, it } from "vitest";
import { toChronologicalWindow } from "./history";

const row = (i: number) => ({ role: "user", content: `m${i}`, created_at: `2026-07-08T00:00:${String(i).padStart(2, "0")}Z` });

describe("toChronologicalWindow (Sprint 29 Phase 0 regression)", () => {
  it("returns the LATEST N turns, not the oldest (the Sprint-28 bug)", () => {
    // 30 messages, newest-first as the desc query returns them: m30..m1
    const newestFirst = Array.from({ length: 30 }, (_, i) => row(30 - i));
    const windowed = toChronologicalWindow(newestFirst, 20);
    expect(windowed).toHaveLength(20);
    expect(windowed[0]?.content).toBe("m11"); // oldest INSIDE the latest-20 window
    expect(windowed[19]?.content).toBe("m30"); // newest turn is always present
  });

  it("preserves chronological order for the provider context", () => {
    const newestFirst = [row(3), row(2), row(1)];
    expect(toChronologicalWindow(newestFirst, 20).map((r) => r.content)).toEqual(["m1", "m2", "m3"]);
  });

  it("handles fewer rows than the limit and empty input", () => {
    expect(toChronologicalWindow([row(2), row(1)], 20).map((r) => r.content)).toEqual(["m1", "m2"]);
    expect(toChronologicalWindow([], 20)).toEqual([]);
  });

  it("re-caps defensively if the query returned more than the limit", () => {
    const newestFirst = Array.from({ length: 25 }, (_, i) => row(25 - i));
    expect(toChronologicalWindow(newestFirst, 5).map((r) => r.content)).toEqual(["m21", "m22", "m23", "m24", "m25"]);
  });
});
