# LeapMoney — Vercel Deployment Guide

## Prerequisites

1. Vercel account at https://vercel.com
2. Vercel CLI installed: `npm i -g vercel` (already done)
3. GitHub repo connected to your Vercel account

## Step 1 — Authenticate

```bash
vercel login
# Opens browser → sign in with GitHub/email → approve
```

## Step 2 — Deploy each app (first time only — links the project)

Run each command from the **repo root**. Answer the prompts:
- "Set up and deploy?" → **Y**
- "Which scope?" → your team/account
- "Link to existing project?" → **N** (first time), then name it as shown
- "In which directory is your code?" → use the path shown below
- "Override settings?" → **N** (vercel.json handles it)

```bash
# 1. Marketing website → leapmoney.net
cd apps/web && vercel --prod && cd ../..

# 2. Borrower portal → app.leapmoney.net
cd apps/borrower && vercel --prod && cd ../..

# 3. DSA portal → dsa.leapmoney.net
cd apps/dsa && vercel --prod && cd ../..

# 4. Lender portal → lender.leapmoney.net
cd apps/lender && vercel --prod && cd ../..

# 5. Admin control tower → admin.leapmoney.net
cd apps/admin && vercel --prod && cd ../..

# 6. Referral stub → ref.leapmoney.net
cd apps/referral && vercel --prod && cd ../..
```

## Step 3 — Set environment variables per project

In each Vercel project dashboard → Settings → Environment Variables, add:

| Variable | Required by | Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | borrower | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | borrower | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | all | Portal-specific URL (see below) |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | web | GA4 measurement ID (optional) |
| `RAZORPAY_KEY_ID` | borrower | Razorpay live key ID |
| `RAZORPAY_KEY_SECRET` | borrower | Razorpay live secret |

**Per-portal NEXT_PUBLIC_SITE_URL values:**
- web: `https://leapmoney.net`
- borrower: `https://app.leapmoney.net`
- dsa: `https://dsa.leapmoney.net`
- lender: `https://lender.leapmoney.net`
- admin: `https://admin.leapmoney.net`
- referral: `https://ref.leapmoney.net`

## Step 4 — Subsequent deploys (CI/CD)

After initial setup, every push to `develop` triggers a preview deployment.
Every push to `main` triggers a production deployment.

```bash
# Manual redeploy any app
cd apps/<app-name> && vercel --prod
```

## Step 5 — Custom domain setup

In each Vercel project → Settings → Domains → Add the domain above.
Then update your DNS provider:
```
leapmoney.net         A      76.76.21.21
app.leapmoney.net     CNAME  cname.vercel-dns.com
dsa.leapmoney.net     CNAME  cname.vercel-dns.com
lender.leapmoney.net  CNAME  cname.vercel-dns.com
admin.leapmoney.net   CNAME  cname.vercel-dns.com
ref.leapmoney.net     CNAME  cname.vercel-dns.com
```

## Build configuration (already in each app's vercel.json)

| Setting | Value |
|---|---|
| Framework | Next.js |
| Install Command | `cd ../.. && pnpm install --frozen-lockfile` |
| Build Command | `cd ../.. && pnpm turbo build --filter=@leapmoney/<app>...` |
| Output Directory | `.next` |
| Region | `bom1` (Mumbai) |
| Node.js | 22.x |
