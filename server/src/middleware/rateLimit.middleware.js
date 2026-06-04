const rateLimit = require("express-rate-limit");

const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many OTP requests. Try again later.",
  },
});

module.exports = {
  otpRateLimiter,
};