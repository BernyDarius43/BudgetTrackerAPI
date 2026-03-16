# Railway Deployment Guide (BudgetTracker API)

This guide explains how to deploy the BudgetTracker Node/Express backend to Railway with:
- Firebase Admin authentication (service account as env vars / base64)
- MongoDB Atlas connection
- Two environments: Development + Production
- Two databases (same Atlas cluster): budgettracker_dev + budgettracker_prod

---

## 1) Prerequisites

1. MongoDB Atlas cluster created
2. Firebase project created (Authentication enabled)
3. Service account generated in Google Cloud (Firebase Admin SDK)
4. GitHub repo for the backend

---

## 2) Repo requirements (Backend)

### package.json
Ensure scripts exist:

- `start`: runs the server in Railway
- `dev`: optional local nodemon

Example:
```json
"scripts": {
  "dev": "nodemon app.js",
  "start": "node app.js"
}
