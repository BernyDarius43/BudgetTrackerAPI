//Helpers
const User = require('../models/userModel')

const getUser = async (firebaseUid) => {
    try {
      const user = await User.findOne({ firebaseUid });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  module.exports = getUser;