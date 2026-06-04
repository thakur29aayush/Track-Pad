const { Resend } = require("resend");
const { resendApiKey, emailFrom } = require("../config/env");

const resend = new Resend(resendApiKey);

async function sendOtpEmail(email, otp) {
  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: "Your login OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Your OTP Code</h2>
        <p>Use this code to login:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message || "Failed to send OTP email.");
  }

  console.log("OTP email sent:", data);
  return data;
}

module.exports = {
  sendOtpEmail,
};