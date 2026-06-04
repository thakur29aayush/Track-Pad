import api from "./api";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data.products;
};

export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data.product;
};

export const getMyPurchases = async () => {
  const res = await api.get("/purchases/my");
  return res.data.purchases;
};

export const getProductAccess = async (productId) => {
  const res = await api.get(`/purchases/${productId}/access`);
  return res.data;
};