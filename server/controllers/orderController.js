const Order = require("../models/Order");

// Called internally (not via HTTP) when a PaymentIntent is created.
// Saves a pending order to the database so there is a record before
// the payment completes. The webhook later updates it to "Paid".
const createPendingOrder = async (cart, paymentIntentId, email) => {
  const items = cart.map((item) => ({
    product: item._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return await Order.create({ items, total, paymentIntentId, email, status: "Pending" });
};

// GET /api/orders
// Returns all orders sorted newest first. Used by the admin dashboard.
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// GET /api/orders/by-payment-intent/:paymentIntentId
// Looks up a single order by its Stripe PaymentIntent ID.
// Used by the success page to check whether the confirmation email was sent.
const getOrderByPaymentIntent = async (req, res) => {
  try {
    const order = await Order.findOne({ paymentIntentId: req.params.paymentIntentId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

module.exports = { createPendingOrder, getOrders, getOrderByPaymentIntent };
