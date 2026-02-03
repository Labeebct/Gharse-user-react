export const ORDER_EVENTS = {
  // Client -> Server
  JOIN_ORDER_ROOM: 'order:join',
  LEAVE_ORDER_ROOM: 'order:leave',
  
  // Server -> Client
  ORDER_CREATED: 'user:order:created',
  ORDER_STATUS_UPDATED: 'user:order:status_updated',
  ORDER_ASSIGNED_RIDER: 'user:order:rider_assigned',
  ORDER_CANCELLED: 'user:order:cancelled',
  
  // Connection events
  CONNECTED: 'connected',
  JOINED: 'joined',
  ERROR: 'error',
};

export default ORDER_EVENTS;
