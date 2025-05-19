const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Customer = require("../models/customerModel");

// Create new order from customer's cart
const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const customer = await Customer.findById(req.user.id);
    if (
      !customer ||
      !customer.address ||
      !customer.city ||
      !customer.postalCode ||
      !customer.country
    ) {
      return res
        .status(400)
        .json({ message: "Incomplete shipping information in profile" });
    }

    const shippingAddress = {
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      country: customer.country,
    };

    const bakerOrdersMap = new Map();
    let totalPrice = 0;

    cart.items.forEach((item) => {
      const bakerId = item.product.baker.toString();
      const productEntry = {
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      };

      const subtotal = item.quantity * item.price;
      totalPrice += subtotal;

      if (!bakerOrdersMap.has(bakerId)) {
        bakerOrdersMap.set(bakerId, {
          baker: item.product.baker,
          products: [productEntry],
          subtotal,
        });
      } else {
        const existing = bakerOrdersMap.get(bakerId);
        existing.products.push(productEntry);
        existing.subtotal += subtotal;
      }
    });

    const bakerOrders = Array.from(bakerOrdersMap.values());

    const order = await Order.create({
      customer: req.user.id,
      shippingAddress,
      totalPrice,
      paymentStatus: "unpaid",
      bakerOrders,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Place order error:", err.message);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Mark an order as paid
const markOrderAsPaid = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the logged-in customer owns the order
    if (order.customer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this order" });
    }

    if (order.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ message: "Order is already marked as paid" });
    }

    order.paymentStatus = "paid";
    await order.save();

    res.json({ message: "Payment status updated to paid", order });
  } catch (err) {
    console.error("Mark as paid error:", err.message);
    res.status(500).json({ message: "Failed to update payment status" });
  }
};

// Get all orders for current customer
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .sort({ createdAt: -1 })
      .populate("customer", "name email")
      .populate({
        path: "bakerOrders.baker",
        select: "name email", // Customize fields as needed
      })
      .populate({
        path: "bakerOrders.products.product",
        select: "name imageUrl price", // Ensure 'image' exists in Product schema
      });

    res.json(orders);
  } catch (err) {
    console.error("Fetch customer orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch your orders" });
  }
};

// Get all orders containing this baker's products
const getBakerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "bakerOrders.baker": req.user.id })
      .populate("customer", "name email") // populate customer basic info
      .populate("bakerOrders.products.product", "name imageUrl price") // populate product info in bakerOrders
      .sort({ createdAt: -1 });

    // Filter only relevant bakerOrder part per order
    const filtered = orders.map((order) => {
      const bakerOrder = order.bakerOrders.find(
        (bo) => bo.baker.toString() === req.user.id
      );

      return {
        _id: order._id,
        customer: order.customer,
        shippingAddress: order.shippingAddress,
        orderedAt: order.orderedAt,
        paymentStatus: order.paymentStatus,
        bakerOrder,
      };
    });

    res.json(filtered);
  } catch (err) {
    console.error("Fetch baker orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Update baker's order status
const updateBakerOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (
    !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
      status
    )
  ) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const bakerOrder = order.bakerOrders.find(
      (bo) => bo.baker.toString() === req.user.id
    );
    if (!bakerOrder)
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });

    bakerOrder.status = status;
    await order.save();

    res.json({ message: "Order status updated", status });
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// Get a single order (for customer)
const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate("customer", "name email")
      .populate({
        path: "bakerOrders.baker",
        select: "name", // Customize fields as needed
      })
      .populate({
        path: "bakerOrders.products.product",
        select: "name price", // Customize fields as needed
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role === "customer" &&
      order.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("Get order by ID error:", err.message);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("customer", "name email")
      .populate({
        path: "bakerOrders.baker",
        select: "name email",
      })
      .populate({
        path: "bakerOrders.products.product",
        select: "name imageUrl price",
      });

    res.json(orders);
  } catch (err) {
    console.error("Fetch all orders error:", err.message);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getBakerOrders,
  updateBakerOrderStatus,
  getOrderById,
  markOrderAsPaid,
  getAllOrders
};
