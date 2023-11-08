import { Player, Room } from '@dupme/shared-types';

import { io } from '../server';
import { KeyStoreService } from './keystore.service';
import { PlayerService } from './player.service';
import { RoomService } from './room.service';
import { ScoreService } from './score.service';
import { TimerService } from './timer.service';

export const GameService = {
  startGame: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    room.started = true;
    room.state = 'showing';
    room.round += 1;
    KeyStoreService.clearKeys(roomName);
    KeyStoreService.clearGuessedKeys(roomName);
    io.emit('rooms', RoomService.getRooms());

    setTimeout(
      () => {
        TimerService.countDown(roomName, 10, () => {
          GameService.transitionStateToGuess(roomName);
        });
      },
      room.round === 1 ? 1200 : 0,
    );
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

    io.emit('rooms', RoomService.getRooms());
  },
  endGame: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    room.ended = true;
    PlayerService.addAccumulatedScore(room.players[0].socketId, room.score[0]);
    PlayerService.addAccumulatedScore(room.players[1]!.socketId, room.score[1]);
    io.emit('rooms', RoomService.getRooms());
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
        io.to(socketId).emit('wrong');
      }
      io.emit('rooms', RoomService.getRooms());
    } else {
      KeyStoreService.appendKey(roomName, key);
    }
  },
};
