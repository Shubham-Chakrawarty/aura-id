# ADR-003: Quality Automation & CI/CD

- **Status:** `Accepted`
- **Date:** 2026-01-10 (Revised 2026-01-21)
- **Deciders:** @shubham-chakrawarty
- **Scope:** DevOps / Infrastructure / DX (Developer Experience)

---

### 1. Context

As AuraID follows a **Single User, Multi-Context** model, the shared types in `packages/shared` are critical. A tiny change can cause a "Butterfly Effect" across the monorepo. We need a multi-layered safety net that catches errors **instantly** (on the developer's machine) and **definitively** (in the cloud) before code is merged.

### 2. Decision

We will implement a dual-stage automation pipeline using **Husky** for local gating and **GitHub Actions** for cloud verification.

### Technical Specifics

**Stage 1: The Local Gatekeeper (Pre-Commit)**

- **Husky & lint-staged:** Intercepts `git commit` to run `prettier --write` and `eslint --fix` on **staged files only**.
- **Commitlint:** Enforces **Conventional Commits** (`feat(auth): ...`) via the `commit-msg` hook.

**Stage 2: The Cloud Safety Net (CI Pipeline)**

- **Platform:** GitHub Actions (Ubuntu-latest).
- **Environment:** `pnpm/action-setup` with **Caching** enabled for the pnpm store.
- **Workflow Steps (`pnpm -r`):**
  1. `pnpm install --frozen-lockfile` (Ensures deterministic builds).
  2. `pnpm lint` (Final styling check).
  3. `pnpm typecheck` (Verifies TypeScript integrity across all apps).
  4. `pnpm build` (Ensures all artifacts compile correctly).

### 3. Rationale

- **Shift-Left Security:** Finding a lint error 1 second after committing (Husky) is significantly cheaper than finding it 5 minutes later in the cloud (CI).
- **Contract Protection:** Type-checking in CI prevents "Type Drift" between the Frontend and Backend packages.
- **Searchable History:** Standardized commit messages allow us to automate changelogs and trace feature evolution.
- **Lean Architecture:** Using native `pnpm -r` commands avoids the complexity of additional orchestrators like Turborepo during the initial MVP phase.

### 4. Consequences

- **Positive:** Zero "style-fix" commits in history; consistent code quality; immediate feedback for developers.
- **Negative/Risks:** Increased "commit friction." You cannot commit "dirty" code.
- **Mitigation:** Use `-no-verify` for local WIP branches only; strictly forbidden for PRs to `main`.
