const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Get current user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id }).populate({
      path: "items.product",
    });

    if (!cart) return res.status(200).json({ items: [] });

    res.json(cart);
  } catch (err) {
    console.error("Get cart error:", err.message);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add item to cart
const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const unitPrice = product.price;

    let cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) {
      cart = await Cart.create({ customer: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: unitPrice,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Add item error:", err.message);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// Update item quantity
const updateItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity < 1) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("Update quantity error:", err.message);
    res.status(500).json({ message: "Failed to update item quantity" });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error("Remove item error:", err.message);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("Clear cart error:", err.message);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
