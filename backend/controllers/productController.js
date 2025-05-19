const Product = require("../models/productModel");
const {
  uploadImageToSupabase,
  deleteImageFromSupabase,
} = require("../utils/supabaseImageHandler");

// Add product
const addProduct = async (req, res) => {
  const { name, price, description, category, subcategory } = req.body;
  const bakerId = req.user.id;

  try {
    let imageUrl = "";
    let imageFilename = "";

    if (req.file) {
      const result = await uploadImageToSupabase(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      imageUrl = result.url;
      imageFilename = result.filename;
    }

    const product = await Product.create({
      name,
      price,
      description,
      category,
      subcategory,
      imageUrl,
      imageFilename,
      baker: bakerId,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Add product error:", err.message);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("baker", "name email");
    res.json(products);
  } catch (err) {
    console.error("Get all products error:", err.message);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate("baker", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Get product by ID error:", err.message);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Get all products for a given baker
const getProductsByBaker = async (req, res) => {
  const bakerId = req.user.id;

  try {
    const products = await Product.find({ baker: bakerId }).populate(
      "baker",
      "name email"
    );
    res.json(products);
  } catch (err) {
    console.error("Get products by baker error:", err.message);
    res.status(500).json({ message: "Failed to fetch products for baker" });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image replacement
    if (req.file) {
      if (product.imageFilename) {
        await deleteImageFromSupabase(product.imageFilename);
      }

      const result = await uploadImageToSupabase(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      product.imageUrl = result.url;
      product.imageFilename = result.filename;
    }

    // Dynamic loop for PATCH-style updates
    const allowedFields = [
      "name",
      "price",
      "description",
      "category",
      "subcategory",
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    console.error("Update product error:", err.message);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.imageFilename) {
      await deleteImageFromSupabase(product.imageFilename);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err.message);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByBaker,
};
