import { createServer } from 'node:http';

import { instrument } from '@socket.io/admin-ui';
import cors from 'cors';
import express from 'express';
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

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('hello', (name, done) => {
    users[socket.id] = {
      name,
      profilePicutre: `https://avatars.dicebear.com/api/avataaars/${name}.svg`,
    };
    done(rooms);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    rooms = rooms.filter((room) => !room.users.some((user) => user.id === socket.id));
    io.emit('rooms', rooms);
  });

  socket.on('newRoom', (roomName, done) => {
    if (!rooms.includes(roomName)) {
      rooms.push({
        name: roomName,
        users: [{ id: socket.id, name: users[socket.id].name }],
      });
      io.emit('rooms', rooms);

      socket.join(roomName);
      done(true);
    } else {
      done(false);
    }
  });
});

server.listen(3000, () => {
  console.log('🚀 DupMe is running at http://localhost:3000');
});
