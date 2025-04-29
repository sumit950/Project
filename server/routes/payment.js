const express = require("express");
const router = express.Router();

router.post("/gpay", async (req, res) => {
    try {
        const { amount, transactionId } = req.body;

        // Validate input data
        if (!amount || typeof amount !== "number") {
            return res.status(400).json({ message: "❌ Invalid or missing amount" });
        }

        if (!transactionId || typeof transactionId !== "string") {
            return res.status(400).json({ message: "❌ Invalid or missing transaction ID" });
        }

        console.log("✅ GPay Payment Processed:", { amount, transactionId });

        res.status(200).json({ message: "✅ Payment successful!", transactionId });
    } catch (error) {
        console.error("❌ Payment error:", error);
        res.status(500).json({ message: "❌ Internal Server Error" });
    }
});

module.exports = router;
