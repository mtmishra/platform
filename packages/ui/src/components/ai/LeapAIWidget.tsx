"use client";

// ── LeapAIWidget ──────────────────────────────────────────────────────────
// Sprint 29 T16 — the one portal-mountable LeapAI surface: AILauncher +
// ChatPanel + SSE client against /api/ai/chat. Portal-agnostic by props
// (endpoint/experience/prompts) so DSA/Founder/Operations mount THIS
// component with different configuration — no duplicate implementations
// (PRD §5: experiences are configuration, not systems).
//
// SSE protocol (route T8): data: {type:"meta"|"text"|"tool_use_*"|
// "tool_result"|"error"} … then data: [DONE].

import { useCallback, useRef, useState } from "react";
import { AILauncher } from "./AILauncher";
import { ChatPanel } from "./ChatPanel";
import { AIMessage, UserMessage } from "./MessageBubble";
import { AIThinking } from "./AIThinking";
import { ChatEmptyState, ChatErrorState } from "./ChatStates";

type ChatItem =
  | { kind: "user"; text: string }
  | { kind: "ai"; text: string; streaming: boolean }
  | { kind: "error"; message: string };

export interface LeapAIWidgetProps {
  /** Chat API endpoint, e.g. "/api/ai/chat". */
  endpoint: string;
  /** Experience chip label, e.g. "CUSTOMER AI" (UX §3.02). */
  experienceLabel: string;
  greeting: string;
  subtitle: string;
  suggestedPrompts: string[];
  /** amber demo-data banner (PRD Risk R1) */
  demoBanner?: boolean;
  /** thinking-verb copy map (UX §9.3); key = tool id */
  thinkingLabels?: Record<string, string>;
}

export function LeapAIWidget({
  endpoint,
  experienceLabel,
  greeting,
  subtitle,
  suggestedPrompts,
  demoBanner = false,
  thinkingLabels = {},
}: LeapAIWidgetProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ChatItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const send = useCallback(
    async (message: string) => {
      setItems((prev) => [...prev, { kind: "user", text: message }]);
      setBusy(true);
      setThinking("LeapAI is thinking…");
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, conversationId: conversationIdRef.current ?? undefined }),
        });

        if (!response.ok || !response.body) {
          const detail = response.status === 429 ? "Daily AI limit reached — resets at midnight." : undefined;
          setItems((prev) => [
            ...prev,
            { kind: "error", message: detail ?? "I couldn't reach LeapAI — please try again." },
          ]);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let aiStarted = false;

        const appendText = (text: string) => {
          setThinking(null);
          setItems((prev) => {
            const last = prev[prev.length - 1];
            if (aiStarted && last?.kind === "ai") {
              return [...prev.slice(0, -1), { kind: "ai", text: last.text + text, streaming: true }];
            }
            aiStarted = true;
            return [...prev, { kind: "ai", text, streaming: true }];
          });
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split("\n\n");
          buffer = events.pop() ?? "";
          for (const raw of events) {
            const data = raw.replace(/^data: /, "").trim();
            if (!data) continue;
            if (data === "[DONE]") continue;
            let event: { type: string; [k: string]: unknown };
            try {
              event = JSON.parse(data) as { type: string };
            } catch {
              continue;
            }
            switch (event.type) {
              case "meta":
                conversationIdRef.current = (event["conversationId"] as string) ?? conversationIdRef.current;
                break;
              case "text":
                appendText(event["text"] as string);
                break;
              case "tool_use_start": {
                const name = event["name"] as string;
                setThinking(thinkingLabels[name] ?? `Using ${name}…`);
                break;
              }
              case "error":
                setItems((prev) => [...prev, { kind: "error", message: event["message"] as string }]);
                break;
              default:
                break;
            }
          }
        }
      } catch {
        setItems((prev) => [...prev, { kind: "error", message: "Connection lost — please try again." }]);
      } finally {
        setThinking(null);
        setBusy(false);
        setItems((prev) =>
          prev.map((item) => (item.kind === "ai" ? { ...item, streaming: false } : item)),
        );
      }
    },
    [endpoint, thinkingLabels],
  );

  return (
    <>
      <AILauncher onClick={() => setOpen(true)} hidden={open} />
      <ChatPanel
        open={open}
        onClose={() => setOpen(false)}
        onSend={send}
        experienceLabel={experienceLabel}
        demoBanner={demoBanner}
        busy={busy}
      >
        {items.length === 0 && !busy ? (
          <ChatEmptyState greeting={greeting} subtitle={subtitle} prompts={suggestedPrompts} onPrompt={send} />
        ) : (
          <>
            {items.map((item, i) =>
              item.kind === "user" ? (
                <UserMessage key={i}>{item.text}</UserMessage>
              ) : item.kind === "ai" ? (
                <AIMessage key={i} streaming={item.streaming} showAvatar={items[i - 1]?.kind !== "ai"}>
                  {item.text}
                </AIMessage>
              ) : (
                <ChatErrorState key={i} message={item.message} />
              ),
            )}
            {thinking && <AIThinking label={thinking} />}
          </>
        )}
      </ChatPanel>
    </>
  );
}
