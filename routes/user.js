/**
 * @openapi
 * /api/v1/user/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const express = require('express');
const verifyFirebaseToken = require('../middleware/verifyFirebaseToken');
const userController = require('../controllers/userController');

const router = express.Router();


router.get(`/user/me`, verifyFirebaseToken, userController.getMe);
router.patch(`/user/me`, verifyFirebaseToken, userController.updateMe);


console.log('[User Routes] Routes registered:');
console.log('  GET ' + urlApi + '/user/me');
console.log('  PATCH ' + urlApi + '/user/me');
module.exports = router;
