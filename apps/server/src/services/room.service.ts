import { Room, RoomLevel } from '@dupme/shared-types';

import { io } from '../server';
import { GameService } from './game.service';
import { PlayerService } from './player.service';

let rooms: Room[] = [];

export const RoomService = {
  getRoom: (name: string) => {
    const room = rooms.find((room) => room.name === name);
    if (!room) {
      throw new Error(`Room ${name} not found`);
    }
    return room;
  },
  getRooms: () => {
    return rooms;
  },
  getPlayerRoom: (socketId: string) => {
    const room = rooms.find((room) => room.players.some((player) => player?.socketId === socketId));
    if (!room) {
      throw new Error(`Player ${socketId} not found`);
    }
    return room;
  },
  createRoom: (name: string, level: RoomLevel, socketId: string, turn: 0 | 1) => {
    if (rooms.some((room) => room.name === name)) throw new Error(`Room name is already taken`);
    const player = PlayerService.getPlayer(socketId);

    let keycount: number;
    if (level == RoomLevel.LV1) {
      keycount = 5;
    } else if (level == RoomLevel.LV2) {
      keycount = 6;
    } else if (level == RoomLevel.LV3) {
      keycount = 7;
    } else keycount = 5;

    rooms.push({
      name,
      level,
      players: [player, null],
      started: false,
      ended: false,

      ready: [false, false],
      keycount: keycount,
      turn,
      round: 0,
      state: 'showing',
      time: 0,
      score: [0, 0],
      keys: [],
      guessedKeys: [],
    });
    io.emit('rooms', rooms);
  },
  joinRoom: (roomName: string, socketId: string) => {
    const existingRoom = rooms.find((room) => room.players.some((player) => player?.socketId === socketId));
    if (existingRoom) {
      RoomService.terminateRoom(existingRoom.name);
    }

    const room = RoomService.getRoom(roomName);
    if (room.players[1]) {
      throw new Error(`Room ${roomName} is full`);
    }
    const player = PlayerService.getPlayer(socketId);
    room.players[1] = player;
    io.emit('rooms', rooms);
  },
  terminateRoom: (roomName: string) => {
    rooms = rooms.filter((room) => room.name !== roomName);
    io.emit('rooms', rooms);
  },
  playerReady: (roomName: string, socketId: string) => {
    const room = RoomService.getRoom(roomName);
    const playerIndex = room.players.findIndex((player) => player?.socketId === socketId);
    room.ready[playerIndex] = true;
    io.emit('rooms', rooms);
    if (room.ready.every((ready) => ready)) GameService.startGame(roomName);
  },
  resetRooms: () => {
    rooms = [];
  },
  clearReadyState: (roomName: string) => {
    try {
      const room = RoomService.getRoom(roomName);
      room.ready[0] = false;
      room.ready[1] = false;
      io.emit('rooms', rooms);
    } catch {
      console.log(`Room ${roomName} search failed, it may have been terminated`);
    }
  },
};
