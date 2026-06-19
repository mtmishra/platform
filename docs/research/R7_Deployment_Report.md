# R7 — Deployment Report
**LeapMoney Platform · Sprint 27 · 2026-06-19**

---

## Status

| Step | Status | Notes |
|---|---|---|
| Vercel CLI installed | ✅ v54.14.2 | `npm i -g vercel` |
| `vercel.json` per app | ✅ 6 files | Created Sprint 26 |
| Build verified | ✅ 6/6 | 93 pages, 0 errors |
| Vercel authentication | ⏳ Requires user action | `vercel login` → browser OAuth |
| Project deployment | ⏳ Requires auth | Run after `vercel login` |
| Custom domain DNS | ⏳ Post-deploy | Vercel dashboard → Settings → Domains |
| Production smoke test | ⏳ Post-deploy | Script ready below |

**Blocking step:** `vercel login` requires interactive browser authentication.
Run `vercel login` in your terminal, approve in browser, then run the deploy commands in `docs/deployment/VERCEL_DEPLOY.md`.

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

### Per-App Configuration

| App | Vercel Project Name | Target Domain | Build Filter | Pages |
|---|---|---|---|---|
| web | `leapmoney-web` | leapmoney.net | `@leapmoney/web...` | 39 |
| borrower | `leapmoney-borrower` | app.leapmoney.net | `@leapmoney/borrower...` | 23 |
| dsa | `leapmoney-dsa` | dsa.leapmoney.net | `@leapmoney/dsa...` | 9 |
| lender | `leapmoney-lender` | lender.leapmoney.net | `@leapmoney/lender...` | 8 |
| admin | `leapmoney-admin` | admin.leapmoney.net | `@leapmoney/admin...` | 10 |
| referral | `leapmoney-referral` | ref.leapmoney.net | `@leapmoney/referral...` | 4 |

---

## Production URLs

*To be populated after `vercel login` + deploy. See `docs/deployment/VERCEL_DEPLOY.md`.*

| Portal | Target Domain | Vercel Preview URL | Status |
|---|---|---|---|
| Marketing website | https://leapmoney.net | — | ⏳ Pending deploy |
| Borrower portal | https://app.leapmoney.net | — | ⏳ Pending deploy |
| DSA portal | https://dsa.leapmoney.net | — | ⏳ Pending deploy |
| Lender portal | https://lender.leapmoney.net | — | ⏳ Pending deploy |
| Admin control tower | https://admin.leapmoney.net | — | ⏳ Pending deploy |
| Referral stub | https://ref.leapmoney.net | — | ⏳ Pending deploy |

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

### Website (leapmoney.net)
- [ ] `/` — Homepage loads, hero CTA visible
- [ ] `/about` — About page
- [ ] `/compare` — Lender comparison table
- [ ] `/emi-calculator` — EMI calculator functional
- [ ] `/register` — Registration page with RBI disclaimer
- [ ] `/fair-practices-code` — Fair practices content
- [ ] `/grievance-redressal` — Grievance process content
- [ ] `/not-found` (404) — Branded 404 page

### Borrower Portal (app.leapmoney.net)
- [ ] `/` — Dashboard with LeapScore gauge, MetricCardV2 KPIs
- [ ] `/health` — LeapScore & Credit Health page
- [ ] `/applications` — Applications list
- [ ] `/match` — LeapMatch lender matching
- [ ] `/not-found` (404) — Branded 404 with Button

### DSA Portal (dsa.leapmoney.net)
- [ ] `/` — Dashboard with pipeline and KPIs
- [ ] `/leads` — Leads list with StaggerContainer
- [ ] `/leads/LD-1000` — Lead detail page
- [ ] `/lenders` — Lender catalogue
- [ ] `/commissions` — Commission summary
- [ ] `/performance` — Performance analytics

### Lender Portal (lender.leapmoney.net)
- [ ] `/` — Dashboard with status counts and notifications
- [ ] `/applications` — Application inbox
- [ ] `/applications/LA-20000` — Application review (LeapScoreGauge, FOIRMeter, ApprovalOddsNumber)
- [ ] `/underwriting` — Underwriting analytics (DistributionChart, TrendChart)
- [ ] `/portfolio` — Portfolio summary (MetricCardV2, CountUp)
- [ ] `/analytics` — Analytics (DistributionChart ×6)

### Admin Control Tower (admin.leapmoney.net)
- [ ] `/` — Dashboard with 8-card KPI grid
- [ ] `/users` — User management with role distribution
- [ ] `/applications` — Application pipeline
- [ ] `/commissions` — Commission management with DSA breakdown
- [ ] `/risk` — Risk dashboard (DistributionChart, RiskBadge)
- [ ] `/revenue` — Revenue dashboard (TrendChart, MetricCardV2)
- [ ] `/compliance` — Compliance (TrustBar regulatory, MetricCardV2, AnimatedCard)

---

## Deploy Commands (after `vercel login`)

```bash
# Run from platform/ root
cd apps/web      && vercel --prod; cd ../..
cd apps/borrower && vercel --prod; cd ../..
cd apps/dsa      && vercel --prod; cd ../..
cd apps/lender   && vercel --prod; cd ../..
cd apps/admin    && vercel --prod; cd ../..
cd apps/referral && vercel --prod; cd ../..
```

---

## Known Issues

| ID | Description | Severity | Resolution |
|---|---|---|---|
| DEPLOY-1 | `vercel login` requires interactive browser auth — cannot be automated headlessly | Blocker (one-time) | User runs `vercel login` once; all subsequent deploys are unattended |
| DEPLOY-2 | Supabase project not yet provisioned in ap-south-1 | Pre-launch | Provision at supabase.com, set to Mumbai region |
| DEPLOY-3 | Custom DNS not pointing to Vercel | Post-deploy | Add CNAME records per VERCEL_DEPLOY.md |
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
| Sprint 27 | (this commit) | Deployment Report + Vercel setup docs |
