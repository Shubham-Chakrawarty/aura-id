# AuraID: User Experience & Flow Logic

### 1. Onboarding & Verification

• **Trigger**: User signs up; system generates VerificationToken linked to origin_app_id.
• **Action**: User clicks email link $\rightarrow$ Server marks User.verified = true.
• **Handshake**: Server issues Global Session (Cookie) $\rightarrow$ Redirects to origin_app.redirect_uri.
• **Security**: Token is single-use and expires in 24 hours.

### 2. SSO & JIT Membership

• **Detection**: App B redirects to AuraID; AuraID detects active GlobalSession.
• **JIT Membership Check**:
_ **If exists**: Silent redirect to App B with auth code.
_ **If missing**: Display Consent Screen $\rightarrow$ On "Accept", create ApplicationMembership $\rightarrow$ Redirect.
• **Security**: Uses state parameter to prevent CSRF during the redirect loop.

### 3. Secure Account Recovery

• **Request**: "Email Sent" response is returned regardless of user existence (Anti-Enumeration).
• **Reset**: User provides new password via RecoveryToken.
• **The "Nuke" (Security Sweep)**: 1. Update password hash. 2. Invalidate all Sessions: Immediate deletion of all active sessions for this userId across all applications. 3. Audit: Log recovery event with IP and Timestamp.
