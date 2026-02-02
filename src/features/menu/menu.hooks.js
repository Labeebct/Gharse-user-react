import { useQuery } from '@tanstack/react-query';
import { getMenuItems } from './menu.api';

export const useMenuItems = () => {
  return useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const response = await getMenuItems();
      return response?.data?.data?.items;
    },
  });
};
