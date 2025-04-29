const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  quantity: { type: Number, default: 1 },
  purchaseDate: { type: Date, default: Date.now }
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);
module.exports = Purchase;
