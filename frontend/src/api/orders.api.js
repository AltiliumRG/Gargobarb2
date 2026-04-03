// ===============================================
// 📦 src/api/orders.api.js
// Endpoints de ÓRDENES / COMPRAS
// ===============================================

import api from "./api";

// -----------------------------------------------
// Crear orden (pública — desde el checkout del cliente)
// POST /api/orders
// -----------------------------------------------
export const createOrder = (data) => {
  return api.post("/orders", data);
};

// -----------------------------------------------
// Obtener órdenes de un sitio (barbero autenticado)
// GET /api/orders/site/:siteId
// -----------------------------------------------
export const getOrdersBySite = (siteId) => {
  return api.get(`/orders/site/${siteId}`);
};
