-- ============================================================================
-- LeapMoney — Sprint 28: LeapAI database foundation, part 1/4.
-- Enables pgvector on the existing Supabase Postgres project. No new vendor —
-- RAG storage lives in the same database as every other table (LeapAI Master
-- PRD v1.1 §4.5, §7.3).
-- ============================================================================

create extension if not exists "vector";

comment on extension vector is
  'pgvector — embedding storage/search for LeapAI RAG (kb_chunk.embedding). Enabled Sprint 28 / T3, no new infra vendor.';
