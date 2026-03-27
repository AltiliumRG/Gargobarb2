import api from './axios.js';

export const createCart = async (cartData) => {
  const response = await api.post('/shopping-carts', cartData);
  return response.data;
};
