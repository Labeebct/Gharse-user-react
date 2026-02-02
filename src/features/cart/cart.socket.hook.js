import { useEffect, useRef } from "react";
import { useSocket } from "../../contexts/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../hooks/useAlert";
import { CART_EVENTS } from "../../services/socket/events/cart.events";

export const useCartSocket = ({ enabled = true } = {}) => {
  const { socketService, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const { showInfo, showWarning } = useAlert();
  const setupCompleteRef = useRef(false);

  useEffect(() => {
    if (!enabled || !isConnected || setupCompleteRef.current) return;

    let socket;
    let listeners = {};

    try {
      socket = socketService.getSocket();
      
      socket.emit(CART_EVENTS.JOIN_CART_ROOM);

      listeners.onCartUpdated = (data) => {
        console.log('Cart updated:', data);
        queryClient.setQueryData(['cart'], data.cart);
      };

      listeners.onAdminAction = (data) => {
        console.log('Admin action:', data);
        showWarning(data.message);
        queryClient.invalidateQueries(['cart']);
      };

      socket.on(CART_EVENTS.CART_UPDATED, listeners.onCartUpdated);
      socket.on(CART_EVENTS.CART_ADMIN_ACTION, listeners.onAdminAction);

      setupCompleteRef.current = true;

      return () => {
        const isRealUnmount = !document.getElementById('root');
        
        if (isRealUnmount && socket) {
          socket.emit(CART_EVENTS.LEAVE_CART_ROOM);
          socket.off(CART_EVENTS.CART_UPDATED, listeners.onCartUpdated);
          socket.off(CART_EVENTS.CART_ADMIN_ACTION, listeners.onAdminAction);
          setupCompleteRef.current = false;
        }
      };
    } catch (error) {
      console.error("Failed to setup cart socket:", error);
    }
  }, [enabled, isConnected, socketService, queryClient, showInfo, showWarning]);

  return { isConnected };
};

export default useCartSocket;
