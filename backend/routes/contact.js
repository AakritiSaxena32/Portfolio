const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact — validates and saves the message.
// Email sending (owner notification + visitor auto-reply) now
// happens client-side via EmailJS, right after this call succeeds.
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, email and message are required.",
      });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }

    const saved = await Message.create({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Message received successfully!",
      id: saved._id,
    });

  } catch (err) {
    console.error("❌ Contact Form Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to process contact form.",
      details: err.message,
    });
  }
});

// GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch messages",
      details: err.message,
    });
  }
});

module.exports = router;