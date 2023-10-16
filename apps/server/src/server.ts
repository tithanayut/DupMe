import { createServer } from 'node:http';

import { instrument } from '@socket.io/admin-ui';
import cors from 'cors';
import express from 'express';
import path from 'path';
import myip from 'quick-local-ip';
import { Server } from 'socket.io';

import { GameService, RoomService } from './services/gameroom.service';
import { MonitoringService } from './services/monitoring.service';
import { PlayerService } from './services/player.service';

const app = express();
const server = createServer(app);

export const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.resolve(__dirname, './dist')));
app.use('/admin', express.static(path.resolve(__dirname, './node_modules/@socket.io/admin-ui/ui/dist')));

MonitoringService.setupServerResetListener();

instrument(io, { auth: false });

io.on('connection', (socket) => {
  MonitoringService.reportConcurrentClients();

  socket.on('hello', (done) => {
    done(
      io.engine.clientsCount,
      PlayerService.getPlayerCount(),
      PlayerService.getPlayers()
        .map((player) => player.name)
        .join(', '),
    );
  });

  socket.on('register', (name, profilePicutre, done) => {
    try {
      PlayerService.registerPlayer(socket.id, name, profilePicutre);
      MonitoringService.reportConcurrentClients();
      done(true, 'Player registered');
    } catch (err) {
      done(false, err instanceof Error ? err.message : 'Something went wrong');
    }
  });

  socket.on('disconnect', () => {
    try {
      const room = RoomService.getRooms().find((room) => room.players.some((player) => player?.socketId === socket.id));
      if (room) RoomService.terminateRoom(room.name);
      PlayerService.unregisterPlayer(socket.id);
    } catch (err) {
      console.error(err);
    }
    io.emit('rooms', RoomService.getRooms());
    MonitoringService.reportConcurrentClients();
  });

  socket.on('createRoom', (name, level, done) => {
    try {
      RoomService.createRoom(name, level, socket.id, Math.random() < 0.5 ? 0 : 1);
      done(true, 'Room created');
    } catch (err) {
      done(false, err instanceof Error ? err.message : 'Something went wrong');
    }
  });

  socket.on('joinRoom', (roomName, done) => {
    try {
      RoomService.joinRoom(roomName, socket.id);
      done(true, 'Room joined');
    } catch (err) {
      done(false, err instanceof Error ? err.message : 'Something went wrong');
    }
  });

  socket.on('ready', () => {
    RoomService.playerReady(RoomService.getPlayerRoom(socket.id).name, socket.id);
  });

  socket.on('key', (key) => {
    GameService.receiveKey(RoomService.getPlayerRoom(socket.id).name, socket.id, key);
  });

  socket.on('playagain', () => {
    GameService.replay(RoomService.getPlayerRoom(socket.id).name);
  });
});

/* One of computer has server program and also game client. */
/* Another computer has only game client that will directly connect to server. */
/* Server’s IP and port will be set in your program’s source code. */
server.listen(3000, () => {
  console.log('🚀 DupMe is listening on port 3000 (Server: http://localhost:3000)');
  console.log('Possible server IP:', myip.getLocalIP4());
  console.log('Press / to reset');
});
