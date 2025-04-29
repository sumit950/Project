const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking"); // Assuming you have a Booking model

// POST request to book a service
router.post("/book-service", async (req, res) => {
  const { providerId, providerEmail, userEmail } = req.body;

  if (!providerId || !providerEmail || !userEmail) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newBooking = new Booking({ providerId, providerEmail, userEmail });
    await newBooking.save();
    res.json({ message: "Service booked successfully" });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
