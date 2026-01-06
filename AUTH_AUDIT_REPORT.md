# 🔐 Auth & Session Integrity Audit Report

**Date:** January 6, 2026
**Auditor:** Cloud Agent

## 1. Executive Summary

The application currently operates in a "Demo Mode" with **no active authentication or session management system**. All "protected" areas are accessible to the public, and sensitive actions (like modifying availability) rely on client-side provided IDs without server-side verification. Critical secrets are hardcoded in the source code.

**Risk Level:** 🚨 **CRITICAL**

---

## 2. Authentication Mechanisms Analysis

### Current State
*   **Frontend (Next.js):** Relies on a hardcoded `DEFAULT_USER_ID = 'demo-user'` in `app/dashboard/page.tsx`. There is no login page, cookie handling, or JWT storage.
*   **Backend (Express):** No middleware for authentication (e.g., Passport, custom JWT verify). Routes are exposed publicly under `/api`.
*   **Setup Assistant (Frontend):** UI exists for OAuth (Google/Microsoft), but it is purely cosmetic ("Placeholder backends").

### Identified Mechanisms

| Component | Mechanism | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Dashboard Access** | Hardcoded User ID | ❌ Insecure | Auto-logs in as 'demo-user'. |
| **API Routes (Next.js)** | None | ❌ Insecure | Trusts `userId` from request body. |
| **Backend API** | None | ❌ Insecure | Publicly accessible endpoints. |
| **SMS Webhook** | None | ❌ Insecure | No Twilio signature validation. |
| **DB Seeding** | Hardcoded Check | ⚠️ Weak | Checks `userCount > 0`. |

---

## 3. Vulnerability Findings

### 🚨 Critical Vulnerabilities

1.  **Hardcoded Secrets**
    *   **File:** `backend/verify-apikey.ts`
    *   **Issue:** A Google Generative AI API Key is hardcoded: `AQ.Ab8RN...`.
    *   **Impact:** Unauthorized use of your AI quota, potential billing impact.

2.  **Missing Authentication (No Login)**
    *   **File:** `app/dashboard/page.tsx`
    *   **Issue:** The dashboard bypasses authentication entirely by fetching a default user.
    *   **Impact:** Any visitor can view and modify the "demo" user's data.

3.  **Insecure Direct Object References (IDOR)**
    *   **File:** `app/api/availability/route.ts`
    *   **Issue:** The API accepts `userId` in the POST body to create availability.
    *   **Impact:** An attacker could modify availability for any user if they guess the ID (which is predictable).

4.  **Missing Webhook Validation**
    *   **File:** `backend/src/routes/sms.ts`
    *   **Issue:** The `/webhook` endpoint does not verify the `X-Twilio-Signature` header.
    *   **Impact:** Anyone can spoof SMS messages to your bot.

5.  **Sensitive Data Exposure**
    *   **File:** `backend/src/routes/public.ts`
    *   **Issue:** `GET /event-types` exposes user details (name, avatar) publicly.
    *   **Impact:** Privacy leakage (low risk if intended for booking page, but needs scoping).

---

## 4. Recommendations

### Immediate Actions (Fix These Now)

1.  **Revoke and Rotate API Keys:**
    *   Immediately revoke the Google AI key found in `backend/verify-apikey.ts`.
    *   Move it to a `.env` file (e.g., `GOOGLE_API_KEY`).

2.  **Implement Basic Authentication:**
    *   **Backend:** Add a middleware (using `jsonwebtoken` or `express-jwt`) to verify a Bearer token on all `/api` routes (except login/public booking).
    *   **Frontend:** Implement NextAuth.js or a custom auth provider to handle user sessions securely.

3.  **Secure Webhooks:**
    *   Implement Twilio signature validation middleware in `backend/src/routes/sms.ts` using the `twilio` SDK.

### Structural Improvements

1.  **Input Validation:**
    *   Use Zod or Joi to validate all incoming request bodies.
    *   Ensure `userId` in API calls matches the authenticated user's ID (from the token), NOT the request body.

2.  **Session Management:**
    *   Stop using "demo-user". Implement a proper signup/login flow.
    *   Use HTTP-only, Secure cookies for session tokens.

3.  **Security Headers:**
    *   Add `helmet` to the Express backend.
    *   Configure CSP headers in Next.js `next.config.js`.

---

## 5. Proposed Auth Architecture

1.  **User logs in** via Frontend (NextAuth.js recommended).
2.  **Frontend** receives a Session/JWT.
3.  **Frontend** includes JWT in `Authorization: Bearer <token>` header for all calls to Backend.
4.  **Backend Middleware** verifies JWT signature and extracts `userId`.
5.  **Backend Route** uses `req.user.id` (from token) instead of `req.body.userId`.

