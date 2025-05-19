const express = require("express");
const router = express.Router();

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByBaker,
} = require("../controllers/productController");

const { protect, checkRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); // multer middleware

// @route   POST /api/products
// @desc    Add new product (admin or baker)
// @access  Private
router.post(
  "/",
  protect,
  checkRole("admin", "baker"),
  upload.single("image"),
  addProduct
);
// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", getAllProducts);

// @route   GET /api/products/baker
// @desc    Get all products for a given baker
// @access  Private
router.get("/baker", protect, checkRole("baker"), getProductsByBaker);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", getProductById);

// @route   PATCH /api/products/:id
// @desc    Update product details or image
// @access  Private
router.patch(
  "/:id",
  protect,
  checkRole("admin", "baker"),
  upload.single("image"),
  updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete("/:id", protect, checkRole("admin", "baker"), deleteProduct);

module.exports = router;
