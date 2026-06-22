# Current Sprint: Sprint 26 — Borrower Registration Flow + WhatsApp OTP

**Sprint:** 26
**Status:** In Progress
**Date:** 2026-06-20
**Branch:** develop
**Goal:** Complete end-to-end borrower registration flow on marketing website — form → WhatsApp OTP → bureau fetch → borrower portal redirect.

---

## What Was Built This Sprint

### 1. EligibilityForm — 3-Step Registration Flow
`apps/web/src/components/forms/EligibilityForm.tsx`

**Step 1 — Basic details**
- Full name, Mobile (+91), Loan amount, Employment type (Salaried / Self-Employed)
- Step indicator: `1 Basic details — 2 PAN & income — 3 WhatsApp OTP`

**Step 2 — Bureau check details**
- PAN card (mandatory — CIBIL/bureau cannot pull without PAN. RBI regulation.)
- Monthly income
- Explicit consent checkbox (RBI Digital Lending / DPDP Act 2023 compliant)
- CTA: "Send WhatsApp OTP" with WhatsApp icon

**Step 3 — WhatsApp OTP verification**
- 6-box OTP input (auto-advance on type, paste support)
- 30s resend countdown timer → "Resend OTP on WhatsApp"
- "Verify & Create Account" CTA
- Back button to return to Step 2

**Processing state — 4-step animated**
1. Verifying PAN with NSDL
2. Fetching bureau report (CIBIL + Experian)
3. LeapScore™ AI analysis — 47 parameters
4. Matching to lenders by policy fit

**Redirect state**
- "Welcome to LeapMoney, {name}!"
- Auto-redirects to borrower portal (`app.leapmoney.net/onboard` in prod, `localhost:3001/onboard` in dev)
- Passes `?loan=&phone=` as query params

### 2. LeadForm — CRED-style post-eligibility results
`apps/web/src/components/forms/LeadForm.tsx`

- Processing animation (3 steps, ~2.4s)
- Results state: LeapScore teaser + Top 3 lender cards + "See All Matches" CTA → /leapmatch
- WhatsApp secondary CTA

### 3. Validation — PAN + Income validators added
`apps/web/src/lib/validation.ts`
- `validatePAN()` — format NNNNNDDDDL (5 letters + 4 digits + 1 letter)
- `validateMonthlyIncome()` — min ₹5,000

### 4. Analytics — New EventNames
`packages/analytics/src/index.ts`
- `eligibility_check_start`
- `dsa_registration_start`
- `lender_partnership_request`

### 5. Forms embedded on all pages
| Page | Form | Status |
|------|------|--------|
| `/` (homepage hero) | LeadForm | ✅ |
| `/register` | LeadForm | ✅ |
| `/personal-loan` | EligibilityForm (3-step) | ✅ |
| `/home-loan` | EligibilityForm (3-step) | ✅ |
| `/business-loan` | EligibilityForm (3-step) | ✅ |
| `/loan-against-property` | EligibilityForm (3-step) | ✅ |
| `/leapscore` | EligibilityForm (3-step) | ✅ |
| `/dsa` | DSALeadForm | ✅ |
| `/lenders` | LenderLeadForm | ✅ |

---

## Architecture Decisions

### Why WhatsApp OTP (not SMS OTP)?
- India: WhatsApp penetration ~85% vs SMS delivery reliability ~60-70%
- Dual benefit: OTP delivery + WhatsApp channel opened for 2-way messaging
- RBI allows WhatsApp as OTP channel (same as SMS, TRAI-registered templates needed)
- Cost: WhatsApp Business API ~₹0.35/session vs SMS ~₹0.10/OTP (justified by retention value)

### Why PAN is mandatory for LeapScore™?
- CIBIL, Experian, Equifax, CRIF — all 4 bureaus require PAN for report pull
- Without PAN: no bureau report → no real LeapScore™ (simulator only)
- Regulatory: RBI KYC guidelines require PAN for credit assessment
- UX decision: Be upfront in Step 2 rather than collecting it later and surprising user

### LeapScore™ = Bureau report AI analysis
- NOT a simple CIBIL score passthrough
- Analyses: Bureau Health (30pts) + Income Base (20pts) + FOIR (20pts) + Banking (15pts) + Employment (8pts) + Readiness (4.5pts + 2.5pts) = 100
- Requires: CIBIL + Experian (dual bureau), bank statement (Perfios/Finvu AA), employment verification

### Post-OTP redirect architecture
```
OTP verified → processing animation (simulated) → window.location.href = BORROWER_PORTAL/onboard
BORROWER_PORTAL = process.env.NEXT_PUBLIC_BORROWER_URL (TODO: set in Vercel env)
Dev: http://localhost:3001
Prod: https://app.leapmoney.net
```

---

## Commits This Sprint
| SHA | Description |
|-----|-------------|
| `11a28c4` | Complete end-to-end form structure — all customer journeys live |
| `e2dfca2` | Homepage lead form + WhatsApp CTA on all form success states |
| `b573967` | CRED-style post-eligibility flow — processing animation + results state |
| `a844e28` | 2-step EligibilityForm with PAN + real LeapScore architecture |
| `d01bc0d` | WhatsApp OTP verification + borrower portal redirect |

---

## What's TODO (Next Sprint)

### CRITICAL — Must do before go-live
1. **Supabase Auth** — Wire `sendOtp({ phone })` and `verifyOtp({ phone, token })` in EligibilityForm
   - Currently: simulated 800ms delay
   - Need: `@supabase/supabase-js` auth calls
   - Region: ap-south-1 (Mumbai) — DPDP mandatory

2. **WhatsApp Business API** — Real OTP delivery
   - BSP options: Gupshup / Wati / Interakt
   - Need: WABA number, approved OTP template (TRAI registered)
   - Template: "Your LeapMoney OTP is {{1}}. Valid for 10 minutes. Do not share."
   - Trigger: Supabase Edge Function → BSP API → WhatsApp

3. **NEXT_PUBLIC_BORROWER_URL** — Set in Vercel env vars for web app
   - Dev: `http://localhost:3001`
   - Prod: `https://app.leapmoney.net`

4. **Borrower portal `/onboard` page** — Receives `?loan=&phone=` params, shows LeapScore + matches
   - Currently: generic "Welcome to LeapMoney" placeholder

5. **Form data persistence** — Save to Supabase `leads` table on submit
   - Table: `leads (id, name, phone, pan_hash, loan_type, amount, employment, income, created_at)`
   - PAN: store SHA-256 hash only, never plaintext

### WhatsApp 2-way messaging (Stage-wise)
| Stage | Trigger | Message |
|-------|---------|---------|
| Form submit | Lead created | "Rahul, hum aapka LeapScore check kar rahe hain. 2 min mein results." |
| Score ready | LeapScore computed | "Aapka LeapScore 72/100 hai. 12 lenders match hue. Link: app.leapmoney.net" |
| App submitted | Application sent to lender | "HDFC Bank ko application bhej di. Ref: LM2026XXXX." |
| Status change | Lender action | "HDFC ne documents maange hain. Portal pe upload karo." |

Implementation: Supabase DB webhook → Edge Function → WhatsApp BSP API

---

## Live Flow — Verified ✅
```
/personal-loan
  Step 1: Name=Rahul Sharma | Phone=9876543210 | Amount=500000 | Employment=Salaried
    ↓ [Continue]
  Step 2: PAN=ABCDE1234F | Income=75000 | Consent=✓
    ↓ [Send WhatsApp OTP]
  Step 3: OTP boxes filled (1 2 3 4 5 6 via paste) | Resend timer visible
    ↓ [Verify & Create Account]
  Processing: 4 animated steps with progress bar
    ↓
  Redirect → localhost:3001/onboard?loan=personal-loan&phone=9876543210
  Borrower portal: "Welcome to LeapMoney" onboarding screen ✅
```
