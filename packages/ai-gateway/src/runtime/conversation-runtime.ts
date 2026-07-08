// ── Conversation Runtime ──────────────────────────────────────────────────
// Sprint 29 T11 — PRD §4.3/§4.4. The agentic turn loop: stream the provider;
// when it requests tools, execute them through an injected executor (the
// ai-tools engine at wiring time), feed results back, and continue until the
// model finishes with text or the iteration cap is hit. Every provider delta
// and every tool result streams out as RuntimeEvents so the UI can render
// thinking/tool states live (UX §3.06/§3.12).
//
// The runtime never decides anything: permissions/timeouts/retries live in
// the executor (T10); grounding rules live in prompts + Conversation OS.

import type { AIProvider, ChatContentBlock, ChatDelta, ChatMessage, ChatRequest } from "../types";
import { toChronologicalWindow, type HistoryTurn } from "../conversation/history";

/** Wire-format-agnostic executor seam — ai-tools' ToolEngine satisfies it. */
export type ToolExecutor = (
  toolId: string,
  args: unknown,
) => Promise<{ ok: true; data: unknown } | { ok: false; error: string; message: string }>;

export type RuntimeEvent =
  | ChatDelta
  | { type: "tool_result"; id: string; name: string; ok: boolean; data?: unknown; message?: string }
  | { type: "turn_limit"; iterations: number };

export interface MemoryHooks {
  /** Structured user facts to append to the system prompt (Phase 2 memory). */
  loadFacts?: () => Promise<string[]>;
  /** Called once per completed turn with the final assistant text. */
  onTurnComplete?: (assistantText: string) => Promise<void>;
}

export interface RuntimeOptions {
  provider: AIProvider;
  executeTool: ToolExecutor;
  /** Safety cap on provider↔tool round-trips per user turn. */
  maxIterations?: number;
  memory?: MemoryHooks;
}

interface PendingToolUse {
  id: string;
  name: string;
  inputJson: string;
}

/**
 * Session resume + context assembly (Conversation OS §13 persistence):
 * system prompt (+ memory facts) + latest history window + current message.
 */
export async function buildTurnMessages(params: {
  systemPrompt: string;
  newestFirstHistory: HistoryTurn[];
  historyLimit: number;
  userMessage: string;
  memory?: MemoryHooks | undefined;
}): Promise<ChatMessage[]> {
  const facts = (await params.memory?.loadFacts?.()) ?? [];
  const system =
    facts.length > 0
      ? `${params.systemPrompt}\n\nKnown user context (from memory, verify before relying on):\n- ${facts.join("\n- ")}`
      : params.systemPrompt;

  const history = toChronologicalWindow(params.newestFirstHistory, params.historyLimit)
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const messages: ChatMessage[] = [{ role: "system", content: system }, ...history];
  if (messages[messages.length - 1]?.content !== params.userMessage) {
    messages.push({ role: "user", content: params.userMessage });
  }
  return messages;
}

export async function* runConversationTurn(
  request: ChatRequest,
  options: RuntimeOptions,
): AsyncIterable<RuntimeEvent> {
  const maxIterations = options.maxIterations ?? 4;
  const messages: ChatMessage[] = [...request.messages];
  let assistantText = "";

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const pending = new Map<string, PendingToolUse>();
    const assistantBlocks: ChatContentBlock[] = [];
    let iterationText = "";

    for await (const delta of options.provider.stream({ ...request, messages })) {
      switch (delta.type) {
        case "text":
          iterationText += delta.text;
          yield delta;
          break;
        case "tool_use_start":
          pending.set(delta.id, { id: delta.id, name: delta.name, inputJson: "" });
          yield delta;
          break;
        case "tool_use_delta": {
          const p = pending.get(delta.id);
          if (p) p.inputJson += delta.partialInputJson;
          yield delta;
          break;
        }
        case "tool_use_stop":
          yield delta;
          break;
        case "done":
          // swallow intermediate done; the runtime emits the final one
          break;
      }
    }

    assistantText += iterationText;
    if (iterationText.length > 0) assistantBlocks.push({ type: "text", text: iterationText });

    if (pending.size === 0) {
      // Model finished with text — turn complete.
      await options.memory?.onTurnComplete?.(assistantText).catch(() => {});
      yield { type: "done" };
      return;
    }

    // ── Execute requested tools, stream results, extend the transcript ──
    const resultBlocks: ChatContentBlock[] = [];
    for (const p of pending.values()) {
      let args: unknown = {};
      try {
        args = p.inputJson ? JSON.parse(p.inputJson) : {};
      } catch {
        /* malformed model JSON → execute with empty args; executor will validate */
      }
      assistantBlocks.push({ type: "tool_use", id: p.id, name: p.name, input: args });

      const result = await options.executeTool(p.name, args);
      if (result.ok) {
        yield { type: "tool_result", id: p.id, name: p.name, ok: true, data: result.data };
        resultBlocks.push({ type: "tool_result", tool_use_id: p.id, content: JSON.stringify(result.data) });
      } else {
        yield { type: "tool_result", id: p.id, name: p.name, ok: false, message: result.message };
        resultBlocks.push({
          type: "tool_result",
          tool_use_id: p.id,
          content: JSON.stringify({ error: result.error, message: result.message }),
          is_error: true,
        });
      }
    }

    messages.push({ role: "assistant", content: assistantBlocks });
    messages.push({ role: "tool", content: resultBlocks });
  }

  // Iteration cap — honest stop, never a silent loop (Conversation OS E-16 spirit).
  yield { type: "turn_limit", iterations: maxIterations };
  await options.memory?.onTurnComplete?.(assistantText).catch(() => {});
  yield { type: "done" };
}
