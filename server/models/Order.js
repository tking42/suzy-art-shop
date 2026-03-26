const mongoose = require("mongoose");

// Represents a customer order. Orders are created with status "Pending" when
// a PaymentIntent is initialised, then updated to "Paid" by the Stripe webhook
// once payment succeeds. This means every completed payment has a corresponding
// order record regardless of whether the user's browser returns to the success page.
const orderSchema = new mongoose.Schema({
  // Optional — only populated for logged-in users (guest checkout leaves this empty)
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },

  // Customer email collected from Stripe billing details via the webhook
  email: { type: String },

  // Snapshot of the items at time of purchase (not references, so order history
  // is preserved even if a product is later edited or deleted)
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    quantity: { type: Number, default: 1 },
    price: Number,
  }],

  total: { type: Number, required: true },

  status: {
    type: String,
    enum: ["Pending", "Paid", "Shipped", "Delivered"],
    default: "Pending",
  },

  shippingAddress: {
    name: String,
    line1: String,
    line2: String,
    city: String,
    postcode: String,
  },

  shippingCost: { type: Number, default: 4.99 },

  // Stripe PaymentIntent ID — used to match this order when the webhook fires
  paymentIntentId: String,

  // Set to true once the confirmation email is successfully sent
  emailSent: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
