# ADR 001: Initial Tech Stack & Architecture

## Status
Proposed

## Context
We need a standalone Identity Provider (IdP) for centralized authentication across multiple services. The system must be secure, scalable, and developer-friendly.

## Decision & Rationale

### 1. The Hybrid Integration Model
* **Decision:** Provide both a **Hosted Auth Portal** (Redirect) and a **Headless SDK** (API-only).
* **Why:** The **Portal** allows new apps to get auth running in minutes. The **SDK** allows apps to build 100% custom login UIs while keeping the complex security logic (token storage, rotation, validation) centralized in one maintained library.

### 2. Security: RS256 & Argon2
* **Decision:** Use **RS256 (Asymmetric)** for JWTs and **Argon2id** for hashing.
* **Why (RS256):** Unlike HS256 (Symmetric), other apps only need a **Public Key** to verify users. They never touch the **Private Key** used to sign tokens, which is much safer.
* **Why (Argon2id):** It is the winner of the Password Hashing Competition. It’s "memory-hard," making it extremely expensive for hackers to crack using GPUs.

### 3. Infrastructure: Redis
* **Decision:** Use **Redis** alongside Postgres.
* **Why:** We need to "Blacklist" stolen or logged-out tokens. Checking a database for every API call is slow; checking Redis (RAM) is nearly instant.

### 4. Language: TypeScript
* **Decision:** Use **TypeScript** for the entire stack.
* **Why:** We share interfaces between the Server, SDK, and Portal. If we change a "User" object in the backend, the frontend and SDK will show an error immediately, preventing runtime bugs.