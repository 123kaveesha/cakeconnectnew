const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    imageFilename: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Main category is required"],
      enum: ["cake", "bakery"],
    },
    subcategory: {
      type: String,
      required: [true, "Subcategory is required"],
      enum: ["cupcake", "cookie", "bread", "pastry", "other"],
      default: "other",
    },
    baker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "baker",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
