// ── PII redaction ─────────────────────────────────────────────────────────
// Sprint 28 T6 — PRD §9-R3 (DPDP): identifiers are masked BEFORE any payload
// leaves for a model provider. The model reasons over "[REDACTED:PAN]", the
// real value never crosses the wire; tools re-fetch live data server-side
// when the real identifier is needed.
//
// Deliberately conservative pattern set (PAN, Aadhaar, Indian mobile, email).
// Order matters: Aadhaar (12 digits) before phone (10 digits) so the longer
// match wins. Boundaries guard against masking loan amounts.

import type { ChatContentBlock, ChatMessage, ChatRequest } from "../types";

const PATTERNS: { name: string; regex: RegExp; token: string }[] = [
  // PAN: AAAAA9999A
  { name: "pan", regex: /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g, token: "[REDACTED:PAN]" },
  // Aadhaar: 12 digits, optionally 4-4-4 grouped
  { name: "aadhaar", regex: /(?<!\d)\d{4}[\s-]?\d{4}[\s-]?\d{4}(?!\d)/g, token: "[REDACTED:AADHAAR]" },
  // Indian mobile: optional +91/0 prefix, 10 digits starting 6-9
  { name: "phone", regex: /(?<!\d)(?:\+91[\s-]?|0)?[6-9]\d{9}(?!\d)/g, token: "[REDACTED:PHONE]" },
  // Email
  { name: "email", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, token: "[REDACTED:EMAIL]" },
];

export function redactPII(text: string): string {
  let out = text;
  for (const { regex, token } of PATTERNS) {
    out = out.replace(regex, token);
  }
  return out;
}

function redactBlock(block: ChatContentBlock): ChatContentBlock {
  switch (block.type) {
    case "text":
      return { ...block, text: redactPII(block.text) };
    case "tool_result":
      return { ...block, content: redactPII(block.content) };
    case "tool_use":
      // tool inputs are structured JSON produced by the model/registry —
      // redact its serialized string fields defensively
      return { ...block, input: redactUnknown(block.input) };
  }
}

function redactUnknown(value: unknown): unknown {
  if (typeof value === "string") return redactPII(value);
  if (Array.isArray(value)) return value.map(redactUnknown);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, redactUnknown(v)]));
  }
  return value;
}

function redactMessage(message: ChatMessage): ChatMessage {
  return {
    ...message,
    content:
      typeof message.content === "string" ? redactPII(message.content) : message.content.map(redactBlock),
  };
}

/** Returns a NEW request with all outbound content redacted; input untouched. */
export function redactRequest(request: ChatRequest): ChatRequest {
  return { ...request, messages: request.messages.map(redactMessage) };
}
