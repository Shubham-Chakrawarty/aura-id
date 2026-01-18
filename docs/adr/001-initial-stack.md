# ADR 001: Initial Tech Stack & Architecture

- **Status:** Accepted
- **Date:** 2026-01-08
- **Deciders:** @shubham-chakrawarty
- **Scope:** Cross-cutting / Infrastructure

---

### 1. Context

AuraID is designed to be a standalone Identity Provider (IdP) responsible for centralized authentication across multiple applications. Unlike a simple login system, this must handle **Global Identities** (one "Passport" per human) that access various **Application-Scoped Contexts** (Visas/Memberships). We require a stack that is secure by default, scales with minimal friction, and enforces a **Zero Trust** model (User + Application + Membership + Session verification).

### 2. Decision

We will adopt a **Hybrid Integration Model** utilizing a modern TypeScript monorepo (`pnpm` workspaces) to maintain a single source of truth across all components.

### **Architecture Components**

- **Hosted Authentication Portal:** A centralized React/Vite application for secure, redirect-based login flows (SSO).
- **Headless SDK:** A logic-only package (`packages/sdk`) for internal services to handle session verification and context maintenance without UI overhead.
- **Server Core:** An Express.js API following a feature-based architecture.

### **Core Infrastructure**

- **Persistence:** **PostgreSQL** via **Prisma ORM**. All core entities (User, Application, Membership) must include mandatory **Soft Deletes** (`deletedAt`) to preserve audit trails.
- **Cache & Security State:** **Redis** for real-time session tracking, token revocation lists (blacklisting), and fast security lookups.

### **Security Primitives**

- **Token Signing:** **RS256 (Asymmetric)** using the `jose` library. The IdP signs with a private key; apps verify with a public key.
- **Hashing:** **Argon2id** for user passwords, providing memory-hard resistance against GPU/ASIC attacks.
- **Cookie Strategy:** `HttpOnly`, `Secure`, `SameSite=Lax` with proactive rotation to mitigate XSS and CSRF.

### 3. Rationale

- **Hybrid Model (Portal + SDK):** This provides the best of both worlds. The Portal ensures security-sensitive logic (like password entry) stays on a domain we control, while the SDK allows developers to integrate AuraID into their own codebases with a few lines of code.
- **RS256 vs HS256:** In a multi-app ecosystem, sharing a "secret key" (HS256) with every client app is a massive security risk. RS256 allows us to share only a **Public Key**, meaning even if a client app is compromised, the attacker cannot forge AuraID tokens.
- **Argon2id:** We are choosing the winner of the Password Hashing Competition. It is more secure than Bcrypt or Scrypt against modern hardware-accelerated attacks.
- **Redis for Session Scoping:** While JWTs are great for being stateless, they are hard to "cancel." By tracking sessions in Redis, we can implement **Scoped Logout** (killing a session for one app while keeping the user logged into others) and a "Global Kill Switch" for compromised accounts.
- **Monorepo (pnpm + Shared Packages):** To follow the **DRY (Don't Repeat Yourself)** principle, we will use `packages/shared` for our Zod schemas. This ensures the Auth Portal, the Server, and the SDK all agree on the exact shape of a "User" or a "Login Request" at compile-time.

### 4. Consequences

- **Positive:**
  - **Industry Standard Security:** Using RS256 and Argon2id puts us in the top tier of secure IdPs.
  - **Developer Velocity:** Shared types and the Headless SDK reduce integration friction for new apps.
  - **Data Integrity:** Soft deletes ensure that we never lose historical identity data, which is crucial for security audits.
- **Negative/Risks:**
  - **Increased Complexity:** Managing a monorepo, a relational DB, and a cache layer requires a more sophisticated DevOps setup from the start.
  - **Performance Overhead:** RS256 signing is slightly more CPU-intensive than HS256, and Redis adds a network hop for session checks.
- **Mitigation:**
  - Use **Dockerized environments** to ensure all developers have identical Postgres/Redis setups.
  - Implement **Vitest/Supertest** for rigorous CI testing to catch contract breaks in the monorepo early.

### 5. Notes / Artifacts

- Refer to `JOURNAL.md` for the step-by-step setup log.
