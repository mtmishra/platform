# R7 — Deployment Report
**LeapMoney Platform · Sprint 27 · 2026-06-19**

---

## Status

| Step | Status | Notes |
|---|---|---|
| Vercel CLI installed | ✅ v54.14.2 | `npm i -g vercel` |
| `vercel.json` per app | ✅ 6 files | Created Sprint 26 |
| Build verified | ✅ 6/6 | 93 pages, 0 errors |
| Vercel authentication | ✅ Complete | `vercel login` via browser OAuth |
| Project deployment | ✅ 6/6 READY | All apps live |
| Custom domain DNS | ⏳ Post-deploy | Vercel dashboard → Settings → Domains |
| Production smoke test | ⏳ Manual | URLs ready below |

---

## Deployment Configuration

### All Apps

| Setting | Value |
|---|---|
| Platform | Vercel |
| Region | `bom1` (Mumbai — DPDP Act 2023 compliance) |
| Framework | Next.js 14 (App Router) |
| Node.js | 22.x |
| Package manager | pnpm 9.x |
| Build system | Turborepo 2.x |
| Install command | `cd ../.. && pnpm install --frozen-lockfile` |
| Security headers | X-Frame-Options, nosniff, strict-origin Referrer, Permissions-Policy |
| Deploy method | `vercel --prod` from monorepo root (rootDirectory per app via API) |

### Per-App Configuration

| App | Vercel Project Name | Target Domain | Root Directory | Pages |
|---|---|---|---|---|
| web | `web` | leapmoney.net | `apps/web` | 39 (static export) |
| borrower | `leapmoney-borrower` | app.leapmoney.net | `apps/borrower` | 23 |
| dsa | `leapmoney-dsa` | dsa.leapmoney.net | `apps/dsa` | 9 |
| lender | `leapmoney-lender` | lender.leapmoney.net | `apps/lender` | 8 |
| admin | `leapmoney-admin` | admin.leapmoney.net | `apps/admin` | 10 |
| referral | `leapmoney-referral` | ref.leapmoney.net | `apps/referral` | 4 |

---

## Production URLs

| Portal | Target Domain | Vercel Preview URL | Deployment ID | Status |
|---|---|---|---|---|
| Marketing website | https://leapmoney.net | https://web-98zz131bn-leapmoney.vercel.app | `dpl_32ZyPKThmRJPAtvVQLXh3LkUhnH8` | ✅ READY |
| Borrower portal | https://app.leapmoney.net | https://leapmoney-borrower-44iqlz8v8-leapmoney.vercel.app | `dpl_EfV1gubxsv47NWePkL2emzoXCubv` | ✅ READY |
| DSA portal | https://dsa.leapmoney.net | https://leapmoney-iukgmapi9-leapmoney.vercel.app | `dpl_8xdLfDAVtANcAQMB9aiAUzFG3XA1` | ✅ READY |
| Lender portal | https://lender.leapmoney.net | https://leapmoney-lender-7unrs7jf3-leapmoney.vercel.app | `dpl_DenEneE44S5Lj2YpQrpY52w9efzv` | ✅ READY |
| Admin control tower | https://admin.leapmoney.net | https://leapmoney-admin-ow62a16ym-leapmoney.vercel.app | `dpl_Hde9n6qjompJFgDemUFpJajo46Yf` | ✅ READY |
| Referral stub | https://ref.leapmoney.net | https://leapmoney-referral-pzupipsw5-leapmoney.vercel.app | `dpl_67wovuT8dujM2CtB37uzYz5FNaTN` | ✅ READY |

---

## Deployment Blocker — Resolved

**Blocker:** `NEXT_MISSING_LAMBDA` in `@vercel/next@4.19.0` (bundled in Vercel CLI v54.14.2)

**Root cause:** `path.posix.join("./", entryDirectory, page)` in `serverBuild` produces a relative key (`connect-bank/consent`) while `prerenderRoute` looks up an absolute key (`/connect-bank/consent`). The mismatch causes lambda lookup to return `undefined` for all App Router static routes.

**Resolution:** Deployed from monorepo root (`platform/`) with `rootDirectory` set per project via Vercel REST API. Vercel's server-side builder uses a different `@vercel/next` version that resolves this correctly. Local `vercel build` was bypassed entirely.

**apps/web** uses `output: "export"` (pure static — no lambdas). All other apps use server-side rendering via Vercel's build infrastructure.

---

## Environment Variables Required

### Minimum (demo mode — no real backend)

| Variable | Portals | Required? | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | all | ✅ Yes | Per-portal value (see above) |
| `NEXT_PUBLIC_SUPABASE_URL` | borrower | ✅ Yes | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | borrower | ✅ Yes | Supabase anon key |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | web | Optional | Leave unset to disable analytics |

### Production (post-demo wiring)

| Variable | Portals | Notes |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | borrower | Server-side only |
| `DATABASE_URL` | borrower | PostgreSQL direct connection |
| `RAZORPAY_KEY_ID` | borrower | Live key (rzp_live_*) |
| `RAZORPAY_KEY_SECRET` | borrower | Server-side only |
| `RAZORPAY_WEBHOOK_SECRET` | borrower | Webhook verification |
| `REDIS_URL` | borrower | Must be ap-south-1 |
| `TURBO_TOKEN` | CI | Remote cache (optional) |
| `TURBO_TEAM` | CI | Remote cache (optional) |

Full reference: `docs/deployment/env.production.example`

---

## Smoke Test Plan

Run after deployment. Open each URL and verify:

### Website (web-98zz131bn-leapmoney.vercel.app)
- [ ] `/` — Homepage loads, hero CTA visible
- [ ] `/about` — About page
- [ ] `/compare` — Lender comparison table
- [ ] `/emi-calculator` — EMI calculator functional
- [ ] `/register` — Registration page with RBI disclaimer
- [ ] `/fair-practices-code` — Fair practices content
- [ ] `/grievance-redressal` — Grievance process content
- [ ] `/blog/credit-utilisation` — Blog article loads
- [ ] `/not-found` (404) — Branded 404 page

### Borrower Portal (leapmoney-borrower-44iqlz8v8-leapmoney.vercel.app)
- [ ] `/` — Dashboard with LeapScore gauge, MetricCardV2 KPIs
- [ ] `/health` — LeapScore & Credit Health page
- [ ] `/applications` — Applications list
- [ ] `/match` — LeapMatch lender matching
- [ ] `/not-found` (404) — Branded 404 with Button

### DSA Portal (leapmoney-iukgmapi9-leapmoney.vercel.app)
- [ ] `/` — Dashboard with pipeline and KPIs
- [ ] `/leads` — Leads list with StaggerContainer
- [ ] `/leads/LD-1000` — Lead detail page
- [ ] `/lenders` — Lender catalogue
- [ ] `/commissions` — Commission summary
- [ ] `/performance` — Performance analytics

### Lender Portal (leapmoney-lender-7unrs7jf3-leapmoney.vercel.app)
- [ ] `/` — Dashboard with status counts and notifications
- [ ] `/applications` — Application inbox
- [ ] `/applications/LA-20000` — Application review (LeapScoreGauge, FOIRMeter, ApprovalOddsNumber)
- [ ] `/underwriting` — Underwriting analytics (DistributionChart, TrendChart)
- [ ] `/portfolio` — Portfolio summary (MetricCardV2, CountUp)
- [ ] `/analytics` — Analytics (DistributionChart ×6)

### Admin Control Tower (leapmoney-admin-ow62a16ym-leapmoney.vercel.app)
- [ ] `/` — Dashboard with 8-card KPI grid
- [ ] `/users` — User management with role distribution
- [ ] `/applications` — Application pipeline
- [ ] `/commissions` — Commission management with DSA breakdown
- [ ] `/risk` — Risk dashboard (DistributionChart, RiskBadge)
- [ ] `/revenue` — Revenue dashboard (TrendChart, MetricCardV2)
- [ ] `/compliance` — Compliance (TrustBar regulatory, MetricCardV2, AnimatedCard)

### Referral (leapmoney-referral-pzupipsw5-leapmoney.vercel.app)
- [ ] `/` — Landing page loads

---

## Custom Domain DNS (Post-Deploy)

In each Vercel project → Settings → Domains → Add domain listed below. Then update DNS provider:

```
leapmoney.net         A      76.76.21.21
app.leapmoney.net     CNAME  cname.vercel-dns.com
dsa.leapmoney.net     CNAME  cname.vercel-dns.com
lender.leapmoney.net  CNAME  cname.vercel-dns.com
admin.leapmoney.net   CNAME  cname.vercel-dns.com
ref.leapmoney.net     CNAME  cname.vercel-dns.com
```

---

## Known Issues

| ID | Description | Severity | Resolution |
|---|---|---|---|
| DEPLOY-2 | Supabase project not yet provisioned in ap-south-1 | Pre-launch | Provision at supabase.com, set to Mumbai region |
| DEPLOY-3 | Custom DNS not pointing to Vercel | Post-deploy | Add CNAME records above |
| PROD-1–7 | Backend integrations (bureau, KYC, Razorpay live, Redis) | Post-demo | Documented in R6_Production_Readiness_Report.md |
| W1 | Borrower names repeat across portal datasets (by design in demo mode) | Low / Demo only | Replace mock generators with Supabase queries at launch |

---

## Commit Reference

| Sprint | SHA | Description |
|---|---|---|
| Sprint 23 | `a9ba090` | Lender Portal V3 Redesign |
| Sprint 24 | `617d935` | Admin Portal V3 Redesign |
| Sprint 25 | `74995eb` | Final Investor Demo Polish & QA |
| Sprint 26 | `4338366` | Production Deployment Preparation |
| Sprint 27 | (this commit) | Deployment live — all 6 apps READY |
