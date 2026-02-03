import { useEffect, useRef } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../hooks/useAlert';
import { ORDER_EVENTS } from '../../services/socket/events/order.events';

export const useOrderSocket = ({ enabled = true } = {}) => {
  const { socketService, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { showInfo, showSuccess, showWarning } = useAlert();
  const setupCompleteRef = useRef(false);

  useEffect(() => {
    if (!enabled || !isConnected || setupCompleteRef.current) return;

    let socket;
    let listeners = {};

    try {
      socket = socketService.getSocket();
      
      // Join order room
      socket.emit(ORDER_EVENTS.JOIN_ORDER_ROOM);

      // Handle order created
      listeners.onOrderCreated = (data) => {
        console.log('Order created:', data);
        showSuccess(`Order #${data.order.orderId} created successfully!`);
        queryClient.invalidateQueries(['orders']);
        queryClient.setQueryData(['order', data.order._id], data.order);
      };

      // Handle order status update
      listeners.onOrderStatusUpdated = (data) => {
        console.log('Order status updated:', data);
        const statusMessages = {
          PREPARING: 'Your order is being prepared',
          OUT_FOR_DELIVERY: 'Your order is out for delivery',
          DELIVERED: 'Your order has been delivered',
        };
        
        if (statusMessages[data.newStatus]) {
          showInfo(statusMessages[data.newStatus]);
        }
        
        queryClient.invalidateQueries(['orders']);
        queryClient.setQueryData(['order', data.orderId], (old) => ({
          ...old,
          orderStatus: data.newStatus,
        }));
      };

      // Handle rider assignment
      listeners.onRiderAssigned = (data) => {
        console.log('Rider assigned:', data);
        showInfo(`Rider ${data.rider.name} has been assigned to your order`);
        queryClient.setQueryData(['order', data.orderId], (old) => ({
          ...old,
          riderId: data.rider,
        }));
      };

      // Handle order cancellation
      listeners.onOrderCancelled = (data) => {
        console.log('Order cancelled:', data);
        showWarning(`Order #${data.orderId} has been cancelled: ${data.reason}`);
        queryClient.invalidateQueries(['orders']);
        queryClient.setQueryData(['order', data.orderId], (old) => ({
          ...old,
          orderStatus: 'CANCELLED',
          cancellationReason: data.reason,
        }));
      };

      // Register all listeners
      socket.on(ORDER_EVENTS.ORDER_CREATED, listeners.onOrderCreated);
      socket.on(ORDER_EVENTS.ORDER_STATUS_UPDATED, listeners.onOrderStatusUpdated);
      socket.on(ORDER_EVENTS.ORDER_ASSIGNED_RIDER, listeners.onRiderAssigned);
      socket.on(ORDER_EVENTS.ORDER_CANCELLED, listeners.onOrderCancelled);

      setupCompleteRef.current = true;

      return () => {
        const isRealUnmount = !document.getElementById('root');
        
        if (isRealUnmount && socket) {
          socket.emit(ORDER_EVENTS.LEAVE_ORDER_ROOM);
          socket.off(ORDER_EVENTS.ORDER_CREATED, listeners.onOrderCreated);
          socket.off(ORDER_EVENTS.ORDER_STATUS_UPDATED, listeners.onOrderStatusUpdated);
          socket.off(ORDER_EVENTS.ORDER_ASSIGNED_RIDER, listeners.onRiderAssigned);
          socket.off(ORDER_EVENTS.ORDER_CANCELLED, listeners.onOrderCancelled);
          setupCompleteRef.current = false;
        }
      };
    } catch (error) {
      console.error('Failed to setup order socket:', error);
    }
  }, [enabled, isConnected, socketService, queryClient, showInfo, showSuccess, showWarning]);

  return { isConnected };
};

export default useOrderSocket;
