import './style.css';

import io from 'socket.io-client';

import { setupGate } from './scenes/1-gate';

export const socket = io(process.env.NODE_ENV === 'development' ? ':3000' : undefined);

socket.on('connect', () => {
  setupGate();
});
