import apiClient from '../../services/apiClient';

// Checkout endpoints
export const getCheckout = () => {
  return apiClient.get('/checkout');
};

export const placeOrder = () => {
  return apiClient.post('/checkout/place-order');
};

export const getPaymentMethods = () => {
  return apiClient.get('/checkout/payment-method');
};

// Order endpoints
export const getUserOrders = ({ page = 1, limit = 10, status } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (status) params.append('status', status);
  
  return apiClient.get(`/orders?${params.toString()}`);
};

export const getOrderById = (orderId) => {
  return apiClient.get(`/orders/${orderId}`);
};

export const createOrder = (orderData) => {
  return apiClient.post('/orders', orderData);
};

export const cancelOrder = (orderId) => {
  return apiClient.patch(`/orders/${orderId}/cancel`);
};
