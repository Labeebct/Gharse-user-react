import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCart, addToCart, updateCart, removeFromCart } from './cart.api';
import { useAlert } from '../../hooks/useAlert';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await getCart();
      return response.data.data;
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      showSuccess('Item added to cart');
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Failed to add to cart');
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { showSuccess } = useAlert();

  return useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
      showSuccess('Item removed from cart');
    },
  });
};
