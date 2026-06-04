import api from "./api";

export const sendOtp = async (email) => {
  const res = await api.post("/auth/send-otp", { email });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};