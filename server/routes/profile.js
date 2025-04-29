const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth"); // Ensure JWT verification
const User = require("../models/User");

router.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
      },
      cart: user.cart || [], // Ensure cart data is included
    });
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
