import { createServer } from 'node:http';

import cors from 'cors';
import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);

const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../dist')));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('startgame', (name, level) => {
    console.log(`${name} joined game with level ${level}`);

    io.emit('someonejoined', name);
  });
});

server.listen(3000, () => {
  console.log('🚀 DupMe is running at http://localhost:3000');
});
