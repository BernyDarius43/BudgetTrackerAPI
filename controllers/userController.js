// controllers/userController.js
const User = require('../models/userModel');
const admin = require('../config/firebase');  

exports.getMe = async (req, res) => {
  try {
    const uid = req.firebase?.uid;
    if (!uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ uid }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return only what the app needs
    return res.status(200).json({
      message: 'User fetched successfully',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        role: user.role,
        preferences: user.preferences,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', detail: error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { uid } = req.firebase;
    const { displayName, phoneNumber, photoURL, preferences } = req.body || {};
    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

          // Basic validation/sanitization
    const safeDisplayName = typeof displayName === 'string' ? displayName.trim() : undefined;
    const safePhotoURL = typeof photoURL === 'string' ? photoURL.trim() : undefined;
    // Mongo-only phoneNumber
    const safePhoneNumber = typeof phoneNumber === 'string' ? phoneNumber.trim() : undefined;


    // 1) Update Firebase user (ONLY fields Firebase supports easily for your use-case)
    const firebaseUpdates = {
      displayName: safeDisplayName,
      photoURL: safePhotoURL,
    };
    Object.keys(firebaseUpdates).forEach(
      (k) => firebaseUpdates[k] === undefined && delete firebaseUpdates[k]
    );

      if (Object.keys(firebaseUpdates).length > 0) {
      await admin.auth().updateUser(uid, firebaseUpdates);
    }



     // 2) Update MongoDB user (source of truth for phoneNumber)
    const mongoUpdates = {};
    if (safeDisplayName !== undefined) mongoUpdates.displayName = safeDisplayName;
    if (safePhotoURL !== undefined) mongoUpdates.photoURL = safePhotoURL;
    if (safePhoneNumber !== undefined) mongoUpdates.phoneNumber = safePhoneNumber;
    if (preferences !== undefined) mongoUpdates.preferences = preferences;
    mongoUpdates.updatedAt = new Date();

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { $set: mongoUpdates },
      { new: true, runValidators: true }
    ).lean();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('[updateMe]', error);
    return res.status(500).json({
      error: 'Failed to update profile',
      detail: error.message,
    });
  }
};