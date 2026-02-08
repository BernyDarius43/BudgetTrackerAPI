// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Try both variable names
    const uri = process.env.MONGODB_URI_DEV;
    
    if (!uri) {
      console.error('❌ No MongoDB URI found in environment variables');
      console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
      throw new Error('MONGODB_URI or MONGO_URI environment variable is not defined');
    }
    
    await mongoose.connect(uri);

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
