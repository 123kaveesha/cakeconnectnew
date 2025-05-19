const mongoose = require("mongoose");

const cakeDesignRequestSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    baker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "baker",
      required: true,
    },
    objectUrl: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CakeDesignRequest", cakeDesignRequestSchema);