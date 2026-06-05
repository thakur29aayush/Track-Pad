import api from "./api";

export const sendOtp = async (payload) => {
  const res = await api.post("/auth/send-otp", payload);
  return res.data;
};

export const verifyOtp = async (payload) => {
  const res = await api.post("/auth/verify-otp", payload);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
};