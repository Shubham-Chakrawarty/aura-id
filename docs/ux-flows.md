# AuraID: User Experience & Flow Logic

> Core Philosophy: Global identity should feel invisible, while local access feels intentional.

### 1. The "First Date" (Onboarding)

_The goal is to get the user from 'Stranger' to 'Authenticated' with zero confusion._

1. **The Entry:** A user visits **App A**. They are redirected to AuraID. The screen says: _"Log in to continue to App A."_
2. **The Commitment:** The user signs up with an Email and Password.
3. **The Verification:** AuraID shows a simple "Check your inbox" screen.
   - **Behind the scenes:** A `VerificationToken` is created, tied to the user and the `origin_app_id`.
4. **The Return:** The user clicks the email link. AuraID verifies them, sets a **Global Session Cookie**, and redirects them straight back to **App A**.

### 2. The "Fast Track" (SSO & JIT Membership)

_The goal is to reuse the 'Passport' without re-asking for credentials._

1. **The Recognition:** The same user visits **App B**.
2. **The Detection:** AuraID sees the Global Cookie. It knows exactly who the user is.
3. **The Handshake (Consent):** Since the user has never used App B, AuraID asks: _"Allow App B to access your profile?"_
4. **The Bridge:** Upon clicking "Allow," a **Membership** record is created **Just-In-Time (JIT)**.
5. **The Result:** The user is redirected to App B. They never typed their password. It felt like one unified system.

### 3. The "Clean Break" (Local Logout)

_The goal is to provide stability across the ecosystem._

- **Action:** The user logs out of **App A**.
- **Reality Check:** Only the **App A Keycard** (Local Session) is destroyed.
- **Consistency:** The user stays logged into **AuraID** and **App B**.
- **Logic:** This avoids "Collateral Damage"—one app shouldn't be able to kick a user out of their entire work day.

### 4. The "Safety Net" (Account Recovery)

_The goal is total security restoration._

- **The Request:** User forgets their password. AuraID uses **Anti-Enumeration** logic (always says "Email Sent") to protect user privacy.
- **The Reset:** User clicks a single-use link and sets a new password.
- **The "Nuke" (Security Sweep):** \* The password is updated.
  - **Crucially:** All active sessions across _all_ apps are instantly deleted.
  - The user is now safe; even if a hacker had a stolen session, it is now useless.
