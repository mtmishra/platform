# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest (`develop`) | ✅ |
| `main` (production) | ✅ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Email: **security@leapmoney.net**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

We will acknowledge receipt within **48 hours** and provide a resolution timeline within **7 business days**.

## Scope

In scope:
- All apps at `*.leapmoney.net`
- Authentication and session management
- Data exposure (borrower PII, financial data)
- Injection vulnerabilities (SQL, XSS, CSRF)
- Broken access control between portals

Out of scope:
- Demo mode mock data
- Rate limiting on public pages
- Social engineering

## Data & Compliance

LeapMoney processes sensitive financial and personal data under:
- **DPDP Act 2023** — All data stored in India (ap-south-1)
- **RBI Digital Lending Directions 2025**
- **FAIR Practices Code**

Vulnerabilities involving borrower financial data or KYC information will be treated as **Critical** and escalated immediately.
