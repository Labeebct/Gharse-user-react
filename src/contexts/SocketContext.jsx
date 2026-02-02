import { createContext, useContext, useEffect, useState, useRef } from 'react';
import socketService from '../services/socket/socket.service';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const connectAttempted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !token || connectAttempted.current) {
      return;
    }

    try {
      socketService.connect(token);
      connectAttempted.current = true;

      const unsubscribe = socketService.onStatusChange((status) => {
        setConnectionStatus(status);
      });

      return () => {
        unsubscribe();
        if (!document.getElementById('root')) {
          socketService.disconnect();
          connectAttempted.current = false;
        }
      };
    } catch (error) {
      console.error('Failed to connect socket:', error);
      setConnectionStatus('error');
    }
  }, [isAuthenticated, token]);

  const isConnected = connectionStatus === 'connected';

  return (
    <SocketContext.Provider value={{ 
      socketService, 
      isConnected, 
      connectionStatus 
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export default SocketContext;
