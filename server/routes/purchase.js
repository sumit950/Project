const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");

// Purchase Route
router.post("/buy", async (req, res) => {
  try {
    const { productId, userId, quantity } = req.body;

    if (!productId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPurchase = new Purchase({ productId, userId, quantity });
    await newPurchase.save();

    res.status(201).json({ message: "Purchase successful", purchase: newPurchase });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
