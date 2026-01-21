# ADR 006: Testing Frameworks

- **Status:** `Accepted`
- **Date:** 2026-01-11
- **Deciders:** @shubham-chakrawarty
- **Scope:** Quality Assurance / DevOps
- **Related**: [[003-continous-integration.md]]

---

### 1. Context

AuraID’s core value is **Trust**. Because we handle sensitive identity logic (Password hashing, JWT issuance, and Membership scoping), unit tests alone are insufficient. We must verify that our Controllers, Services, and Prisma Models work together in a real environment. We need a testing suite that is fast enough for local development but rigorous enough to catch breaking changes in our **Single User, Multi-Context** logic during CI.

### 2. Decision

We will implement an **Integration-First Testing Strategy** using **Vitest** and **Supertest**.

### **Technical Specifics**

- **Test Runner:** **Vitest** (configured with workspace support).
- **HTTP Assertions:** **Supertest** for high-level API testing.
- **Database Isolation:** A dedicated **Test Database** (e.g., `auraid_test`) managed via Docker.
- **Test Lifecycle:**
  - **Setup:** Before tests, run Prisma migrations on the test DB.
  - **Teardown:** Truncate tables between test suites to ensure a "Clean Slate."
- **Strategy:** Focus on **E2E Integration** for critical paths:
  - `POST /auth/register` (Registration flow)
  - `POST /auth/login` (Token issuance)
  - `GET /apps/:id/members` (Scoped access check)

### 3. Rationale

- **Vitest Speed:** Vitest shares the same transformation pipeline as Vite and `esbuild`. In a monorepo, it is significantly faster than Jest because it doesn't need to re-compile TypeScript from scratch for every file change.
- **Supertest + Express:** Supertest allows us to pass our Express `app` instance directly to the runner. This tests the **entire request lifecycle**—including Zod validation, security headers, and error middleware—without needing to bind the server to a real network port.
- **Real DB vs. Mocks:** Mocks often hide bugs (e.g., a foreign key constraint failing). By using a real PostgreSQL test database, we ensure that our Prisma schemas and migrations are actually correct.
- **Jest Compatibility:** Vitest uses the same `describe/expect` syntax as Jest, allowing us to use familiar patterns while gaining modern performance.

### 4. Consequences

- **Positive:**
  - **High Reliability:** We test the app exactly as it will run in production.
  - **Developer Velocity:** Vitest's "Watch Mode" provides near-instant feedback as you code.
  - **CI Safety:** **ADR-003 (GitHub Actions)** will now fail if any core identity flow is broken, preventing faulty builds.
- **Negative/Risks:**
  - **Infrastructure Complexity:** The CI environment must now spin up a Postgres container specifically for tests.
  - **State Management:** We must be disciplined about clearing the database to prevent "leaky tests" (where one test fails because of data left by another).
- **Mitigation:**
  - Use a global `vitest.setup.ts` file to handle database truncation and environment variable overrides automatically.

### 5. Notes / Artifacts

- **Reference:** This ADR fulfills the verification requirements for **ADR-005** (Backend Standards).
