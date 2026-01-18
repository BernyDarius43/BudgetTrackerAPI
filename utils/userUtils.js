function buildUserPayload(firebase, body = {}, override = {}) {
    return {
      uid: firebase.uid,
      email: firebase.email,
      displayName: '',
      photoURL: '',
      phoneNumber:'',
      role: 'user',
      lastLogin: new Date(),
      preferences: {
        currency: 'CAD',
        theme: 'light',
      },
    };
  }
  
  module.exports = {
    buildUserPayload,
  };
  