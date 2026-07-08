// ── AnthropicProvider ─────────────────────────────────────────────────────
// PRD §4.2. Talks to Anthropic's Messages API. Server-only — the guard below
// is a runtime safety net, not a substitute for keeping this out of client
// bundles (route it through /api/ai/* only).
//
// Model routing: haiku-4-5 by default (high-volume chat profiles), opus-4-8
// for reasoning-heavy profiles (Credit AI, Founder AI) via `request.model`.

import type { AIProvider, ChatDelta, ChatMessage, ChatRequest } from "../types";

export const ANTHROPIC_MODEL_HAIKU = "claude-haiku-4-5-20251001";
export const ANTHROPIC_MODEL_OPUS = "claude-opus-4-8";

const DEFAULT_MAX_TOKENS = 1024;
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;

/**
 * Minimal shape of the Anthropic SDK surface this provider needs, kept
 * narrow so tests can inject a fake client with zero network/API-key cost.
 */
export interface AnthropicMessageStream {
  textStream: AsyncIterable<string>;
}
export interface AnthropicMessagesClient {
  messages: {
    stream(
      params: {
        model: string;
        max_tokens: number;
        system?: string | undefined;
        messages: { role: "user" | "assistant"; content: string }[];
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

function splitSystemAndTurns(messages: ChatMessage[]): {
  system: string | undefined;
  turns: { role: "user" | "assistant"; content: string }[];
} {
  const system = messages.find((m) => m.role === "system")?.content;
  const turns = messages
    .filter((m): m is ChatMessage & { role: "user" | "assistant" } => m.role !== "system")
    .map((m) => ({ role: m.role, content: m.content }));
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

  async *stream(request: ChatRequest): AsyncIterable<ChatDelta> {
    const { system, turns } = splitSystemAndTurns(request.messages);
    const model = request.model ?? this.defaultModel;

    let messageStream: AnthropicMessageStream | undefined;
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries && !messageStream; attempt++) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const client = await this.getClient();
        messageStream = client.messages.stream(
          { model, max_tokens: this.maxTokens, system, messages: turns },
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

    for await (const text of messageStream.textStream) {
      yield { type: "text", text };
    }
    yield { type: "done" };
  }
}
