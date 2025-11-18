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
  revokeAccess
} = require("../controllers/warrantyController");
const multer = require("multer");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory for direct upload to S3
  limits: { fileSize: 5 * 1024 * 1024 }, // limited file size to 5MB
});

router.post("/addWarranty", upload.single("invoiceFile"), addWarranty);
router.post("/uploadInvoice", uploadInvoice);
router.get("/getAllWarrantyByUser/:addedBy", getAllWarrantyByUser); //userid
router.get("/getWarrantyById/:id", getWarrantyById); //truckid
router.delete("/deleteWarrantyById/:id", deleteWarrantyById);
router.get("/stats/:addedBy", warrantyController.getWarrantyStatsByUser);
router.put(
  "/updateWarrantyById/:id",
  upload.single("invoiceFile"),
  updateWarrantyById
);
router.get("/getExpiringWarrantiesByUser/:addedBy", getExpiringWarrantiesByUser);
router.post("/shareAccess/:id", shareAccess);
router.delete("/revokeAccess/:id", revokeAccess);

module.exports = router;
