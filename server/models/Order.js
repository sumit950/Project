const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  totalAmount: Number,
  status: { type: String, enum: ["Pending", "Shipped", "Delivered"], default: "Pending" }
});

module.exports = mongoose.model("Order", OrderSchema);
