# BudgetTrackerAPI
Backend of BudgetTracker

**Environment Setup**
This backend uses `dotenv-flow` to load env files based on `NODE_ENV`.
Load order:
- `.env`
- `.env.local`
- `.env.development` or `.env.production`
- `.env.development.local` or `.env.production.local`

Where to put actual values:
- Local development: put real values in `.env` (never commit).
- Templates: keep placeholders in `.env.development`, `.env.production`, and `.env.example`.
- Production: set real values in your Render dashboard environment variables.

Secrets:
- Keep `JWT_SECRET`, MongoDB URIs, and Firebase Admin credentials out of the repo.
- Use `GOOGLE_APPLICATION_CREDENTIALS` to point to a JSON file stored outside the repo, or use `FIREBASE_SERVICE_ACCOUNT_BASE64` in hosting dashboards.
