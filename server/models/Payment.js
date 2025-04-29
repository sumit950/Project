const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Completed" },
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
