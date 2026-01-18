# Security Handshake & Guardrails

## 1. Zero Trust Enforcement

Every request is verified against the quadruple check: **User + Application + Membership + Session.**

## 2. Non-Negotiable Guardrails

- **Cryptographic Trust:** RS256 Asymmetric JWTs. Apps verify via public keys.
- **Storage:** Sensitive identifiers live in `HttpOnly`, `Secure`, `SameSite=Lax` cookies.
- **Refresh Token Rotation:** Single-use refresh tokens. Reuse triggers immediate session invalidation (Replay Attack Prevention).

## 3. High-Security Logic

- **Logout is Local:** Clicking logout in App A destroys the "Keycard" (Local Session) but preserves the "Passport" (Global Session).
- **Verification Tokens:** Single-use secrets for intent-based actions. Linked to a specific app context for better UX (e.g., "Reset password for App A").
