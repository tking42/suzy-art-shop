const Order = require("../models/Order");

const createPendingOrder = async (cart, paymentIntentId) => {
  const items = cart.map((item) => ({
    product: item._id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return await Order.create({ items, total, paymentIntentId, status: "Pending" });
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = { createPendingOrder, getOrders };
