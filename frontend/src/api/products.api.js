import api from "./api";

// Crear producto
export const createProduct = async (data) => {
  return await api.post("/products/products", data);
};

// Obtener productos por barbería
export const getProductsByBarbershop = async (barbershopId) => {
  return await api.get(`/products/barbershop/${barbershopId}`);
};

// Actualizar producto
export const updateProduct = async (id, data) => {
  return await api.put(`/products/${id}`, data);
};

// Eliminar producto
export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`);
};
