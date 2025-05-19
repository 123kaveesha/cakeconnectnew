const express = require("express");
const router = express.Router();
const { submitContactForm, getAllContacts } = require("../controllers/contactController");
const { protect, checkRole } = require("../middleware/authMiddleware");

// Public: Anyone can submit contact form
router.post("/", protect, submitContactForm);

// Admin: Get all contact messages
router.get("/", protect, checkRole("admin"), getAllContacts);

module.exports = router;