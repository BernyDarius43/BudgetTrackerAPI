const express = require('express');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const { getMe } = require('../controllers/userController');

const router = express.Router();
const urlApi = process.env.URL_API;

router.get(`${urlApi}/user/me`, verifyFirebaseToken, getMe);

module.exports = router;
