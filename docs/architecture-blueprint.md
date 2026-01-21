# Architecture Blueprint: Domain Model & Entities

This document explains the "Single User, Multi-Context" database design. It uses a **Travel Metaphor** to describe how different data models interact to provide secure, scalable authentication.

## Core Metaphor: Passport vs. Visa

AuraID separates **Identity** (Who you are) from **Authorization** (What you can do).

| Entity                 | Metaphor  | Function                                                            |
| :--------------------- | :-------- | :------------------------------------------------------------------ |
| **User**               | Passport  | Global identity across all apps.                                    |
| **Application**        | High Wall | A security boundary/room owned by a developer.                      |
| **Membership**         | Visa      | The bridge; determines role/access in a specific app.               |
| **Session**            | Keycard   | The active interaction "key" for one specific door.                 |
| **Verification Token** | Intent    | Temporary proof for high-security actions (Reset/Verify).           |
| **Refresh Token**      | Battery   | The energy keeping the Keycard active; swapped (rotated) regularly. |

## 1. The Foundation Layers (Static Data)

These models represent the "People" and the "Places." They don't change often.

### 🛂 **User (The Passport)**

The **User** is the global identity. It represents a real human.

- **Key Logic:** It stores the "Source of Truth" for credentials (email/password) and global settings.
- **Relation:** A User can visit many Applications through Memberships.
- **Senior Detail:** We use **Soft Deletes** (`deletedAt`) so that if a user "deletes" their account, we keep the record for security audits while hiding it from the app.

### 🏰 **Application (The Country)**

The **Application** is a security boundary (e.g., your "Invoicing App" or "Admin Portal").

- **Key Logic:** It holds the **OAuth2 Credentials** (`clientId` and `clientSecret`). It also has a "Whitelist" of `redirectUris` to prevent hackers from intercepting login codes.
- **Relation:** It "owns" its own set of Memberships and active Sessions.

### 📜 **ApplicationMembership (The Visa)**

The **Membership** is the bridge between a **User** and an **Application**.

- **Key Logic:** This is where **Context** lives. A user is just a person, but a _Membership_ defines if they are an `ADMIN` or a `USER` inside a specific app.
- **Constraint:** A User can only have **one** membership per Application (`@@unique`).

---

## 2. The Interaction Layers (Dynamic Data)

These models track active movement. They are created and destroyed frequently.

### 🔑 **Session (The Keycard)**

A **Session** is created every time a user successfully logs into an app.

- **Key Logic:** It links the **User**, the **Application**, and the **Membership** into one "Event." It stores the `sid` (Session ID) used to manage logouts.
- **Visualization:** If you log in on Chrome and Safari, you have **two** Session records.
- **Security:** If a session is `isRevoked`, it acts as a "burned keycard" that can never be used again.

### 🔋 **RefreshToken (The Battery)**

The **RefreshToken** keeps the **Session** alive without making the user re-type their password.

- **Key Logic:** We use **Token Rotation**. Every time you use a token, it is replaced by a new one (`replacedBy`).
- **Security:** If an attacker tries to use an old token that has already been replaced, AuraID detects the "Replay" and kills the entire Session chain instantly.

### ✉️ **VerificationToken (The Intent)**

A **VerificationToken** is a temporary "pass" for a specific action.

- **Key Logic:** It is used for **Email Verification** or **Password Resets**.
- **Constraint:** These are short-lived (e.g., 15 minutes) and are "burned" (`usedAt`) the moment they are clicked.

---

## 3. Entity Relationship Visualizer

### How the Data Flows:

1. **Identity Check:** User provides email/password.
2. **Visa Check:** AuraID looks for an `ApplicationMembership`. If none exists, it might create one (JIT Provisioning).
3. **Keycard Issued:** A `Session` is created, linking the User to the App.
4. **Power On:** A `RefreshToken` is issued and linked to that Session to keep it active.
