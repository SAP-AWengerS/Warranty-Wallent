const express = require('express');
const router = express.Router();
const { getMyProfile } = require("../controllers/users");

/**
 * @swagger
 * /api/v1/app/users/getMyProfile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/getMyProfile', getMyProfile);

module.exports = router;
