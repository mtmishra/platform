# LeapMoney Platform

India's most intelligent AI-powered loan marketplace — connecting borrowers with the right lenders through LeapScore credit intelligence and LeapMatch AI matching.

---

## Live URLs

| Portal | URL |
|---|---|
| Marketing Website | https://web-98zz131bn-leapmoney.vercel.app |
| Borrower Portal | https://leapmoney-borrower-44iqlz8v8-leapmoney.vercel.app |
| DSA Portal | https://leapmoney-iukgmapi9-leapmoney.vercel.app |
| Lender Portal | https://leapmoney-lender-7unrs7jf3-leapmoney.vercel.app |
| Admin Tower | https://leapmoney-admin-ow62a16ym-leapmoney.vercel.app |

> All portals run in **demo mode** — no real backend required.

---

## Architecture

```
platform/                        ← pnpm monorepo + Turborepo
├── apps/
│   ├── web/        (port 3000)  ← Marketing site (Next.js, static export)
│   ├── borrower/   (port 3001)  ← Borrower portal (Next.js + Supabase auth)
│   ├── dsa/        (port 3002)  ← DSA portal (Next.js, SSR)
│   ├── lender/     (port 3003)  ← Lender portal (Next.js, SSR)
│   ├── admin/      (port 3004)  ← Admin control tower (Next.js, SSR)
│   └── referral/   (port 3005)  ← Referral stub
└── packages/
    ├── ui/          ← 33 shared React components
    ├── credit/      ← LeapScore v2 engine + bureau adapters
    ├── match/       ← LeapMatch AI engine (eligibility, approval odds, ranking)
    ├── lenders/     ← 65-lender seed database
    ├── demo-data/   ← Canonical demo platform aggregates
    ├── supabase/    ← DB client, auth helpers, typed schema
    ├── analytics/   ← Consent-gated GA4 event taxonomy
    ├── outcomes/    ← Application outcome tracking
    ├── types/       ← Shared TypeScript enums
    └── config/      ← Shared ESLint + Tailwind config
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS |
| Monorepo | pnpm workspaces + Turborepo |
| Database | Supabase (PostgreSQL, ap-south-1 Mumbai) |
| Auth | Supabase Auth (SSR) |
| Deployment | Vercel (bom1 region, Mumbai) |

---

## Local Setup

**Requirements:** Node ≥ 22, pnpm ≥ 9

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Apps start at ports 3000–3005. Demo mode works without Supabase — all portals fall back to mock data when `NEXT_PUBLIC_SUPABASE_URL` is unset.

---

## Commands

```bash
pnpm dev          # Start all apps
pnpm build        # Build all apps
pnpm type-check   # TypeScript check
pnpm lint         # ESLint
pnpm clean        # Remove build output
```

Run a single app:
```bash
pnpm --filter @leapmoney/web dev
pnpm --filter @leapmoney/borrower build
```

---

## Database

19 Supabase migrations in `supabase/migrations/`. Apply with:
```bash
npx supabase db push
```
Requires Supabase project in `ap-south-1` (Mumbai) for DPDP Act 2023 compliance.

---

## Deployment

See [`docs/deployment/VERCEL_DEPLOY.md`](docs/deployment/VERCEL_DEPLOY.md).

---

## Documentation

| Document | Location |
|---|---|
| Phase specs (1–12) | `docs/phases/` |
| Research reports (R1–R7) | `docs/research/` |
| Audit reports | `docs/audits/` |
| Deployment guide | `docs/deployment/` |
| Dev rules | `.claude/DEVELOPMENT_RULES.md` |
| Current sprint | `.claude/CURRENT_SPRINT.md` |

---

## Compliance

- **RBI Digital Lending Directions 2025** — Transparent lender ranking, no hidden bias
- **DPDP Act 2023** — Granular consent, data stored in India (ap-south-1)
- **FAIR Practices Code** — Embedded in product flow

---

See [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`SECURITY.md`](SECURITY.md)
