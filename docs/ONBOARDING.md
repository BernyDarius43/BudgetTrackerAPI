# BudgetTracker — Full Project Onboarding Guide

> This document walks a junior developer through the complete setup of the BudgetTracker project from scratch to deployment. Follow each section in order.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Repository Setup](#3-repository-setup)
4. [Backend Setup](#4-backend-setup)
5. [Frontend Setup](#5-frontend-setup)
6. [Firebase Setup](#6-firebase-setup)
7. [MongoDB Atlas Setup](#7-mongodb-atlas-setup)
8. [Environment Variables](#8-environment-variables)
9. [Running Locally](#9-running-locally)
10. [Backend Deployment — Render](#10-backend-deployment--render)
11. [Frontend Deployment — EAS](#11-frontend-deployment--eas)
12. [TestFlight Distribution](#12-testflight-distribution)
13. [Version Management](#13-version-management)
14. [Git Workflow](#14-git-workflow)
15. [Secrets Management](#15-secrets-management)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Project Overview

**BudgetTracker** is a full-stack personal finance iOS app.

```
Frontend    React Native (Expo) + TypeScript
Backend     Node.js / Express
Database    MongoDB Atlas
Auth        Firebase Authentication + React Native Firebase
Hosting     Backend → Render | Frontend → EAS (Expo Application Services)
```

### Architecture

```
iPhone App (Expo/React Native)
        ↓ HTTPS + Firebase ID Token
Express Backend (Render)
        ↓ Mongoose
MongoDB Atlas
        ↑ token verification
Firebase Admin SDK
```

---

## 2. Prerequisites

Install these before anything else.

### Required Tools

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 22.x | nodejs.org |
| npm | comes with Node | — |
| Git | latest | git-scm.com |
| EAS CLI | latest | `npm install -g eas-cli` |
| Expo CLI | latest | `npm install -g expo` |

### Required Accounts

| Service | Purpose | URL |
|---------|---------|-----|
| GitHub | Source control | github.com |
| Expo | EAS builds + OTA | expo.dev |
| Firebase | Authentication | console.firebase.google.com |
| MongoDB Atlas | Database | cloud.mongodb.com |
| Render | Backend hosting | render.com |
| Apple Developer | TestFlight + App Store | developer.apple.com ($99/year) |

### Windows-Specific Notes

- You **cannot** build iOS natively on Windows — EAS cloud builds handle this
- Never run `pod install` — EAS does this on their Mac servers
- Use forward slashes in paths inside config files

---

## 3. Repository Setup

### Clone Both Repos

```bash
# Backend
git clone https://github.com/BernyDarius43/BudgetTrackerAPI.git
cd BudgetTrackerAPI
npm install

# Frontend
git clone https://github.com/BernyDarius43/BudgetTrackerIOS.git
cd BudgetTrackerIOS
npm install
```

### Branch Strategy

```
main     → production (always stable)
dev      → staging (active development)
feature/* → feature branches (merged into dev via PR)
```

**Never commit directly to `main`.** Always work on `dev` or a feature branch and open a Pull Request.

---

## 4. Backend Setup

### Folder Structure

```
BudgetTrackerAPI/
├── app.js                  ← entry point
├── config/
│   ├── db.js               ← MongoDB connection
│   ├── firebase.js         ← Firebase Admin init
│   └── validateEnv.js      ← env var validation
├── controllers/
│   ├── incomeController.js
│   ├── expenseController.js
│   └── userController.js
├── middleware/
│   └── verifyFirebaseToken.js
├── models/
│   ├── incomeModel.js
│   ├── expenseModel.js
│   └── userModel.js
├── routes/
│   ├── auth.js
│   ├── income.js
│   ├── expense.js
│   ├── user.js
│   └── home.js
├── utils/
│   └── userUtils.js
├── .env                    ← NEVER commit (real values)
├── .env.example            ← commit (placeholders only)
└── package.json
```

### Install Dependencies

```bash
cd BudgetTrackerAPI
npm install
```

### Key Dependencies

```json
"express"          → HTTP server
"mongoose"         → MongoDB ORM
"firebase-admin"   → verify Firebase tokens
"dotenv-flow"      → environment variable loading
"cors"             → cross-origin requests
"jsonwebtoken"     → JWT utilities
```

---

## 5. Frontend Setup

### Folder Structure

```
BudgetTrackerIOS/
├── app/                    ← Expo Router screens
│   ├── (auth)/             ← authenticated routes
│   ├── (tabs)/             ← tab navigation
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expense/
│   │   └── profile/
│   ├── login.tsx
│   ├── register.tsx
│   └── _layout.tsx
├── components/
│   ├── common/             ← shared UI components
│   └── transactions/       ← transaction-specific
├── constants/
│   ├── Colors.ts           ← theme colors (light + dark)
│   └── categoryIcons.ts    ← category → Ionicons mapping
├── context/
│   ├── authContext/
│   ├── IncomeContext.tsx
│   ├── ExpenseContext.tsx
│   └── GlobalContext.tsx
├── hooks/
│   ├── useThemeColors.ts
│   ├── useAllTransactions.ts
│   ├── useTransactionControls.ts
│   └── useDashboardData.ts
├── services/
│   ├── api.ts              ← Axios instance + Firebase interceptor
│   └── firebase/
│       └── firebaseAuth.ts
├── utils/
│   ├── formatters.ts
│   └── groupTransactions.ts
├── GoogleService-Info.plist ← iOS Firebase config (safe to commit)
├── app.json                ← Expo config
├── eas.json                ← EAS build profiles
└── package.json
```

### Install Dependencies

```bash
cd BudgetTrackerIOS
npm install
```

---

## 6. Firebase Setup

### Create Firebase Project

1. Go to **console.firebase.google.com**
2. Click **"Add project"**
3. Name it (e.g. `budgettracker`)
4. Disable Google Analytics (not needed)
5. Click **Create Project**

### Enable Authentication

1. Left sidebar → **Authentication** → **Get Started**
2. **Sign-in method** tab → **Email/Password** → Enable → Save

### iOS App Registration

1. Project Settings (gear icon) → **"Add app"** → iOS
2. Bundle ID: `com.yourname.budgettrackerios`
3. Download **`GoogleService-Info.plist`**
4. Place it in the **frontend project root**

### Backend Service Account

1. Project Settings → **Service Accounts** tab
2. Click **"Generate new private key"**
3. Download the JSON file
4. Convert to base64:

```bash
# Mac/Linux
base64 -i serviceAccount.json

# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("serviceAccount.json"))
```

5. Store the base64 string as `FIREBASE_SERVICE_ACCOUNT_BASE64` in your env vars
6. **Never commit the JSON file**

---

## 7. MongoDB Atlas Setup

### Create Cluster

1. Go to **cloud.mongodb.com** → **Build a Database**
2. Choose **Free (M0)** tier
3. Select a region close to your Render server
4. Name your cluster

### Create Database Users

1. Left sidebar → **Database Access** → **Add New Database User**
2. Create two users:

```
Username: dev_user     Role: Read and write to any database
Username: prod_user    Role: Read and write to any database
```

⚠️ **Always use "Read and write" role** — read-only will cause update/delete operations to fail silently.

### Create Databases

1. Left sidebar → **Databases** → **Browse Collections**
2. Create two databases:
```
budgettracker_dev   ← staging / development
budgettracker_prod  ← production
```

### Get Connection Strings

1. Click **Connect** on your cluster
2. Choose **"Connect your application"**
3. Copy the URI and replace `<password>` with your user password:

```
mongodb+srv://dev_user:<password>@cluster0.xxx.mongodb.net/budgettracker_dev
mongodb+srv://prod_user:<password>@cluster0.xxx.mongodb.net/budgettracker_prod
```

### Whitelist IP

1. Left sidebar → **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
3. This is required for Render to connect

---

## 8. Environment Variables

### Backend `.env` (local only — never commit)

Create `.env` in `BudgetTrackerAPI/`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://dev_user:<password>@cluster0.xxx.mongodb.net/budgettracker_dev
URL_DEV=/api/v1
FIREBASE_SERVICE_ACCOUNT_BASE64=<your_base64_string>
JWT_SECRET=<any_random_string_min_32_chars>
CORS_ORIGINS=http://localhost:3000
```

### `.env.example` (commit this — placeholders only)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster/<dbname>
URL_DEV=/api/v1
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64_encoded_service_account_json>
JWT_SECRET=<your_jwt_secret>
CORS_ORIGINS=http://localhost:3000
```

### `.gitignore` Rules

Make sure your `.gitignore` contains:

```
.env
.env.*
!.env.example
```

This allows only `.env.example` through — all real env files are blocked.

---

## 9. Running Locally

### Start Backend

```bash
cd BudgetTrackerAPI
npm run dev
```

Should see:
```
you are listening on port: 5000
[Mongo] Connected
[Mongo] db: budgettracker_dev
```

### Start Frontend (requires EAS dev client installed on iPhone)

```bash
cd BudgetTrackerIOS
npx expo start --dev-client
```

Scan the QR code with your iPhone camera — opens in the dev client app.

⚠️ **Do NOT use Expo Go** — React Native Firebase requires a custom dev client.

### Local API URL

When running locally, your iPhone and laptop must be on the **same WiFi network**. The API URL will be your machine's local IP:

```
http://192.168.x.x:5000/api/v1
```

Find your local IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

Update `services/api.ts` fallback URL while developing locally.

---

## 10. Backend Deployment — Render

You need **two separate Render services** — one for staging, one for production.

### Create Staging Service

1. **render.com** → New → **Web Service**
2. Connect your GitHub backend repo
3. Select branch: `dev`
4. Configure:

```
Name:           budgettracker-api-staging
Build command:  npm install
Start command:  node app.js
Plan:           Free
```

5. Add environment variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=<dev_atlas_uri>
URL_DEV=/api/v1
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64>
JWT_SECRET=<secret>
CORS_ORIGINS=http://localhost:3000
```

### Create Production Service

1. Same steps but:

```
Name:           budgettracker-api-production
Branch:         main
```

2. Environment variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<prod_atlas_uri>
URL_DEV=/api/v1
FIREBASE_SERVICE_ACCOUNT_BASE64=<base64>
JWT_SECRET=<secret>
CORS_ORIGINS=https://your-production-domain
```

### Verify Both Services

```bash
# Staging
curl https://your-staging-url.onrender.com/health

# Production
curl https://your-production-url.onrender.com/health
```

Both should return:
```json
{ "status": "ok", "message": "Server is running", "timestamp": "..." }
```

### Important Notes

- Real values go **directly into Render's environment variables UI** — never in files
- Render free tier sleeps after 15 min inactivity — upgrade to paid for always-on
- Auto-deploy is enabled by default — every push to the connected branch triggers a deploy

---

## 11. Frontend Deployment — EAS

### First Time Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Link project (run from frontend root)
eas init
```

### EAS Build Profiles

Your `eas.json` has 3 profiles:

```
development  → dev client build for daily development
preview      → standalone build for device testing  
production   → App Store / TestFlight build
```

### Development Build (first time + after native changes)

```bash
eas build --profile development --platform ios
```

- Takes 10-20 min (or up to 3 hours on free queue)
- Install the `.ipa` via the QR code link on your iPhone through **Safari**
- After installing: `npx expo start --dev-client` for hot reload

### When to Rebuild

You only need a new EAS build when:
- Native dependencies change (`package.json`)
- `app.json` plugins change
- `GoogleService-Info.plist` changes

For all JS/UI changes — just run `npx expo start --dev-client`. Changes hot reload instantly.

### Register a Test Device (for preview builds)

```bash
eas device:create
```

Share the registration link with your tester — they visit it on their iPhone to register.

---

## 12. TestFlight Distribution

### Step 1 — Create App Record in App Store Connect

1. Go to **appstoreconnect.apple.com**
2. Apps → **+** → **New App**
3. Fill in:

```
Platform:         iOS
Name:             BudgetTracker
Primary Language: English
Bundle ID:        com.yourname.budgettrackerios
SKU:              budgettrackerios
```

### Step 2 — Register Bundle ID (if not exists)

1. **developer.apple.com** → Certificates, IDs & Profiles → Identifiers
2. **+** → App IDs → App
3. Bundle ID: `com.yourname.budgettrackerios` (Explicit)

### Step 3 — Production Build

```bash
eas build --profile production --platform ios
```

Wait for build to complete (~20 min).

### Step 4 — Submit to TestFlight

```bash
eas submit --platform ios
```

EAS automatically submits to App Store Connect using `ascAppId` from `eas.json`.

### Step 5 — Add Testers

1. App Store Connect → Your App → **TestFlight**
2. Internal Testing → **+** next to testers
3. Add tester by Apple ID email
4. They receive an email → download TestFlight app → install your app

---

## 13. Version Management

Follow **Semantic Versioning**: `Major.Minor.Patch`

| Type | When | Example |
|------|------|---------|
| Major | Breaking changes, full redesign | `1.0.0 → 2.0.0` |
| Minor | New features | `1.0.0 → 1.1.0` |
| Patch | Bug fixes | `1.0.0 → 1.0.1` |

### Update Version

Both files must stay in sync:

**`app.json`:**
```json
{
  "expo": {
    "version": "1.1.0"
  }
}
```

**`package.json`:**
```json
{
  "version": "1.1.0"
}
```

### OTA Updates (no rebuild needed)

For JS-only changes after shipping to TestFlight:

```bash
eas update --channel production --message "Fix sort bug"
```

Users get the update automatically next time they open the app.

---

## 14. Git Workflow

### Daily Development

```bash
# Start a new feature
git checkout dev
git pull origin dev
git checkout -b feature/search-bar

# Work on feature...
git add .
git commit -m "feat: add search bar to transactions screen"
git push origin feature/search-bar

# Open PR: feature/search-bar → dev
# After review and merge:
git checkout dev
git pull origin dev
```

### Releasing to Production

```bash
# Open PR: dev → main
# After review and merge:
git checkout main
git pull origin main

# Render auto-deploys production backend
# Run EAS production build for frontend
eas build --profile production --platform ios
eas submit --platform ios
```

### Commit Message Format

```
feat:     new feature
fix:      bug fix
chore:    maintenance (deps, config)
docs:     documentation
refactor: code restructure, no behavior change
```

---

## 15. Secrets Management

### The Golden Rule

```
Real secrets → never in git
Real secrets → Render UI (backend) or EAS environment (frontend)
Git → .env.example with placeholders only
```

### What is Safe to Commit

| File | Safe? | Reason |
|------|-------|--------|
| `GoogleService-Info.plist` | ✅ Yes | Public Firebase client config by design |
| `.env.example` | ✅ Yes | Placeholders only |
| `eas.json` | ✅ Yes | No secrets, just build config |
| `app.json` | ✅ Yes | No secrets |
| `.env` | ❌ No | Real values |
| `.env.development` | ❌ No | Real values |
| Firebase service account JSON | ❌ No | Private key |

### If You Accidentally Commit a Secret

1. **Rotate the secret immediately** (change password, regenerate key)
2. Remove from git history:

```bash
pip install git-filter-repo
python -m git_filter_repo --path .env.development --invert-paths --force
git remote add origin <your-repo-url>
git push origin main --force
git push origin dev --force
```

3. Close GitGuardian alert as "Revoked"

---

## 16. Troubleshooting

### `RNFBAppModule not found`

**Cause:** Running in Expo Go instead of dev client  
**Fix:** Install EAS dev client build and use `npx expo start --dev-client`

### `timeout of 15000ms exceeded`

**Cause:** Frontend calling wrong backend URL (localhost instead of Render)  
**Fix:** Check `services/api.ts` baseURL — must point to Render URL

### `Request failed with status code 404`

**Cause:** Route prefix mismatch — `URL_DEV` not set on Render  
**Fix:** Add `URL_DEV=/api/v1` to Render environment variables

### `SyntaxError: Unexpected token` in app.js

**Cause:** Bad merge conflict resolution leaving orphaned lines  
**Fix:** Open `app.js`, find and remove any `<<<<<<<`, `=======`, `>>>>>>>` markers and floating code

### Login returns 404

**Cause:** User exists in Firebase but not in MongoDB  
**Fix:** Call `/api/v1/auth/register` first with the Firebase token

### MongoDB `user is not allowed to do action [update]`

**Cause:** Database user has read-only role  
**Fix:** MongoDB Atlas → Database Access → edit user → change to "Read and write to any database"

### EAS build fails with `missing ios.googleServicesFile`

**Cause:** `GoogleService-Info.plist` not committed to git  
**Fix:** Download from Firebase Console → commit to project root

### GitGuardian flags `GoogleService-Info.plist` API key

**Cause:** False positive — this key is public by design  
**Fix:** Close alert as "False positive" — do NOT revoke the key

---

## Quick Reference

### Useful Commands

```bash
# Start backend locally
npm run dev

# Start frontend (dev client)
npx expo start --dev-client

# EAS development build
eas build --profile development --platform ios

# EAS production build
eas build --profile production --platform ios

# Submit to TestFlight
eas submit --platform ios

# OTA update (JS changes only)
eas update --channel production --message "your message"

# Register test device
eas device:create

# List builds
eas build:list
```

### Key URLs

```
Staging backend:    https://budgettrackerapi-muxo.onrender.com
Production backend: https://budgettrackerapi-1-utry.onrender.com
Expo dashboard:     https://expo.dev
Firebase console:   https://console.firebase.google.com
MongoDB Atlas:      https://cloud.mongodb.com
App Store Connect:  https://appstoreconnect.apple.com
```

### Environment Summary

| Environment | Backend | Database | Frontend |
|-------------|---------|----------|----------|
| Local | localhost:5000 | budgettracker_dev | Expo dev client |
| Staging | Render staging | budgettracker_dev | EAS preview build |
| Production | Render production | budgettracker_prod | TestFlight |

---

*Last updated: March 2026 — BudgetTracker v1.1.0*
