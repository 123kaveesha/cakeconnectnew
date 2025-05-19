const User = require("./userModel");
const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    default: "",
  },
});

const Admin = User.discriminator("admin", AdminSchema);
module.exports = Admin;
