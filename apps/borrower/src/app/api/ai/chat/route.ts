// ── POST /api/ai/chat ─────────────────────────────────────────────────────
// Sprint 28 T8 — PRD §7.2. The platform's first business-logic API route:
// auth → budget → conversation persistence → audited/redacted provider
// stream → SSE out → assistant turn persisted + usage recorded.
//
// SSE events: {type:"meta"} once (conversation id), then gateway ChatDeltas
// verbatim, then [DONE]. Errors mid-stream emit {type:"error"} then close —
// the client renders the honest-failure state (Conversation OS E-16).

import { NextResponse, type NextRequest } from "next/server";
import { getSystemPrompt, getModelForProfile, PROMPT_VERSION } from "@leapmoney/ai-prompts";
import type { ChatMessage } from "@leapmoney/ai-gateway";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createAuditedProvider,
  createBudgetManager,
  estimateTokens,
} from "@/lib/ai/gateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 2_000; // UX §3.17 composer guard, enforced server-side
const HISTORY_TURNS = 20;

interface ChatBody {
  message?: string;
  conversationId?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  const supabase = createSupabaseServerClient();

  // ── Auth ──────────────────────────────────────────────────────────────
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("users_profile")
    .select("id, role, full_name")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "profile_not_found" }, { status: 403 });
  }

  // ── Input ─────────────────────────────────────────────────────────────
  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json({ error: "message_required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: "message_too_long", max: MAX_MESSAGE_CHARS }, { status: 400 });
  }

  // ── Budget (T5) — pre-flight, structured denial ───────────────────────
  const budget = createBudgetManager(supabase);
  const decision = await budget.check(profile.id);
  if (!decision.allowed) {
    return NextResponse.json(
      { error: decision.reason, resetsAt: decision.resetsAt },
      { status: 429 },
    );
  }

  // ── Conversation (T3 schema) ──────────────────────────────────────────
  let conversationId = body.conversationId ?? null;
  if (conversationId) {
    const { data: owned } = await supabase
      .from("ai_conversation")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", profile.id)
      .maybeSingle();
    if (!owned) {
      return NextResponse.json({ error: "conversation_not_found" }, { status: 404 });
    }
  } else {
    const { data: created, error } = await supabase
      .from("ai_conversation")
      .insert({ user_id: profile.id, app: "borrower", agent_profile: "borrower" })
      .select("id")
      .single();
    if (error || !created) {
      return NextResponse.json({ error: "conversation_create_failed" }, { status: 500 });
    }
    conversationId = created.id;
  }

  // Persist the user turn (append-only per RLS).
  await supabase.from("ai_message").insert({
    conversation_id: conversationId,
    role: "user",
    content: message,
  });

  // ── History → provider request ────────────────────────────────────────
  const { data: history } = await supabase
    .from("ai_message")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(HISTORY_TURNS);

  const model = getModelForProfile("borrower");
  const messages: ChatMessage[] = [
    { role: "system", content: getSystemPrompt("borrower", { lifecycle: "existing" }) },
    ...(history ?? [])
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];
  // Ensure the new message is present even if the persistence read lagged.
  if (messages[messages.length - 1]?.content !== message) {
    messages.push({ role: "user", content: message });
  }

  const provider = createAuditedProvider(supabase, profile.id, "borrower", conversationId);

  // ── Stream (SSE) ──────────────────────────────────────────────────────
  const encoder = new TextEncoder();
  const finalConversationId = conversationId;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      let assistantText = "";
      try {
        send({ type: "meta", conversationId: finalConversationId, promptVersion: PROMPT_VERSION });
        for await (const delta of provider.stream({ messages, model })) {
          if (delta.type === "text") assistantText += delta.text;
          send(delta);
        }
      } catch (error) {
        send({
          type: "error",
          message: "Something broke on my side — nothing you entered is lost.",
          detail: error instanceof Error ? error.name : "unknown",
        });
      } finally {
        // Post-stream persistence: failures logged, never surfaced as a broken stream.
        try {
          if (assistantText.length > 0) {
            await supabase.from("ai_message").insert({
              conversation_id: finalConversationId,
              role: "assistant",
              content: assistantText,
              provider: process.env["AI_PROVIDER"] === "anthropic" ? "anthropic" : "mock",
              model,
              tokens_in: estimateTokens(message),
              tokens_out: estimateTokens(assistantText),
            });
            await budget.record(profile.id, {
              tokensIn: estimateTokens(message),
              tokensOut: estimateTokens(assistantText),
              costMicros: 0,
            });
          }
        } catch (persistError) {
          // eslint-disable-next-line no-console
          console.warn("[api/ai/chat] post-stream persistence failed", persistError);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
