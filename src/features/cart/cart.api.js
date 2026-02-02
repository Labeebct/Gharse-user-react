import apiClient from '../../services/apiClient';

export const getCart = () => {
  return apiClient.get('/cart');
};

export const addToCart = (data) => {
  return apiClient.post('/cart/add', data);
};

export const updateCart = (data) => {
  return apiClient.patch('/cart/update', data);
};

export const removeFromCart = (menuId) => {
  return apiClient.delete('/cart/remove', { data: { menuId } });
};
