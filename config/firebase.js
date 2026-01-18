// config/firebase.js
const admin = require('firebase-admin');

function initFirebaseAdmin() {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('✅ Firebase Admin already initialized');
      return admin;
    }

    let serviceAccount;

    // ✅ METHOD 1: Use base64-encoded service account (RECOMMENDED for Railway/Render)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      console.log('🔑 Loading Firebase credentials from base64...');
      const base64String = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(jsonString);
    }
    // ✅ METHOD 2: Use individual environment variables (fallback)
    else if (process.env.FIREBASE_PRIVATE_KEY) {
      console.log('🔑 Loading Firebase credentials from env vars...');
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace literal \n with actual newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    }
    // ❌ No credentials found
    else {
      throw new Error('No Firebase credentials found. Set FIREBASE_SERVICE_ACCOUNT_BASE64 or individual env vars.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('✅ Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
    throw error;
  }
}

// Initialize Firebase Admin
initFirebaseAdmin();

module.exports = admin;