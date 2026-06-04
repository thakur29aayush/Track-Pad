const crypto = require("crypto");
const { razorpayKeySecret } = require("../config/env");

function verifyRazorpayPayment({ orderId, paymentId, signature }) {
  const body = `${orderId}|${paymentId}`;

  const expectedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

module.exports = verifyRazorpayPayment;