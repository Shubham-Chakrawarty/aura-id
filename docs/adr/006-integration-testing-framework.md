# ADR 006: Selection of Vitest and Supertest for Integration Testing

## Status

Accepted

## Date

2026-01-11

## Context

AuraID requires reliable automated testing to verify critical backend flows such as:

- User Registration
- Login
- Email Verification

Given our setup (TypeScript monorepo, Express, Prisma, PostgreSQL), the testing solution must:

- Support TypeScript out-of-the-box
- Execute quickly in a CI/CD pipeline (GitHub Actions)
- Enable **integration testing** by hitting real HTTP routes
- Work with a real database without risking development data

## Decision

1. **Test Runner**
   - Use **Vitest** as the primary test runner.

2. **HTTP Testing**
   - Use **Supertest** for making HTTP assertions against the Express API.

3. **Database Strategy**
   - Use a **separate PostgreSQL database/container** for tests to ensure isolation from development data.

## Rationale

### Vitest

- Uses `esbuild` under the hood for near-instant test execution.
- Native TypeScript support with minimal configuration.
- Jest-compatible API provides familiarity without sacrificing speed.
- Excellent developer experience with fast watch mode.

### Supertest

- Industry-standard library for testing Node.js HTTP servers.
- Allows requests to be made directly against the Express app instance.
- Eliminates the need to manually start and stop the server for each test.
- Ideal for validating real middleware, routing, and request handling.

### Database Isolation

- Prevents accidental mutation or deletion of development data.
- Enables repeatable and deterministic test runs.
- Mirrors production behavior more closely than mocks.

## Consequences

### Positive

- High confidence in core authentication flows.
- Fast feedback loop during development and CI runs.
- Tests exercise real application behavior instead of mocked logic.

### Negative

- Requires additional setup for test-specific configuration.
- Test database must be managed and cleaned between runs.

## Setup Notes

- A `vitest.config.ts` file is required in `apps/server`.
- A dedicated `.env.test` file must be used to point Prisma to the test database.
- CI must provision the test database before running tests.

## Notes

This testing approach prioritizes **realism over mocking**, ensuring AuraID’s most critical flows behave correctly in production-like conditions.
