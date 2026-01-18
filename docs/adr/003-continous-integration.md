# ADR 003: Continuous Integration with GitHub Actions

- **Status:** Accepted
- **Date:** 2026-01-10
- **Deciders:** @shubham-chakrawarty
- **Scope:** DevOps / Infrastructure

---

### 1. Context

As AuraID follows a **Single User, Multi-Context** model, the logic in `packages/shared` (Zod schemas, types) is the glue holding the entire system together. A change in a shared type can silently break the `apps/auth-portal` while the `apps/server` remains valid. We need an automated "Safety Net" to ensure that every commit is verified against our **Code Quality Standards (ADR-002)** before it is merged.

### 2. Decision

We will use **GitHub Actions** as our CI platform, leveraging **pnpm recursive commands** for task execution.

### **Technical Specifics**

- **Triggers:** Run on every `push` to `main` and all `pull_request` events.
- **Environment:** Ubuntu-latest runners using `pnpm/action-setup` for dependency management.
- **Workflow Steps:**
  1. **Dependency Install:** `pnpm install --frozen-lockfile` (ensures exact versions).
  2. **Linting:** `pnpm -r lint` (recursive across all apps/packages).
  3. **Type Checking:** `pnpm -r typecheck` (verifies TypeScript integrity).
  4. **Build Validation:** `pnpm -r build` (ensures all packages are ready for deployment).
- **Caching:** Utilize GitHub Actions cache for the pnpm store to reduce installation time.

### 3. Rationale

- **Native pnpm Workspaces:** Using `pnpm -r` is the most direct way to interact with a monorepo. It removes the need for extra configuration files required by Turborepo or Nx, keeping the project "Lean."
- **Cost-Efficiency:** GitHub Actions' free tier (2,000 mins/month) is more than enough for a solo developer. Managing an external CI like CircleCI or Jenkins would add unnecessary operational overhead.
- **Standardization:** This follows our **DRY** principle—the same commands you run locally (`pnpm lint`) are the ones run in the cloud, ensuring no "it works on my machine" surprises.

### 4. Consequences

- **Positive:**
  - **Contract Protection:** Prevents "Type Drift" between the Frontend and Backend.
  - **Deterministic Integrity:** The `-frozen-lockfile` flag guarantees that CI builds are identical to local builds.
  - **Visibility:** Build status badges and PR checks provide immediate feedback on code health.
- **Negative/Risks:**
  - **Lack of Remote Caching:** Without Turborepo, we cannot "skip" tasks that haven't changed. Every CI run rebuilds everything.
  - **Future Bottleneck:** As the project grows, CI time will increase linearly with the number of packages.
- **Mitigation:**
  - Keep the dependency tree lean. If CI time exceeds 5 minutes, we will create a new ADR to adopt **Turborepo** for intelligent task orchestration.

### 5. Notes / Artifacts

- This ADR fulfills the "Automation" requirement mentioned in **ADR-002**.
- **File Location:** `.github/workflows/ci.yml`.
