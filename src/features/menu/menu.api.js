import apiClient from '../../services/apiClient';

export const getMenuItems = () => {
  return apiClient.get('/admin/menu');
};
