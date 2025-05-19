const express = require("express");
const router = express.Router();

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getMyReviews,
} = require("../controllers/reviewController");

const { protect, checkRole } = require("../middleware/authMiddleware");

// All review routes require authentication
router.use(protect);

// @route   POST /api/reviews
// @desc    Add a review to a product
// @access  Private (Customer)
router.post("/", checkRole("customer"), addReview);

// @route   GET /api/reviews/:productId
// @desc    Get all reviews for a product
// @access  Public
router.get("/:productId", checkRole("baker", "customer"), getProductReviews);

// @route   GET /api/reviews/my
// @desc    Get all reviews by the logged-in customer
// @access  Private (Customer)
router.get("/my", checkRole("customer"), getMyReviews);

// @route   PATCH /api/reviews/:reviewId
// @desc    Update a review
// @access  Private (Customer)
router.patch("/:reviewId", checkRole("customer"), updateReview);

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
// @access  Private (Customer)
router.delete("/:reviewId", checkRole("customer"), deleteReview);

module.exports = router;
