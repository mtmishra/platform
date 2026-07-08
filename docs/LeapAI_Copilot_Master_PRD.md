# LeapAI Copilot — Master PRD (Single Source of Truth)

**Version:** 1.1 (adds §2 Ecosystem & Product Architecture; renames Copilot Modules → LeapAI Experiences)
**Date:** 2026-06-22
**Status:** Approved for planning — implementation NOT started
**Owner:** CTO / Founder Office
**Supersedes:** none (first and only LeapAI PRD — do not create additional PRD files; amend this one)

---

## 1. Vision & Objectives

### 1.1 Vision

**LeapAI is not a chatbot. LeapAI is not another ChatGPT.**

LeapAI is the **central intelligence platform** that powers every customer interaction, every credit decision, every lender recommendation, every DSA workflow, and every business insight across the entire LeapMoney ecosystem. **LeapScore and LeapMatch are not separate products — they are core intelligence engines within LeapAI**, orchestrated by it and exposed through it.

The Copilot (the conversational surface specified in this document) is the first *experience* built on LeapAI: a single, role-aware AI assistant embedded in every portal (Borrower, DSA, Lender, Admin, Web) that can **explain, guide, and act** using LeapAI's engines (LeapScore, LeapMatch, credit health, applications) as tools — grounded in the user's real data, never hallucinating financial facts.

One AI system, many faces:

- A **borrower** asks "Why is my LeapScore 802 and how do I reach 850?" — the Copilot reads their real bureau report and answers with evidence.
- A **DSA** asks "Which of my 12 leads is most likely to convert this week?" — the Copilot ranks using the match engine.
- The **founder** asks "How many applications moved to underwriting today?" — the Copilot queries the snapshot tables.

### 1.2 Objectives (measurable)

| # | Objective | Metric | Target (Phase 1) |
|---|---|---|---|
| O1 | Ship Borrower Copilot grounded in real user data | Chat answers cite user's own report/application | 100% of answers tool-grounded |
| O2 | Zero hallucinated financial facts | All numbers come from tool calls, never model memory | Enforced by architecture |
| O3 | Full auditability (DPDP/RBI) | Every AI interaction logged | 100% to `audit_log` |
| O4 | Reuse existing engines, don't rebuild | New engine code written | ~0 (tools wrap existing packages) |
| O5 | Cost control | Per-user daily token budget | Configurable cap, default enforced |

### 1.3 Non-Goals

- No autonomous money movement, loan approval, or lender submission by the AI (human confirms all state-changing actions).
- No fine-tuning / custom model training.
- No replacement of the deterministic LeapScore/LeapMatch engines — the AI **explains and invokes** them; it never computes scores itself.
- No new design system — reuse `@leapmoney/ui`.

### 1.4 Guiding Principles

1. **Tools over tokens** — every factual answer must come from a tool call against real data or the knowledge base.
2. **One gateway** — no app ever calls a model provider directly.
3. **RLS everywhere** — the AI can only see what the signed-in user can see.
4. **Reuse first** — the repo already has the engines, schema, auth, and design system. LeapAI is a thin, well-governed layer on top.

---

## 2. LeapAI Ecosystem & Product Architecture

### 2.1 Where LeapAI Sits

LeapAI is the **AI Brain** of the platform — not a feature beside LeapScore/LeapMatch, but the layer that owns and orchestrates them.

```
LeapMoney Platform
      │
      ▼
LeapAI  (AI Brain — gateway, orchestration, tools, RAG, memory)
      │
      ▼
LeapScore  (Credit Intelligence Engine — packages/credit)
      │
      ▼
LeapMatch  (Lender Recommendation Engine — packages/match)
      │
      ▼
Business Applications
(Borrower portal · DSA portal · Lender portal · CRM · Loan Engine ·
 Insurance* · Mutual Funds* · Analytics · Admin)
```

Full platform map:

```
LeapMoney Platform
│
├── LeapAI (AI Brain)            ← this PRD; orchestrates everything below
│
├── LeapScore                    Credit Intelligence   (exists: packages/credit)
├── LeapMatch                    Lender Recommendation (exists: packages/match)
│
├── CRM                          Leads/DSA workflows   (partial: dsa app, snapshot tables)
├── Loan Engine                  Applications/outcomes (partial: application schema, packages/outcomes)
├── Insurance                    Future product line   (*no code yet — out of AI scope until it exists)
├── Mutual Funds                 Future product line   (*no code yet — out of AI scope until it exists)
├── Analytics                    packages/analytics + *_snapshot tables
└── Admin                        apps/admin (control tower)
```

**Everything flows through LeapAI:** any module that needs intelligence — a score, a match, an explanation, a prediction, a summary — requests it through the LeapAI layer (gateway + tools), never by embedding its own model calls. This is enforced by the single-gateway rule (§1.4, §4.2).

### 2.2 Complete Customer Journey (LeapAI-orchestrated)

```
Customer
  ↓  LeapAI understands customer intent        (Copilot chat / eligibility form NLU)
  ↓  Collect customer information              (guided by Customer AI; stored w/ consent)
  ↓  Fetch Credit Bureau                       (tool: credit.get_report → bureau adapters)
  ↓  Generate LeapScore                        (tool: credit.get_leapscore → packages/credit)
  ↓  Run LeapMatch                             (tool: match.get_matches → packages/match)
  ↓  Recommend best lender                     (ranked results, no commission bias — RBI DLG)
  ↓  Explain recommendation                    (tool: match.explain_match + score factors)
  ↓  Complete application                      (existing 7-step wizard; AI assists, human confirms)
  ↓  Track application                         (tool: application.status + proactive updates)
  ↓  Cross-sell relevant financial products    (Phase 3+; only products that exist in platform)
```

### 2.3 DSA Journey (LeapAI-orchestrated)

```
Lead
  ↓  LeapAI Qualification          (DSA AI scores/qualifies inbound lead)
  ↓  LeapScore                     (credit intelligence on the lead, with consent)
  ↓  LeapMatch                     (policy-fit across lender products)
  ↓  Best Bank Recommendation      (ranked, explained)
  ↓  Application                   (DSA files via existing flows; AI pre-fills/checks)
  ↓  Commission Tracking           (commission_snapshot; AI answers "what do I earn?")
  ↓  Performance Insights          (dsa_snapshot; AI surfaces conversion patterns)
```

### 2.4 Founder Journey (LeapAI-orchestrated)

```
Founder
  ↓  LeapAI                        (Founder AI, role-gated)
  ↓  Business Intelligence         (NL queries over admin/revenue/portfolio snapshots)
  ↓  Revenue                       (revenue_snapshot)
  ↓  Conversion                    (funnel across leads → applications → disbursal)
  ↓  Team Performance              (DSA/ops metrics)
  ↓  Forecasting                   (trend projection over snapshot history — Phase 3)
  ↓  Recommendations               (AI-suggested actions, always human-decided)
```

### 2.5 Scope Honesty (repo-grounded)

Insurance and Mutual Funds appear in the platform map as **future product lines** — the repository audit found no code for either. LeapAI will power them **when they exist**; this PRD deliberately does not spec AI for products with no underlying engine or data (see Risks R6). CRM and Loan Engine exist today as the DSA app + application schema and are covered by the DSA/Operations experiences (§5).

---

## 3. Current Repository Analysis

Evidence base: full repository audit of 2026-06-22 (git @ `9403147`).

### 3.1 What Already Exists (verified in code)

| Asset | Location | State |
|---|---|---|
| 6 Next.js 14 apps | `apps/{web,borrower,dsa,lender,admin,referral}` | Built, 93 pages, deployed to Vercel (bom1) |
| Shared UI library | `packages/ui` | Mature V3 design system |
| Credit engine | `packages/credit` | LeapScore compute, credit health, 4-bureau adapter seam (mock-backed) |
| Match engine | `packages/match` | Eligibility, approval odds, ranking |
| Lender repository | `packages/lenders` | Repository + seed data |
| Outcomes | `packages/outcomes` | Application status model |
| Supabase auth | `packages/supabase`, borrower `LoginForm` | Real OTP (`signInWithOtp`/`verifyOtp`) + demo bypass |
| **Database schema** | `supabase/migrations/0001–0019` | **28 tables with RLS**: `users_profile`, `user_consent`, `audit_log`, `application`, `application_event`, `bureau_report`, `tradeline`, `inquiry`, `lender`, `lender_product`, `score_factor`, + full `*_snapshot` set (leapscore, match, income, financial, dsa, lender, underwriting, portfolio, admin, revenue, compliance, commission, recommendation, report, health, score) |
| Analytics | `packages/analytics` | GA4 event names |
| Docs corpus | `docs/` (20 .md + phase/design/research .docx) | RAG-able, not RAG-ready |
| CI | `.github/workflows/ci.yml` | type-check / lint / build / audit |

### 3.2 What Exists as AI Today

**Nothing.** No LLM SDK in any `package.json`, no vector store, no embeddings, no chat UI, no prompt code, no agents, no MCP. `apps/web/src/app/leapai/page.tsx` is marketing copy only. This PRD is greenfield for the AI layer — but **not** greenfield for the product around it.

### 3.3 What Can Be Reused (and how)

| Existing asset | Reused as |
|---|---|
| `packages/credit` (`computeLeapScore`, `computeCreditHealth`, `BureauRegistry`) | **AI tools** `get_leapscore`, `explain_score_factors`, `get_bureau_report` |
| `packages/match` (eligibility, odds, ranking) | **AI tools** `get_matches`, `explain_match`, `check_eligibility` |
| `packages/lenders` | **AI tool** `get_lender_products` |
| `application*` tables + `packages/outcomes` | **AI tools** `get_application_status`, `list_applications` |
| `audit_log` table (exists, migration 0001) | **AI audit trail** — one row per AI interaction |
| `user_consent` table | **AI consent gate** — AI data-access consent recorded here |
| RLS policies | **Security boundary** — AI queries run as the user, never service-role for reads |
| `packages/ui` | Chat interface components built from existing primitives |
| Supabase Postgres | **Vector store** via `pgvector` extension — no new infrastructure |
| Adapter pattern (`MockBureauAdapter` seam) | Template for the **provider-agnostic AI Gateway** |
| `docs/` corpus + marketing FAQ content | **Knowledge base** source material |

### 3.4 What Needs to Be Built (net-new)

1. `packages/ai-gateway` — provider abstraction, budgets, logging (nothing like it exists).
2. `packages/ai-tools` — tool definitions wrapping existing engines.
3. API layer — `/api/ai/*` route handlers (repo currently has **no** business-logic API layer at all; this is the first).
4. RAG pipeline — pgvector migration, ingestion script, retrieval tool.
5. Chat UI — `packages/ui` additions: `ChatPanel`, `AssistantLauncher`, `MessageStream`, `ToolResultCard`, `ConfirmActionCard`.
6. Memory — `ai_conversation`, `ai_message` tables (+ RLS).
7. Prompt registry — versioned system prompts per copilot role.

### 3.5 Hard Prerequisite (from repo audit)

The portals currently read from `*-demo.ts` mock libraries, not the real schema. **A Copilot grounded in mock data is theater.** Phase 1 therefore depends on the MVP Conversion work (Supabase persistence wiring + live bureau) already planned. LeapAI Phase 1 targets the borrower portal **after** its data path is real; the RAG/KB copilot skills (product Q&A) can ship independently of that.

---

## 4. LeapAI Architecture

### 4.1 System Overview

```
┌────────────────────────────────────────────────────────────────┐
│  Portals (existing Next.js apps)                               │
│  borrower · dsa · lender · admin · web                         │
│  └── <AssistantLauncher/> + <ChatPanel/>   (packages/ui, new)  │
└───────────────┬────────────────────────────────────────────────┘
                │ POST /api/ai/chat   (streaming, per-app route)
┌───────────────▼────────────────────────────────────────────────┐
│  packages/ai-gateway  (NEW — single choke point)               │
│  • Provider adapter (Claude default; swappable like            │
│    MockBureauAdapter pattern)                                  │
│  • Auth context + role resolution (Supabase session)           │
│  • Token budgets / rate limits / cost metering                 │
│  • PII redaction pre-flight · prompt-injection guards          │
│  • Every call → audit_log                                      │
└───────┬───────────────────────┬────────────────────────────────┘
        │                       │
┌───────▼────────┐   ┌──────────▼─────────────────────────────────┐
│ Orchestrator   │   │ packages/ai-tools (NEW, thin wrappers)     │
│ (role-scoped   │──▶│ credit.* match.* lenders.* application.*   │
│ agent + prompt │   │ kb.search  (RAG)                           │
│ registry)      │   │ → existing packages + Supabase (RLS as     │
└───────┬────────┘   │   the signed-in user)                      │
        │            └────────────────────────────────────────────┘
┌───────▼────────────────────────────────────────────────────────┐
│ Supabase Postgres (existing project)                           │
│ • 28 existing tables (RLS)     • ai_conversation / ai_message  │
│ • audit_log (existing)         • kb_document / kb_chunk        │
│ • pgvector extension (new migration)                           │
└────────────────────────────────────────────────────────────────┘
```

### 4.2 AI Gateway (`packages/ai-gateway`)

The only component allowed to talk to a model provider.

- **Provider adapter interface** (mirrors the proven `MockBureauAdapter` swap pattern):
  ```ts
  interface AIProvider {
    stream(req: ChatRequest): AsyncIterable<ChatDelta>;
    name: "anthropic" | "mock";
  }
  ```
  Default provider: **Anthropic Claude** — `claude-opus-4-8` for reasoning-heavy copilots (Credit, Founder), `claude-haiku-4-5` for high-volume chat (Borrower FAQ, DSA). A `MockAIProvider` ships first so UI and tests never depend on live keys (same discipline as the bureau layer).
- **Responsibilities:** API-key custody (server-only env), retries/timeouts, per-user + per-org token budgets, cost metering per call, model routing by copilot role, structured logging → `audit_log`.
- **Hard rule:** no `dangerouslyAllowBrowser`, no client-side keys, no app imports a provider SDK directly.

### 4.3 Multi-Agent System

Deliberately simple: **one orchestrator, role-scoped agent profiles** — not a swarm.

- An *agent profile* = system prompt (from prompt registry) + allowed toolset + model + budget.
- Profiles: `borrower`, `dsa`, `credit`, `sales`, `operations`, `founder` (§5).
- The orchestrator resolves the profile from the authenticated user's role (`users_profile.role`) and the app the request came from. A borrower can never invoke the founder profile — enforced server-side, not by prompt.
- Sub-agent delegation (agent calling agent) is **out of scope until Phase 3**; until then, one agent with good tools beats many agents with coordination overhead.

### 4.4 Tool Calling

Tools are the contract between the AI and reality. All tools live in `packages/ai-tools`, are pure wrappers, and declare a required role.

| Tool | Wraps | Roles |
|---|---|---|
| `credit.get_report` | `bureau_report`/`tradeline` tables (or adapter) | borrower, credit |
| `credit.get_leapscore` | `packages/credit` compute + `leapscore_snapshot` | borrower, dsa, credit, founder |
| `credit.explain_factors` | `score_factor` table | borrower, credit |
| `match.get_matches` | `packages/match` ranking | borrower, dsa, sales |
| `match.explain_match` | match reason data | borrower, dsa |
| `application.list` / `application.status` | `application`, `application_event` | borrower, dsa, ops |
| `application.next_steps` | `packages/outcomes` status model | borrower, dsa, ops |
| `lenders.get_products` | `packages/lenders` | dsa, sales, credit |
| `metrics.snapshot` | `admin/revenue/portfolio/*_snapshot` tables | founder, ops |
| `kb.search` | RAG retrieval (§4.5) | all |

Rules:

1. Read tools run under the **user's own Supabase session** (RLS enforced by the database, not by prompt).
2. State-changing tools (Phase 2+: `application.create_draft`, `documents.request`) always return a **confirmation card** — the human clicks, the app (not the model) executes.
3. Every tool invocation is logged (tool, args-hash, user, latency) to `audit_log`.

### 4.5 RAG / Knowledge Base

- **Store:** `pgvector` extension on the existing Supabase Postgres. New tables `kb_document` (source, title, url, checksum) and `kb_chunk` (document_id, content, embedding, metadata). No new infrastructure vendor.
- **Corpus (Phase 1):** product pages content (loan types, LeapScore/LeapMatch explainers, FAQ blocks already written in `apps/web`), legal/compliance pages (fair practices, grievance), `docs/research/*.md`. Phase 2 adds phase-doc `.docx` extracts and SOPs.
- **Ingestion:** repo script `scripts/kb-ingest.ts` (chunk → embed → upsert), run manually/CI on content change. Embeddings via the gateway (Voyage or provider embedding endpoint) — same audit path.
- **Retrieval:** `kb.search(query, top_k)` tool; answers must cite the source document. If retrieval confidence is low, the Copilot says "I don't have that in my knowledge base" — it does not guess.

### 4.6 Memory

Two tiers, both in Postgres with RLS (`user_id = auth.uid()`):

- **Thread memory:** `ai_conversation` (id, user_id, app, agent_profile, created_at) + `ai_message` (conversation_id, role, content, tool_calls, tokens, created_at). Powers multi-turn context; conversations resumable across sessions.
- **User memory (Phase 2):** small structured facts (stated goals: "wants home loan by Dec", preferences) stored as rows, injected into the system prompt. Never store raw PAN/report data in memory — tools re-fetch live data instead.
- Retention: align with `user_consent`; user-visible "delete my AI history" required for DPDP (hard delete).

### 4.7 MCP Integration

Phase 3. Once the internal toolset is stable, expose it as an **MCP server** (`packages/ai-mcp`) so the same `credit.*` / `match.*` / `kb.*` tools are consumable by external agent clients (Claude Desktop for internal ops, partner integrations). Internal-only MCP first (service auth); external exposure requires a separate security review. Not a Phase 1/2 concern — the tool schema in §4.4 is designed to map 1:1 to MCP tools so no rework is needed.

---

## 5. LeapAI Experiences

These are **not separate AI systems**. Every experience below is the same LeapAI platform — one gateway, one orchestrator, one toolset — surfaced with a different agent profile (prompt + toolset + surface). No per-experience codebases.

| Experience | Surface | Core jobs | Key tools | Phase |
|---|---|---|---|---|
| **Customer AI** | Borrower portal floating assistant | Explain my score/report; why this DPD hurts; what improves approval odds; where is my application; product Q&A | `credit.*`, `match.*`, `application.*`, `kb.search` | **1** |
| **DSA AI** | DSA portal assistant | Lead prioritization ("who converts?"), lender-product lookup, commission questions, application chasing | `match.*`, `lenders.*`, `application.*`, `kb.search`, dsa snapshots | 2 |
| **Sales AI** | Web + internal | Qualify inbound leads, draft follow-ups (WhatsApp/email copy), objection answers from KB | `match.get_matches`, `lenders.*`, `kb.search` | 2 |
| **Credit AI** | Lender/underwriting portal | Summarize applicant file, flag anomalies across bureau data, policy-fit explanation | `credit.*`, `application.*`, underwriting snapshots | 2 |
| **Operations AI** | Admin portal | Application-pipeline queries, stuck-application detection, compliance checklist answers | `application.*`, `metrics.snapshot`, `kb.search` | 3 |
| **Founder AI** | Admin portal (role-gated) | Natural-language business questions over snapshot tables ("revenue this week?", "conversion by lender?") | `metrics.snapshot` (all), `kb.search` | 3 |

Insurance / Mutual Fund copilots (from earlier product audit): **explicitly out of scope** — no underlying product exists in the repo to ground them. Revisit when those product lines exist.

---

## 6. UI/UX Flow

Reuse `@leapmoney/ui` primitives and the existing V3 visual language. No redesign of any current screen.

### 6.1 Global AI Assistant

- **`<AssistantLauncher/>`** — floating button, bottom-right, on every authenticated page (mirrors the existing `NotificationCenter` placement pattern in the borrower dashboard). Keyboard: `⌘K` / `Ctrl+K` opens it (doubles as command palette entry — Phase 2).
- Collapsed → pill with LeapAI mark; expanded → `<ChatPanel/>` as right-side drawer (desktop) / full-height sheet (mobile). Mobile-first, consistent with existing responsive patterns.

### 6.2 Chat Interface

Components (new, in `packages/ui`):

- `ChatPanel` — header (agent name, conversation switcher, close), message list, composer.
- `MessageStream` — streaming assistant text (token stream from gateway).
- `ToolResultCard` — structured render of tool output; **reuses existing widgets** (score gauge, match card, application status badge) so the AI's answers look native, not like a bot pasted text.
- `SourceCitation` — chip linking to the KB doc/page an answer came from.
- `ConfirmActionCard` — for state-changing suggestions: shows exactly what will happen + Confirm/Cancel buttons; the button triggers the normal app mutation path, never the model.
- Empty state: 3–4 role-relevant suggested prompts ("Explain my LeapScore", "What's blocking my HDFC application?").

Trust rules baked into UI: assistant always labeled "LeapAI"; disclaimer footer ("Not financial advice; verify before acting"); every number visually tied to a tool card or citation.

### 6.3 Dashboard Integration

- **Contextual entry points** (Phase 1–2): "Explain this ↗" affordance on existing widgets — LeapScore card, match card, application timeline — opens the ChatPanel pre-seeded with that context (widget id + entity id passed as tool-call context, not as pasted text).
- **Proactive insights** (Phase 3): AI-authored insight cards on the dashboard (e.g., "Your utilization dropped 6% — score likely to rise") — generated server-side on snapshot updates, rendered with existing card components, each with "Ask more" → chat.

---

## 7. Technical Architecture

### 7.1 New Packages

```
packages/
  ai-gateway/     provider adapters (anthropic, mock), budgets, redaction,
                  audit logging, streaming
  ai-tools/       tool registry: zod-schema'd tools wrapping credit/match/
                  lenders/outcomes/supabase queries + kb.search
  ai-prompts/     versioned agent-profile system prompts (ts constants,
                  reviewed via PR — no runtime prompt editing in Phase 1)
```

(Phase 3: `ai-mcp/` — MCP server exposing `ai-tools`.)

### 7.2 APIs (first business-logic API layer in the repo)

Next.js route handlers per app (thin — all logic in packages):

| Route | Method | Purpose |
|---|---|---|
| `/api/ai/chat` | POST (stream) | Main chat turn: auth → profile → orchestrate → stream |
| `/api/ai/conversations` | GET | List user's conversations |
| `/api/ai/conversations/[id]` | GET / DELETE | History / DPDP delete |
| `/api/ai/feedback` | POST | 👍/👎 + comment per message |

Auth: existing Supabase session middleware (already present in borrower app) — reused, not rebuilt. Rate limit: per-user sliding window in the gateway (Postgres-backed counter; no Redis dependency in Phase 1).

### 7.3 Database Additions (new migrations, continuing `0020+`)

```sql
-- 0020_ai_extension.sql        create extension if not exists vector;
-- 0021_ai_conversations.sql    ai_conversation, ai_message (+ RLS: owner-only)
-- 0022_ai_kb.sql               kb_document, kb_chunk(embedding vector(1024))
--                              + ivfflat index (+ RLS: authenticated read)
-- 0023_ai_usage.sql            ai_usage(user_id, day, tokens_in, tokens_out,
--                              cost_micros) for budgets (+ RLS)
```

No changes to any existing table. AI audit rows go to the **existing** `audit_log`.

### 7.4 Integration with Existing Packages

- `ai-tools` imports `@leapmoney/credit`, `@leapmoney/match`, `@leapmoney/lenders`, `@leapmoney/outcomes`, `@leapmoney/supabase` — engines untouched.
- While portals are still mock-backed, `ai-tools` reads the same source the UI reads (demo libs behind a flag), flipping to Supabase queries the moment the MVP persistence wiring lands — the tool interface doesn't change, only its implementation (adapter pattern again).
- `packages/analytics`: new events `ai_chat_opened`, `ai_message_sent`, `ai_tool_called`, `ai_feedback`.
- CI: new packages join the existing turbo `type-check`/`lint`/`build` graph automatically.

### 7.5 Environment / Secrets

`ANTHROPIC_API_KEY` (server-only, Vercel env), `AI_PROVIDER` (`anthropic|mock`), `AI_DAILY_TOKEN_BUDGET_USER`. Added to `.env.example`; never client-exposed.

---

## 8. Development Roadmap

### Phase 1 — Borrower Copilot MVP (~3–4 weeks eng)

*Goal: one real, grounded, audited copilot in production behind a flag.*

1. `ai-gateway` with `MockAIProvider` + Anthropic provider; `/api/ai/chat` streaming; budgets + audit logging.
2. Migrations 0020–0023; `ai-prompts` with `borrower` profile.
3. `ai-tools` v1: `credit.get_leapscore`, `credit.explain_factors`, `match.get_matches`, `application.status`, `kb.search`.
4. KB ingestion of web product/FAQ/legal content.
5. `ChatPanel` + `AssistantLauncher` in `packages/ui`; mounted in borrower portal only, feature-flagged.
6. Exit criteria: borrower asks score/match/application/product questions → tool-grounded, cited, streamed answers; every turn in `audit_log`; mock provider passes CI without keys.

**Dependency note:** ships against demo-data reads if persistence wiring isn't done; flips to real data with zero tool-interface change when it is. Do not block Phase 1 on the bureau vendor.

### Phase 2 — Multi-role + Actions (~4 weeks)

1. DSA, Sales, Credit profiles + role-scoped toolsets; launcher in dsa/lender portals.
2. Contextual "Explain this" entry points on dashboard widgets.
3. First confirmed actions: `application.create_draft`, `documents.request` (ConfirmActionCard flow).
4. User memory (structured facts) + conversation resume; `⌘K` command palette.
5. KB expansion: phase-doc extracts, SOPs; feedback loop (👍/👎) wired to review queue.

### Phase 3 — Ops/Founder + Platform (~4 weeks)

1. Operations + Founder profiles over snapshot tables (NL business queries).
2. Proactive insight cards (server-generated on snapshot updates).
3. `ai-mcp` internal MCP server exposing the toolset.
4. Evaluation harness (golden-question set per profile, run in CI with mock + sampled live).
5. Cost/quality dashboards from `ai_usage` in the admin portal.

---

## 9. Risks & Recommendations

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | **Mock-data grounding** — Copilot ships while portals read demo data; users may believe fake numbers are real | High | Feature-flag to internal/demo accounts until persistence wiring lands; visible "demo data" banner in ChatPanel when flag active |
| R2 | Hallucinated financial claims | High | Architecture rule O2: numbers only from tools/citations; refusal fallback on low retrieval confidence; golden-question evals in CI |
| R3 | PII to model provider (DPDP) | High | Gateway redaction (PAN/Aadhaar/phone masked before provider call); India data residency for stored data (Supabase Mumbai — already the case); DPA review of provider terms before prod keys |
| R4 | Prompt injection via user content / KB | Medium | Tool allow-lists per role enforced server-side; no tool executes state changes without human confirm; KB content sanitized at ingestion |
| R5 | Cost runaway | Medium | Per-user daily budgets in gateway (`ai_usage`), Haiku-by-default routing, Opus only for credit/founder profiles |
| R6 | Scope creep to 10 copilots at once | Medium | This PRD fixes scope: 6 profiles, 3 phases; Insurance/MF explicitly out |
| R7 | No existing API layer — first one built here | Medium | Keep route handlers thin; logic in packages; covered by existing CI |
| R8 | Team size vs. plan | Medium | Phases are strictly sequential; Phase 1 alone is a complete, shippable product |

**Recommendations (CTO):**

1. Treat this document as the **only** LeapAI source of truth; changes by PR to this file.
2. Build `MockAIProvider` first — the whole system must run in CI with no API keys (proven pattern from the bureau layer).
3. Do not start Phase 2 until Phase 1 exit criteria are demonstrably met on real (non-demo) data for at least internal users.
4. Run the DPDP/provider-DPA review in parallel with Phase 1 engineering — it is the longest non-engineering lead item.

---

*End of Master PRD — LeapAI Copilot v1.0*
