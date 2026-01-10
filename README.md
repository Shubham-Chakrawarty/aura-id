# AuraID

A professional-grade, standalone Identity Provider (IdP) featuring a Hybrid Integration model.

## 🚀 Quick Start

1. **Install:** `pnpm install`
2. **Infra:** `docker-compose up -d`
3. **Dev:** `pnpm dev` (to be configured)

## 🏗️ Project Structure

- `apps/server`: Express + Prisma + Jose (Auth Engine).
- `apps/auth-portal`: React + Vite (Centralized Login UI).
- `packages/sdk`: Headless logic for client applications.
- `packages/types`: Shared TypeScript definitions.

## 🛡️ Security Specs

- **Algorithm:** RS256 (Asymmetric JWT)
- **Hashing:** Argon2id
- **Sessions:** HttpOnly Cookie Rotation + Redis Blacklisting
