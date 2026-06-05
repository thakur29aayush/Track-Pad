const { z } = require("zod");
const { createAndSendOtp, verifyOtp } = require("../services/otp.service");
const { signToken } = require("../utils/jwt");

const sendOtpSchema = z.object({
  mode: z.enum(["login", "signup"]).default("login"),
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
});

async function sendOtp(req, res, next) {
  try {
    const data = sendOtpSchema.parse(req.body);

    const result = await createAndSendOtp({
      mode: data.mode,
      email: data.email.trim().toLowerCase(),
      name: data.name?.trim(),
      phone: data.phone?.trim(),
    });

    res.json({
      message: result.message,
      emailSent: result.emailSent,
    });
  } catch (error) {
    next(error);
  }
}

async function verifyOtpController(req, res, next) {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);
    const normalizedEmail = email.trim().toLowerCase();

    const user = await verifyOtp(normalizedEmail, otp);
    const token = signToken(user);

    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isSuspended: user.isSuspended,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function me(req, res) {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      phone: req.user.phone,
      role: req.user.role,
      isSuspended: req.user.isSuspended,
    },
  });
}

module.exports = {
  sendOtp,
  verifyOtpController,
  me,
};