const Contact = require("../models/contactModel");

const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      user: req.user?.id || null,
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ message: "Message submitted successfully", contact });
  } catch (err) {
    console.error("Contact form error:", err.message);
    res.status(500).json({ message: "Failed to submit message" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
};