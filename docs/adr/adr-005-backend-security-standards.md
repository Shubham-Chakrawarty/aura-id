# ADR 005: Backend Security Standards

- **Status:** `Accepted`
- **Date:** 2026-01-11 (Revised 2026-01-21)
- **Deciders:** @shubham-chakrawarty
- **Scope:** Backend / Security

---

### 1. Context

AuraID is a security-critical application. As an Identity Provider, the backend must not only be performant but also **resilient by design**. We need a structure that prevents common security pitfalls (like leaking stack traces), ensures that only "clean" data enters our system, and allows us to scale our feature set (Auth, Apps, Memberships) without creating a "Spaghetti" codebase.

### 2. Decision

We will adopt a **Layered, Feature-Based Architecture** with a "Security First" validation layer.

#### Technical Specifics

- **Security Layer:** **Argon2id** for all password hashing. No legacy algorithms (Bcrypt/MD5) are permitted.
- **Validation Layer:** **Zod** schemas for all "Entry Points" (Environment variables and Request bodies).
- **Structural Pattern:** **Controller → Service → Model (Prisma)**.
  - _Controller:_ Handles HTTP/Transport logic.
  - _Service:_ Handles the "Business Rules" (e.g., _Is this user allowed to join this app?_).
  - _Model:_ Handles data persistence.
- **Organization:** Feature-based folders (e.g., `src/features/auth/*`, `src/features/users/*`) rather than generic `controllers/` or `services/` folders.
- **Build System:** **tsup** (using `esbuild`) for bundling to ensure modern ESM output and lightning-fast build times.
- **Error Strategy:** A centralized `ErrorHandler` middleware to catch all exceptions and format them into consistent JSON responses.

### 3. Rationale

- **Argon2id:** Following the **OWASP Password Storage Cheat Sheet**, Argon2id is the current gold standard. It is specifically designed to resist GPU-based cracking, which is a critical requirement for a modern IdP.
- **Zod for Fail-Fast Validation:** By validating at the very edge of the application (the request), we ensure that invalid data never reaches our business logic. This follows the **DRY** principle, as Zod types are inferred directly into our TypeScript interfaces.
- **Feature-Based Structure:** In a "Multi-Context" system, code becomes unmanageable if all services live in one giant folder. Grouping by feature (e.g., `memberships`) makes it easier to find code and see the "Security Boundary" of each module.
- **Layered Separation:** By keeping business logic in "Services," we can easily write unit tests for our identity logic without needing to mock HTTP requests or database connections (following **SOLID** principles).
- **tsup/esbuild:** Standard `tsc` is too slow for large monorepos. `tsup` provides a professional bundling setup with minimal config, supporting "Hot Reloading" for a superior developer experience.

### 4. Security Protocol (The Handshake)

- **Zero Trust Enforcement (The Quadruple Check)**
  No request is trusted by default. Every incoming token must be validated against four pillars:
  1. **User:** Is the account active and not blocked?
  2. **Application:** Is the client ID registered and active?
  3. **Membership:** Does the User have a valid "Visa" (Role) for this App?
  4. **Session:** Is the specific Keycard (sid) still active and not revoked?
  ***
- **Cryptographic & Storage Standards**
  - **Token Type:** RS256 Asymmetric JWTs. AuraID signs; Applications verify using the Public JWKS (JSON Web Key Set).
  - **Cookie Policy:** `HttpOnly`, `Secure`, `SameSite=Lax` for all session-related identifiers.
  - **CSRF Protection:** Mandatory `state` parameter check on all authorization redirects.
  - **Grant Protection:** PKCE is required for all flows to mitigate code interception.
  ***
- **The "Self-Destruct" Logic (Token Rotation)**
  - **Single-Use:** Refresh tokens are valid for one-time use only.
  - **Breach Detection:** If an old Refresh Token is presented, AuraID flags a **Replay Attack**.
  - **The Penalty:** The entire Session (all related tokens) is immediately marked `isRevoked: true`.
  ***
- **Scoped Session Control**
  - **Logout is Local:** Terminating a session in App A kills the `Local Session` but preserves the `Global Identity` cookie (SSO).
  - **Verification Scoping:** Tokens for Password Resets are scoped to the `ApplicationContext`. A reset link for App A cannot be used to gain access to App B.

### 5. Consequences

- **Positive:**
  - **High Security Bar:** Argon2id and strict Zod validation provide a robust defense against common attacks.
  - **Maintainable Scale:** New developers can find features easily due to the domain-based folder structure.
  - **Zero Leaks:** Centralized error handling ensures that internal database errors or stack traces are never exposed to the end-user.
- **Negative/Risks:**
  - **Boilerplate:** Creating a Controller, Service, and Schema for every feature takes more time than a simple Express route.
  - **Learning Curve:** Developers must understand the distinction between "Operational" and "Programmer" errors.
- **Mitigation:**
  - Use code snippets or templates to quickly scaffold new features following this pattern.

### 6. Notes / Artifacts

- **Reference:** [OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
