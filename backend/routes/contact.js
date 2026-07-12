const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const nodemailer = require("nodemailer");

// Email validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Gmail transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Verify transporter when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail transporter error:", error);
  } else {
    console.log("✅ Gmail transporter is ready.");
  }
});

// POST /api/contact
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

    // Save to MongoDB
    const saved = await Message.create({
      name,
      email,
      message,
    });

    // Email to portfolio owner
    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `📩 New Contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    });

    console.log("✅ Notification email sent to owner.");

    // Auto reply to visitor
    try {
      console.log("Sending thank-you email to:", email);

      const info = await transporter.sendMail({
        from: `"Aakriti Saxena" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Thank you for contacting me!",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
              <h2>Hello ${name}! 👋</h2>

              <p>Thank you for contacting me through my portfolio website.</p>

              <p>
                I have received your message and will get back to you as soon as possible.
              </p>

              <hr>

              <h3>Your Message</h3>

              <p>${message}</p>

              <br>

              <p>Best Regards,</p>

              <h3>Aakriti Saxena</h3>

              <p>Software Developer</p>
          </div>
        `,
      });

      console.log("✅ Thank-you email sent.");
      console.log(info.response);

    } catch (mailError) {
      console.error("❌ Failed to send thank-you email:");
      console.error(mailError);
    }

    return res.status(201).json({
      success: true,
      message: "Message received successfully!",
      id: saved._id,
    });

  } catch (err) {
    console.error("❌ Contact Form Error:");
    console.error(err);

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
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    res.json(messages);

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch messages",
      details: err.message,
    });
  }
});

module.exports = router;