import { describe, expect, it } from "vitest";
import {
  AGENT_PROFILES,
  getModelForProfile,
  getSystemPrompt,
  PROMPT_CORE,
  PROMPT_VERSION,
} from "./index";

describe("prompt registry", () => {
  it("exposes a version for audit stamping", () => {
    expect(PROMPT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("every profile prompt starts with the shared PROMPT_CORE trunk", () => {
    for (const profile of AGENT_PROFILES) {
      expect(getSystemPrompt(profile).startsWith(PROMPT_CORE)).toBe(true);
    }
  });

  it("no unresolved template slots remain in any rendered prompt", () => {
    for (const profile of AGENT_PROFILES) {
      expect(getSystemPrompt(profile)).not.toMatch(/\{[a-z_]+\}/);
    }
  });

  it("borrower prompt renders the lifecycle state", () => {
    expect(getSystemPrompt("borrower", { lifecycle: "premium" })).toContain("lifecycle: premium");
    expect(getSystemPrompt("borrower")).toContain("lifecycle: existing"); // safe default
  });

  it("operations prompt renders the sub-mode", () => {
    expect(getSystemPrompt("operations", { mode: "support" })).toContain("mode: support");
    expect(getSystemPrompt("operations")).toContain("mode: ops");
  });

  it("core encodes the non-negotiables: grounding, no-decisions, confirm cards", () => {
    expect(PROMPT_CORE).toContain("never guess");
    expect(PROMPT_CORE).toContain("confirmation cards");
    expect(PROMPT_CORE).toContain("never paraphrase");
  });

  it("prompts contain no thresholds or policy numbers (OS §18 rule 1)", () => {
    for (const profile of AGENT_PROFILES) {
      // no bare policy numbers like 650/780/50% may live in prompt text
      expect(getSystemPrompt(profile)).not.toMatch(/\b\d{2,}\b/);
    }
  });

  it("routes credit and founder to opus, all others to haiku (PRD §4.2)", () => {
    expect(getModelForProfile("credit")).toBe("claude-opus-4-8");
    expect(getModelForProfile("founder")).toBe("claude-opus-4-8");
    for (const profile of ["borrower", "dsa", "sales", "operations"] as const) {
      expect(getModelForProfile(profile)).toBe("claude-haiku-4-5-20251001");
    }
  });
});
