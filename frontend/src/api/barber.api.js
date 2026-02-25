// ===============================================
// 💈 src/api/barber.api.js
// Endpoints del BARBERO / BARBERÍAS
// ===============================================

import api from "./api";

// -----------------------------------------------
// Crear barbería
// POST /api/barbershops
// -----------------------------------------------
export const createBarbershop = (data) => {
  return api.post("/barbershops", data);
};

// -----------------------------------------------
// Obtener barberías del barbero autenticado
// GET /api/barbershops/my
// -----------------------------------------------
// Obtener barberías del barbero autenticado
export const getMyBarbershops = () => {
  return api.get("/barbershops/my");
};


// -----------------------------------------------
// Obtener barbería por ID
// GET /api/barbershops/:id
// -----------------------------------------------
export const getBarbershopById = (id) => {
  return api.get(`/barbershops/${id}`);
};

// -----------------------------------------------
// Actualizar barbería
// PUT /api/barbershops/:id
// -----------------------------------------------
export const updateBarbershop = (id, data) => {
  return api.put(`/barbershops/${id}`, data);
};

// -----------------------------------------------
// Eliminar barbería
// DELETE /api/barbershops/:id
// -----------------------------------------------
export const deleteBarbershop = (id) => {
  return api.delete(`/barbershops/${id}`);
};
