// ===============================================
// 🌍 src/api/barberPublic.api.js
// Endpoints públicos (sin auth)
// ===============================================

import api from "./api";

// -----------------------------------------------
// Obtener TODAS las barberías públicas
// GET /api/public/barbershops
// -----------------------------------------------
export const getPublicBarbershops = () => {
  return api.get("/public/barbershops");
};

// -----------------------------------------------
// Obtener barbería pública por slug o id
// GET /api/public/barbershops/:slug
// -----------------------------------------------
export const getPublicBarbershopBySlug = (slug) => {
  return api.get(`/public/barbershops/${slug}`);
};
