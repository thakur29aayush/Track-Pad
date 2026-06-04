const prisma = require("../config/prisma");
const generateOtp = require("../utils/generateOtp");
const { hashOtp, compareOtp } = require("../utils/hashOtp");
const { sendOtpEmail } = require("./email.service");

const normalizeEmail = (email) => String(email).toLowerCase().trim();

async function createAndSendOtp(email) {
  const normalizedEmail = normalizeEmail(email);

  const otp = generateOtp();
  const codeHash = await hashOtp(otp);

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: {
      email: normalizedEmail,
      isVerified: false,
    },
  });

  await prisma.otp.updateMany({
    where: {
      email: normalizedEmail,
      used: false,
    },
    data: {
      used: true,
    },
  });

  await prisma.otp.create({
    data: {
      email: normalizedEmail,
      codeHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("====================================");
    console.log(`DEV OTP for ${normalizedEmail}: ${otp}`);
    console.log("====================================");
  }

  try {
    await sendOtpEmail(normalizedEmail, otp);
  } catch (error) {
    console.error("OTP email sending failed:", error.message);

    if (process.env.NODE_ENV === "production") {
      throw new Error("Failed to send OTP email.");
    }

    return {
      emailSent: false,
      message: "OTP generated. Email failed, use terminal OTP in development.",
    };
  }

  return {
    emailSent: true,
    message: "OTP sent successfully.",
  };
}

async function verifyOtp(email, code) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = String(code).trim();

  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: normalizedEmail,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    throw new Error("OTP expired or not found.");
  }

  if (otpRecord.attempts >= 5) {
    throw new Error("Too many OTP attempts.");
  }

  const isValid = await compareOtp(normalizedCode, otpRecord.codeHash);

  if (!isValid) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw new Error("Invalid OTP.");
  }

  const user = await prisma.user.update({
    where: { email: normalizedEmail },
    data: { isVerified: true },
  });

  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  return user;
}

module.exports = {
  createAndSendOtp,
  verifyOtp,
};