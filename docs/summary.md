
---

### C) Resume of what we did so far + recurring mistakes/difficulties

Save as: `docs/PROJECT_SUMMARY.md`

```md
# BudgetTracker Project Summary

## What we built / fixed
1. **Auth architecture (Firebase + MongoDB)**
   - Firebase is the source of identity.
   - Backend verifies Firebase ID token on every protected request.
   - MongoDB stores user profile + app-specific metadata (role, preferences, timestamps).

2. **Global enforcement: “No Mongo access without Firebase token”**
   - Added middleware (`verifyFirebaseToken`) that validates ID tokens and populates `req.firebase`.
   - Protected routes require this middleware before any DB calls.

3. **User lifecycle**
   - Register endpoint is idempotent (returns existing user if already created).
   - Login endpoint creates Mongo user if missing, otherwise updates lastLogin.

4. **Ownership enforcement**
   - Audited income/expense controllers to ensure `uid` ownership checks exist for fetch/update/delete.

5. **Frontend routing structure (Expo Router)**
   - Logged-out routes: `/home`, `/login`, `/register`
   - Logged-in routes: `/(tabs)/*`, with post-login landing on `/(tabs)/home-user`

6. **Dev/Prod separation**
   - Created `budgettracker_dev` + `budgettracker_prod`.
   - Railway dev environment connects to dev db.
   - Railway prod environment connects to prod db.
   - Logs now confirm correct db selection.

## Recurrent mistakes / pain points
1. **Env var naming mismatch**
   - Examples: `MONGO_URI` vs `MONGODB_URI`, inconsistent keys.
   - Result: deployment worked but wrote to wrong db or failed to connect.

2. **Secrets management**
   - Firebase service account JSON path missing in container (because file not present).
   - Fix: use env vars or base64 service account.

3. **Expo Router duplicate screens / patterns**
   - Duplicate files like `expense.tsx` + `expense/index.tsx` caused route collisions.

4. **CORS misunderstandings**
   - Web requires correct origin allowlist.
   - Mobile requests often have **no Origin header**, so CORS logic must allow that.

5. **Debugging without “ground truth” endpoints**
   - It was hard to confirm: “which backend am I calling?” and “which db is used?”
   - Fix recommendation: `/health` returns env + db name, `/whoami` returns uid/email.

   ## Recurrent mistakes / pain points

7. **MongoDB Atlas permissions**
   - Symptom: "user is not allowed to do action [update]"
   - Cause: Database user created with read-only role
   - Fix: Change role to "Read and write to any database" in Database Access
   - Prevention: Always use read+write role for app users
