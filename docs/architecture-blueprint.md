# Architecture Blueprint: Domain Model & Entities

## 1. Core Metaphor: Passport vs. Visa

AuraID separates **Identity** (Who you are) from **Authorization** (What you can do).

| Entity                 | Metaphor  | Function                                                            |
| :--------------------- | :-------- | :------------------------------------------------------------------ |
| **User**               | Passport  | Global identity across all apps.                                    |
| **Application**        | High Wall | A security boundary/room owned by a developer.                      |
| **Membership**         | Visa      | The bridge; determines role/access in a specific app.               |
| **Session**            | Keycard   | The active interaction "key" for one specific door.                 |
| **Verification Token** | Intent    | Temporary proof for high-security actions (Reset/Verify).           |
| **Refresh Token**      | Battery   | The energy keeping the Keycard active; swapped (rotated) regularly. |

## 2. Entity Specifications

### User (Global)

- **Rule:** One human = One User. email + passwordHash.
- **Scope:** Global. Benefits like improved hashing apply to all apps instantly.

### Application (Boundary)

- **Rule:** Isolation. App A cannot see App B's users without a Membership.
- **Details:** Owns `client_id` and `client_secret`.

### Membership (The Bridge)

- **Rule:** Access is explicit. Linking User ID ↔ App ID.
- **Roles:** Stores context-specific roles (e.g., Admin in App A, User in App B).

### Session (One-Door Rule)

- **Global Session:** Tracks the "Passport" at auraid.com (SSO).
- **Local Session:** Tracks the "Keycard" for a specific App.
- **Context**: Groups multiple tokens under a single device/browser instance.

### Refresh Token (The Power Source)

- **Rule**: Rotation. Using a token consumes it and generates a new one.
- **Security**: If an old "consumed" token is used, the entire Session (Keycard) is fried (revoked).
- **Hierarchy**: Belongs to a Session.

## 3. Audit Standard

- **Soft Deletes:** Mandatory `deletedAt` for Users, Apps, and Memberships to ensure audit trails and mistake recovery.
