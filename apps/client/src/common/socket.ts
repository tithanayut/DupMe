import io from 'socket.io-client';

export const socket = io(import.meta.env.MODE === 'development' ? 'http://localhost:3000' : '');

socket.on('disconnect', () => {
  window.location.reload();
});
