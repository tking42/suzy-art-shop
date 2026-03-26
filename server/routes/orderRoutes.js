const express = require("express");
const { getOrders, getOrderByPaymentIntent, shipOrder } = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", protect, isAdmin, getOrders);
router.get("/by-payment-intent/:paymentIntentId", getOrderByPaymentIntent);
router.put("/:id/ship", protect, isAdmin, shipOrder);

module.exports = router;
