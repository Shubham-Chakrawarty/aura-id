# ADR 002: Code Quality Standards

## Status

Accepted

## Context

AuraID is a growing monorepo with multiple applications and shared packages.
Without consistent code quality standards, the codebase risks becoming difficult to maintain and reason about over time.

We require a unified approach to code quality that:

- Enforces consistent rules across all packages
- Prevents gradual degradation of code quality (“code rot”)
- Scales cleanly as new packages and applications are added

## Decision

1. **TypeScript**
   - Enable **`strict` mode** as the baseline configuration for all packages.
   - Provide tailored profiles for:
     - `base`
     - `server`
     - `dom`

2. **ESLint**
   - Use a **centralized ESLint configuration package**.
   - Provide tailored profiles for:
     - `base`
     - `server`
     - `react`

3. **Prettier**
   - Enforce a **single formatting standard at the repository root**.
   - Apply formatting rules consistently across all applications and packages.

## Consequences

### Positive

- Consistent code style and structure across the entire monorepo.
- Type errors and unsafe patterns are caught early during development.
- New packages inherit established standards automatically.
- Reduced long-term maintenance cost and technical debt.

### Negative

- Developers must resolve linting and formatting issues before committing or merging changes.
- Initial setup requires more configuration compared to ad-hoc tooling.

## Notes

This decision emphasizes **consistency and correctness** over short-term convenience.
As the AuraID codebase grows, centralized code quality standards provide a stable foundation for collaboration and long-term maintainability.
