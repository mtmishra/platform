import { describe, expect, it } from "vitest";
import { redactPII, redactRequest } from "./redact";
import { withRedaction } from "./with-redaction";
import type { AIProvider, ChatDelta, ChatRequest } from "../types";

describe("redactPII", () => {
  it("masks PAN numbers", () => {
    expect(redactPII("my pan is AWPPM4863Q ok")).toBe("my pan is [REDACTED:PAN] ok");
  });

  it("masks Aadhaar in plain and grouped forms", () => {
    expect(redactPII("aadhaar 123412341234")).toBe("aadhaar [REDACTED:AADHAAR]");
    expect(redactPII("aadhaar 1234 1234 1234")).toBe("aadhaar [REDACTED:AADHAAR]");
    expect(redactPII("aadhaar 1234-1234-1234")).toBe("aadhaar [REDACTED:AADHAAR]");
  });

  it("masks Indian mobile numbers with and without +91/0 prefix", () => {
    expect(redactPII("call 9876543210")).toBe("call [REDACTED:PHONE]");
    expect(redactPII("call +91 9876543210")).toBe("call [REDACTED:PHONE]");
    expect(redactPII("call 09876543210")).toBe("call [REDACTED:PHONE]");
  });

  it("masks emails", () => {
    expect(redactPII("mail support@leapmoney.net now")).toBe("mail [REDACTED:EMAIL] now");
  });

  it("does not mask loan amounts or short numbers", () => {
    expect(redactPII("loan of 1000000 rupees")).toBe("loan of 1000000 rupees");
    expect(redactPII("EMI is 21742 monthly")).toBe("EMI is 21742 monthly");
    expect(redactPII("score 802")).toBe("score 802");
  });

  it("handles multiple identifiers in one text", () => {
    const input = "PAN AWPPM4863Q, phone 9876543210, mail a@b.co";
    expect(redactPII(input)).toBe("PAN [REDACTED:PAN], phone [REDACTED:PHONE], mail [REDACTED:EMAIL]");
  });
});

describe("redactRequest", () => {
  it("redacts string content, block content, tool_result content and tool_use inputs", () => {
    const request: ChatRequest = {
      messages: [
        { role: "user", content: "my pan AWPPM4863Q" },
        {
          role: "assistant",
          content: [
            { type: "text", text: "calling tool for 9876543210" },
            { type: "tool_use", id: "t1", name: "crm.update_profile", input: { phone: "9876543210", nested: ["a@b.co"] } },
          ],
        },
        { role: "tool", content: [{ type: "tool_result", tool_use_id: "t1", content: "stored 1234 1234 1234" }] },
      ],
    };
    const redacted = redactRequest(request);
    const s = JSON.stringify(redacted);
    expect(s).not.toContain("AWPPM4863Q");
    expect(s).not.toContain("9876543210");
    expect(s).not.toContain("a@b.co");
    expect(s).not.toContain("1234 1234 1234");
    // original untouched (pure function)
    expect(JSON.stringify(request)).toContain("AWPPM4863Q");
  });
});

describe("withRedaction", () => {
  it("the wrapped provider only ever sees redacted content", async () => {
    let seen = "";
    const spy: AIProvider = {
      name: "mock",
      async *stream(req: ChatRequest): AsyncIterable<ChatDelta> {
        seen = JSON.stringify(req);
        yield { type: "done" };
      },
    };
    const provider = withRedaction(spy);
    const out: ChatDelta[] = [];
    for await (const d of provider.stream({ messages: [{ role: "user", content: "PAN AWPPM4863Q phone 9876543210" }] })) {
      out.push(d);
    }
    expect(seen).not.toContain("AWPPM4863Q");
    expect(seen).not.toContain("9876543210");
    expect(seen).toContain("[REDACTED:PAN]");
    expect(out).toEqual([{ type: "done" }]);
  });
});
