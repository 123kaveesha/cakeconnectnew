const Customer = require("../models/customerModel");
const Baker = require("../models/bakerModel");
const {
  uploadImageToSupabase,
  deleteImageFromSupabase,
} = require("../utils/supabaseImageHandler");

// Get full profile for current user
const getMyProfile = async (req, res) => {
  try {
    const Model = req.user.role === "baker" ? Baker : Customer;
    const user = await Model.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Profile not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// Update profile for current user (image + fields)
const updateMyProfile = async (req, res) => {
  try {
    const Model = req.user.role === "baker" ? Baker : Customer;
    const user = await Model.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent changing restricted fields
    if (req.user.role === "baker") {
      delete req.body.rating;
      delete req.body.bakerType;
    }

    // Upload new image if provided
    if (req.file) {
      if (user.imageFilename) {
        await deleteImageFromSupabase(user.imageFilename);
      }
      const result = await uploadImageToSupabase(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      user.imageUrl = result.url;
      user.imageFilename = result.filename;
    }

    // Update other fields
    Object.keys(req.body).forEach((field) => {
      if (
        req.body[field] !== undefined &&
        !["imageUrl", "imageFilename"].includes(field)
      ) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Remove profile image
const deleteProfileImage = async (req, res) => {
  try {
    const Model = req.user.role === "baker" ? Baker : Customer;
    const user = await Model.findById(req.user.id);
    if (!user || !user.imageFilename)
      return res.status(400).json({ message: "No image to delete" });

    await deleteImageFromSupabase(user.imageFilename);
    user.imageUrl = "";
    user.imageFilename = "";
    await user.save();

    res.json({ message: "Profile image deleted" });
  } catch (err) {
    console.error("Delete image error:", err);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("name email imageUrl");
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// Get all bakers
const getAllBakers = async (req, res) => {
  try {
    const bakers = await Baker.find({}, { password: 0 }).populate({
      path: "products",
      select: "-__v -createdAt -updatedAt",
    });

    res.json(bakers);
  } catch (err) {
    console.error("Error fetching bakers:", err.message);
    res.status(500).json({ message: "Failed to fetch bakers" });
  }
};

// Delete customer
const deleteCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    if (customer.imageFilename) {
      await deleteImageFromSupabase(customer.imageFilename);
    }

    await customer.deleteOne();
    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete customer" });
  }
};

// Delete baker (with cascade)
const deleteBakerById = async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.id);
    if (!baker) return res.status(404).json({ message: "Baker not found" });

    if (baker.imageFilename) {
      await deleteImageFromSupabase(baker.imageFilename);
    }

    await baker.deleteOne();
    res.json({ message: "Baker deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete baker" });
  }
};

// Get a baker's public profile by ID
const getBakerById = async (req, res) => {
  try {
    const baker = await Baker.findById(req.params.id).select(
      "name bakerType specialty experience location imageUrl rating"
    );
    if (!baker) return res.status(404).json({ message: "Baker not found" });
    res.json(baker);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch baker" });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  deleteProfileImage,
  getAllCustomers,
  getAllBakers,
  deleteCustomerById,
  deleteBakerById,
  getBakerById,
};
