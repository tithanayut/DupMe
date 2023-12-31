import { GlobalKeyboardListener } from 'node-global-key-listener';

import { io } from '../server';
import { PlayerService } from './player.service';
import { RoomService } from './room.service';

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
    io.emit('concurrent', io.engine.clientsCount, PlayerService.getPlayerCount(), PlayerService.getPlayers());
  },
  reinitializeServer: () => {
    console.info(`Game reset on ${new Date().toLocaleString()}`);

    PlayerService.resetPlayers();
    RoomService.resetRooms();

    io.emit('reset');
  },
  /* Server has a reset button to reset player’s scores and current game. */
  setupServerResetListener: () => {
    try {
      const listener = new GlobalKeyboardListener();
      listener.addListener((event) => {
        if (event.name === 'FORWARD SLASH' && !debounced) {
          debounced = true;
          setTimeout(() => {
            debounced = false;
          }, 30);

          MonitoringService.reinitializeServer();
          MonitoringService.reportConcurrentClients();
        }
      });
    } catch {
      console.error('Failed to setup server reset listener');
    }
  },
};
