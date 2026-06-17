# LeapMoney Credit Intelligence Report — R3
## Bureau, Lender, Approval & AI Infrastructure Research

**Classification:** Engineering + Product — Internal Reference  
**Date:** June 2026  
**Purpose:** Build the complete data model required for LeapScore, LeapMatch, and the Approval Odds Engine  
**Feeds Into:** Sprint 7 (LeapScore), Sprint 8 (LeapMatch), Sprint 9 (Approval Engine)  
**Research-Only:** No coding. No GitHub changes. No implementation.

---

# TABLE OF CONTENTS

1. Bureau Intelligence — CIBIL, Experian, CRIF, Equifax
2. Lender Intelligence — Bureau Mapping Database
3. Approval Intelligence — Per-Lender Approval Framework
4. Rejection Intelligence — Why Loans Get Rejected
5. Self-Employed Intelligence — GST, ITR, Bank Statement Framework
6. Home Loan Intelligence — LTV, FOIR, Income Multiplier
7. Business Loan Intelligence — MSME, Working Capital, GST Loans
8. Alternative Data Intelligence — UPI, GST, Utility, Telecom
9. LeapScore Data Dictionary — Complete Field Specification
10. LeapMatch Data Dictionary — Complete Matching Engine Spec

---

# SECTION 1: BUREAU INTELLIGENCE

## 1.1 Overview — India's 4 Credit Bureaus

India has 4 RBI-licensed credit bureaus. All lenders must be members of at least one. Most major lenders are members of all 4. Each bureau runs its own proprietary scoring algorithm.

| Bureau | Founded | Ranges | Market Share | Specialty |
|---|---|---|---|---|
| TransUnion CIBIL | 2000 | 300–900 | 65–70% of enquiries | Banks; largest database |
| Experian India | 2010 | 300–900 | ~15% | Fintechs; dynamic updates |
| CRIF High Mark | 2010 | 300–900 | ~10% | NBFCs; microfinance; rural |
| Equifax India | 2010 | 1–999 (note: different scale) | ~5% | Commercial; analytics depth |

**Critical Note on Equifax:** Equifax India uses a 1–999 scale, unlike the 300–900 scale of the other three. LeapScore UI must normalize this when displaying to users.

---

## 1.2 CIBIL — Deep Dive

### Score Ranges and Meaning

| Score Range | Category | Lender Action |
|---|---|---|
| 300–549 | Poor | Almost all banks reject; some NBFCs at high rates |
| 550–649 | Below Average | Very limited options; high interest; small amounts |
| 650–699 | Average | Digital NBFCs, KreditBee, Bajaj Finance may approve |
| 700–749 | Good | Most NBFCs; some private banks; moderate rates |
| 750–799 | Very Good | All major banks approve; competitive rates |
| 800–900 | Excellent | Pre-approved offers; best rates; highest limits |

### Score Calculation Factors (Industry-Reported Weightages — CIBIL does not officially publish)

| Factor | Weight | Description |
|---|---|---|
| Payment History | ~35% | DPD history, missed payments, defaults |
| Credit Utilization | ~30% | Credit used ÷ Total credit limit (keep <30%) |
| Credit Length | ~10% | Age of oldest account + average account age |
| Credit Mix | ~10% | Balance of secured (home/auto) vs unsecured (PL, CC) |
| New Credit / Inquiries | ~10% | Hard inquiries in last 6–12 months |
| Other (CIBIL proprietary) | ~5% | Undisclosed internal factors |

**Important:** CIBIL's exact algorithm is proprietary. These are industry-reported approximate weightages confirmed by multiple sources. LeapScore explanations must caveat: "Based on reported factors."

### What CIBIL Tracks (Credit Report Structure)

**Section 1 — Personal Information**
- Name, DOB, PAN, Passport, Voter ID, Aadhaar (partial)
- Address history (current + previous)
- Employment information

**Section 2 — Account Information (Tradelines)**
Each credit account shows:
- Lender name
- Account type (credit card / personal loan / home loan / auto / OD)
- Account number (partially masked)
- Ownership (individual / joint / guarantor)
- Date opened / closed
- Sanctioned amount / credit limit
- Current balance
- Amount overdue
- EMI amount
- **DPD (Days Past Due) — monthly for last 36 months**
- Account status (STD / SMA / NPA / Written Off / Settled)

**DPD Status Codes (critical for LeapScore):**
- `000` = Paid on time
- `001–030` = 1–30 days late
- `031–060` = 31–60 days late
- `061–090` = 61–90 days late
- `090+` = NPA territory; major score damage
- `SUB` = Sub-standard
- `DBT` = Doubtful
- `LSS` = Loss
- `WO` = Written Off
- `SET` = Settled (very negative)
- `CLO` = Closed

**Section 3 — Enquiry Information**
- Every hard inquiry recorded with: date, lender, loan type, amount applied for
- Soft inquiries (consumer checks) do NOT appear to other lenders

**Section 4 — CIBIL Score**
- Single score 300–900
- Score reason codes (top 4 factors affecting the score)

### Key Impact Rules

| Event | Score Impact | Recovery Timeline |
|---|---|---|
| Single missed EMI (30 DPD) | -30 to -50 pts | 6–12 months |
| 90+ DPD | -80 to -120 pts | 12–24 months |
| Loan settlement | -100 to -150 pts | 2–5 years |
| Write-off | -150 to -200 pts | 5–7 years (stays on report) |
| Hard inquiry (single) | -5 to -10 pts | Fades in 6–12 months |
| Multiple hard inquiries (3+ in 6 months) | -40 to -80 pts | 6–12 months after last inquiry |
| High credit utilization (>50%) | -30 to -60 pts | Immediate when reduced |
| New credit (first account) | Neutral to +20 pts | After 6 months on-time |

### Thin File / New-to-Credit Handling (2025 Update)

- CIBIL now scores individuals with as little as **6 months of credit activity** (previously needed 12+)
- RBI introduced the **Credit Health Score (CHS)** as a supplementary metric alongside the standard CIBIL score — factors in income stability signals, inquiry frequency, credit diversity
- Government directive (Aug 2025): Banks cannot reject first-time loan applicants **solely** for lack of credit history
- Alternative path for thin-file: Secured credit (FD-backed card), credit builder loans, co-applicant loans

### CIBIL API Access Options for LeapMoney

| Method | Description | Best For |
|---|---|---|
| CIBIL Direct API | Official B2B integration; RBI compliance built-in; requires CIBIL membership | Enterprise (Year 2) |
| Decentro API | Wrapper over CIBIL + Experian; faster integration; handles compliance layer | Launch (Year 1) |
| Setu CIBIL API | Pine Labs' wrapper; combined with AA | If using Setu for AA too |
| Bureau-direct via lender | Some lenders pull on behalf; not scalable for marketplace | Not recommended |

**Recommended for LeapMoney Year 1:** Decentro (CIBIL + Experian in one integration, compliance layer included)

---

## 1.3 Experian India — Deep Dive

### Differentiators vs CIBIL

| Feature | CIBIL | Experian India |
|---|---|---|
| Score update frequency | Monthly (moving to fortnightly by 2026) | Real-time (dynamic scoring) |
| Score range | 300–900 | 300–900 |
| Data vintage | Since 2000 (deepest) | Since 2010 |
| Lender preference | Banks, PSBs | Fintechs, private lenders |
| Specialty product | Standard consumer score | Grameen Score (rural; launched Nov 2025) |
| API maturity | Mature; wide coverage | Mature; used by most fintech platforms |

### Experian Grameen Score (November 2025)
- Range: 300–900
- Designed for rural / semi-urban borrowers without formal credit history
- Uses non-traditional data: agricultural income patterns, cooperative society membership, self-help group (SHG) history
- Key for LeapMoney's Tier 2/3 and thin-file strategy

### Experian Score Factors (Similar structure to CIBIL)
- Payment history: Dominant factor
- Amounts owed / utilization
- Credit history length
- Credit mix
- New credit applications

---

## 1.4 CRIF High Mark — Deep Dive

### Key Differentiators

- **Dominant in microfinance** — India's largest MFI credit bureau dataset
- Strong for borrowers in **cooperative societies, SHG, and Kisan Credit Cards**
- Coverage of **rural India** credit history often deeper than CIBIL
- Score range: 300–900

### When CRIF Matters for LeapMoney

| User Segment | Why CRIF Is Relevant |
|---|---|
| Microfinance borrowers | SHG, JLG, MFI history only in CRIF |
| Rural self-employed | Agricultural loan history; Kisan Credit Card |
| Small merchants (Tier 3) | Cooperative credit; not in CIBIL database |
| Thin-file with MFI history | CRIF score exists; CIBIL score doesn't |

**LeapScore Recommendation:** Pull CRIF for users who show zero CIBIL score or score below 300 — they may have positive CRIF history that makes them lendable.

---

## 1.5 Equifax India — Deep Dive

### Key Differentiators

| Feature | Detail |
|---|---|
| Score range | **1–999** (different from others' 300–900) |
| Specialty | Commercial credit; cross-border analytics |
| Data depth | Both individual AND business credit data |
| Used by | Some NBFCs, banks (secondary check) |
| Consumer product | Weak — near-zero consumer brand |

### LeapMoney Display Consideration
Equifax's 1–999 range requires normalization before showing in LeapScore. Recommended approach: Show Equifax score alongside its range (e.g., "Equifax: 812/999 — equivalent to ~730 on standard scale").

---

## 1.6 Multi-Bureau Comparison Matrix

| Attribute | CIBIL | Experian | CRIF | Equifax |
|---|---|---|---|---|
| Score Range | 300–900 | 300–900 | 300–900 | 1–999 |
| Market Share (lender enquiries) | 65–70% | ~15% | ~10% | ~5% |
| Update Frequency | Monthly → Fortnightly (2026) | Real-time / dynamic | Monthly | Monthly |
| Database Size | 650M individuals, 45M businesses | Large; 10-yr data | Large MFI focus | Moderate |
| Hard Inquiry Impact | -5 to -10 pts | -5 to -10 pts | Similar | Similar |
| Settlement Duration on Report | 2–5 years | 2–5 years | 2–5 years | ~7 years |
| Write-off Duration on Report | 7 years | 7 years | 7 years | 7 years |
| Thin-file / No history score | Yes (after 6 months) | Yes | Strong (MFI data) | Limited |
| Lender primary | Banks + PSBs | Fintechs + Private | NBFCs + MFIs | Commercial + Analytics |
| Rural / Grameen | Limited | Grameen Score (2025) | Strong | Weak |
| API for LeapMoney | Via Decentro / direct | Via Decentro / direct | Direct / via aggregator | Direct (limited partners) |
| Consumer product | Strong (free score) | Moderate | Weak | Very weak |
| Report price (consumer) | ₹550 | ₹399 | ₹399 | ₹400 |

---

# SECTION 2: LENDER INTELLIGENCE — BUREAU MAPPING DATABASE

## 2.1 Bank Bureau Mapping

### Public Sector Banks

| Bank | Primary Bureau | Secondary Bureau | Min Score (PL) | Min Score (HL) | Notes |
|---|---|---|---|---|---|
| SBI | CIBIL | CRIF High Mark | 650 (govt salary) / 700 (others) | 700 | Govt employees get relaxation |
| Bank of Baroda | CIBIL | Experian | 701 | 701 | Published minimum is 701 |
| Punjab National Bank | CIBIL | CRIF | 700 | 700 | PSB standard |
| Canara Bank | CIBIL | — | 700 | 700 | CIBIL primary |
| Union Bank | CIBIL | — | 700 | 700 | PSB standard |
| Bank of India | CIBIL | — | 700 | 700 | PSB standard |

### Private Sector Banks

| Bank | Primary Bureau | Secondary Bureau | Min Score (PL) | Min Score (HL) | Notes |
|---|---|---|---|---|---|
| HDFC Bank | CIBIL | Experian | 730–750 | 700 | Strict underwriting; 750+ preferred |
| ICICI Bank | CIBIL | Experian | 700–730 | 700 | 700+ for basic; 730+ for best rates |
| Axis Bank | CIBIL | Experian | 720–750 | 700 | Pre-approved customers: lower bar |
| Kotak Mahindra | CIBIL | Experian | 750–760 | 700 | One of strictest scorers |
| IndusInd Bank | CIBIL | Experian | 700–720 | 700 | More flexible than Kotak |
| Yes Bank | CIBIL | Experian | 700 | 700 | More flexible |
| IDFC FIRST Bank | CIBIL | Experian | 730 | 700 | Actively growing retail book |
| Federal Bank | CIBIL | CRIF | 700 | 700 | Kerala-focused; moderate |
| RBL Bank | CIBIL | Experian | 700 | 700 | Credit card lender; moderate |
| IDBI Bank | CIBIL | — | 700 | 700 | PSB-like underwriting |

### Small Finance Banks

| Bank | Primary Bureau | Secondary Bureau | Min Score | Notes |
|---|---|---|---|---|
| Ujjivan SFB | CIBIL + CRIF | — | 650 | Strong in microfinance segment |
| Equitas SFB | CRIF | CIBIL | 650 | CRIF because of MFI background |
| AU Small Finance | CIBIL | — | 700 | Moving upmarket; bank-like standards |
| ESAF SFB | CRIF | — | 600+ | Deep rural coverage |

---

## 2.2 NBFC Bureau Mapping

| NBFC | Primary Bureau | Secondary Bureau | Min Score | Product Focus | Notes |
|---|---|---|---|---|---|
| Bajaj Finance | Experian | CIBIL | 650 | Personal, Consumer, Business | **Experian is primary** — major insight |
| Tata Capital | CIBIL | Experian | 750 | Personal, Home, Business | Premium segment |
| Mahindra Finance | CRIF | CIBIL | 600 | Auto, Rural, SME | Rural focus; CRIF primary |
| HDB Financial | CIBIL | Experian | 700 | Personal, Business | HDFC Group NBFC |
| Shriram Finance | CRIF | CIBIL | 600 | Auto, CV, SME | CRIF primary (rural) |
| L&T Finance | CIBIL | Experian | 700 | Home, Rural, SME | Diversified |
| Aditya Birla Finance | CIBIL | Experian | 700 | Personal, Business | AB Group |
| Muthoot Finance | CRIF | CIBIL | 600+ | Gold Loan, Personal | Gold primary; bureau secondary |
| Poonawalla Fincorp | CIBIL | Experian | 700 | Personal, Consumer | Aggressive growth |
| Cholamandalam | CRIF | CIBIL | 600 | Auto, SME | Rural; CRIF primary |

---

## 2.3 Digital / Fintech Lender Bureau Mapping

| Lender | Primary Bureau | Secondary Bureau | Min Score | Typical Ticket | Notes |
|---|---|---|---|---|---|
| KreditBee | Experian | CIBIL | 600+ (flexible) | ₹6K–₹10L | Alternative data + bureau |
| MoneyView | CIBIL | Experian | 600–650 | ₹10K–₹10L | Salaried focus |
| Fibe (EarlySalary) | CIBIL | — | 650 | ₹5K–₹5L | Young professionals |
| PaySense (LazyPay) | CIBIL | Experian | No history OK | ₹5K–₹5L | New-to-credit friendly |
| StashFin | Experian | CIBIL | 650 | ₹1K–₹10L | Credit line model |
| Navi | CIBIL | Experian | 650+ | ₹10K–₹20L | Full-stack digital |
| Paysense | CIBIL | — | NTC OK | ₹5K–₹5L | No bureau OK with alt data |
| Slice (now SBM) | Experian | CIBIL | NTC OK | ₹10K–₹10L | Card + loan hybrid |
| OneCard | CIBIL | Experian | 700+ | Credit card | Premium card for salaried |
| Rupeek | — | CIBIL | Not bureau-driven | Gold loan | Asset-backed; score secondary |

---

## 2.4 Lender Bureau Intelligence — Key Insights

### Insight 1: Bajaj Finance Uses Experian as Primary
This is the most important bureau mapping insight. Bajaj Finance — India's largest NBFC with 80M+ customers — **uses Experian as primary, CIBIL as secondary**. A user with CIBIL 670 but Experian 720 may qualify for Bajaj Finance when rejected by an HDFC Bank that only checks CIBIL.

**LeapMatch implication:** When a user's CIBIL score is below a bank's minimum, LeapMatch should check Experian and route to lenders who use Experian as primary.

### Insight 2: CRIF Primary for Rural/Auto NBFCs
Mahindra Finance, Shriram Finance, Cholamandalam — all major auto/rural NBFCs — use CRIF as primary. A rural borrower with no CIBIL score but positive CRIF microfinance history is lendable to these NBFCs.

**LeapMatch implication:** Always pull CRIF for users from Tier 3+ locations or self-employed in rural sectors.

### Insight 3: Digital Lenders Accept Lower Scores + Alternative Data
KreditBee, PaySense, Fibe, StashFin all approve at scores that traditional banks reject. They compensate by: higher interest rates, lower loan amounts, alternative data supplements.

**LeapMatch implication:** Below 650 CIBIL segment should be routed to digital lenders with clear rate + risk explanation.

### Insight 4: Pre-Existing Banking Relationship Raises Approval Odds
A user applying to their salary bank (e.g., HDFC salary account applying to HDFC Bank) has 20–40% higher approval probability because the bank sees actual cash flow — overriding the need for bureau score in some cases.

**LeapMatch implication:** Capture which bank user holds salary account. Weight existing relationship as +10–15% approval probability modifier.

---

# SECTION 3: APPROVAL INTELLIGENCE

## 3.1 Approval Probability Framework — Personal Loans

### Tier 1 Banks (HDFC, ICICI, Kotak, Axis) — Approval Criteria

| Parameter | Minimum | Ideal | Weight in Decision |
|---|---|---|---|
| CIBIL Score | 700 | 750+ | Very High (35%) |
| Monthly Net Income (Salaried) | ₹25,000 | ₹50,000+ | High (25%) |
| Employment Stability | 1 year current employer | 3+ years | High (20%) |
| FOIR (Fixed Obligation to Income Ratio) | <50% | <40% | Medium (15%) |
| Credit Mix | Any | Secured + Unsecured | Low (5%) |
| Credit Inquiries (last 6 months) | <3 | 0–1 | Medium (included above) |
| Existing relationship with bank | Neutral | Salary account = +ve | Moderate |
| Age | 21–60 | 25–45 | Low (verification) |

**Approval Probability Estimate by CIBIL Score (Tier 1 Banks):**

| CIBIL Score | Approval Probability | Notes |
|---|---|---|
| 800–900 | 90–95% | Pre-approval likely; best rate |
| 750–799 | 75–85% | Strong approval; competitive rate |
| 720–749 | 50–65% | Income and FOIR critical |
| 700–719 | 30–45% | Borderline; employer matters |
| 670–699 | 10–20% | Very low; not worth applying |
| <670 | <5% | Reject; reroute to NBFC/fintech |

### Tier 2 NBFCs (Bajaj Finance, Tata Capital, HDB) — Approval Criteria

| Parameter | Minimum | Ideal | Weight |
|---|---|---|---|
| Experian Score (Bajaj) / CIBIL (others) | 650 | 700+ | High (30%) |
| Monthly Income | ₹15,000 | ₹30,000+ | High (25%) |
| Employment | 1 year | 2+ years | Medium (20%) |
| FOIR | <55% | <45% | Medium (15%) |
| Account Aggregator cash flow | Optional | 6-month positive trend | Emerging (10%) |

**Approval Probability (NBFC Tier 2):**

| CIBIL/Experian Score | Approval Probability |
|---|---|
| 750+ | 85–90% |
| 700–749 | 65–75% |
| 650–699 | 40–55% |
| 600–649 | 20–35% |
| <600 | 5–15% |

### Digital Lenders (KreditBee, Fibe, MoneyView) — Approval Criteria

| Parameter | Notes |
|---|---|
| Bureau Score | 600+ preferred; NTC accepted with alt data |
| Income Minimum | ₹8,000–₹15,000/month |
| Employment | Even gig/freelance accepted |
| Alt Data | UPI transaction volume; mobile usage patterns |
| FOIR | Up to 60–65% (more lenient) |
| Loan Amount | Capped at ₹50K–₹2L for first-time borrowers |

**Approval Probability (Digital Lenders):**

| CIBIL Score | Approval Probability |
|---|---|
| 700+ | 80–90% |
| 600–699 | 55–70% |
| 500–599 | 25–40% |
| No CIBIL (NTC) | 30–50% (with good alt data) |

---

## 3.2 Approval Probability Factors — Universal Rules

### Rule 1: The FOIR Rule
- Banks: FOIR must be below 40–50%
- NBFCs: FOIR up to 50–60%
- Digital: FOIR up to 65%
- Formula: FOIR = (All fixed monthly obligations) ÷ (Net monthly income) × 100
- Example: ₹15,000 EMIs on ₹50,000 income = 30% FOIR = Excellent
- Example: ₹25,000 EMIs on ₹50,000 income = 50% FOIR = Borderline

### Rule 2: The Existing Relationship Multiplier
- User holds salary account with applying bank: +15–20% approval probability
- User has existing loan with lender (good repayment): +10–15%
- User has credit card with bank: +5–10%
- No existing relationship: Baseline

### Rule 3: Employment Quality Multiplier
- Government employee: +10–15% (super stable income; banks love)
- MNC/Listed company: +8–12%
- Private company (known): Baseline
- SME/Private (unknown company): -5 to -10%
- Self-employed with ITR: Baseline (depends heavily on ITR quality)
- Self-employed without ITR: -15 to -25%

### Rule 4: Purpose of Loan
- Medical emergency: +5% (sympathetic view)
- Home renovation: Neutral
- Education: +5% (productive purpose)
- Debt consolidation: -10% (signals existing debt stress)
- No stated purpose: Neutral

### Rule 5: Hard Inquiry Recency
- 0 inquiries in 6 months: +5%
- 1–2 inquiries: Neutral
- 3–4 inquiries: -10%
- 5+ inquiries: -20 to -30% (screams credit hunger)

---

# SECTION 4: REJECTION INTELLIGENCE

## 4.1 Top 15 Rejection Reasons — Ranked by Frequency

| Rank | Rejection Reason | Frequency | Score Impact | LeapMoney Response |
|---|---|---|---|---|
| 1 | CIBIL score below minimum | Very High | Core issue | Route to lower-tier lender OR show score improvement plan |
| 2 | High FOIR / existing EMI burden | High | Indirect | Show FOIR calculator; suggest lower loan amount |
| 3 | Credit card utilization >30% | High | -30 to -60 pts | "Reduce utilization — fastest score boost" |
| 4 | DPD history (late payments) | High | -30 to -120 pts | Show DPD impact; improvement timeline |
| 5 | Loan settlement or write-off | High | -100 to -200 pts | Show recovery timeline; specialized lenders |
| 6 | Multiple hard inquiries (last 6 months) | Medium-High | -40 to -80 pts | "Stop applying — each application hurts" |
| 7 | Insufficient income / income mismatch | Medium-High | Not score-related | Suggest correct loan amount; income verification tips |
| 8 | Thin file / no credit history | Medium | N/A | Show starter loan options; secured card path |
| 9 | Job change / short tenure | Medium | Not score-related | Explain 1-year rule; flag employer quality |
| 10 | Rejected by same lender before | Medium | Not score-related | Route to different lender type |
| 11 | Loan purpose mismatch | Medium | Not score-related | Clarify purpose; choose right product type |
| 12 | Age outside lender range | Low-Medium | Not score-related | Route to age-appropriate lenders |
| 13 | Address verification failure | Low-Medium | Not score-related | Address in bureau vs. stated must match |
| 14 | Incomplete KYC | Low | Not score-related | Document checklist |
| 15 | Internal policy (lender-specific) | Variable | Not predictable | Try alternate lender immediately |

---

## 4.2 Rejection by Score Range — What to Tell Users

```
LEAPMONEY REJECTION INTELLIGENCE — USER-FACING LOGIC

IF score < 550:
  "Your score needs significant rebuilding. This takes 12–18 months.
   In the meantime, here are options: Secured credit card (FD-backed),
   Gold loan, Microfinance. Start your 90-day recovery plan?"

IF score 550–650:
  "Some digital lenders may approve you at higher rates.
   Options: KreditBee, PaySense, Fibe. Expected rate: 20–28%.
   Better option: Improve score to 680+ first. Takes 3–6 months."

IF score 650–700:
  "NBFCs will approve you. Banks will be difficult.
   Best lenders now: Bajaj Finance, HDB, MoneyView.
   Route to improve: Reduce utilization + 6 months on-time = 720+"

IF score 700–750:
  "Most NBFCs and some banks will approve.
   Check Experian score — if higher, Bajaj Finance is your best bet.
   Next milestone: 750 (unlocks HDFC, ICICI, Axis)"

IF score 750+:
  "Strong approval odds across banks and NBFCs.
   Shop for rate, not approval. Compare HDFC vs ICICI vs IDFC FIRST."

IF rejected despite 750+ score:
  Reason is almost always: High FOIR, multiple inquiries, or employer issue
  Action: Check FOIR, check inquiry history, try pre-approved channel
```

---

## 4.3 What Lenders Won't Tell You (But LeapMoney Should)

1. **The same lender may approve you if you wait 90 days** after a rejection — hard inquiry fades and score recovers
2. **Applying through net banking pre-approved portal** vs. marketplace gives different approval odds — bank's own platform uses internal data, not just bureau
3. **Co-applicant addition can override a FOIR rejection** — adds income base
4. **Some lenders have PIN code-based policies** — certain geographies are blacklisted
5. **Occupation blacklists exist** — some lenders do not lend to specific industries (e.g., real estate agents, commission salespeople) due to income volatility
6. **Processing fee is charged regardless of approval** at some lenders — LeapMoney must flag this
7. **Soft inquiry first** — always recommend users check if lender offers a soft-pull pre-qualification before the hard pull application

---

# SECTION 5: SELF-EMPLOYED INTELLIGENCE

## 5.1 How Lenders Evaluate Self-Employed Borrowers

Self-employed borrowers face a fundamentally different approval logic than salaried borrowers. The key challenge: **income is irregular and hard to verify**.

### 5.1.1 The Self-Employed Credit Evaluation Stack

```
SELF-EMPLOYED UNDERWRITING HIERARCHY

Level 1 — Bureau Score (same as salaried)
  CIBIL / Experian score
  DPD history
  Credit utilization

Level 2 — Income Verification (where it differs from salaried)
  Option A: ITR-based income (2 years' filed ITRs, CAs certified)
    Taxable income × multiplier = loan eligibility
  Option B: Bank statement income (6–12 months of bank statements)
    Average monthly deposits × multiplier
    Requires: Perfios or AA-based analysis
  Option C: GST turnover (for GST-registered businesses)
    Monthly GST sales × % of turnover (usually 10–25%)
  Option D: Hybrid (ITR + bank statement + GST combined)
    Most lenders use Option D for approval > ₹10L

Level 3 — Business Stability
  Business vintage: Minimum 2 years operational
  GST registration continuity
  No major revenue drops (>30% year-on-year = flag)

Level 4 — Alternative Signals (emerging, 2025 onwards)
  UPI business collection patterns (3+ months consistent)
  E-commerce seller ratings (Amazon, Flipkart)
  Trade references / vendor invoice history
```

### 5.1.2 Minimum Requirements by Lender Type

| Lender Type | ITR Required | Min Business Age | Min Income | Min Score | Notes |
|---|---|---|---|---|---|
| PSB (SBI, BoB) | 2 years | 3 years | ₹3L/year taxable | 700 | Strictest |
| Private Bank | 2 years | 2 years | ₹4L/year | 720 | HDFC, ICICI |
| Large NBFC | 1–2 years | 2 years | ₹2.5L/year | 680 | Tata, HDB |
| Digital NBFC | Optional | 1 year | ₹1.5L/year | 650 | KreditBee, MoneyView |
| Fintech (no doc) | Not required | 6 months | UPI + bank statement | 600 | High rate 20–28% |

### 5.1.3 GST as Credit Signal

**What GST data tells lenders:**
- Monthly turnover (revenue proxy)
- Business sector / HSN codes (risk classification)
- GST filing regularity (discipline signal)
- Input credit utilization (business scale proxy)
- GST growth trend (business health)

**Key rule:** A GST-registered business with regular quarterly filings and consistent monthly sales above ₹5L can get business loans from digital NBFCs without ITR, using only bank statements + GST data.

**Platforms enabling this:** PSB Loans in 59 Minutes; GST Sahay (GSTN); Decentro GST API; Setu GST integration

### 5.1.4 Personal Loan Without ITR — Is It Possible?

Yes. Available from: PaySense, KreditBee, IIFL, StashFin, Navi

Requirements for no-ITR approval:
- 6–12 months of bank statements showing regular credits
- GST registration (preferred)
- CIBIL score 650+
- Business registration proof (Udyam / MSME certificate)
- Trade license / shop establishment certificate

Interest rate penalty for no-ITR: +4–8% vs. ITR-verified borrower

**LeapMatch Recommendation:** Build "no-ITR" filter so self-employed users who haven't filed can still see applicable lenders.

---

## 5.2 Self-Employed Score Gaps — LeapScore Opportunity

```
THE SELF-EMPLOYED CREDIT GAP

Bureau Score: Often LOWER than salaried with same actual income
  Why: Irregular large deposits look like income spikes
  Why: Business expenses run through personal accounts (mixed finances)
  Why: Some self-employed deliberately avoid formal credit (cash economy)
  
LeapScore Opportunity:
  Add AA-based cash flow analysis: 12-month bank statement income
  Add GST compliance signal: Filing regularity + growth trend
  Add UPI collection pattern: Monthly business inflows
  Result: Self-employed user's LeapScore accurately reflects
          actual creditworthiness beyond bureau score alone
```

---

# SECTION 6: HOME LOAN INTELLIGENCE

## 6.1 Home Loan Approval Framework

### 6.1.1 Key Metrics

| Metric | Definition | Standard Range | Notes |
|---|---|---|---|
| FOIR | Fixed obligations ÷ gross income | 40–55% maximum | Includes all existing EMIs + new home loan EMI |
| LTV | Loan ÷ Property Value | Up to 90% (<₹30L); up to 75% (₹30–75L) | RBI mandated; higher LTV = stricter eligibility |
| Income Multiplier | Max loan ÷ Annual income | 50–72x monthly income | Varies by lender; higher for joint applications |
| Co-applicant Impact | Adds income base | +50–80% eligibility increase | Both co-applicants must be co-owners for tax benefit |
| PMAY Subsidy | Interest subsidy for first home | 3–6.5% subsidy | EWS/LIG/MIG categories |

### 6.1.2 Score Requirements by Home Loan Lender

| Lender | Min CIBIL | Bureau Used | Min Income | LTV | Special |
|---|---|---|---|---|---|
| SBI Home Loan | 700 | CIBIL | ₹25,000/month | 90% <₹30L | Lowest rates for govt employees |
| HDFC Ltd (now merged HDFC Bank) | 700 | CIBIL + Experian | ₹25,000/month | 90% | Most trusted home lender |
| ICICI Home Finance | 700 | CIBIL | ₹25,000/month | 90% | Digital journey; 3-day approval |
| Axis Bank | 700 | CIBIL | ₹25,000/month | 85% | Good for self-employed |
| LIC Housing Finance | 700 | CIBIL | ₹20,000/month | 90% | PSB-like; best for aged borrowers |
| PNB Housing Finance | 700 | CIBIL | ₹20,000/month | 90% | Tier 2/3 strong |
| Bajaj Housing Finance | 725 | Experian | ₹25,000/month | 85% | Fast digital process |
| Aadhar Housing Finance | 650 | CRIF + CIBIL | ₹10,000/month | 85% | EWS/LIG segment |
| Home First Finance | 650 | CRIF | ₹10,000/month | 90% | Self-employed; informal income |

### 6.1.3 FOIR Calculation for Home Loans

```
HOME LOAN FOIR EXAMPLE

User Profile:
  Gross Income: ₹1,00,000/month
  Existing EMIs: ₹20,000/month (car loan + credit card)
  
Step 1: Calculate available FOIR capacity
  Bank allows 50% FOIR
  Available for new EMI: ₹1,00,000 × 50% - ₹20,000 = ₹30,000

Step 2: Calculate max home loan from EMI capacity
  ₹30,000 EMI × 25-year tenure × current rate ~8.5%
  = Approximately ₹37–38 lakh home loan

Step 3: Check LTV constraint
  If property costs ₹50 lakh, LTV 90% = max loan ₹45 lakh
  FOIR constraint is binding: max loan ₹37–38 lakh
  Down payment required: ₹50L - ₹37L = ₹13L minimum

LeapMoney Home Loan Tool should show this calculation in real-time.
```

### 6.1.4 Co-Applicant Strategy

- Adding a working spouse increases combined income base
- If both co-own the property: each can claim ₹2L tax deduction (Section 24) + ₹1.5L (Section 80C) = ₹7L total family deduction
- PMAY subsidy: If female is co-applicant/primary owner → eligible for additional subsidy

---

# SECTION 7: BUSINESS LOAN INTELLIGENCE

## 7.1 MSME Loan Approval Logic

### 7.1.1 Core Approval Framework

| Parameter | Banks | NBFCs | Digital Lenders |
|---|---|---|---|
| Business vintage | 3 years | 2 years | 1 year |
| Annual turnover | ₹25L+ | ₹10L+ | ₹5L+ |
| Credit score | 700+ | 650+ | 600+ |
| ITR required | 2 years | 1–2 years | Optional |
| GST required | Preferred | Preferred | Preferred |
| Collateral | Often required >₹25L | Optional | Not required |
| FOIR (business) | 40–50% | 50–60% | 65% |
| Loan range | ₹5L–₹5Cr | ₹1L–₹2Cr | ₹50K–₹50L |
| Interest rate | 9–15% | 14–22% | 18–36% |

### 7.1.2 Government MSME Loan Schemes

| Scheme | Eligibility | Max Loan | Key Benefit |
|---|---|---|---|
| Mudra Loan (Shishu) | Any business | ₹50,000 | No collateral; low documentation |
| Mudra Loan (Kishore) | Business >1 year | ₹5 lakh | Low rate; government guarantee |
| Mudra Loan (Tarun) | Established business | ₹10 lakh | Scale-up financing |
| CGTMSE | MSMEs | ₹5 crore | No collateral guarantee from government |
| PSB Loans in 59 Min | GST registered | ₹5 crore | Pre-approval in 59 minutes |
| SIDBI Direct | MSMEs | ₹25 lakh | Development bank rates |

### 7.1.3 GST-Based Working Capital (GST Sahay)

**GST Sahay** is a government platform that enables invoice-based working capital loans:
- Lender sees real GST invoices
- Loan amount = % of outstanding invoices
- No separate income proof needed
- Fast disbursal: 48–72 hours

**Integration for LeapMoney:** Setu's GST integration allows pulling a user's GST data with consent. This can feed directly into business loan matching.

### 7.1.4 Digital Underwriting Models

**PSB Loans in 59 Minutes:**
- Integrates GST + ITR + bank statement + bureau in one flow
- Pre-approval in 59 minutes for ₹1L–₹5Cr
- Used by SBI, PNB, BoB, Canara, BoI
- **API integration opportunity for LeapMoney:** Route MSME users to this platform via embedded flow

**Fintech MSME Lenders:**

| Lender | Specialty | Approval Logic | Key Data |
|---|---|---|---|
| Lendingkart | Working capital | Bank statement analysis | 6-month GST + bank statement |
| FlexiLoans | Flexible EMI | Revenue-based repayment | Daily/weekly collections |
| Indifi | Sectoral | Restaurant, retail focus | Zomato/Swiggy data for restaurants |
| Yubi (CredAvenue) | Co-lending | Bank + NBFC collaboration | Credit-rated MSMEs |
| NeoGrowth | Merchant cash advance | Card swipe + POS data | Merchant financial history |

---

# SECTION 8: ALTERNATIVE DATA INTELLIGENCE

## 8.1 Alternative Data Sources and Credit Signals

### 8.1.1 UPI Transaction Analysis

**What can be extracted from UPI data:**

| Signal | Credit Insight | Reliability |
|---|---|---|
| Average monthly inflow | Income proxy | High |
| Income regularity | Stability signal | High |
| Salary date pattern | Salaried confirmation | Very High |
| Merchant payment patterns | Spending discipline | Medium |
| Declined transactions (insufficient funds) | Cash flow stress | High |
| Inflow sources (business/personal) | Income type | Medium |
| Merchant categories | Lifestyle/risk | Medium |
| Transfer to self (savings behavior) | Financial discipline | Medium |

**Who accesses UPI data:** Via Account Aggregator (with user consent), or via NPCI data partnerships. NOT publicly available — requires explicit user consent.

**Repayment prediction accuracy:** 75–85% default prediction accuracy for thin-file borrowers using UPI data alone (comparable to traditional bureau scoring).

### 8.1.2 GST Data Analysis

| GST Signal | Credit Insight |
|---|---|
| GST turnover (monthly) | Revenue/income proxy |
| GST filing regularity | Discipline signal |
| Input tax credit pattern | Business scale |
| HSN codes filed | Industry/risk category |
| Year-on-year GST growth | Business health |
| GST payment vs. liability | Tax compliance |

**Access method:** GSTN API (via Setu, Decentro, or direct); requires user PAN + consent.

### 8.1.3 Utility Bill Payment History

| Utility Type | Signal | Reliability |
|---|---|---|
| Electricity bill | Payment discipline | High |
| Piped gas / LPG | Regular payments | Medium |
| Water board | Payment discipline | Medium |
| Postpaid mobile | Credit behavior proxy | High |
| Broadband | Payment regularity | Medium |
| DTH subscription | Regular commitment | Low-Medium |

**Access method:** BBPS (Bharat Bill Payment System) via Setu BBPS API — provides last 12 months of utility payment history.

**Key insight:** Postpaid mobile bill payment history is the single best utility proxy for credit behavior. If someone pays their ₹999/month Jio postpaid on the 1st of every month for 12 months, it strongly predicts loan repayment.

### 8.1.4 Telecom / Mobile Usage Data

| Signal | Credit Insight | Data Source |
|---|---|---|
| Prepaid vs. postpaid | Postpaid = more creditworthy signal | Operator data |
| Monthly recharge amount | Income proxy | Operator data |
| Roaming usage | Travel/business activity | Operator data |
| Phone model used | Socioeconomic proxy | Device ID |
| App usage patterns | Financial literacy | Device analytics |

**Access method:** Requires telecom partnerships (Airtel, Jio, Vi data programs). CreditVidya accesses some of this via partner agreements.

**For LeapMoney:** Direct telecom access is complex. Better to access via CreditVidya API (B2B alternative data provider).

### 8.1.5 Alternative Data Scoring Models in India (2025)

**Model 1: Bureau + Alternative Hybrid (Most Accurate)**
- Combines CIBIL/Experian with UPI + utility + GST
- 15–20% better default prediction than bureau alone
- Used by: Navi, MoneyView, KreditBee (internal models)

**Model 2: Pure Alternative Data (Thin-File Only)**
- No bureau data; uses only UPI + telecom + device
- 75–85% default prediction accuracy
- Used for: First loan, NTC borrowers
- Providers: CreditVidya, FinBox, Lenddo (international)

**Model 3: Account Aggregator Cash Flow Scoring**
- Bank statement analysis via AA
- Income verification, salary crediting, EMI payment patterns
- Most lender-grade of all alternative models
- Used by: Lenders directly; Perfios provides the analysis layer
- 10% higher sanction rate documented in Sahamati research

---

## 8.2 Alternative Data Integration Recommendation for LeapMoney

```
LEAPMONEY ALTERNATIVE DATA STACK (Priority Order)

Priority 1 — Account Aggregator (Year 1, Q3)
  Source: Setu AA API (registered FIU)
  Data: 12-month bank statement, income patterns, EMI commitments
  Value: Highest quality; lender-grade; consent-first
  Use: Enrich LeapScore for all users; improve LeapMatch accuracy

Priority 2 — GST Data (Year 1, Q4 — for self-employed)
  Source: Decentro GST API or Setu
  Data: Monthly turnover, filing regularity, HSN codes
  Value: Self-employed income verification
  Use: Business loan matching; self-employed LeapScore

Priority 3 — BBPS Utility Data (Year 2, Q1)
  Source: Setu BBPS API
  Data: 12 months utility payment history
  Value: Thin-file enrichment; discipline signal
  Use: LeapScore thin-file boost

Priority 4 — CreditVidya API (Year 2, Q2 — for NTC users)
  Source: CreditVidya B2B API
  Data: Telecom + social + device analytics
  Value: First-loan approval for truly thin-file users
  Use: Special NTC-targeted loan matching
```

---

# SECTION 9: LEAPSCORE DATA DICTIONARY

## 9.1 Complete Field Specification

### 9.1.1 Input Data Schema

```
LEAPSCORE INPUT SCHEMA v2.0

USER IDENTITY
  user_id: UUID (internal)
  pan_number: String (encrypted, used for bureau pull)
  mobile_number: String (OTP verified)
  aadhaar_last4: String (for identity matching)
  consent_timestamp: DateTime (mandatory before any pull)

BUREAU DATA — Layer A (Weight: 55% in LeapScore)
  cibil_score: Integer (300–900 | null if no history)
  cibil_report_date: Date
  cibil_score_reason_codes: Array[String] (top 4 reason codes from bureau)
  experian_score: Integer (300–900 | null)
  experian_report_date: Date
  crif_score: Integer (300–900 | null)
  equifax_score: Integer (1–999 | null)
  bureau_pull_type: Enum [SOFT | HARD]
  
  PER ACCOUNT (from credit report — array of tradelines)
  account_type: Enum [CREDIT_CARD | PERSONAL_LOAN | HOME_LOAN | AUTO_LOAN | OVERDRAFT | GOLD_LOAN | MICROFINANCE | BUSINESS_LOAN]
  lender_name: String
  sanctioned_amount: Integer
  current_balance: Integer
  credit_limit: Integer (for revolving credit)
  amount_overdue: Integer
  emi_amount: Integer
  account_status: Enum [STANDARD | SETTLEMENT | WRITE_OFF | NPA | CLOSED]
  dpd_last_36_months: Array[Integer] (0 = on time; value = days past due)
  date_opened: Date
  date_closed: Date (null if open)
  ownership_type: Enum [INDIVIDUAL | JOINT | GUARANTOR]

CASH FLOW DATA — Layer B (Weight: 25% in LeapScore, via AA)
  aa_consent_active: Boolean
  bank_account_count: Integer (number of accounts linked via AA)
  avg_monthly_credit_6mo: Integer (average monthly inflow, last 6 months)
  avg_monthly_debit_6mo: Integer (average monthly outflow, last 6 months)
  salary_credit_detected: Boolean
  salary_credit_day: Integer (day of month salary credited, 1–31)
  salary_credit_amount: Integer
  emi_payments_detected: Array[{lender, amount, day}] (auto-detected from statements)
  months_with_negative_balance: Integer (count in last 12 months)
  months_with_returned_emi: Integer (bounced EMIs in last 12 months)
  cash_flow_trend: Enum [GROWING | STABLE | DECLINING]
  aa_data_months: Integer (how many months of data available)
  income_source_type: Enum [SALARIED | BUSINESS | MIXED | UNCLEAR]
  
PAYMENT BEHAVIOR — Layer C (Weight: 15%, via BBPS + utility)
  utility_bills_tracked: Boolean
  utility_payment_on_time_pct: Float (0.0–1.0, last 12 months)
  postpaid_mobile_payment_history: Array[Boolean] (last 12 months, true = on time)
  electricity_payment_history: Array[Boolean]
  gst_filed_months: Integer (of last 12 months)
  gst_filing_regular: Boolean
  
ACCOUNT HEALTH — Layer D (Weight: 5%)
  credit_utilization_overall: Float (total balance ÷ total limit)
  credit_utilization_credit_card: Float (card balance ÷ card limit)
  oldest_account_age_months: Integer
  average_account_age_months: Integer
  credit_account_count_total: Integer
  secured_account_count: Integer
  unsecured_account_count: Integer
  hard_inquiries_last_6m: Integer
  hard_inquiries_last_12m: Integer
```

### 9.1.2 LeapScore Computation Model

```
LEAPSCORE v2.0 CALCULATION

Step 1: Bureau Score Composite (55% weight)
  
  If 3+ bureaus available:
    bureau_composite = (CIBIL × 0.45) + (Experian × 0.35) + (CRIF × 0.20)
    [Convert CRIF/Equifax to 300-900 scale before weighting]
  
  If only CIBIL:
    bureau_composite = CIBIL_score
  
  If only Experian:
    bureau_composite = Experian_score
  
  If no bureau score (thin file):
    bureau_composite = 0 [handled in thin-file path below]
  
  bureau_component = (bureau_composite / 900) × 55

Step 2: Cash Flow Score (25% weight — requires AA data)
  
  If AA data available:
    Income stability (0–30 pts): 
      GROWING trend: 30 pts
      STABLE: 20 pts
      DECLINING: 5 pts
    
    Cash flow health (0–40 pts):
      months_negative_balance = 0: 40 pts
      1–2 months: 25 pts
      3+: 5 pts
    
    Income verification (0–30 pts):
      salary_credit_detected + regular: 30 pts
      business income regular: 22 pts
      irregular credits: 10 pts
    
    aa_raw_score = (income_stability + cash_flow_health + income_verification)
    cash_flow_component = (aa_raw_score / 100) × 25
  
  If no AA:
    cash_flow_component = (bureau_composite / 900) × 15
    [Fallback: use bureau as proxy, lower weight]

Step 3: Payment Behavior (15% weight)
  
  utility_score = utility_payment_on_time_pct × 50
  gst_score = (gst_filed_months / 12) × 30
  mobile_score = (postpaid_on_time_count / 12) × 20
  
  behavior_raw = utility_score + gst_score + mobile_score
  behavior_component = (behavior_raw / 100) × 15

Step 4: Account Health (5% weight)
  
  utilization_pts = MAX(0, 40 × (1 - credit_utilization_overall/0.3))
  [Full 40 pts at 0% utilization; 0 pts at 30%+ utilization]
  
  account_age_pts = MIN(30, oldest_account_age_months × 0.5)
  
  inquiry_pts = MAX(0, 30 - hard_inquiries_last_6m × 10)
  
  health_raw = utilization_pts + account_age_pts + inquiry_pts
  health_component = (health_raw / 100) × 5

Step 5: Final LeapScore
  
  leapscore = bureau_component + cash_flow_component + behavior_component + health_component
  
  [Score output: 300–900 range to match bureau familiarity]
  final_leapscore = 300 + (leapscore × 6.0)
  
  Round to nearest integer.

THIN-FILE PATH (No bureau score):
  If bureau_composite = 0 AND aa_data available:
    leapscore uses: cash_flow_component (50%) + behavior_component (35%) + health_component (15%)
    Confidence flag: "ALTERNATIVE_DATA_ONLY"
  
  If no bureau AND no AA:
    Do not generate LeapScore — show "Score Unavailable" + starter path
```

### 9.1.3 LeapScore Output Schema

```
LEAPSCORE OUTPUT SCHEMA

leapscore: Integer (300–900)
leapscore_date: DateTime
confidence_level: Enum [HIGH | MEDIUM | LOW | ALTERNATIVE_DATA_ONLY]
data_sources_used: Array[Enum] [CIBIL | EXPERIAN | CRIF | EQUIFAX | AA | BBPS | GST]

bureau_breakdown:
  cibil: Integer | null
  experian: Integer | null
  crif: Integer | null
  equifax_normalized: Integer | null (equifax score normalized to 300-900)

score_range_label: String (e.g., "Very Good")
score_percentile: Integer (approximate — 742 = top 28% of India borrowers)

what_is_helping: Array[{factor: String, impact: Enum[HIGH|MEDIUM|LOW], detail: String}]
  Example: [{factor: "Payment History", impact: "HIGH", detail: "All EMIs paid on time for 36 months"}]

what_is_holding_back: Array[{factor: String, impact: Enum[HIGH|MEDIUM|LOW], detail: String, fix: String}]
  Example: [{factor: "Credit Utilization", impact: "HIGH", detail: "₹45,000 used of ₹60,000 limit (75%)", fix: "Reduce to <₹18,000 (30%) for +25 point boost"}]

score_improvement_actions: Array[{
  action: String,
  estimated_point_gain: Integer,
  difficulty: Enum[EASY|MEDIUM|HARD],
  timeline_days: Integer,
  priority: Integer (1=highest)
}]

loan_eligibility_snapshot: {
  personal_loan_max: Integer (estimated max loan amount)
  home_loan_max: Integer (estimated max home loan)
  credit_card_limit: Integer (estimated card limit)
  current_best_rate: Float (lowest available rate for profile)
}

next_milestone: {
  target_score: Integer (e.g., 760)
  days_to_achieve: Integer (estimate)
  what_unlocks: String (e.g., "Qualifies for HDFC Bank Personal Loan at 11.5%")
}

credit_cost_indicator: {
  current_rate_estimate: Float (e.g., 14.5%)
  at_750_rate: Float (e.g., 11.5%)
  monthly_saving_on_10L_5yr: Integer (e.g., 2400)
  total_saving_5yr: Integer (e.g., 144000)
}
```

---

# SECTION 10: LEAPMATCH DATA DICTIONARY

## 10.1 Complete Matching Engine Specification

### 10.1.1 Input Schema

```
LEAPMATCH INPUT SCHEMA v2.0

USER PROFILE (from LeapScore data + user inputs)
  leapscore: Integer
  cibil_score: Integer | null
  experian_score: Integer | null
  crif_score: Integer | null
  monthly_net_income: Integer (user-stated or AA-verified)
  income_verification_source: Enum [SALARY_SLIP | AA_VERIFIED | ITR | SELF_STATED]
  employment_type: Enum [SALARIED_MNC | SALARIED_SME | SALARIED_GOVT | SELF_EMPLOYED_GST | SELF_EMPLOYED_NO_GST | PROFESSIONAL | FREELANCER]
  employer_name: String | null
  employer_category: Enum [LISTED_COMPANY | MNC | GOVT | PSU | SME | UNKNOWN]
  years_at_current_employer: Float
  total_work_experience_years: Float
  city_tier: Enum [METRO | TIER_1 | TIER_2 | TIER_3]
  pin_code: String
  age: Integer
  foir_current: Float (existing EMI obligations ÷ income)
  existing_bank_relationships: Array[String] (bank names where user has accounts)
  existing_loan_with_lender: Array[String] (if any active loans)
  hard_inquiries_last_6m: Integer
  has_settlement_or_writeoff: Boolean
  months_since_last_delinquency: Integer | null
  gst_registered: Boolean
  gst_monthly_turnover: Integer | null
  aa_cash_flow_verified: Boolean

LOAN REQUEST
  loan_type: Enum [PERSONAL | HOME | BUSINESS | AUTO | EDUCATION | GOLD | LAP | CREDIT_CARD]
  loan_amount_requested: Integer
  tenure_months: Integer (preferred)
  purpose: Enum [MEDICAL | WEDDING | TRAVEL | HOME_RENOVATION | DEBT_CONSOLIDATION | EDUCATION | BUSINESS | OTHER]
  urgency: Enum [IMMEDIATE (24h) | STANDARD (3-7 days) | FLEXIBLE]
  preference: Enum [LOWEST_RATE | HIGHEST_APPROVAL_CHANCE | FASTEST | BALANCED]
  collateral_available: Boolean
  property_value: Integer | null (for home loan / LAP)
  down_payment_available: Integer | null
```

### 10.1.2 Lender Intelligence Database Schema (Internal)

```
LENDER DATABASE SCHEMA (maintained by LeapMoney team)

lender_id: UUID
lender_name: String
lender_type: Enum [PSB | PRIVATE_BANK | SFB | NBFC | DIGITAL_NBFC | COOPERATIVE]
products: Array[Enum] [PERSONAL | HOME | BUSINESS | AUTO | GOLD | CREDIT_CARD | UPI_CREDIT]

PER PRODUCT:
  min_leapscore: Integer (LeapMoney internal; maps to bureau minimums)
  min_cibil: Integer
  min_experian: Integer
  primary_bureau: Enum [CIBIL | EXPERIAN | CRIF | EQUIFAX]
  secondary_bureau: Enum | null
  
  min_income_salaried: Integer
  min_income_self_employed: Integer
  max_foir: Float
  min_employment_months: Integer
  min_business_vintage_months: Integer
  
  loan_amount_min: Integer
  loan_amount_max: Integer
  tenure_min_months: Integer
  tenure_max_months: Integer
  
  current_interest_rate_min: Float (updated weekly via API or manual)
  current_interest_rate_max: Float
  processing_fee_type: Enum [PERCENTAGE | FIXED | NIL]
  processing_fee_value: Float
  prepayment_penalty: Float | null
  
  avg_disbursal_days: Float (updated from application outcomes)
  approval_rate_by_score_band: {
    "750_plus": Float,
    "700_749": Float,
    "650_699": Float,
    "600_649": Float,
    "below_600": Float
  }
  
  accepts_nri: Boolean
  accepts_self_employed_no_itr: Boolean
  accepts_new_to_credit: Boolean
  pin_code_blacklist: Array[String]
  employer_blacklist: Array[String]
  
  user_review_score: Float (1.0–5.0, from LeapMoney review system)
  review_count: Integer
  
  api_integration_status: Enum [FULL_API | PARTIAL | MANUAL | NOT_INTEGRATED]
  application_url: String (for redirect if not API)
  
  last_updated: DateTime
```

### 10.1.3 Matching Algorithm Logic

```
LEAPMATCH ALGORITHM v2.0

STEP 1: ELIGIBILITY FILTER (Hard Rules — Pass/Fail)
  For each lender in database:
  
  PASS conditions (all must be true):
    user.primary_bureau_score >= lender.min_{primary_bureau}
    user.loan_amount_requested >= lender.loan_amount_min
    user.loan_amount_requested <= lender.loan_amount_max
    user.monthly_net_income >= lender.min_income_{employment_type}
    user.foir_current + (new_emi / income) <= lender.max_foir
    user.age >= 21 AND user.age <= 65 (standard; varies by lender)
    user.pin_code NOT IN lender.pin_code_blacklist
    user.employer_name NOT IN lender.employer_blacklist (if known)
    IF lender.accepts_new_to_credit == FALSE AND user.has_no_bureau == TRUE → FAIL
    IF lender.accepts_self_employed_no_itr == FALSE AND user.employment_type == SELF_EMPLOYED_NO_GST → FAIL
  
  Output: eligible_lenders[] (passed), ineligible_lenders[] (failed, with reason)

STEP 2: APPROVAL PROBABILITY SCORING (0–100 for each eligible lender)
  
  Base probability from score band:
    score = user.primary_bureau_score (of primary bureau lender uses)
    base_prob = lender.approval_rate_by_score_band[score_band]
  
  Modifiers applied:
    existing_relationship_bonus:
      IF lender.lender_name IN user.existing_bank_relationships: +15 pts
      IF lender.lender_name IN user.existing_loan_with_lender (good standing): +10 pts
    
    employer_quality_bonus:
      IF employer_category == GOVT: +10 pts
      IF employer_category == MNC: +8 pts
      IF employer_category == LISTED_COMPANY: +5 pts
      IF employer_category == UNKNOWN: -5 pts
    
    inquiry_penalty:
      hard_inquiries_6m = 0: 0 pts
      1–2: -5 pts
      3–4: -15 pts
      5+: -30 pts
    
    foir_modifier:
      IF computed_foir < 0.35: +8 pts
      IF computed_foir 0.35–0.45: +3 pts
      IF computed_foir 0.45–0.55: -5 pts
      IF computed_foir > 0.55: -15 pts
    
    aa_verified_income_bonus:
      IF user.aa_cash_flow_verified == TRUE: +7 pts
    
    settlement_penalty:
      IF user.has_settlement_or_writeoff: -20 pts
      IF months_since_last_delinquency < 12: -15 pts
    
    purpose_modifier:
      IF purpose == DEBT_CONSOLIDATION: -10 pts
      IF purpose == MEDICAL: +5 pts
    
    urgency_fit:
      IF urgency == IMMEDIATE AND lender.avg_disbursal_days > 3: -10 pts
    
    approval_probability = CLAMP(base_prob + all_modifiers, 5, 95)
    [Cap at 5% min and 95% max — never show 0% or 100%]

STEP 3: RANKING (based on user preference)
  
  IF preference == BALANCED:
    match_score = (approval_probability × 0.40) 
                + (rate_competitiveness_score × 0.30)
                + (disbursal_speed_score × 0.15)
                + (user_review_score × 0.15)
  
  IF preference == LOWEST_RATE:
    match_score = (approval_probability × 0.20)
                + (rate_competitiveness_score × 0.60)
                + (disbursal_speed_score × 0.10)
                + (user_review_score × 0.10)
  
  IF preference == HIGHEST_APPROVAL_CHANCE:
    match_score = (approval_probability × 0.70)
                + (rate_competitiveness_score × 0.15)
                + (disbursal_speed_score × 0.10)
                + (user_review_score × 0.05)
  
  IF preference == FASTEST:
    match_score = (approval_probability × 0.30)
                + (rate_competitiveness_score × 0.10)
                + (disbursal_speed_score × 0.50)
                + (user_review_score × 0.10)
  
  rate_competitiveness_score = 100 × (1 - (lender.rate - market_min_rate) / (market_max_rate - market_min_rate))
  disbursal_speed_score = 100 × (1 - lender.avg_disbursal_days / max_disbursal_days)
  
  Sort eligible_lenders by match_score DESC

STEP 4: OUTPUT GENERATION
  
  For each lender (ranked):
    Generate: offer card with approval_probability, estimated_emi, rate, fees, disbursal_time
    Generate: match_reason (natural language via Claude API — 1–2 sentences)
    
  For ineligible_lenders:
    Show: "Not matched — [reason]" section
    For each: show what score/income is needed to qualify
    
  RBI 2025 Compliance:
    All eligible AND ineligible lenders must be shown (cannot hide ineligible to push to eligible)
    APR must be displayed (not just flat rate)
    Processing fees shown before application
    Ranking logic summary shown to user (transparency)
```

### 10.1.4 LeapMatch Output Schema

```
LEAPMATCH OUTPUT SCHEMA

match_session_id: UUID
match_date: DateTime
user_id: UUID
loan_request: {type, amount, tenure, purpose, preference}

matched_lenders: Array[{
  lender_id: UUID
  lender_name: String
  rank: Integer (1 = best match)
  match_badge: Enum [BEST_MATCH | LOWEST_RATE | FASTEST | BEST_FOR_SCORE | EASIEST_DOCS]
  
  approval_probability: Integer (5–95)
  approval_probability_label: String (e.g., "Very High", "Good", "Moderate", "Low")
  
  interest_rate_min: Float
  interest_rate_max: Float
  rate_display: String (e.g., "11.0% – 14.5%")
  
  emi_estimate_min: Integer
  emi_estimate_max: Integer
  
  processing_fee_display: String (e.g., "1% of loan amount")
  annual_percentage_rate: Float (APR including fees — RBI 2025 requirement)
  
  tenure_offered: String (e.g., "12–60 months")
  avg_disbursal_days: Float
  disbursal_label: String (e.g., "48-72 hours")
  
  user_review_score: Float
  review_count: Integer
  
  match_reason: String (AI-generated, max 2 sentences)
  
  application_type: Enum [API_INTEGRATED | REDIRECT | MANUAL]
  apply_url: String
  prefill_available: Boolean
  prefill_fields: Array[String]
  
  bureau_that_will_be_pulled: Enum [CIBIL | EXPERIAN | CRIF]
  hard_inquiry_warning: Boolean (true = applying will create hard inquiry)
}]

not_matched_lenders: Array[{
  lender_id: UUID
  lender_name: String
  reason: Enum [SCORE_TOO_LOW | INCOME_TOO_LOW | FOIR_TOO_HIGH | EMPLOYMENT_TYPE | GEOGRAPHY | OTHER]
  reason_display: String (user-friendly explanation)
  what_you_need: String (e.g., "Need CIBIL 730+; you have 710. In 90 days: possible.")
  action_link: String (link to score improvement plan)
}]

ranking_methodology: String (RBI 2025 requirement — explain how ranking works)
```

---

## 10.2 EMI Calculation Formula

```
EMI CALCULATION (Standard Reducing Balance Method)

EMI = P × r × (1+r)^n / ((1+r)^n - 1)

Where:
  P = Principal loan amount
  r = Monthly interest rate (annual rate ÷ 12 ÷ 100)
  n = Tenure in months

Example:
  P = ₹10,00,000 (₹10 lakh)
  Annual rate = 12%
  r = 12 / 12 / 100 = 0.01
  n = 60 months (5 years)
  
  EMI = 10,00,000 × 0.01 × (1.01)^60 / ((1.01)^60 - 1)
      = 10,00,000 × 0.01 × 1.8167 / 0.8167
      = 10,00,000 × 0.02224
      = ₹22,244/month

APR Calculation (includes processing fee):
  Effective loan received = P - processing_fee
  Use effective principal in EMI formula to get APR
  APR is always higher than stated interest rate
```

---

## 10.3 Approval Odds Engine — Testing Framework

### Cold Start Problem (Year 1) and Solution

**Problem:** LeapMatch needs historical approval data to train the model, but in Year 1 we have zero data.

**Solution — 3-Phase Approach:**

**Phase 1 — Cold Start (Months 1–6):**
Use industry data as baseline:
- Lender-published minimum eligibility criteria
- Industry approval rate estimates by score band
- RBI data on loan origination by lender type and segment
Approval probability = rule-based engine (not ML yet)

**Phase 2 — Data Accumulation (Months 7–18):**
Track every LeapMoney application:
- User profile at time of application
- Which lender they applied to
- Was approved / rejected?
- What rate was offered?
- Did they proceed with disbursal?
This builds the training dataset.

**Phase 3 — ML Model (Month 18+, ~10,000 outcomes):**
Train XGBoost / LightGBM model on:
- Features: LeapScore components, FOIR, income, employment, city tier
- Target: binary approval (approved=1, rejected=0)
- Validation: AUC-ROC >0.75 required before deployment
This replaces the rule-based engine with a trained model.

---

# APPENDIX: KEY FORMULAS AND QUICK REFERENCE

## A. Credit Utilization Formula
```
Credit Utilization = (Total credit card balances) ÷ (Total credit card limits) × 100
Target: <30% for healthy score | <10% for maximum score benefit
```

## B. FOIR Formula
```
FOIR = (Sum of all fixed monthly obligations including new EMI) ÷ (Net monthly income) × 100
Bank limit: <50% | NBFC limit: <60% | Digital: <65%
```

## C. Home Loan Eligibility Quick Estimate
```
Max Home Loan EMI = Monthly income × 0.50 (FOIR) - Existing EMIs
Max Home Loan = EMI × tenure factor (see EMI formula above)
LTV Cap: 90% of property value (<₹30L) | 75% (₹30–75L) | 60–70% (>₹75L)
Max Loan = MIN(FOIR-based calculation, LTV-based calculation)
```

## D. Score Improvement Priority Matrix
```
Action                          | Points Gained | Effort | Timeline
Pay overdue amount              | +30 to +50    | Low    | 30–60 days after reporting
Reduce CC utilization to <30%   | +20 to +30    | Low    | 1 billing cycle (30 days)
Reduce CC utilization to <10%   | +10 to +20    | Low    | 1 billing cycle (30 days)
Dispute and fix report error    | +20 to +60    | Medium | 30–60 days (bureau process)
Wait for old DPD to age (24mo) | +15 to +25    | Zero   | Time-based
Close unused card (careful)     | Varies        | Low    | 1–2 months
Add secured credit (FD card)    | +10 to +30    | Low    | 6 months of history
Maintain 0 new inquiries 6mo   | +10 to +20    | Low    | 6 months of no applications
Pay all EMIs on time            | +20 to +50    | Low    | 6–12 months
```

## E. Bureau Score Interpretation (All Bureaus, 300–900 Scale)

```
300–549: Poor — Rebuild required
550–649: Below Average — Limited options; high cost
650–699: Average — Digital lenders; NBFCs; not banks
700–749: Good — Most NBFCs; some private banks
750–799: Very Good — All banks; competitive rates
800–900: Excellent — Pre-approved; best rates; premium products
```

---

*R3 Research compiled by LeapMoney Founding Team*  
*Sections A–J complete. All 10 sections cover: Bureau Intelligence, Lender Database, Approval Framework, Rejection Analysis, Self-Employed Logic, Home Loan, Business Loan, Alternative Data, LeapScore Data Dictionary, LeapMatch Engine Specification*  
*Classification: Engineering + Product Internal Reference*  
*Next: Sprint 7 — LeapScore Implementation | Sprint 8 — LeapMatch Implementation*  
*Previous: R2 — LeapMoney_Market_Intelligence_Report_R2.md*
