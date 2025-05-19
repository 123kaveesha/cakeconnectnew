const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // for image upload via memory storage

const {
  getMyProfile,
  updateMyProfile,
  deleteProfileImage,
  getAllCustomers,
  getAllBakers,
  deleteCustomerById,
  deleteBakerById,
  getBakerById,
} = require("../controllers/userController");

const { protect, checkRole } = require("../middleware/authMiddleware");

// Profile (Customer/Baker)

// @route   GET /api/profile
// @desc    Get current user's full profile
// @access  Private
router.get("/profile", protect, getMyProfile);

// @route   PATCH /api/profile
// @desc    Update profile (with optional image)
// @access  Private
router.patch("/profile", protect, upload.single("image"), updateMyProfile);

// @route   DELETE /api/profile/image
// @desc    Delete profile image
// @access  Private
router.delete("/profile/image", protect, deleteProfileImage);

// Admin-Only Routes

// @route   GET /api/users/customers
// @desc    Get all customers
// @access  Private (Admin)
router.get("/users/customers", protect, checkRole("admin"), getAllCustomers);

// @route   GET /api/users/bakers
// @desc    Get all bakers
// @access  Private (Admin)
router.get(
  "/users/bakers",
  protect,
  checkRole("admin", "customer"),
  getAllBakers
);

// @route   DELETE /api/users/customers/:id
// @desc    Delete a customer by ID
// @access  Private (Admin)
router.delete(
  "/users/customers/:id",
  protect,
  checkRole("admin"),
  deleteCustomerById
);

// @route   DELETE /api/users/bakers/:id
// @desc    Delete a baker by ID
// @access  Private (Admin)
router.delete(
  "/users/bakers/:id",
  protect,
  checkRole("admin"),
  deleteBakerById
);

// Public

// @route   GET /api/users/bakers/:id
// @desc    Public view of a baker's profile
// @access  Public
router.get("/users/bakers/:id", getBakerById);

module.exports = router;
