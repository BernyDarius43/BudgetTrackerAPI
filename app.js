// app.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");
require("./config/firebase"); // initialize firebase-admin once

const app = express();

// --- CORS: supports 3 options ---
// 1) Expo mobile (often sends no Origin) -> allowed
// 2) Web frontend (origin must be whitelisted in CORS_ORIGINS) -> allowed
// 3) Local dev (localhost origins can be included in CORS_ORIGINS) -> allowed
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Mobile apps / server-to-server calls may not send Origin
      if (!origin) return cb(null, true);

      // If no whitelist provided, allow all (good for early testing)
      if (allowedOrigins.length === 0) return cb(null, true);

      // Enforce whitelist for browser origins
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
const incomeRoutes = require("./routes/income");
const homeRoutes = require("./routes/home");
const expenseRoutes = require("./routes/expense");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use(homeRoutes);
app.use(incomeRoutes);
app.use(expenseRoutes);
app.use(authRoutes);
app.use(userRoutes);

const PORT = process.env.PORT || 1738;
app.listen(PORT, () => {
  console.log("you are listening on port :", PORT);
});
