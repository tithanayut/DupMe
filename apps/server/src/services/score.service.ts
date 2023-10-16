import { io } from '../server';
import { RoomService } from './gameroom.service';

export const ScoreService = {
  increaseScore: (roomName: string, playerSocketId: string, score = 1) => {
    ScoreService.adjustScore(roomName, playerSocketId, score);
  },
  decreaseScore: (roomName: string, playerSocketId: string, score = 1) => {
    ScoreService.adjustScore(roomName, playerSocketId, -score);
  },
  adjustScore: (roomName: string, playerSocketId: string, score = 1) => {
    const room = RoomService.getRoom(roomName);
    const playerIndex = room.players.findIndex((player) => player?.socketId === playerSocketId);
    room.score[playerIndex] += score;
    io.emit('rooms', RoomService.getRooms());
  },
};
