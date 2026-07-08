-- ============================================================================
-- LeapMoney — Sprint 28: LeapAI database foundation, part 3/4.
-- Knowledge base for RAG (Master PRD v1.1 §4.5). Platform-owned content
-- (product/FAQ/legal/research docs) — not user-owned, so RLS here follows the
-- catalog-table pattern (public.lender): readable by any authenticated user,
-- writable only by admin / the service-role ingestion script.
-- ============================================================================

-- ── kb_document ───────────────────────────────────────────────────────────────
create table if not exists public.kb_document (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  source      text not null,                        -- e.g. 'web_page' | 'legal_doc' | 'research_doc'
  url         text,                                  -- source URL or repo path, nullable
  checksum    text not null,                         -- content hash, drives idempotent re-ingest (scripts/kb-ingest.ts)
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.kb_document is
  'One row per ingested knowledge-base source document. Platform-owned, not user-owned — see RLS below.';
comment on column public.kb_document.checksum is
  'Content hash of the source document. Re-ingestion compares this before re-embedding, per Master PRD §4.5 ingestion script.';

create unique index if not exists idx_kb_document_checksum on public.kb_document (checksum);

create trigger trg_kb_document_updated_at
  before update on public.kb_document
  for each row execute function set_updated_at();

-- ── kb_chunk ──────────────────────────────────────────────────────────────────
create table if not exists public.kb_chunk (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references public.kb_document (id) on delete cascade,
  chunk_index  integer not null default 0,
  content      text not null,
  embedding    vector(1024),                         -- nullable until the embedding step of ingestion completes
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

comment on table public.kb_chunk is
  'One row per embedded chunk of a kb_document. embedding is nullable so a chunk can be inserted before its embedding is computed.';
comment on column public.kb_chunk.chunk_index is
  'Position of this chunk within its parent document, for ordered reconstruction / citation context.';
comment on column public.kb_chunk.embedding is
  'pgvector embedding, dimension 1024. Queried by kb.search (Master PRD §4.4) via cosine distance.';

create index if not exists idx_kb_chunk_document on public.kb_chunk (document_id, chunk_index);

-- ivfflat requires a lists parameter; 100 is a reasonable default for a
-- knowledge base in the low tens-of-thousands of chunks range and can be
-- rebuilt with a higher value later without a schema change.
create index if not exists idx_kb_chunk_embedding
  on public.kb_chunk
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- ── RLS: readable by any authenticated user; writable only by admin ───────────
alter table public.kb_document enable row level security;
alter table public.kb_chunk enable row level security;

create policy "kb_document_select_all"
  on public.kb_document for select
  using (auth.uid() is not null);

create policy "kb_document_admin_write"
  on public.kb_document for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy "kb_chunk_select_all"
  on public.kb_chunk for select
  using (auth.uid() is not null);

create policy "kb_chunk_admin_write"
  on public.kb_chunk for all
  using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');
-- Note: the ingestion script (scripts/kb-ingest.ts) runs with the Supabase
-- service-role key, which bypasses RLS entirely — the admin_write policy
-- above covers the case of an admin managing KB content through the app.
