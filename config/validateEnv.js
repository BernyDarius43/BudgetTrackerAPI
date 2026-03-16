const fs = require('fs');

function validateEnv() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const missing = [];

  const hasMongo =
    !!process.env.MONGODB_URI ||
    !!process.env.MONGO_URI ||
    (nodeEnv === 'production'
      ? !!process.env.MONGODB_URI_PROD
      : !!process.env.MONGODB_URI_DEV);

  if (!hasMongo) {
    missing.push('MONGODB_URI (preferred), MONGO_URI, MONGODB_URI_DEV, or MONGODB_URI_PROD');
  }

  if (!process.env.PORT) {
    missing.push('PORT');
  }

  if (!process.env.JWT_SECRET) {
    missing.push('JWT_SECRET');
  }

  const hasFirebaseCreds =
    !!process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    !!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 ||
    (!!process.env.FIREBASE_PRIVATE_KEY &&
      !!process.env.FIREBASE_PROJECT_ID &&
      !!process.env.FIREBASE_CLIENT_EMAIL);

  if (!hasFirebaseCreds) {
    missing.push(
      'GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_BASE64 or (FIREBASE_PRIVATE_KEY + FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL)'
    );
  }

  const gacPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gacPath && !fs.existsSync(gacPath)) {
    missing.push(`GOOGLE_APPLICATION_CREDENTIALS path not found: ${gacPath}`);
  }

  const strict =
    (process.env.ENV_VALIDATE_STRICT || '').toLowerCase() === 'true' ||
    nodeEnv === 'production';

  if (missing.length > 0) {
    const message = `[env] Missing required environment configuration:\n- ${missing.join('\n- ')}`;
    if (strict) {
      throw new Error(message);
    }
    console.warn(message);
  }

  return { nodeEnv, ok: missing.length === 0, missing, strict };
}

module.exports = validateEnv();
