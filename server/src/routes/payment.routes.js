const express = require("express");
const {
  createOrder,
  verifyPayment,
  razorpayWebhook,
} = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);
router.post("/webhook", razorpayWebhook);

module.exports = router;