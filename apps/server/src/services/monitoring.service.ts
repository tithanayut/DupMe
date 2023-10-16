import { GlobalKeyboardListener } from 'node-global-key-listener';

import { io } from '../server';
import { RoomService } from './gameroom.service';
import { PlayerService } from './player.service';

let debounced = false;

export const MonitoringService = {
  /* Server program shows the number of concurrent clients that are online */
  reportConcurrentClients: () => {
    console.info(
      `There are ${
        io.engine.clientsCount
      } clients connected, ${PlayerService.getPlayerCount()} has registered: ${PlayerService.getPlayers()
        .map((player) => player.name)
        .join(', ')}`,
    );
  },
  reinitializeServer: () => {
    PlayerService.resetPlayers();
    RoomService.resetRooms();
    io.emit('reset');
  },
  /* Server has a reset button to reset player’s scores and current game. */
  setupServerResetListener: () => {
    const listener = new GlobalKeyboardListener();
    try {
      listener.addListener((event) => {
        if (event.name === 'FORWARD SLASH' && !debounced) {
          debounced = true;
          setTimeout(() => {
            debounced = false;
          }, 30);

          console.info(`Game reset on ${new Date().toLocaleString()}`);
          MonitoringService.reinitializeServer();
          MonitoringService.reportConcurrentClients();
        }
      });
    } catch {
      console.error('Failed to setup server reset listener');
    }
  },
};
