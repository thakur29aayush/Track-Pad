import api from "./api";

export const getAdminStats = async () => {
  const res = await api.get("/admin/stats");
  return res.data.stats;
};

export const getAdminOrders = async () => {
  const res = await api.get("/admin/orders");
  return res.data.orders;
};

export const getAdminUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data.users;
};

export const updateUser = async (id, payload) => {
  const res = await api.put(`/admin/users/${id}`, payload);
  return res.data.user;
};

export const suspendUser = async (id) => {
  const res = await api.patch(`/admin/users/${id}/suspend`);
  return res.data.user;
};

export const unsuspendUser = async (id) => {
  const res = await api.patch(`/admin/users/${id}/unsuspend`);
  return res.data.user;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/users/${id}`);
  return res.data;
};

export const createProduct = async (payload) => {
  const res = await api.post("/admin/products", payload);
  return res.data.product;
};

export const updateProduct = async (id, payload) => {
  const res = await api.put(`/admin/products/${id}`, payload);
  return res.data.product;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

export const getAdminBookings = async () => {
  const res = await api.get("/admin/counselling");
  return res.data.bookings;
};

export const updateBooking = async (id, status) => {
  const res = await api.put(`/admin/counselling/${id}`, { status });
  return res.data.booking;
};

export const createCounsellingBooking = async (payload) => {
  const res = await api.post("/counselling/book", payload);
  return res.data.booking;
};

export const deleteAdminOrder = async (id) => {
  const res = await api.delete(`/admin/orders/${id}`);
  return res.data;
};

export const clearAdminOrders = async () => {
  const res = await api.delete("/admin/orders");
  return res.data;
};