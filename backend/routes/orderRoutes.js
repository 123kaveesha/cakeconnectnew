const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getBakerOrders,
  updateBakerOrderStatus,
  getOrderById,
  markOrderAsPaid,
  getAllOrders,
} = require("../controllers/orderController");

const { protect, checkRole } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Customer Routes

// @route   POST /api/orders
// @desc    Place a new order from the cart
// @access  Private (Customer)
router.post("/", checkRole("customer"), placeOrder);

// @route   GET /api/orders/my
// @desc    Get all orders of the logged-in customer
// @access  Private (Customer)
router.get("/my", checkRole("customer"), getMyOrders);

router.get("/all", checkRole("admin"), getAllOrders);

// @route   PATCH /api/orders/:orderId/pay
// @desc    Mark an order as paid (customer side)
// @access  Private (Customer)
router.patch("/:orderId/pay", checkRole("customer"), markOrderAsPaid);

// @route   GET /api/orders/:orderId
// @desc    Get single order by ID (customer or related baker)
// @access  Private (Customer/Baker)
router.get("/:orderId", getOrderById);

// Baker Routes

// @route   GET /api/orders/baker/all
// @desc    Get all orders assigned to the logged-in baker
// @access  Private (Baker)
router.get("/baker/all", checkRole("baker"), getBakerOrders);

// @route   PATCH /api/orders/:orderId/status
// @desc    Update the status of the baker’s part of the order
// @access  Private (Baker)
router.patch("/:orderId/status", checkRole("baker"), updateBakerOrderStatus);

module.exports = router;
