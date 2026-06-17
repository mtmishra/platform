# Development Rules

## Monorepo Rules

- Always run commands from the repo root using `pnpm` scripts
- Never run `npm install` or `yarn` — use `pnpm` only
- Add shared code to `packages/`, not duplicated across apps
- Workspace dependencies use `workspace:*` — never pin versions for internal packages

## TypeScript Rules

- `strict: true` is enforced — no exceptions
- `noUnusedLocals` and `noUnusedParameters` are enabled — clean up before committing
- No `any` types — use `unknown` and narrow, or define proper types in `packages/types`
- All new types shared across apps go into `packages/types/src/`

## Next.js Rules

- Use App Router only — no Pages Router
- Server Components by default — add `"use client"` only when necessary
- All environment variables accessed server-side must NOT be prefixed `NEXT_PUBLIC_`
- Client-side env vars must be prefixed `NEXT_PUBLIC_`
- Never hardcode secrets, API keys, or URLs — always use environment variables

## Git Rules

- Branch from `develop` for all feature work
- Branch naming: `feature/`, `fix/`, `chore/`, `docs/`
- Never commit directly to `main` or `develop`
- Never commit `.env.local` or any file containing real secrets
- Commit messages: imperative present tense ("Add login page", not "Added login page")

## Supabase Rules

- Use the shared client from `packages/supabase` — never initialise Supabase directly in apps
- Row Level Security (RLS) must be enabled on all tables
- Never expose the `service_role` key to the client

## Styling Rules

- Tailwind CSS only — no inline styles, no CSS modules (unless unavoidable)
- Use the shared Tailwind config from `packages/config/tailwind`
- Component variants go in `packages/ui` — not per-app

## Compliance Rules (Non-Negotiable)

- No PII in logs or error messages
- All user data stored in AWS Mumbai (ap-south-1) — no cross-region replication to outside India
- KYC document handling must follow RBI Digital Lending Guidelines 2022
- Loan agreement generation must include all FAIR Practices Code disclosures

## Testing Rules

- Unit tests alongside source files (`*.test.ts`)
- Integration tests in `__tests__/` at app root
- Do not mock the database in integration tests
- Minimum coverage target: 80% for `packages/`, 60% for `apps/`
