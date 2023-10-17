import { Player, Room, RoomLevel } from '@dupme/shared-types';

import { io } from '../server';
import { KeyStoreService } from './keystore.service';
import { PlayerService } from './player.service';
import { ScoreService } from './score.service';
import { TimerService } from './timer.service';

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
    const room = RoomService.getRoom(roomName);
    room.ready[0] = false;
    room.ready[1] = false;
    io.emit('rooms', rooms);
  },
};

export const GameService = {
  startGame: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    room.started = true;
    room.state = 'showing';
    room.round += 1;
    KeyStoreService.clearKeys(roomName);
    KeyStoreService.clearGuessedKeys(roomName);
    io.emit('rooms', rooms);

    TimerService.countDown(roomName, 10, () => {
      GameService.transitionStateToGuess(roomName);
    });
  },
  transitionStateToGuess(roomName: string) {
    let room: Room | null = null;
    try {
      room = RoomService.getRoom(roomName);
    } catch {
      console.log(`Room ${roomName} search failed, it may have been terminated`);
    }
    if (!room) return;

    room.state = 'guessing';
    room.turn = room.turn === 0 ? 1 : 0;
    TimerService.countDown(roomName, 20, () => {
      if (room && room.round >= 2) {
        GameService.endGame(roomName);
      } else {
        RoomService.clearReadyState(roomName);
      }
    });

    io.emit('rooms', rooms);
  },
  endGame: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    room.ended = true;
    PlayerService.addAccumulatedScore(room.players[0].socketId, room.score[0]);
    PlayerService.addAccumulatedScore(room.players[1]!.socketId, room.score[1]);
    io.emit('rooms', rooms);
  },
  replay: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    let nextRoundFirstPlayer: Player;
    let otherPlayer: Player;
    if (room.score[0] > room.score[1]) {
      nextRoundFirstPlayer = room.players[0];
      otherPlayer = room.players[1]!;
    } else if (room.score[1] > room.score[0]) {
      nextRoundFirstPlayer = room.players[1]!;
      otherPlayer = room.players[0]!;
    } else {
      nextRoundFirstPlayer = room.players[Math.random() < 0.5 ? 0 : 1]!;
      otherPlayer = room.players.find((player) => player?.socketId !== nextRoundFirstPlayer.socketId)!;
    }
    console.log(room.score);
    console.log(room.players);

    RoomService.terminateRoom(roomName);
    RoomService.createRoom(`${roomName} (2)`, room.level, nextRoundFirstPlayer.socketId, 0);
    RoomService.joinRoom(`${roomName} (2)`, otherPlayer.socketId);
  },
  receiveKey: (roomName: string, socketId: string, key: string) => {
    const room = RoomService.getRoom(roomName);
    if (room.state === 'guessing') {
      KeyStoreService.appendGuessedKey(roomName, key);
      if (KeyStoreService.verifyGuessedKey(roomName)) {
        ScoreService.increaseScore(roomName, socketId);
      } else {
        const scoreToDecrease = KeyStoreService.getGuessedKeys(roomName).length - 1;
        KeyStoreService.clearGuessedKeys(roomName);
        ScoreService.decreaseScore(roomName, socketId, scoreToDecrease);
      }
    } else {
      KeyStoreService.appendKey(roomName, key);
    }
  },
};
