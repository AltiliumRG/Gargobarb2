// src/pages/barber/services.jsx
import api from "../../api/axios";

const API_URL = "/api/barbershops";

// ⚠️ Se asume que el token está en localStorage
const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ======================================================
   🏪 BARBERÍAS
====================================================== */

// Crear barbería
export const createBarbershop = (data) => {
  return api.post(API_URL, data, authHeaders());
};

// Obtener barberías (según rol)
export const getBarbershops = () => {
  return api.get(API_URL, authHeaders());
};

// Obtener barbería por ID
export const getBarbershopById = (id) => {
  return api.get(`${API_URL}/${id}`, authHeaders());
};

// Actualizar barbería
export const updateBarbershop = (id, data) => {
  return api.put(`${API_URL}/${id}`, data, authHeaders());
};

// Eliminar barbería (solo admin)
export const deleteBarbershop = (id) => {
  return axios.delete(`${API_URL}/${id}`, authHeaders());
};

/* ======================================================
   📅 HORARIOS
   (ajusta la ruta si tu backend usa otra)
====================================================== */

export const getSchedules = (barbershopId) => {
  return axios.get(
    `${API_URL}/${barbershopId}/schedules`,
    authHeaders()
  );
};

export const saveSchedules = (barbershopId, schedules) => {
  return axios.post(
    `${API_URL}/${barbershopId}/schedules`,
    { schedules },
    authHeaders()
  );
};
