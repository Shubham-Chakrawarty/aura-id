### `ADR-007: Scoped Environment Validation`

- **Status:** `Accepted`
- **Date:** 2026-01-23
- **Deciders:** @shubham-chakrawarty
- **Scope:** Infrastructure / Security

---

### 1. Context

To make `process.env` more robust and prevent the application from running in an unstable state. We need to ensure that every package and app has the variables it needs before it starts executing logic.

### 2. Decision

**We will use Scoped Zod schemas with a "Boot-First" requirement.**

- **Scoped:** Each package defines its own `env.config.ts`.
- **Line 1 Rule:** The app entry point must load `dotenv` using absolute paths before any other imports.
- **Absolute Path:** Use `resolve(import.meta.dirname, '../../.env')` to ensure the file is found regardless of where the command is run.

### 3. Rationale

- **Independence:** Packages only validate what they actually use.
- **Robustness:** Ensures `process.env` is never "empty" or "undefined" when the app logic begins.
- **Fail-Fast:** The app crashes immediately if a key is missing, preventing "silent" runtime errors.
- **Security:** Prevents the service from starting if critical keys (like `DATABASE_URL`) are missing.

### 4. Consequences

- **Positive:** Guaranteed valid configuration; better developer experience via IntelliSense.
- **Negative:** Requires careful management of the root `.env` file.
- **Mitigation:** Documenting required keys in a `.env.example` file.
