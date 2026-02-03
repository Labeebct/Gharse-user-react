import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserOrders, getOrderById, createOrder, cancelOrder, getCheckout, placeOrder, getPaymentMethods } from './orders.api';
import { useAlert } from '../../hooks/useAlert';
import { useNavigate } from 'react-router-dom';

// Checkout hooks
export const useCheckout = () => {
  return useQuery({
    queryKey: ['checkout'],
    queryFn: async () => {
      const response = await getCheckout();
      return response?.data?.data;
    },
    retry: 1,
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['cart']);
      queryClient.invalidateQueries(['checkout']);
      
      showSuccess('Order placed successfully!');
      // Navigate to order detail page
      if (response?.data?.data?._id) {
        navigate(`/orders/${response.data.data._id}`);
      } else {
        navigate('/orders');
      }
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Failed to place order');
    },
  });
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const response = await getPaymentMethods();
      return response?.data?.data;
    },
  });
};

// Order hooks
export const useOrders = ({ page = 1, limit = 10, status } = {}) => {
  return useQuery({
    queryKey: ['orders', page, limit, status],
    queryFn: async () => {
      const response = await getUserOrders({ page, limit, status });
      return response?.data?.data;
    },
  });
};

export const useOrder = (orderId) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await getOrderById(orderId);
      return response?.data?.data;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['cart']);
      showSuccess('Order placed successfully!');
      return response?.data?.data;
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Failed to create order');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAlert();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (response, orderId) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', orderId]);
      showSuccess('Order cancelled successfully');
    },
    onError: (error) => {
      showError(error?.response?.data?.message || 'Failed to cancel order');
    },
  });
};
