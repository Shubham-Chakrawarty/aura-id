# ADR 002: Code Quality Standards

- **Status:** `Accepted`
- **Date:** 2026-01-09
- **Deciders:** @shubham-chakrawarty
- **Scope:** Tooling / Developer Experience

---

### 1. Context

AuraID is a monorepo containing multiple applications (Auth Portal, Server) and shared packages (SDK, Shared Types). Without a unified set of rules for how code is written, formatted, and typed, the codebase will suffer from "consistency drift." This makes it harder to share code between packages and increases the likelihood of bugs being introduced simply because one package is less "strict" than another.

### 2. Decision

We will enforce a unified code quality baseline across the entire repository using three core tools.

**1. TypeScript Configuration**

- Enable **`strict` mode** as the global requirement.
- Use a base configuration that is extended by specific packages (Server vs. DOM/React) to ensure consistent type-checking rules.

**2. ESLint for Static Analysis**

- Implement a centralized ESLint configuration.
- Define specific profiles for `base` logic, `server` (Node.js), and `react` (Frontend) to catch unsafe patterns early.

**3. Prettier for Formatting**

- Define a single formatting standard in a `.prettierrc` file at the repository root.
- All code across all packages must adhere to this single style to ensure clean Git diffs.

### 3. Rationale

- **Standardization (DRY):** By centralizing these configs, we ensure that a "User" type in `packages/shared` is treated with the same level of strictness as it is in the `apps/server`.
- **Type Safety:** Strict TypeScript is non-negotiable for an Identity Provider. It prevents common runtime errors like "undefined is not a function" which could crash our authentication flows.
- **Developer Velocity:** Consistent formatting (Prettier) means developers don't waste time arguing over semicolons or tabs, and code reviews can focus on **logic** rather than **style**.

### 4. Consequences

- **Positive:**
  - Consistent code style across all current and future applications.
  - Type errors are caught at compile-time rather than in production.
  - Simplified onboarding: any new package automatically inherits the AuraID quality bar.
- **Negative/Risks:**
  - **Initial Friction:** Developers must resolve all linting and type errors before code can be considered "done."
  - **Configuration Overhead:** Maintaining centralized configs requires a small amount of extra work compared to default "out-of-the-box" settings.
- **Mitigation:**
  - Integrate these tools into the IDE (VS Code) to provide real-time feedback.

### 5. Notes / Artifacts

- **Missing Automation:** This ADR defines the _standards_ but not the _enforcement_.
