const express = require("express");
const { getOrders, getOrderByPaymentIntent } = require("../controllers/orderController");
const router = express.Router();

router.get("/", getOrders);
router.get("/by-payment-intent/:paymentIntentId", getOrderByPaymentIntent);

module.exports = router;
