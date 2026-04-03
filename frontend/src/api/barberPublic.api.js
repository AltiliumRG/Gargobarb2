// ===============================================
// 🌍 src/api/barberPublic.api.js
// Endpoints públicos (sin auth)
// ===============================================

import api from "./axios";

// -----------------------------------------------
// Obtener barbería pública por slug
// GET /api/b/:slug
// -----------------------------------------------
export const getBySlug = (slug) => {
  return api.get(`/b/${slug}`);
};

const barberPublicApi = {
  getBySlug,
};

export default barberPublicApi;
