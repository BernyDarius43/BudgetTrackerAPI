const admin = require('../config/firebase');
const jwt = require('jsonwebtoken');
require("dotenv-flow").config();

const verifyFirebaseToken = async (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;
  console.log('AUTH HEADER:', authHeader?.slice(0, 20) + '...');

  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Token missing or invalid' });
  }
  if (!secret) {
  return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' });
}

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email } = decodedToken;
    
    // Attach raw Firebase user info for downstream use
    req.firebase = { uid, email };
    console.log('user:', req.firebase);
    
    return next();
  } catch (error) {
     console.error('verifyIdToken failed:', error);
  console.error('verifyIdToken message:', error?.message);
  console.error('verifyIdToken code:', error?.code);
  
  return res.status(401).json({
    error: 'Invalid Firebase token',
    detail: error?.message,
    code: error?.code,
  });
  }
};

module.exports = verifyFirebaseToken;
