const express = require("express");
const {
  addWarranty,
  getWarrantyById,
  getAllWarrantyByUser,
  updateWarrantyById,
  deleteWarrantyById,
  uploadInvoice,
  getExpiringWarrantiesByUser,
  shareAccess,
  revokeAccess,
  getWarrantyStatsByUser,
} = require("../controllers/warrantyController");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @swagger
 * /api/v1/app/warranty/addWarranty:
 *   post:
 *     summary: Add a new warranty
 *     tags: [Warranties]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - itemName
 *               - category
 *               - purchasedOn
 *               - expiresOn
 *               - addedBy
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               category:
 *                 type: string
 *                 example: Electronics
 *               warrantyProvider:
 *                 type: string
 *                 example: Apple Inc.
 *               purchasedOn:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               expiresOn:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-15
 *               description:
 *                 type: string
 *                 example: One year manufacturer warranty
 *               addedBy:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               invoiceFile:
 *                 type: string
 *                 format: binary
 *                 description: Invoice file (max 5MB)
 *     responses:
 *       201:
 *         description: Warranty added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Warranty added successfully
 *                 warranty:
 *                   $ref: '#/components/schemas/Warranty'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/addWarranty", upload.single("invoiceFile"), addWarranty);
/**
 * @swagger
 * /api/v1/app/warranty/uploadInvoice:
 *   post:
 *     summary: Upload invoice file to AWS S3
 *     tags: [Warranties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Invoice uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   example: https://s3.amazonaws.com/bucket/invoice.pdf
 *       400:
 *         description: Upload failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/uploadInvoice", uploadInvoice);

/**
 * @swagger
 * /api/v1/app/warranty/getAllWarrantyByUser/{addedBy}:
 *   get:
 *     summary: Get all warranties for a specific user
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: addedBy
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Warranties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 warranties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warranty'
 *       404:
 *         description: No warranties found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/getAllWarrantyByUser/:addedBy", getAllWarrantyByUser);

/**
 * @swagger
 * /api/v1/app/warranty/getWarrantyById/{id}:
 *   get:
 *     summary: Get warranty by ID
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warranty ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Warranty retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 warranty:
 *                   $ref: '#/components/schemas/Warranty'
 *       404:
 *         description: Warranty not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/getWarrantyById/:id", getWarrantyById);

/**
 * @swagger
 * /api/v1/app/warranty/deleteWarrantyById/{id}:
 *   delete:
 *     summary: Delete warranty by ID
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warranty ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Warranty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Warranty deleted successfully
 *       404:
 *         description: Warranty not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/deleteWarrantyById/:id", deleteWarrantyById);

/**
 * @swagger
 * /api/v1/app/warranty/stats/{addedBy}:
 *   get:
 *     summary: Get warranty statistics for a user
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: addedBy
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 stats:
 *                   $ref: '#/components/schemas/WarrantyStats'
 *       404:
 *         description: No data found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/stats/:addedBy", getWarrantyStatsByUser);

/**
 * @swagger
 * /api/v1/app/warranty/updateWarrantyById/{id}:
 *   put:
 *     summary: Update warranty by ID
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warranty ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 example: iPhone 14 Pro Max
 *               category:
 *                 type: string
 *                 example: Electronics
 *               warrantyProvider:
 *                 type: string
 *                 example: Apple Inc.
 *               purchasedOn:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               expiresOn:
 *                 type: string
 *                 format: date
 *                 example: 2025-01-15
 *               description:
 *                 type: string
 *                 example: Extended warranty coverage
 *               invoiceFile:
 *                 type: string
 *                 format: binary
 *                 description: New invoice file (max 5MB)
 *     responses:
 *       200:
 *         description: Warranty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Warranty updated successfully
 *                 warranty:
 *                   $ref: '#/components/schemas/Warranty'
 *       404:
 *         description: Warranty not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  "/updateWarrantyById/:id",
  upload.single("invoiceFile"),
  updateWarrantyById
);

/**
 * @swagger
 * /api/v1/app/warranty/getExpiringWarrantiesByUser/{addedBy}:
 *   get:
 *     summary: Get warranties expiring soon for a user
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: addedBy
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Expiring warranties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 warranties:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warranty'
 *       404:
 *         description: No expiring warranties found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/getExpiringWarrantiesByUser/:addedBy", getExpiringWarrantiesByUser);

/**
 * @swagger
 * /api/v1/app/warranty/shareAccess/{id}:
 *   post:
 *     summary: Share warranty access with other users
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warranty ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to share with
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Access shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Access shared successfully
 *       404:
 *         description: Warranty not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/shareAccess/:id", shareAccess);

/**
 * @swagger
 * /api/v1/app/warranty/revokeAccess/{id}:
 *   delete:
 *     summary: Revoke warranty access from a user
 *     tags: [Warranties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Warranty ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID to revoke access from
 *                 example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Access revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Access revoked successfully
 *       404:
 *         description: Warranty not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/revokeAccess/:id", revokeAccess);

module.exports = router;
