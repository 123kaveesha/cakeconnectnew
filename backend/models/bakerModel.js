const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");

const BakerSchema = new mongoose.Schema(
  {
    bakerType: {
      type: String,
      enum: ["cakemaker", "baker"],
      required: true,
    },
    experience: {
      type: String,
    },
    location: {
      type: String,
    },
    specialty: {
      type: String,
    },
    rating: {
      type: Number,
      default: 3.0,
    },
    imageUrl: {
      type: String,
    },
    imageFilename: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual population for products
BakerSchema.virtual("products", {
  ref: "Product", // Related model
  localField: "_id", // Match baker._id
  foreignField: "baker", // To product.baker
});

// Cascade delete products when baker is removed
BakerSchema.pre("remove", async function (next) {
  try {
    await Product.deleteMany({ baker: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Baker = User.discriminator("baker", BakerSchema);
module.exports = Baker;
