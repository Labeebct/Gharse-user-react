import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from './query.client';
import { SocketProvider } from '../contexts/SocketContext';
import { AlertProvider } from '../contexts/AlertContext';

export const AppProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AlertProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AlertProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};
