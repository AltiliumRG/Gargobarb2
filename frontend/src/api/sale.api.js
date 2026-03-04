import axios from './api';

export const createSale = (saleData) => axios.post('/sales', saleData);
export const getSalesByBarbershop = (barbershopId) => axios.get(`/sales/${barbershopId}`);
export const getRequiredDataForSale = (barbershopId) => axios.get(`/sales/data/${barbershopId}`);
export const bulkCreateSales = (sales) => axios.post('/sales/bulk', { sales });
