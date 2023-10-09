import './style.css';

import io from 'socket.io-client';

import { setupGate } from './scenes/1-gate';

/* Each client knows what server’s address and server’s port are. */
export const socket = io(':3000');

socket.on('connect', () => {
  setupGate();
});
