const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/notify-provider", async (req, res) => {
  const { providerEmail, userEmail } = req.body;

  if (!providerEmail || !userEmail) {
    return res.status(400).json({ message: "Provider and user email are required." });
  }

  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use your email service provider
      auth: {
        user: "your-email@gmail.com",  // Replace with your email
        pass: "your-email-password",  // Use an app password instead of real password
      },
    });

    // Email details
    const mailOptions = {
      from: "your-email@gmail.com",
      to: providerEmail,
      subject: "New Service Booking",
      text: `Hello, you have a new service booking from ${userEmail}. Please check your dashboard for details.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("✅ Email notification sent successfully!");
    res.json({ message: "Notification email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;
