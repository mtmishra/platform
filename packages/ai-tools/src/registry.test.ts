import { describe, expect, it } from "vitest";
import { createDefaultRegistry, ToolRegistry } from "./registry";
import type { ToolSpec } from "./registry";

const registry = createDefaultRegistry();

describe("ToolRegistry (T9)", () => {
  it("registers the Conversation OS §8 tool set with unique ids", () => {
    const ids = registry.list().map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const required of [
      "credit.get_leapscore",
      "credit.explain_factors",
      "credit.get_report",
      "match.get_matches",
      "match.explain_match",
      "match.check_eligibility",
      "lenders.get_products",
      "crm.get_profile",
      "crm.update_profile",
      "application.list",
      "application.status",
      "application.next_steps",
      "application.create_draft",
      "kb.search",
      "notify.send",
    ]) {
      expect(ids).toContain(required);
    }
  });

  it("rejects duplicate registrations", () => {
    const dup = registry.get("kb.search") as ToolSpec;
    expect(() => new ToolRegistry([dup, dup])).toThrow(/Duplicate tool id/);
  });

  it("every spec is fully operational-defined (schema, permissions, timeout, retry, audit)", () => {
    for (const t of registry.list()) {
      expect(t.inputSchema["type"]).toBe("object");
      expect(t.outputSchema["type"]).toBe("object");
      expect(t.permissions.length).toBeGreaterThan(0);
      expect(t.timeoutMs).toBeGreaterThan(0);
      expect(t.retry.maxRetries).toBeGreaterThanOrEqual(0);
      expect(["redacted", "names_only"]).toContain(t.audit.logArgs);
    }
  });

  it("placeholders exist for pending vendors but are never offered to a model", () => {
    for (const id of ["whatsapp.send", "digilocker.fetch", "ckyc.verify", "esign.request", "payment.collect"]) {
      expect(registry.get(id)?.status).toBe("placeholder");
    }
    for (const profile of ["borrower", "dsa", "sales", "credit", "operations", "founder"] as const) {
      const offered = registry.toToolDefinitions(profile).map((t) => t.name);
      expect(offered.every((name) => registry.get(name)?.status === "active")).toBe(true);
    }
  });

  it("profile permissioning matches the Conversation OS matrix", () => {
    const borrowerTools = registry.listForProfile("borrower").map((t) => t.id);
    expect(borrowerTools).toContain("credit.get_leapscore");
    expect(borrowerTools).not.toContain("notify.send"); // operations-only

    const founderTools = registry.listForProfile("founder").map((t) => t.id);
    expect(founderTools).toContain("kb.search");
    expect(founderTools).not.toContain("application.create_draft");
  });

  it("all writes are confirmed_write — the model can never execute state changes", () => {
    for (const t of registry.list()) {
      if (["crm.update_profile", "application.create_draft", "notify.send"].includes(t.id)) {
        expect(t.kind).toBe("confirmed_write");
      }
    }
  });

  it("MCP projection is identical to the provider projection (no translation layer)", () => {
    expect(registry.toMcpTools("borrower")).toEqual(registry.toToolDefinitions("borrower"));
  });

  it("tool definitions slot into the ai-gateway ChatRequest.tools shape", () => {
    const defs = registry.toToolDefinitions("borrower");
    expect(defs.length).toBeGreaterThan(0);
    for (const d of defs) {
      expect(typeof d.name).toBe("string");
      expect(typeof d.description).toBe("string");
      expect(typeof d.inputSchema).toBe("object");
    }
  });
});
