const Order = require("../models/Order");
const { sendShippingNotification } = require("../utils/email");

const SHIPPING_COST = 4.99;

// Called internally (not via HTTP) when a PaymentIntent is created.
// Saves a pending order to the database so there is a record before
// the payment completes. The webhook later updates it to "Paid".
const createPendingOrder = async (cart, paymentIntentId, email, shippingAddress) => {
  const items = cart.map((item) => ({
    product: item._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = itemsTotal + SHIPPING_COST;

  return await Order.create({
    items,
    total,
    shippingCost: SHIPPING_COST,
    shippingAddress,
    paymentIntentId,
    email,
    status: "Pending",
  });
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

// PUT /api/orders/:id/ship
// Marks an order as Shipped and sends a shipping notification email to the customer.
const shipOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.status !== "Paid") return res.status(400).json({ error: "Only Paid orders can be marked as shipped" });

    order.status = "Shipped";
    await order.save();

    if (order.email) {
      try {
        await sendShippingNotification(order.email, order);
      } catch (err) {
        console.error("Failed to send shipping notification:", err.message);
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to ship order" });
  }
};

module.exports = { createPendingOrder, getOrders, getOrderByPaymentIntent, shipOrder };
