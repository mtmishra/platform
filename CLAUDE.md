# LeapMoney Platform — Claude Code Guide

## Project Overview

LeapMoney is an AI-powered Indian loan marketplace with three user portals: Borrower, DSA (Direct Selling Agent), and Lender. The core engine is **LeapMatch AI** — an eligibility-matching system that pre-screens borrowers against lender policies.

## Repository Structure

```
platform/
├── apps/
│   ├── web/          # Marketing site (port 3000)
│   ├── borrower/     # Borrower portal (port 3001)
│   ├── dsa/          # DSA portal (port 3002)
│   ├── lender/       # Lender portal (port 3003)
│   ├── admin/        # Admin dashboard (port 3004)
│   └── referral/     # Referral portal (port 3005)
├── packages/
│   ├── ui/           # Shared React component library
│   ├── types/        # Shared TypeScript types
│   ├── supabase/     # Supabase client & helpers
│   ├── analytics/    # Analytics utilities
│   └── config/       # Shared ESLint & Tailwind config
├── docs/
│   ├── phases/       # Phase 1–12 specification documents
│   ├── audits/       # Audit reports
│   └── sprints/      # Sprint backlogs and execution reports
├── .claude/          # Claude Code project context
├── CLAUDE.md         # This file
└── .env.example      # Environment variable reference
```

## Tech Stack

- **Monorepo:** pnpm workspaces + Turborepo
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL) — AWS Mumbai region
- **Auth:** Supabase Auth
- **Payments:** Razorpay
- **Analytics:** Google Analytics 4

## Getting Started

```bash
pnpm install
pnpm dev
```

## Key Rules

- Read `.claude/DEVELOPMENT_RULES.md` before making any code changes
- Read `.claude/CURRENT_SPRINT.md` to understand active sprint scope
- Read `.claude/PROJECT_CONTEXT.md` for business and regulatory context
- Never commit `.env.local` files
- All data must be stored in India (AWS Mumbai / ap-south-1)

## Regulatory Context

India-specific compliance required:
- RBI Digital Lending Guidelines 2022
- DPDP Act 2023
- FAIR Practices Code

## Specification Documents

All PRD and architecture documents are in `docs/`. Phase documents are the source of truth for features.
