import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    // In browser, connect to current origin or NEXT_PUBLIC_SOCKET_URL if set
    const socketUrl = (typeof window !== 'undefined' && window.location.origin) || 'http://localhost:3000';
    
    socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Connected to EventTicket real-time WebSocket server');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from real-time server:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.warn('Real-time connection notice:', error.message);
    });
  }

  return socketInstance;
}

export function joinEventRoom(eventId: string) {
  const socket = getSocket();
  if (socket && eventId) {
    socket.emit('join-event', eventId);
  }
}

export function leaveEventRoom(eventId: string) {
  const socket = getSocket();
  if (socket && eventId) {
    socket.emit('leave-event', eventId);
  }
}

export function joinAdminRoom() {
  const socket = getSocket();
  if (socket) {
    socket.emit('join-admin');
  }
}
