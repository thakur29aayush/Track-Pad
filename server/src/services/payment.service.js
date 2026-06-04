const razorpay = require("../config/razorpay");

async function createRazorpayOrder({ amount, currency = "INR", receipt }) {
  return razorpay.orders.create({
    amount: amount * 100,
    currency,
    receipt,
    payment_capture: 1,
  });
}

module.exports = {
  createRazorpayOrder,
};