# Contributing to LeapMoney Platform

## Branch Naming

```
feature/<short-description>   ← New features
fix/<short-description>       ← Bug fixes
chore/<short-description>     ← Dependencies, config, tooling
docs/<short-description>      ← Documentation only
```

Examples:
- `feature/borrower-kyc-flow`
- `fix/dsa-commission-rounding`
- `chore/upgrade-next-15`

## Commit Messages

Format: `type: short description`

```
feat: add LeapScore improvement simulator
fix: correct FOIR calculation for self-employed
chore: upgrade @supabase/ssr to 0.6
docs: add Supabase setup guide
refactor: extract bureau adapter to shared package
```

## Pull Requests

1. Branch off `develop` — never commit directly to `main`
2. Fill the PR template completely
3. CI must pass (type-check + lint + build)
4. Squash merge preferred for feature branches

## Development Rules

Read `.claude/DEVELOPMENT_RULES.md` before making code changes. Key rules:

- **Animation:** Only `transform` and `opacity` — never `width`, `height`, `top`, `background-color`
- **Demo data:** Always use `@leapmoney/demo-data` constants — no hardcoded numbers
- **TypeScript:** No `any`, no `@ts-ignore` — strict mode enforced
- **Secrets:** Never commit `.env.local`, API keys, or tokens

## Local Development

```bash
pnpm install
pnpm dev         # All 6 apps
pnpm type-check  # Before every PR
pnpm build       # Verify build passes
```

## Questions

Raise an issue or contact the engineering team at engineering@leapmoney.net
