const express = require('express');
const admin = require('../config/firebase'); // Add this at top
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { buildUserPayload } = require('../utils/userUtils');


const router = express.Router();
const urlApi = process.env.URL_DEV
const secret = process.env.JWT_SECRET;


// 🔐 Register Route
router.post(`${urlApi}/auth/register`, verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email } = req.firebase;
    // const { photoURL, displayName, phoneNumber } = req.body;   


    if (!uid || !email) {
      console.log("Missing fields");
      return res.status(400).json({ error: 'Missing fields' });
    }

    let user = await User.findOne({ uid });
     // ✅ Idempotent: if user exists, return it
    if (user) {
      return res.status(200).json({
        message: 'User already registered',
        user,
      });
    }

   // ✅ Server-derived payload only (body only for safe profile fields)
    const payload = buildUserPayload(req.firebase, req.body);

    user = await User.create(payload);

    return res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration error', detail: error.message });
    console.log('Registration failed', error);
  }
});

// Login route
router.post(`${urlApi}/auth/login`, verifyFirebaseToken, async (req, res) => {
  const { uid } = req.firebase;
  try {
  const user = await User.findOne({ uid });

  if (!user) {
    return res.status(404).json({ error: 'User not found. Please register first.' });
  }

  user.lastLogin = new Date();
  await user.save();

  console.log("user logged:", user, "User token");

  return res.status(200).json({ 
    message: 'User logged in successfully', 
    user });
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log("Login failed", error);
  }
});

// IdToken refresh route
router.post(`${urlApi}/auth/refresh`, verifyFirebaseToken, async (req, res) => {
  const { uid } = req.firebase;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.lastLogin = new Date();
    await user.save();
    res.status(200).json({ message: 'Token refreshed', user });
    console.log('Token refresh called successfully', user);
    
  } catch (err) {
    res.status(500).json({ error: 'Token refresh failed', detail: err.message });
    console.log('Token refresh failed', err);
  }
});


// 🔐 Secure logout route
router.post(`${urlApi}/auth/logout`, verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebase.uid;

    // Optional: revoke Firebase session
    await admin.auth().revokeRefreshTokens(firebaseUid);
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed', detail: err.message });
  }
});

module.exports = router;
