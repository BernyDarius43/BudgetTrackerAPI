
# 🔄 BudgetTracker API – Postman Usage

This project includes a Postman collection to easily test the authentication flow using Firebase and MongoDB.

---

## 📦 File Location

```
/postman/BudgetTracker_Auth_API.postman_collection.json
```

---

## 🧭 How to Use

### 1. Open Postman  
Use the [Postman app](https://www.postman.com/downloads/) or go to [https://web.postman.co](https://web.postman.co).

### 2. Import Collection  
- Click **“Import”**
- Choose the file:
  ```
  /postman/BudgetTracker_Auth_API.postman_collection.json
  ```

### 3. Create Environment Variables  
Click ⚙️ **"Manage Environments"** and add:

| Variable | Example |
|----------|---------|
| `BASE_URL` | `http://localhost:5000` |
| `FIREBASE_ID_TOKEN` | _(paste a valid Firebase token after login)_ |

### 4. Select Environment  
At the top right of Postman, choose the environment you just created.

### 5. Test Auth Routes 🚀  
You’ll find pre-configured requests for:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

Each request includes headers and sample payloads.

---

For best results, make sure your backend is running and Firebase token is fresh before sending requests.
