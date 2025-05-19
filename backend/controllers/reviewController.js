const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

// Add a new review
const addReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = await Review.findOne({
      product: productId,
      customer: req.user.id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      customer: req.user.id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("Add review error:", err.message);
    res.status(500).json({ message: "Failed to add review" });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ product: productId })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get reviews error:", err.message);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// Get all reviews written by the current customer
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user.id })
      .populate("product", "name category")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("Get my reviews error:", err.message);
    res.status(500).json({ message: "Failed to fetch your reviews" });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.customer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.json(review);
  } catch (err) {
    console.error("Update review error:", err.message);
    res.status(500).json({ message: "Failed to update review" });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.customer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error("Delete review error:", err.message);
    res.status(500).json({ message: "Failed to delete review" });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getMyReviews,
};
