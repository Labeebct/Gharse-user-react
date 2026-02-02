import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connectionStatus = 'disconnected';
    this.statusCallbacks = new Set();
  }

  connect(token) {
    if (this.socket?.connected) return this.socket;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    this.setStatus('connecting');

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupConnectionHandlers();
    return this.socket;
  }

  setupConnectionHandlers() {
    this.socket.on('connect', () => {
      this.setStatus('connected');
    });

    this.socket.on('disconnect', () => {
      this.setStatus('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      this.setStatus('error');
      console.error('Socket connection error:', error.message);
    });

    this.socket.on('reconnect', () => {
      this.setStatus('connected');
    });
  }

  setStatus(status) {
    if (this.connectionStatus !== status) {
      this.connectionStatus = status;
      this.notifyStatusCallbacks(status);
    }
  }

  getStatus() {
    return this.connectionStatus;
  }

  onStatusChange(callback) {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  notifyStatusCallbacks(status) {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.setStatus('disconnected');
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getSocket() {
    if (!this.socket) {
      throw new Error('Socket not initialized');
    }
    return this.socket;
  }
}

const socketService = new SocketService();
export default socketService;
