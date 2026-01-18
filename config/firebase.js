const admin = require('firebase-admin');
const serviceAccount = require('./budgettracker-8f9d7-firebase-adminsdk-k533o-528c3dbd97.json'); // Update the path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://budgettracker-8f9d7-default-rtdb.firebaseio.com", // Replace with your database URL
});

module.exports = admin;
