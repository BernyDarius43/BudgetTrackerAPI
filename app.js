require("dotenv-flow").config();
require("./config/validateEnv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./config/db");
require("./config/firebase"); // ensure Firebase Admin initializes

const app = express(); // ✅ MUST exist before app.use

// ---- Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS
const allowed = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser clients (mobile / curl) with no Origin header
      if (!origin) return cb(null, true);

      // if you didn't configure CORS_ORIGINS, allow all (development-friendly)
      if (allowed.length === 0) return cb(null, true);

      // exact match
      if (allowed.includes(origin)) return cb(null, true);

      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// ---- DB
connectDB();

// ---- Routes
const income = require("./routes/income");
const homeRoute = require("./routes/home");
const expenseRoute = require("./routes/expense");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const verifyFirebaseToken = require("./middleware/verifyFirebaseToken");

app.use(homeRoute);
app.use(income);
app.use(expenseRoute);
app.use(authRoutes);
app.use(userRoutes);

// ---- Start
const PORT = process.env.PORT;;
app.listen(PORT, () => {
  console.log("you are listening on port :", PORT);
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});
app.get("/whoami", verifyFirebaseToken ,(req, res) => {
  res.status(200).json({ uid, email });
});
