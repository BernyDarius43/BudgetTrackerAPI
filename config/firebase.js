// config/firebase.js
const admin = require('firebase-admin');

function initFirebaseAdmin() {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      console.log('Firebase Admin already initialized');
      return admin;
    }

    let serviceAccount;
    let credential;

    // METHOD 0: Use GOOGLE_APPLICATION_CREDENTIALS (path outside repo)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('Loading Firebase credentials from GOOGLE_APPLICATION_CREDENTIALS');
      credential = admin.credential.applicationDefault();
    }
    // METHOD 1: Use base64-encoded service account (recommended for Render/Railway)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      console.log('Loading Firebase credentials from base64');
      const base64String = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
      const jsonString = Buffer.from(base64String, 'base64').toString('utf-8');
      serviceAccount = JSON.parse(jsonString);
      credential = admin.credential.cert(serviceAccount);
    }
    // METHOD 2: Use individual environment variables (fallback)
    else if (process.env.FIREBASE_PRIVATE_KEY) {
      console.log('Loading Firebase credentials from env vars');
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace literal \n with actual newlines
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
      credential = admin.credential.cert(serviceAccount);
    }
    // No credentials found
    else {
      throw new Error('No Firebase credentials found. Set GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT_BASE64, or individual env vars.');
    }

    admin.initializeApp({
      credential,
    });

    console.log('Firebase Admin initialized successfully');
    return admin;
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error.message);
    throw error;
  }
}

// Initialize Firebase Admin
initFirebaseAdmin();

module.exports = admin;
