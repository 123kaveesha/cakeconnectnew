const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshAccessToken,
  getProfile,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a new user (customer or baker)
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/auth/refresh-token
// @desc    Get new access token using refresh token
// @access  Public (but requires refresh token in header)
router.get("/refresh-token", refreshAccessToken);

// @route   GET /api/auth/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", protect, getProfile);

// @route   POST /api/auth/logout
// @desc    Logout user (clear refresh token in DB)
// @access  Public (but needs refresh token in header)
router.post("/logout", logoutUser);

module.exports = router;
