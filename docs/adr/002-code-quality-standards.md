# ADR 002: Code Quality Standards

## Status
Accepted

## Context
We need a unified way to enforce coding standards across the AuraID monorepo to ensure maintainability and prevent "code rot."

## Decision
1. **TypeScript:** Use "Strict" mode as the base for all packages.
2. **ESLint:** Use a centralized configuration package with profiles for `base`, `server`, and `react`.
3. **Prettier:** Enforce a single formatting standard at the root to avoid style conflicts.

## Consequences
- Developers must fix linting errors before committing.
- New packages must extend the shared configs to pass CI.
- Increased initial setup time, but significantly lower long-term technical debt.