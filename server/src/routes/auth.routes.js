const express = require("express");
const {
  sendOtp,
  verifyOtpController,
  me,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { otpRateLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

router.post("/send-otp", otpRateLimiter, sendOtp);
router.post("/verify-otp", verifyOtpController);
router.get("/me", authMiddleware, me);

module.exports = router;