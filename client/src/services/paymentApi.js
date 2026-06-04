import api from "./api";

export const createPaymentOrder = async (productIds) => {
  const res = await api.post("/payments/create-order", { productIds });
  return res.data;
};

export const verifyPayment = async (payload) => {
  const res = await api.post("/payments/verify", payload);
  return res.data;
};