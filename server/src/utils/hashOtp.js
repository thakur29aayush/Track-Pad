const bcrypt = require("bcryptjs");

async function hashOtp(otp) {
  return bcrypt.hash(otp, 10);
}

async function compareOtp(otp, hash) {
  return bcrypt.compare(otp, hash);
}

module.exports = {
  hashOtp,
  compareOtp,
};