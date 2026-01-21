# ADR-004: Database Architecture

- **Status:** `Accepted` (Revised 2026-01-21)
- **Date:** 2026-01-11
- **Deciders:** @shubham-chakrawarty
- **Scope:** Backend / Infrastructure

---

### 1. Context

AuraID requires a data store that prioritizes **integrity** and **traceability**. As an Identity Provider, we cannot afford "lost" data or orphaned records. We need a persistence layer that handles the complex relationships of our **Single User, Multi-Context** model (Users, Applications, and Memberships) while remaining performant in both local Docker environments and future cloud deployments.

### 2. Decision

We will standardize on **PostgreSQL** managed through **Prisma v7** using the modern driver adapter pattern and a **modular schema architecture**.

**Technical Specifics**

- **Database Engine:** PostgreSQL (Latest stable).
- **ORM:** **Prisma v7** using `@prisma/adapter-pg` to minimize engine overhead and cold starts.
- **Schema Organization:** Every model resides in its own `.prisma` file (e.g., `user.prisma`, `application.prisma`).
- **Primary Keys:** **CUID (v2)**. Chosen over UUID to ensure URL-friendliness and optimized B-Tree index performance (time-sortable).
- **Audit Fields:** Every table must include `createdAt`, `updatedAt`, and `deletedAt` (Soft Deletes).
- **Automation:** Use of `predev` and `prebuild` hooks (`pnpm db:generate`) to ensure the client is always synced with the modular schema.
- **Singleton Pattern:** Prisma client instantiated via a global singleton to prevent connection exhaustion during Hot Module Replacement (HMR).

### 3. Rationale

- **Prisma Folder Structure:** Breaking the schema into `prisma/schema/*.prisma` prevents the "God File" anti-pattern, making the codebase maintainable as AuraID grows.
- **CUID vs UUID:** CUIDs are chronologically sortable, preventing database "index fragmentation" which occurs with random UUID v4s. They are also more compact for URL-based verification links.
- **Singleton Strategy:** Crucial for development environments. It stashes the instance in the `global` object to ensure we don't hit Postgres's `max_connections` during code reloads.

### 4. Consequences

- **Positive:**
  - **Developer Experience:** Automated client generation via `predev` scripts ensures types are never out of sync.
  - **Granular Review:** PRs become easier to read as schema changes are isolated to specific model files.
  - **Security Audit-Ready:** Mandatory timestamps and soft deletes provide a permanent history for forensics.
- **Negative/Risks:**
  - **Complexity:** Modular schemas are a "Preview Feature" in Prisma and require a specific folder structure.
  - **Soft Delete Overhead:** We must remember to filter `deletedAt: null` in our queries or use a Prisma extension.
- **Mitigation:**
  - Standardize on a `BaseRepository` or **Prisma Extension** to automatically handle `deletedAt` filtering across all models.

### 5. Notes / Artifacts

- This revision supersedes the initial UUID v4 proposal in favor of CUID.
