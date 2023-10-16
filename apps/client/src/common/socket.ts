import io from 'socket.io-client';

export const socket = io(import.meta.env.NODE_ENV !== 'production' ? ':3000' : '');

socket.on('disconnect', () => {
  window.location.reload();
});
