// src/pages/barber/services.jsx
import axios from "axios";

const API_URL = "http://localhost:4000/api/barbershops";

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
  return axios.post(API_URL, data, authHeaders());
};

// Obtener barberías (según rol)
export const getBarbershops = () => {
  return axios.get(API_URL, authHeaders());
};

// Obtener barbería por ID
export const getBarbershopById = (id) => {
  return axios.get(`${API_URL}/${id}`, authHeaders());
};

// Actualizar barbería
export const updateBarbershop = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data, authHeaders());
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
