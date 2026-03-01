const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional for guest checkout
  email: { type: String, required: true }, // for guest checkout
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Paid", "Shipped", "Delivered"], default: "Pending" },
  paymentIntentId: String, // Stripe payment reference
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);