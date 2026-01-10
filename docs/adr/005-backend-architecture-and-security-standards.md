# ADR 005: Backend Architecture and Security Standards

## Status

Accepted

## Context

AuraID requires a backend architecture that is secure, scalable, and maintainable over time.

The backend must:

- Enforce strong password hashing standards
- Provide consistent validation across environment variables and request data
- Separate business logic from transport concerns
- Standardize error handling across all services
- Support fast and reliable builds within a TypeScript monorepo

## Decision

1. **Password Hashing**
   - Use **Argon2id** (via the `argon2` library) for password hashing.

2. **Validation Strategy**
   - Use **Zod** for schema-based, fail-fast validation.
   - Apply validation consistently to:
     - Environment configuration
     - Incoming HTTP request data

3. **Code Structure**
   - Adopt a **feature-based folder structure**.
   - Use a **Layered Architecture**:
     - Controller → Service → Model

4. **Naming Conventions**
   - Use **domain-based file naming**, e.g.:
     - `user.controller.ts`
     - `user.service.ts`

5. **Error Handling**
   - Implement **class-based global error-handling middleware**.
   - Clearly distinguish between:
     - Operational errors
     - Programmer (unexpected) errors

6. **Build Tooling**
   - Use **tsup** for ESM bundling powered by `esbuild`.

## Rationale

### Argon2id

- Memory-hard algorithm resistant to GPU and ASIC attacks.
- Recommended by OWASP as a modern password hashing standard.

### Zod Validation

- Provides runtime validation with static type inference.
- Enables fail-fast behavior, reducing downstream error handling.
- Ensures shared validation logic across packages.

### Layered Architecture

- Decouples HTTP and transport logic from business rules.
- Improves testability and reusability of core services.
- Makes refactoring and feature expansion safer over time.

### Global Error Middleware

- Ensures consistent JSON error responses.
- Prevents leaking internal stack traces in production.
- Centralizes error formatting and logging behavior.

### tsup

- Faster builds compared to `tsc`.
- Minimal configuration for ESM output.
- Well-suited for monorepo environments.

## Consequences

### Positive

- Strong, standardized security practices across the backend.
- Predictable validation and error-handling behavior.
- Improved developer experience and maintainability.
- Faster build times and simpler bundling configuration.

### Negative

- Additional architectural structure increases initial complexity.
- Strict validation can surface more errors during early development.

## Notes

This backend architecture prioritizes **security, correctness, and clarity**.
The design can be adapted as performance, scale, or deployment requirements evolve.
