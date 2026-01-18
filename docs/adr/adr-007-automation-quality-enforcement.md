# ADR-007: Automation & Quality Enforcement

- **Status:** `Accepted`
- **Date:** 2026-01-18
- **Deciders:** @shubham-chakrawarty
- **Scope:** Tooling / Workflow Efficiency / Infrastructure
- **Related:**: [[002-code-quality-standards.md]]
- **Pre-requisite for:** [[003-continous-integration.md]]

---

### 1. Context

We have defined strict quality standards and a CI pipeline. However, the feedback loop is currently too slow. If a developer makes a formatting error or writes an ambiguous commit message, they only find out minutes later after the GitHub Action fails. We need a way to gatekeep the codebase locally so that "dirty" code or poorly documented history never leaves the developer's machine.

### 2. Decision

We will implement local automation using **Husky**, **lint-staged**, and **Commitlint**, powered by native pnpm workspace commands.

**Technical Specifics:**

- **Husky:** Manages Git hooks to intercept lifecycle events.
- **lint-staged:** Runs `prettier --write` and `eslint --fix` surgicaly on changed files only.
- **Commitlint:** Enforces the **Conventional Commits** pattern (`type(scope): description`) using the `@commitlint/config-conventional` standard.
- **Silence Warnings:** We use `loglevel=error` in `.npmrc` to suppress non-critical npm warnings regarding pnpm-specific configurations (like hoisting patterns).

**Workflow:**

1. Developer runs `git commit`.
2. **Husky `pre-commit`** triggers `lint-staged` to auto-fix styling.
3. **Husky `commit-msg`** triggers `commitlint` to validate the message.
4. If either fails, the commit is blocked.

### 3. Rationale

- **Zero Overhead:** Guards the "commit gate" without heavy orchestrators.
- **Developer Speed:** Only linting staged files keeps the process fast (< 3s).
- **Searchable History:** Standardized commit messages allow for automated changelog generation and easier debugging across the monorepo.
- **Terminal Hygiene:** Using `loglevel=error` ensures developers aren't distracted by harmless "Unknown project config" warnings caused by the pnpm/npm dual-compatibility layer.
- **Alignment with ADR-002:** Directly enforces the stylistic and quality rules defined in our Code Quality Standards (ADR-002) at the earliest possible stage.

### 4. Consequences

- **Positive:** Clean Git history; zero "style-fix" commits; reduced CI failures.
- **Negative/Risks:** Commit friction. Developers cannot commit code that has linting errors or non-standard messages.
- **Mitigation:** The `-no-verify` flag remains available for emergency WIP commits on local branches, though prohibited for protected branches.

### 5. Notes / Artifacts

- **Enforcement Layer:** This is the automated implementation of **ADR-002** (Code Quality Standards).
- **Pipeline Integration:** Acts as the local gatekeeper before code reaches the **ADR-003** (CI Pipeline).
- **Key Files:** `.husky/pre-commit`, `.husky/commit-msg`, `commitlint.config.js`, `.npmrc`.
- **Ruleset:** `@commitlint/config-conventional` with a custom `scope-enum` for AuraID sub-packages.
