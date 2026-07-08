-- ============================================================================
-- LeapMoney — Sprint 28: MCP-compatibility hardening, applied before T4.
-- Purely additive — no existing column altered/dropped, no data migrated.
-- Lets a future tool-result turn (T9 tool registry, T30 MCP server) be stored
-- without a further schema change: a provider-agnostic 'tool' role, and a
-- pointer back to the tool_use block it answers.
-- ============================================================================

alter type ai_message_role add value if not exists 'tool';

alter table public.ai_message
  add column if not exists tool_use_id text;

comment on column public.ai_message.tool_use_id is
  'For role=''tool'' rows: the id of the tool_use block (from a prior assistant message''s tool_calls) this result answers. Null for all other roles.';

create index if not exists idx_ai_message_tool_use_id
  on public.ai_message (tool_use_id)
  where tool_use_id is not null;
