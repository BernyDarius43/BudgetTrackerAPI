const express = require('express');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const userController = require('../controllers/userController');

const router = express.Router();
const urlApi = process.env.URL_DEV;

console.log('[User Routes] Registering routes with prefix:', urlApi);

router.get(`${urlApi}/user/me`, verifyFirebaseToken, userController.getMe);
router.patch(`${urlApi}/user/me`, verifyFirebaseToken, userController.updateMe);


console.log('[User Routes] Routes registered:');
console.log('  GET ' + urlApi + '/user/me');
console.log('  PATCH ' + urlApi + '/user/me');
module.exports = router;
