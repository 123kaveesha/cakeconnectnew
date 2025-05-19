const CakeDesignRequest = require("../models/cakeDesignRequestModel");
const { uploadImageToSupabase } = require("../utils/supabaseImageHandler");

const createRequest = async (req, res) => {
  try {
    const { bakerId, message } = req.body;
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const result = await uploadImageToSupabase(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    const request = await CakeDesignRequest.create({
      customer: req.user.id,
      baker: bakerId,
      message,
      objectUrl: result.url,
      filename: result.filename,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Create request error:", err.message);
    res.status(500).json({ message: "Failed to create request" });
  }
};

const getCustomerRequests = async (req, res) => {
  try {
    const requests = await CakeDesignRequest.find({ customer: req.user.id })
      .populate("baker", "name email");
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

const getBakerRequests = async (req, res) => {
  try {
    const requests = await CakeDesignRequest.find({ baker: req.user.id })
      .populate("customer", "name email");
    res.json(requests);
  } catch {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await CakeDesignRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Not found" });

    if (request.baker.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    request.status = status;
    await request.save();
    res.json(request);
  } catch {
    res.status(500).json({ message: "Failed to update request" });
  }
};

module.exports = {
  createRequest,
  getCustomerRequests,
  getBakerRequests,
  updateRequestStatus,
};