//UserModels 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true, // Firebase UID
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  displayName: {
    type: String,
    trim: true,
    default: '',
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  photoURL: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  preferences: {
    currency: {
      type: String,
      default: 'CAD',
    },
    theme: {
      type: String,
      default: 'light',
    },
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true }); // adds createdAt and updatedAt

module.exports = mongoose.model('Users', userSchema);
