import apiClient from '../../services/apiClient';

export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const refreshToken = (refreshToken) => {
  return apiClient.post('/auth/refresh-token', { refreshToken });
};
