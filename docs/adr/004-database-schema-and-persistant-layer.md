# ADR 004: Database Schema and Persistence Layer

## Status

Accepted

## Context

AuraID requires a persistent data store for managing user identities and authentication-related data.

The persistence layer must:

- Integrate cleanly with a TypeScript-based monorepo
- Ensure strong data integrity and transactional safety
- Support efficient connection management
- Be compatible with serverless and container-based deployments

## Decision

1. **Database**
   - Use **PostgreSQL** as the primary database.
   - Use **Docker** for local development to ensure environment parity.

2. **ORM**
   - Use **Prisma v7** with the `@prisma/adapter-pg` driver.

3. **Primary Keys**
   - Use **UUID (v4/v7)** as primary keys for all persisted entities.

4. **Connection Management**
   - Use a **Singleton Prisma Client** to manage database connections and prevent resource leaks during development and hot reloads.

## Rationale

### PostgreSQL

- Provides strong relational guarantees and mature indexing capabilities.
- Well-supported within the Node.js and TypeScript ecosystem.

### Prisma with `@prisma/adapter-pg`

- Removes the dependency on the embedded Rust query engine.
- Results in a lighter runtime and faster cold starts.
- Improves compatibility with serverless environments.

### UUIDs

- Native PostgreSQL support with efficient indexing.
- Fixed-size (16-byte) binary representation.
- High collision resistance compared to string-based identifiers (e.g., CUIDs).

### Singleton Prisma Client

- Prevents excessive database connections during development reloads.
- Reduces the risk of "Too many connections" errors.
- Aligns with recommended Prisma usage patterns in long-running processes.

## Consequences

### Positive

- Reliable and consistent data persistence.
- Predictable database behavior across environments.
- Improved performance and startup time for the server.
- Reduced operational risk related to connection management.

### Negative

- UUIDs can be less human-readable than sequential identifiers.
- Prisma introduces an abstraction layer that may hide some database-specific optimizations.

## Notes

This persistence strategy balances **performance, safety, and developer experience**.
The approach can be revisited if scaling or deployment constraints change significantly.
