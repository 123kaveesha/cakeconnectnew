// models/customerModel.js
const mongoose = require("mongoose");
const User = require("./userModel");

const CustomerSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    country: {
      type: String,
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

// Optional: Link all orders for this customer (if you implement Order model)
CustomerSchema.virtual("orders", {
  ref: "Order", // will reference future Order model
  localField: "_id",
  foreignField: "customer",
});

const Customer = User.discriminator("customer", CustomerSchema);
module.exports = Customer;
