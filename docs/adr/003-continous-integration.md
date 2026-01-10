# ADR 003: Continuous Integration with GitHub Actions

## Status

Accepted

## Context

AuraID is a monorepo-based Identity Provider (IdP) consisting of multiple applications and shared packages, including:

- `apps/server`
- `apps/auth-portal`
- `packages/shared`

To maintain high code quality and prevent **type drift** between the backend, frontend, and shared domain logic, we require an automated verification system.

The CI solution must:

- Integrate natively with GitHub (where the codebase is hosted)
- Support `pnpm` workspaces efficiently
- Be cost-effective for a single-developer startup / side project
- Enforce linting, type checking, and build validation on every change

## Decision

We will use **GitHub Actions** as the primary Continuous Integration platform for AuraID.

Instead of adopting advanced monorepo orchestration tools (such as Turborepo or Nx), we will rely on **pnpm’s native recursive workspace commands (`pnpm -r`)** to execute tasks across all packages.

This approach keeps the CI pipeline:

- Explicit and easy to reason about
- Beginner-friendly without sacrificing professional rigor
- Well-suited for the current size and complexity of AuraID

## Rationale

### Why GitHub Actions?

- **Zero Overhead:** No infrastructure or external CI servers to manage.
- **Deep GitHub Integration:** CI results appear directly on pull requests and commits.
- **First-Class pnpm Support:** `pnpm/action-setup` provides reliable installation and store caching.
- **Secrets Management:** Secure handling of environment variables for future deployment stages.

## Consequences

### Positive

- **Safety Net:** Every change is validated, preventing accidental breakage of shared types or contracts.
- **Deterministic Builds:** `pnpm install --frozen-lockfile` ensures reproducible dependency resolution.
- **Single Source of Truth:** CI configuration lives alongside the codebase in `.github/workflows/ci.yml`.
- **Simplicity:** No additional abstraction layers in the build pipeline.

### Negative

- **Limited Caching:** Without Turborepo or Nx, all linting and build steps run on every CI execution.
  For the current scale of AuraID, this is acceptable (expected runtime < 2 minutes).
- **Execution Limits:** CI usage is constrained by GitHub’s free-tier limit (2,000 minutes/month), which is sufficient for this project.

## Notes

This decision prioritizes **clarity, determinism, and maintainability** over premature optimization.
The CI strategy can be revisited if build times or repository scale increase significantly.
