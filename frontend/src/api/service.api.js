import axios from './api';

export const createService = (serviceData) => axios.post('/services', serviceData);
export const getAllServices = () => axios.get('/services');
export const updateService = (id, serviceData) => axios.put(`/services/${id}`, serviceData);
export const deleteService = (id) => axios.delete(`/services/${id}`);
export const getServicesByBarbershop = (barbershopId) => axios.get(`/services?barbershop_id=${barbershopId}`);
