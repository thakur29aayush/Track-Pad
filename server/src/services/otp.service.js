const prisma = require("../config/prisma");
const generateOtp = require("../utils/generateOtp");
const { hashOtp, compareOtp } = require("../utils/hashOtp");
const { sendOtpEmail } = require("./email.service");

async function createAndSendOtp(email) {
  const normalizedEmail = String(email).toLowerCase().trim();

  const otp = generateOtp();
  const codeHash = await hashOtp(otp);

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        isVerified: false,
      },
    });
  }

  // Mark older OTPs as used so only the latest OTP works
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

  // Development fallback: lets you test OTP even if email provider fails
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

    // In development, don't fail login just because Resend is being dramatic
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
  const normalizedEmail = String(email).toLowerCase().trim();
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