import { Player } from '@dupme/shared-types';

let players: Player[] = [];

export const PlayerService = {
  getPlayer: (socketId: string) => {
    const player = players.find((player) => player.socketId === socketId);
    if (!player) {
      throw new Error(`Player ${socketId} not found`);
    }
    return player;
  },
  getPlayerCount: () => {
    return players.length;
  },
  getPlayers: () => {
    return players;
  },
  registerPlayer: (socketId: string, name: string, profilePicture: string) => {
    if (players.some((player) => player.name === name)) throw new Error(`This name is already taken`);
    players.push({
      socketId,
      name,
      profilePicture,
      accumulatedScore: 0,
    });
  },
  unregisterPlayer: (socketId: string) => {
    players = players.filter((player) => player.socketId !== socketId);
  },
  resetPlayers: () => {
    players = [];
  },
  addAccumulatedScore: (playerSocketId: string, score: number) => {
    const player = PlayerService.getPlayer(playerSocketId);
    player.accumulatedScore += score;
  },
};
