# ADR 001: Initial Tech Stack & Architecture

## Status

Proposed

## Context

AuraID is intended to be a standalone Identity Provider (IdP) for centralized authentication across multiple services.

The system must:

- Be secure by default
- Scale with minimal architectural changes
- Be developer-friendly for both integrators and maintainers

## Decision

### 1. Architecture Model

- **Decision:** Adopt a **Hybrid Integration Model** consisting of:
  - A **Hosted Authentication Portal** (redirect-based)
  - A **Headless SDK** (API-only)

### 2. Token & Password Security

- **Decision:** Use **RS256 (asymmetric signing)** for JWTs.
- **Decision:** Use **Argon2id** for password hashing.

### 3. Infrastructure Components

- **Decision:** Use **Redis** alongside **PostgreSQL**.

### 4. Programming Language

- **Decision:** Use **TypeScript** across the entire stack.

## Rationale

### Hybrid Integration Model

- The hosted portal allows applications to integrate authentication quickly with minimal configuration.
- The headless SDK enables fully custom authentication flows while centralizing security-critical logic in a maintained library.

### RS256 & Argon2id

- **RS256:** Enables applications to verify tokens using a public key without exposing the private signing key, reducing blast radius.
- **Argon2id:** A memory-hard hashing algorithm designed to resist GPU and ASIC attacks.

### Redis

- Enables fast token revocation and session invalidation without querying the primary database on every request.
- Supports real-time security features such as logout and token blacklisting.

### TypeScript

- Shared type definitions between the server, SDK, and frontend prevent contract mismatches.
- Type errors surface at development time rather than at runtime.

## Consequences

### Positive

- Strong security guarantees with industry-standard cryptography.
- Flexible integration options for different application needs.
- Reduced runtime errors due to shared type contracts.
- Clear separation of responsibilities across system components.

### Negative

- Higher initial setup complexity compared to simple auth solutions.
- Additional infrastructure (Redis) introduces operational overhead.

## Notes

This architecture prioritizes **security, correctness, and long-term maintainability** over initial simplicity.
The design can evolve as usage patterns and scale become clearer.
