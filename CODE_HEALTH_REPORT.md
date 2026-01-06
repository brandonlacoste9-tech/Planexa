# Unified Code Health Inspection Report
**Date:** January 6, 2026
**Target:** Planexa Monorepo

## 1. Executive Summary
The project is a monorepo containing a modern **Vite/React frontend** and an **Express/Prisma backend**. However, the workspace is significantly cluttered with remnants of an abandoned **Next.js application** at the root level. 

**Critical Findings:**
- 🚨 **Security Risk:** Hardcoded API Key in `backend-python`.
- ⚠️ **Architecture:** Conflicting Database Schemas (SQLite at root vs PostgreSQL in backend).
- 🧹 **Cleanup:** Approximately 30-40% of the root files are abandoned code from a previous framework.

---

## 2. Critical Issues (Immediate Action Required)

### 🚨 Security Vulnerabilities
- **Hardcoded DeepSeek API Key:** 
  - File: `backend-python/main.py`
  - Issue: `DEEPSEEK_API_KEY` has a default value `sk-d3...` directly in the code.
  - **Action:** Revoke this key immediately. Use `os.environ` only.
- **Hardcoded Cloud Config:**
  - File: `backend/src/routes/sms.ts`
  - Issue: `PROJECT_ID` is hardcoded.

### ⚠️ Database Schema Conflicts
- **Two Schemas Exist:**
  1. `/workspace/prisma/schema.prisma`: **SQLite**, simpler model. (Likely abandoned).
  2. `/workspace/backend/prisma/schema.prisma`: **PostgreSQL**, complex model (Organization, EventType). (Active).
- **Risk:** Running `npx prisma migrate` at the root might target the wrong DB or create a local SQLite file instead of updating the Postgres DB.

---

## 3. Abandoned & Unused Code

The following directories and files appear to be leftovers from a Next.js App Router project and are **not used** by the current `frontend` (Vite) or `backend` (Express):

- **Directories:**
  - `app/` (Next.js pages/layouts)
  - `components/` (Root level components, distinct from `frontend/src/components`)
  - `lib/` (Root level lib, distinct from `backend/src/lib`)
  - `prisma/` (Root level SQLite setup)

- **Configuration Files:**
  - `next.config.js`
  - `tailwind.config.ts` (Root level, frontend has its own `tailwind.config.js`)
  - `postcss.config.js` (Root level)
  - `globals.css` (Root level)

**Recommendation:** Delete these files to prevent confusion.

---

## 4. Code Quality & Consistency

### Architecture
- **Frontend:** Clean React/Vite structure. Uses `fetch` with `import.meta.env.VITE_API_URL`. Good separation of features.
- **Backend (Node):** Well-structured Express app. Routes are modular.
- **Backend (Python):** Standalone FastAPI service ("Planexa DeepSeek Monolith"). 
  - **Issue:** Defines its own SQLAlchemy models (`ConversationHistory`, `EventType`) which duplicates the Prisma schema. This requires manual synchronization of database changes.

### Error Handling
- **Node Backend:** Good usage of `try/catch` in async routes. 
- **Python Backend:** Catches generic `Exception`. Recommended to catch specific errors (e.g., `SQLAlchemyError`, `OpenAIError`) for better debugging.

### Naming Conventions
- **Consistency:** High. Frontend uses PascalCase for components. Backend uses standard REST naming.
- **Language:** Code variables are English. Strings/Comments are French/English mixed (appropriate for the project context).

---

## 5. Recommended Fixes

1.  **Security:**
    - Move `DEEPSEEK_API_KEY` and `PROJECT_ID` to `.env` files.
    - Add `.env` to `.gitignore` in `backend-python`.

2.  **Cleanup (High Impact):**
    - Delete `app/`, `components/` (root), `lib/` (root), `prisma/` (root).
    - Delete `next.config.js`, `tailwind.config.ts` (root).

3.  **Database:**
    - Use only `backend/prisma/schema.prisma`.
    - Update scripts to ensure they point to the correct schema.

4.  **Refactoring:**
    - Consider moving `backend-python` logic to the Node backend if the Python dependency is only for a simple API call, OR strictly define the microservice boundary.
