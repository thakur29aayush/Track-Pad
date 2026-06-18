import api from "./api";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data.products;
};

export const getProductBySlug = async (slug) => {
  const res = await api.get(`/products/${slug}`);
  return res.data.product;
};

export const createProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.product;
};

export const updateProduct = async (id, formData) => {
  const res = await api.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.product;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const getMyPurchases = async () => {
  const res = await api.get("/purchases/my");
  return res.data.purchases;
};

export const getProductAccess = async (productId) => {
  const res = await api.get(`/purchases/${productId}/access`);
  return res.data;
};