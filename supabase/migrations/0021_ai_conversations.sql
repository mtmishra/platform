-- ============================================================================
-- LeapMoney — Sprint 28: LeapAI database foundation, part 2/4.
-- Conversation + message memory (LeapAI Master PRD v1.1 §4.6, §7.3). Two-tier
-- memory: ai_conversation is the thread, ai_message is each turn. RLS scopes
-- everything to the owning user — the AI can only ever see what the signed-in
-- user can see (Master PRD §4.4 rule 1).
-- ============================================================================

-- ── ai_agent_profile ─────────────────────────────────────────────────────────
-- One enum value per LeapAI Experience (Master PRD v1.1 §5 — Customer/DSA/
-- Sales/Credit/Operations/Founder AI). Extending to a new experience later is
-- an ALTER TYPE, same friction as the existing app_role enum — no redesign.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'ai_agent_profile') then
    create type ai_agent_profile as enum ('borrower', 'dsa', 'credit', 'sales', 'operations', 'founder');
  end if;
  if not exists (select 1 from pg_type where typname = 'ai_message_role') then
    create type ai_message_role as enum ('system', 'user', 'assistant');
  end if;
end $$;

-- ── ai_conversation ──────────────────────────────────────────────────────────
create table if not exists public.ai_conversation (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users_profile (id) on delete cascade,
  app            text not null,                     -- portal the conversation started in: borrower | dsa | lender | admin | web
  agent_profile  ai_agent_profile not null,          -- which LeapAI Experience this thread is scoped to
  title          text,                               -- optional short label (AI-generated summary or null)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

comment on table public.ai_conversation is
  'LeapAI conversation thread — one row per chat session. Deleting a row cascades to ai_message (DPDP hard-delete path).';
comment on column public.ai_conversation.app is
  'Portal the conversation was started from: borrower | dsa | lender | admin | web.';
comment on column public.ai_conversation.agent_profile is
  'LeapAI Experience scoping this thread (Master PRD §5) — determines prompt + allowed toolset.';
comment on column public.ai_conversation.title is
  'Optional short label for the conversation list; null until the AI or user names it.';

create index if not exists idx_ai_conversation_user on public.ai_conversation (user_id, updated_at desc);

create trigger trg_ai_conversation_updated_at
  before update on public.ai_conversation
  for each row execute function set_updated_at();

-- ── ai_message ────────────────────────────────────────────────────────────────
-- Append-only (no UPDATE/DELETE policy) — a turn is written once and never
-- edited, matching the audit_log/user_consent convention.
create table if not exists public.ai_message (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversation (id) on delete cascade,
  role            ai_message_role not null,
  content         text not null,
  tool_calls      jsonb,                             -- nullable array of {tool, args, result} — Master PRD §4.4 tool registry
  provider        text,                               -- 'mock' | 'anthropic' | future 'openai' | 'gemini' — nullable for user-authored rows
  model           text,                               -- provider-specific model id, e.g. claude-haiku-4-5-20251001
  tokens_in       integer,
  tokens_out      integer,
  created_at      timestamptz not null default now()
);

comment on table public.ai_message is
  'One row per conversation turn. Append-only — never updated after insert. provider/model columns let a future OpenAI/Gemini provider slot in without a schema change.';
comment on column public.ai_message.tool_calls is
  'Array of {tool, args, result} for assistant turns that invoked ai-tools (Master PRD §4.4). Null for plain text turns.';
comment on column public.ai_message.provider is
  'Which AIProvider produced this message (mock | anthropic | ...). Null for user-authored messages.';
comment on column public.ai_message.model is
  'Provider-specific model id used for this turn, for cost/audit reconciliation with ai_usage.';

create index if not exists idx_ai_message_conversation on public.ai_message (conversation_id, created_at);

-- ── RLS ───────────────────────────────────────────────────────────────────────
alter table public.ai_conversation enable row level security;
alter table public.ai_message enable row level security;

create policy "ai_conversation_select_own"
  on public.ai_conversation for select
  using (user_id = public.current_profile_id());

create policy "ai_conversation_insert_own"
  on public.ai_conversation for insert
  with check (user_id = public.current_profile_id());

create policy "ai_conversation_update_own"
  on public.ai_conversation for update
  using (user_id = public.current_profile_id())
  with check (user_id = public.current_profile_id());

create policy "ai_conversation_delete_own"
  on public.ai_conversation for delete
  using (user_id = public.current_profile_id());
-- DELETE is intentionally allowed (unlike audit_log/user_consent) — DPDP
-- gives the user the right to erase their own AI conversation history
-- (Master PRD §4.6, User Story US4).

create policy "ai_message_select_own"
  on public.ai_message for select
  using (
    conversation_id in (
      select id from public.ai_conversation where user_id = public.current_profile_id()
    )
  );

create policy "ai_message_insert_own"
  on public.ai_message for insert
  with check (
    conversation_id in (
      select id from public.ai_conversation where user_id = public.current_profile_id()
    )
  );
-- No UPDATE/DELETE policy on ai_message — deleting the parent ai_conversation
-- (allowed above) cascades and removes its messages; individual turns are
-- otherwise immutable.
