const express = require("express");
const { createOrder, getOrders } = require("../controllers/orderController");
const router = express.Router();

// POST /api/orders/checkout
router.post("/checkout", createOrder);

// GET all orders (admin or user-specific)
router.get("/", getOrders);

module.exports = router;