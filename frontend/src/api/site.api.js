import api from "./api";

// 🔹 Cargar builder completo
export const getSiteByBarbershop = (barbershopId) =>
  api.get(`/sites/builder/${barbershopId}`);

// 🔹 Guardar cambios del builder
export const saveSiteBuilder = (payload) =>
  api.post("/sites/builder/save", payload);

// 🔹 Publicar sitio
export const publishSite = (siteId) =>
  api.post(`/sites/builder/publish/${siteId}`);
