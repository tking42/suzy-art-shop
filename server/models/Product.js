const mongoose = require("mongoose");

// Represents a product listed in the shop.
// Stock is decremented by the Stripe webhook when an order is paid.
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  // Path to image served from /public/images/products/, or a full URL
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
