import { createServer } from 'node:http';

import { instrument } from '@socket.io/admin-ui';
import cors from 'cors';
import express from 'express';
import { GlobalKeyboardListener } from 'node-global-key-listener';
import os from 'os';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../dist')));
app.use(
  '/admin',
  express.static(
    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../node_modules/@socket.io/admin-ui/ui/dist'),
  ),
);

instrument(io, { auth: false });

let users = {};
let rooms = [];

/* Server program shows the number of concurrent clients that are online */
let onHold = false;
function reportConcurrentClients() {
  if (onHold) return;
  console.log(
    `There are ${io.engine.clientsCount} clients connected, ${
      Object.keys(users).length
    } has entered their name: ${JSON.stringify(users, null, 2)}`,
  );
}

/* Server has a reset button to reset player’s scores and current game. */
try {
  const v = new GlobalKeyboardListener();
  // eslint-disable-next-line no-inner-declarations
  function onReset(e) {
    if (e.name === 'FORWARD SLASH') {
      v.removeListener(onReset);
      onHold = true;
      io.emit('reset');
      users = {};
      rooms = [];
      console.log('Game is resetting...');
      setTimeout(() => {
        v.addListener(onReset);
        onHold = false;
        console.log('Game reset complete!');
        reportConcurrentClients();
      }, 1500);
    }
  }
  v.addListener(onReset);
} catch {
  console.log('OS not supported');
}

/* Creating an easter egg by listening */
/* try {
  const g = new GlobalKeyboardListener();
  function inSetWith(e) {
    if (e)
  }
} */

io.on('connection', (socket) => {
  reportConcurrentClients();
  socket.emit('rooms', rooms);

  socket.on('getOtherClient', (done) => {
    done(io.engine.clientsCount, Object.keys(users).length, rooms.length);
  });

  socket.on('hello', (name, done) => {
    if (!Object.values(users).some((user) => user.name === name)) {
      users[socket.id] = {
        name,
        profilePicutre: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
      };
      done(true, rooms);
      reportConcurrentClients();
    } else {
      done(false);
      return;
    }
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    const disconnectedRoom = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    if (disconnectedRoom) {
      io.to(disconnectedRoom.name).emit('otherPlayerDisconnected');
    }
    rooms = rooms.filter((room) => !room.users.some((user) => user.id === socket.id));
    io.emit('rooms', rooms);
    reportConcurrentClients();
  });

  socket.on('newRoom', (roomName, roomLevel, done) => {
    //check if recieved level for the room
    console.log(`Level for this room: ${roomLevel}`);
    if (!rooms.some((room) => room.name === roomName)) {
      rooms.push({
        name: roomName,
        level: roomLevel,
        users: [{ id: socket.id, name: users[socket.id].name, level: users[socket.id].level }],
      });
      io.emit('rooms', rooms);
      socket.join(roomName);

      done(true);
    } else {
      done(false);
    }
  });

  socket.on('joinRoom', (roomName, done) => {
    const room = rooms.find((room) => room.name === roomName);
    if (room.users.length < 2) {
      room.users.push({ id: socket.id, name: users[socket.id].name });
      io.emit('rooms', rooms);
      socket.join(roomName);

      /* Server randomizes first player that will start the game. */
      const turn = Math.floor(Math.random() * 2);
      io.to(roomName).emit('startGame', room.users, room.users[turn]);

      done(true);
    } else {
      done(false);
    }
  });

  socket.on('startTurnNew', () => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    const me = room.users.find((user) => user.id === socket.id);
    io.to(room.name).emit('startAgainTUrn');
  });

  socket.on('startTurn', () => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    if (room.turnCount) {
      room.turnCount += 1;
    } else {
      room.turnCount = 1;
    }
    io.to(room.name).emit('startTimer', 10);
    setTimeout(() => {
      io.to(room.name).emit('startGuess');
      io.to(room.name).emit('startTimer', 20);
    }, 10000);
  });

  socket.on('addMyScore', (add) => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    io.to(room.name).emit('score', socket.id, add);
  });
  socket.on('minusMyScore', (minus) => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    io.to(room.name).emit('score', socket.id, -minus);
  });

  socket.on('clearLog', () => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    io.to(room.name).emit('clearLog');
  });

  socket.on('key', (key) => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    io.to(room.name).emit('key', key);
  });

  socket.on('guessAllCorrect', () => {
    const room = rooms.find((room) => room.users.some((user) => user.id === socket.id));
    io.to(room.name).emit('guessAllCorrect', socket.id);
  });
});

/* One of computer has server program and also game client. */
/* Another computer has only game client that will directly connect to server. */
/* Server’s IP and port will be set in your program’s source code. */
server.listen(3000, () => {
  console.log('🚀 DupMe is listening on port 3000 (Server: http://localhost:3000)');
  console.log(
    'Possible server IP:',
    Object.values(os.networkInterfaces())
      .flat()
      .find((i) => i.family === 'IPv4' && !i.internal).address,
  );
  console.log('Press / to reset');
});
