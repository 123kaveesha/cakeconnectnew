const express = require("express");
const router = express.Router();

const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect, checkRole } = require("../middleware/authMiddleware");

// All routes below require authentication and "customer" role
router.use(protect, checkRole("customer"));

// @route   GET /api/cart
// @desc    Get current user's cart
router.get("/", getCart);

// @route   POST /api/cart
// @desc    Add item to cart
router.post("/", addItemToCart);

// @route   PATCH /api/cart
// @desc    Update quantity of an item
router.patch("/", updateItemQuantity);

// @route   DELETE /api/cart/item/:productId
// @desc    Remove item from cart
router.delete("/item/:productId", removeItemFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
router.delete("/", clearCart);

module.exports = router;
