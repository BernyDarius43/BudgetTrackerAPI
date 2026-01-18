// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // 🔍 DEBUG: Print what Railway sees
    console.log('📝 Environment variables check:');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ EXISTS' : '❌ UNDEFINED');
    
    // Try both variable names
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!uri) {
      console.error('❌ No MongoDB URI found in environment variables');
      console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('MONGO')));
      throw new Error('MONGODB_URI or MONGO_URI environment variable is not defined');
    }

    console.log('🔌 Connecting to MongoDB...');
    console.log('   URI preview:', uri.substring(0, 30) + '...');
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
