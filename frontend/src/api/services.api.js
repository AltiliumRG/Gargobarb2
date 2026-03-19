import axios from "./api"; // Use the more robust instance with refresh logic

export const getServicesByBarbershop = (barbershopId) =>
  axios.get(`/services/barbershop/${barbershopId}`);

export const getAllServices = () => 
  axios.get('/services');

export const createService = async (data) => {
  return axios.post("/services", data);
};

export const updateService = (id, data) =>
  axios.put(`/services/${id}`, data);

export const deleteService = (id) =>
  axios.delete(`/services/${id}`);