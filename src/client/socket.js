import './style.css';

import io from 'socket.io-client';

import { setupGate } from './scenes/1-gate';

export const socket = io('http://localhost:3000');

socket.on('connect', () => {
  setupGate();
});
