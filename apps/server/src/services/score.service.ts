import { io } from '../server';
import { RoomService } from './room.service';

const leaderboard: Record<string, number> = {};

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

    const player = room.players[playerIndex];
    if (player) {
      if (leaderboard[player.name] === undefined) leaderboard[player.name] = 0;
      leaderboard[player.name] += room.score[playerIndex];
    }

    io.emit('rooms', RoomService.getRooms());
    io.emit(
      'leaderboard',
      Object.entries(leaderboard)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
    );
  },
};
