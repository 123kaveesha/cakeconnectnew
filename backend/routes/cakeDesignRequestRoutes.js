const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  createRequest,
  getCustomerRequests,
  getBakerRequests,
  updateRequestStatus,
} = require("../controllers/cakeDesignRequestController");

const { protect, checkRole } = require("../middleware/authMiddleware");
const upload = multer(); // memory storage

// Create a design request
router.post("/", protect, checkRole("customer"), upload.single("file"), createRequest);

// Customer views their requests
router.get("/my", protect, checkRole("customer"), getCustomerRequests);

// Baker views received requests
router.get("/baker", protect, checkRole("baker"), getBakerRequests);

// Baker updates request status
router.patch("/:id/status", protect, checkRole("baker"), updateRequestStatus);

module.exports = router;