**[2026-01-21] Ref:** Issue #16 | ADR-003

### Technical Hurdles & Resolutions

- **Problem:** Ensuring the Prisma Client is always up-to-date without manual intervention and deciding between `src` and `dist` exports for the internal package.
- **Resolution:**
  - 1.  **Dist-First Exports:** Switched from `src` to `dist` exports in `package.json`. This treats the database package as a compiled library, improving performance by avoiding on-the-fly transpilation and ensuring architectural boundaries are respected.
  - 2.  **Lifecycle Automation (`pre` scripts):** Implemented `predev` and `prebuild` hooks. By mapping these to `pnpm db:generate`, we ensure the Prisma Client is automatically re-generated whenever the development server starts or a production build is triggered. This eliminates "out-of-sync" type errors.
  - 3.  **Singleton Pattern Implementation:** Refactored the client initialization to use the `global` object.
  - **Why:** In Node.js environments with Hot Module Replacement (HMR), re-instantiating `PrismaClient` on every file save would exhaust the Postgres connection pool.
  - **Impact:** The singleton pattern ensures only one connection pool exists across the entire application lifecycle, preventing "Too many connections" errors during development.

  ***
  - **Problem:** Deciding whether to persist user data before or after email verification.
  - **Resolution:** Adopted a **"Persist-First"** strategy. Users are saved to the `users` table immediately with `isEmailVerified: false`. This ensures data integrity (Unique email constraints), enables "re-engagement" marketing, and simplifies the codebase by using the primary database as the single source of truth for all identity states.

  ***
  - **Problem:** Attempted to use the multi-schema models instead of all models in one big file, but encountered pathing issues and "Cannot find modules” errors during execution and monorepo building. The multi-file schema was not correctly merging or being detected by the generator.
  - **Resolution:** Fixed the configs and folder names according to Prisma v7 architecture.
    1. Renamed the directory from `schema/` to `models/` (Keeping logic organised but not as the primary source).
    2. Updated `packages/database/package.json` to point to the directory: `"prisma": { "schema": "./prisma" }`.
    3. Updated `prisma.config.ts` to point to `./prisma` instead of `./prisma/schema.prisma`.

---

**[2026-01-20] Ref:** Issue #16 | ADR-003

### Technical Hurdles & Resolutions

- **Problem:** Prisma 7 + ESM Monorepo pathing issues. Specifically, the `MODULE_NOT_FOUND` error for `.prisma/client/default` and TypeScript's inability to see the generated client inside the `dist` folder.
- **Resolution:** 1. **Standardized Output:** Configured `schema.prisma` to output to `../src/generated` to keep it within the TypeScript `rootDir`.

2. **Barrel Export Pattern:** Split the database package into `lib/prisma.ts` (singleton logic), `utils/reset-db.ts` (helpers), and a central `index.ts` for clean public exports.
3. **Watch Automation:** Added `tsc --watch` to the database package to automate the `src` -> `dist` compilation during development.

---

**[2026-01-18] Ref:** Issue #14 | ADR-007

### Technical Hurdles & Resolutions

- **Problem:** Monorepo `lint-staged` was triggering full-directory scans (`eslint .`), causing slow commits and "missing config" errors at the root.
- **Resolution:** Standardized package scripts into `lint`, `lint:fix`, and `lint:staged-fix`. Updated `lint-staged` to use `pnpm --filter` to delegate tasks to sub-packages without the `.` directory dot.
  ***
- **Problem:** Standard `npm` was throwing "Unknown project config" warnings for `pnpm` settings in `.npmrc`.
- **Resolution:** Added `loglevel=error` to the top of `.npmrc` to suppress non-critical configuration warnings and maintain a clean terminal output.
  ***
- **Problem:** Commit messages lacked structure, risking a messy git history.
- **Resolution:** Implemented **Commitlint** with Husky's `commit-msg` hook to enforce the Conventional Commits pattern (`type(scope): description`).

---

**[2026-01-14] Ref:** Issue #14 | ADR-007 (Local Automation & Governance)

### Technical Hurdles & Resolutions

- **Problem:** Fragments of the "System Bible" were scattered across Notion, making it hard to reference while coding.
- **Resolution:** Centralized all logic into the `/docs` folder (`blueprint.md`, `handshake.md`, etc.). This ensures the "Source of Truth" lives inside the repository.
  ***
- **Problem:** Husky execute permissions were missing after initial setup.
- **Resolution:** Ran `chmod +x .husky/pre-commit` to ensure the git hook triggers correctly on commit.

---

**[2026-01-11] Ref:** Issue #5 | ADR-006 (Testing Infrastructure)

### Technical Hurdles & Resolutions

- **Problem:** `supertest` was failing to connect to the Express app because the database hadn't migrated in the test environment.
- **Resolution:** Added a `pretest` script to the `apps/server` `package.json`: `dotenv -e .env.test -- prisma migrate deploy`. This ensures the test DB is always in sync with the schema before Vitest runs.

---

**[2026-01-11] Ref:** Issue #4 | ADR-004 & ADR-005 (Persistence & Backend Standards)

### Technical Hurdles & Resolutions

- **Problem:** Prisma was pulling in the heavy Rust-based query engine, increasing Docker build times.
- **Resolution:** Switched to the `@prisma/adapter-pg` as decided in ADR-004. This lightened the server image and improved container startup speed.
  ***
- **Problem:** `argon2` library was failing to compile on a specific Node version.
- **Resolution:** Re-installed `argon2` using `pnpm` specifically to trigger the native build process for the current environment.

---

**[2026-01-10]Ref:** Issue #3 | ADR-003 (CI Pipeline)

### Technical Hurdles & Resolutions

- **Problem:** GitHub Actions were failing due to `pnpm install` taking too long and timing out.
- **Resolution:** Implemented `pnpm/action-setup` with the `run_install: false` and manual caching of dependencies to skip redundant downloads.

---

**[2026-01-09] Ref:** Issue #2 | ADR-002 (Code Quality Standards)

### Technical Hurdles & Resolutions

- **Problem:** TypeScript could not find `@aura/typescript-config/server.json`.
- **Resolution:** Realized `pnpm` requires a root-level `pnpm install` to generate the symlinks in `node_modules`. Running install at the root resolved the pathing.
  ***
- **Problem:** ESLint v9 (Flat Config) failed to find configurations because it no longer "climbs" the folder tree automatically.
- **Resolution:** Created a root `eslint.config.js` to act as a router, delegating rules to specific app folders.

---

**[2026-01-08] Ref:** Issue #1 | ADR-001 (Monorepo Blueprint)

### Technical Hurdles & Resolutions

- **Problem:** Port 5432 was already allocated by another project.
- **Resolution:** Remapped the local container port to 5433 in `docker-compose.yml` to avoid conflicts.
