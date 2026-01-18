// controllers/userController.js
const User = require('../models/userModel');

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
