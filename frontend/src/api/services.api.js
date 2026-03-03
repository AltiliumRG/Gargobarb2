import axios from "./axios";

export const getServicesByBarbershop = (barbershopId) =>
  axios.get(`/services/barbershop/${barbershopId}`);

export const createService = async (data) => {
  console.log("📦 Payload enviado:", data);
  return axios.post("/services", data);
};

export const updateService = (id, data) =>
  axios.put(`/services/${id}`, data);

export const deleteService = (id) =>
  axios.delete(`/services/${id}`);