# ADR 004: Database Schema and Persistence Layer

- **Status:** Accepted
- **Date:** 2026-01-11
- **Deciders:** @shubham-chakrawarty
- **Scope:** Backend / Infrastructure

---

### 1. Context

AuraID requires a data store that prioritizes **integrity** and **traceability**. As an Identity Provider, we cannot afford "lost" data or orphaned records. We need a persistence layer that handles the complex relationships of our **Single User, Multi-Context** model (Users, Applications, and Memberships) while remaining performant in both local Docker environments and future cloud deployments.

### 2. Decision

We will standardize on **PostgreSQL** managed through **Prisma v7** using the modern driver adapter pattern.

### **Technical Specifics**

- **Database Engine:** PostgreSQL (latest stable).
- **ORM:** **Prisma v7** using `@prisma/adapter-pg` (to avoid the Rust engine overhead and improve cold starts).
- **Schema Standards:**
  - **Primary Keys:** UUID (v7 preferred for time-sortability, or v4).
  - **Audit Fields:** Every table must include `createdAt`, `updatedAt`, and **`deletedAt`** (for Soft Deletes).
- **Architecture:**
  - **Singleton Pattern:** The Prisma client will be instantiated as a singleton in `apps/server` to prevent connection exhaustion.
  - **Local Development:** Standardized via a `docker-compose.yml` defining the Postgres container.

### 3. Rationale

- **Prisma v7 + Adapter:** By using the `@prisma/adapter-pg`, we remove the heavy Rust binary. This makes our Docker images smaller and ensures that if we ever move to a Serverless environment (like Vercel or AWS Lambda), our "cold starts" are significantly faster.
- **UUIDs:** In a distributed system or an IdP, we should never expose sequential IDs (like `User #1`). UUIDs prevent "ID Enumeration" attacks and allow for safer record merging across different database instances in the future.
- **Soft Deletes (Blueprint Requirement):** Identity data is sensitive. We never physically `DELETE` rows. Using a `deletedAt` column ensures we can recover data and maintain foreign key integrity for historical audits.
- **Singleton Client:** In Node.js, specifically with hot-reloading (Vite/Nodemon), every code change can create a new database connection. A Singleton ensures we stay within the connection limits of our PostgreSQL instance.

### 4. Consequences

- **Positive:**
  - **Strong Typing:** Prisma generates TypeScript types directly from our schema, eliminating the "SQL-to-Code" mapping errors.
  - **Environment Parity:** Docker ensures that "it works on my machine" translates perfectly to "it works in production."
  - **Audit-Ready:** Mandatory timestamps and soft deletes make the system compliant with standard security audit requirements.
- **Negative/Risks:**
  - **UUID Complexity:** Debugging via SQL queries is slightly harder with UUIDs than with simple integers (e.g., `1` vs `550e8400-e29b...`).
  - **Soft Delete Logic:** Prisma does not support soft deletes out of the box; we must implement middleware or custom query logic to filter out "deleted" records.
- **Mitigation:**
  - Use **Prisma Middleware** or **Extended Clients** to automatically filter out records where `deletedAt != null`.

### 5. Notes / Artifacts

- This decision implements the **Core Identity Model** defined in the Project Blueprint.
- **File Location:** `packages/database/prisma/schema.prisma`.
