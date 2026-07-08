// ── AnthropicProvider ─────────────────────────────────────────────────────
// PRD §4.2. Talks to Anthropic's Messages API. Server-only — the guard below
// is a runtime safety net, not a substitute for keeping this out of client
// bundles (route it through /api/ai/* only).
//
// Model routing: haiku-4-5 by default (high-volume chat profiles), opus-4-8
// for reasoning-heavy profiles (Credit AI, Founder AI) via `request.model`.
//
// MCP compatibility (reviewed before Sprint 28 T4): `tools` passes straight
// through to Anthropic's native tool-calling, and the raw `events` stream
// (Anthropic's documented content_block_start/delta/stop protocol) is
// translated into ChatDelta tool_use_* events so a future tool registry (T9)
// needs no changes here. `textStream`-only clients (incl. existing tests)
// keep working — event translation only engages when `events` is supplied.

import type { AIProvider, ChatContentBlock, ChatDelta, ChatMessage, ChatRequest, ToolDefinition } from "../types";

export const ANTHROPIC_MODEL_HAIKU = "claude-haiku-4-5-20251001";
export const ANTHROPIC_MODEL_OPUS = "claude-opus-4-8";

const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;

/** Anthropic's documented Messages-API streaming events — the subset we need. */
export type AnthropicRawStreamEvent =
  | { type: "content_block_start"; index: number; content_block: { type: "text"; text: string } | { type: "tool_use"; id: string; name: string } }
  | { type: "content_block_delta"; index: number; delta: { type: "text_delta"; text: string } | { type: "input_json_delta"; partial_json: string } }
  | { type: "content_block_stop"; index: number }
  | { type: "message_stop" };

/**
 * Minimal shape of the Anthropic SDK surface this provider needs, kept
 * narrow so tests can inject a fake client with zero network/API-key cost.
 */
export interface AnthropicMessageStream {
  /** Text-only convenience stream — always present, mirrors SDK behavior. */
  textStream: AsyncIterable<string>;
  /** Full event stream. Optional so simple text-only fakes stay valid. */
  events?: AsyncIterable<AnthropicRawStreamEvent>;
}
export interface AnthropicMessagesClient {
  messages: {
    stream(
      params: {
        model: string;
        max_tokens: number;
        system?: string | undefined;
        messages: { role: "user" | "assistant"; content: string | ChatContentBlock[] }[];
        tools?: { name: string; description: string; input_schema: Record<string, unknown> }[] | undefined;
      },
      options?: { signal?: AbortSignal },
    ): AnthropicMessageStream;
  };
}

export interface AnthropicProviderOptions {
  /** Falls back to process.env.ANTHROPIC_API_KEY. Never read on the client. */
  apiKey?: string;
  defaultModel?: string;
  maxTokens?: number;
  timeoutMs?: number;
  maxRetries?: number;
  /** DI seam for tests — production path lazily constructs the real SDK client. */
  client?: AnthropicMessagesClient;
}

function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "AnthropicProvider is server-only. Route all AI calls through /api/ai/* — never import ai-gateway providers from client components.",
    );
  }
}

function contentToText(content: string | ChatContentBlock[]): string {
  if (typeof content === "string") return content;
  return content.map((b) => (b.type === "text" ? b.text : `[${b.type}]`)).join(" ");
}

function splitSystemAndTurns(messages: ChatMessage[]): {
  system: string | undefined;
  turns: { role: "user" | "assistant"; content: string | ChatContentBlock[] }[];
} {
  const systemMessage = messages.find((m) => m.role === "system");
  const system = systemMessage ? contentToText(systemMessage.content) : undefined;

  // Anthropic has no wire-level "tool" role: a tool result is a user-role
  // message carrying a tool_result content block. Translate here so callers
  // (and the DB's ai_message_role enum) can use "tool" without this provider
  // needing a redesign when that role starts appearing (T9).
  const turns = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    }));

  return { system, turns };
}

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic" as const;

  private readonly apiKey: string | undefined;
  private readonly defaultModel: string;
  private readonly maxTokens: number;
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly injectedClient: AnthropicMessagesClient | undefined;
  private client: AnthropicMessagesClient | undefined;

  constructor(options: AnthropicProviderOptions = {}) {
    assertServerOnly();
    this.apiKey = options.apiKey ?? process.env["ANTHROPIC_API_KEY"];
    this.defaultModel = options.defaultModel ?? ANTHROPIC_MODEL_HAIKU;
    this.maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.injectedClient = options.client;
  }

  private async getClient(): Promise<AnthropicMessagesClient> {
    if (this.injectedClient) return this.injectedClient;
    if (this.client) return this.client;
    if (!this.apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. AnthropicProvider cannot make live calls without it.",
      );
    }
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    this.client = new Anthropic({ apiKey: this.apiKey }) as unknown as AnthropicMessagesClient;
    return this.client;
  }

  private static toAnthropicTools(tools: ToolDefinition[] | undefined) {
    return tools?.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema }));
  }

  async *stream(request: ChatRequest): AsyncIterable<ChatDelta> {
    const { system, turns } = splitSystemAndTurns(request.messages);
    const model = request.model ?? this.defaultModel;
    const tools = AnthropicProvider.toAnthropicTools(request.tools);

    let messageStream: AnthropicMessageStream | undefined;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries && !messageStream; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const client = await this.getClient();
        messageStream = client.messages.stream(
          { model, max_tokens: this.maxTokens, system, messages: turns, tools },
          { signal: controller.signal },
        );
      } catch (err) {
        lastError = err;
      } finally {
        clearTimeout(timeout);
      }
    }

    if (!messageStream) {
      throw lastError instanceof Error
        ? lastError
        : new Error("AnthropicProvider: failed to start stream after retries");
    }

    if (messageStream.events) {
      yield* AnthropicProvider.translateEvents(messageStream.events);
    } else {
      for await (const text of messageStream.textStream) {
        yield { type: "text", text };
      }
    }
    yield { type: "done" };
  }

  /** Anthropic's index-addressed block events → our id-addressed ChatDelta tool_use events. */
  private static async *translateEvents(events: AsyncIterable<AnthropicRawStreamEvent>): AsyncIterable<ChatDelta> {
    const toolUseIdByIndex = new Map<number, string>();

    for await (const event of events) {
      switch (event.type) {
        case "content_block_start":
          if (event.content_block.type === "tool_use") {
            toolUseIdByIndex.set(event.index, event.content_block.id);
            yield { type: "tool_use_start", id: event.content_block.id, name: event.content_block.name };
          }
          break;
        case "content_block_delta":
          if (event.delta.type === "text_delta") {
            yield { type: "text", text: event.delta.text };
          } else {
            const id = toolUseIdByIndex.get(event.index);
            if (id) yield { type: "tool_use_delta", id, partialInputJson: event.delta.partial_json };
          }
          break;
        case "content_block_stop": {
          const id = toolUseIdByIndex.get(event.index);
          if (id) yield { type: "tool_use_stop", id };
          break;
        }
        case "message_stop":
          return;
      }
    }
  }
}
