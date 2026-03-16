// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  const env = process.env.NODE_ENV;


  // Support both naming styles so you don’t get blocked by Railway naming mismatches
  const uriDev = process.env.MONGODB_URI_DEV;

  const uriProd = process.env.MONGODB_URI_PROD || process.env.MONGODB_URI

  const uri = env === "production" ? uriProd : uriDev;

  if (!uri) {
    throw new Error(
      "Mongo URI missing. Set MONGO_URI_DEV/MONGO_URI_PROD (or MONGODB_URI_DEV/MONGODB_URI_PROD)."
    );
  }

  try {
    // Prefer canonical variable, fall back to environment-specific names
    const uri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      (process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_PROD
        : process.env.MONGODB_URI_DEV);
    
    if (!uri) {
      console.error('❌ No MongoDB URI found in environment variables');
      console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
      throw new Error(
        "MONGODB_URI (preferred), MONGO_URI, MONGODB_URI_DEV, or MONGODB_URI_PROD environment variable is not defined"
      );
    }
    
    await mongoose.connect(uri);

    // Log where you actually connected (this is how you confirm the fix)
    console.log("[Mongo] Connected");
    console.log("[Mongo] host:", mongoose.connection.host);
    console.log("[Mongo] db:", mongoose.connection.name);
    console.log("[Mongo] env:", env);
  } catch (error) {
    console.error("[Mongo] Connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
