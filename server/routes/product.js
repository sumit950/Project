const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Get products by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase(); // Normalize category names

    // ✅ Define valid categories (Ensure these match your MongoDB categories)
    const validCategories = ["bestseller", "new", "mostviewed", "mostpurchased"];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const products = await Product.find({ category });

    // ✅ Instead of 404, return an empty array
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
