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

router.post("/addWarranty", upload.single("invoiceFile"), addWarranty);
router.post("/uploadInvoice", uploadInvoice);
router.get("/getAllWarrantyByUser/:addedBy", getAllWarrantyByUser);
router.get("/getWarrantyById/:id", getWarrantyById);
router.delete("/deleteWarrantyById/:id", deleteWarrantyById);
router.get("/stats/:addedBy", getWarrantyStatsByUser);
router.put(
  "/updateWarrantyById/:id",
  upload.single("invoiceFile"),
  updateWarrantyById
);
router.get("/getExpiringWarrantiesByUser/:addedBy", getExpiringWarrantiesByUser);
router.post("/shareAccess/:id", shareAccess);
router.delete("/revokeAccess/:id", revokeAccess);

module.exports = router;
