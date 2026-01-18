# Contributing to AuraID

This document outlines the professional standards and technical workflows required to maintain the integrity of the AuraID Identity Provider. Following these guidelines ensures that our **"Single User, Multi-Context"** mission remains secure, stable, and scalable.

## 1. The Development Workflow

We follow a **Traceable Development** model. No code should be written without a clear path of documentation:

1. **Define Strategy:** Create an **ADR** (Architectural Decision Record) in `docs/adr/` for any significant architectural change or new technology.
2. **Define Execution:** Create a **GitHub Issue** with a clear Description, Tasks, and Definition of Done (DoD).
3. **Document Experience:** Record technical hurdles and resolutions in the `JOURNAL.md` at the end of every session.

## 2. Git & Branching Strategy

To maintain a stable and professional history, we follow the **Short-Lived Feature Branch** model.

### Branch Naming

Always create a new branch for every GitHub Issue. Use the format: `[type]/[issue-number]-[short-description]`

- `feat/15-user-schema`
- `fix/22-cookie-auth`
- `chore/14-setup-governance`

### The Commit Process

- **Small & Logical:** Use small, incremental commits rather than one giant "finished feature" commit.
- **Conventional Commits (ADR-007):** All messages must follow the `type(scope): description` format.
  - `feat(server): ...` (New feature)
  - `fix(shared): ...` (Bug fix)
  - `docs(root): ...` (Documentation changes)
  - `chore(infra): ...` (Tooling/Maintenance)

### Merging (The "Golden Rule")

- **Never commit directly to `main`.**
- **Squash and Merge:** When a Pull Request is approved and CI passes, use the "Squash and Merge" option. This keeps the `main` branch history clean by combining branch commits into one professional entry.

## 3. Local Setup & Automation

Ensure you have **pnpm** and **Docker** installed.

```bash
# 1. Install dependencies & initialize Husky hooks
pnpm install

# 2. Setup environment variables
cp apps/server/.env.example apps/server/.env

# 3. Start infrastructure (Postgres & Redis)
docker compose up -d

# 4. Initialize database
pnpm -F @aura/database prisma migrate dev
```

### Pre-commit Hooks (ADR-007)

Husky and `lint-staged` are active. Your commit will be blocked if:

1. **ESLint** finds errors (Standardized in **ADR-002**).
2. **Prettier** formatting is incorrect (it will attempt to auto-fix).
3. **Commit Message** does not follow the Conventional Commit pattern.
4. **TypeScript** types are broken.

_Note: If you see npm warnings regarding "Unknown project config," ensure your `.npmrc` includes `loglevel=error`._

## 4. Quality Standards

- **Zero-Any Policy:** Strict TypeScript is mandatory. Never use `any`.
- **Layered Architecture:** Follow the **Controller → Service → Model** pattern.
- **Security First:** No secrets in plain text. Use `HttpOnly` and `Secure` cookies. Wrap sensitive logic in `try/catch` with standardized error logging.
- **Testing:** New features must include integration tests using Vitest and Supertest.Bash

  `pnpm -F @aura/server test`

## 5. Definition of Done (DoD)

A task is only considered "Done" when:

- [ ] Code follows **SOLID** and **DRY** principles.
- [ ] All tests pass locally and in the CI pipeline (`pnpm ci-test`).
- [ ] Related **ADRs** are updated to `Accepted`.
- [ ] Documentation (`README.md` or `docs/`) is updated for new public APIs or UI flows.
- [ ] **JOURNAL.md** contains the session's technical hurdles and context handoff.
