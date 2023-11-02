export enum RoomLevel {
  LV1 = 'LV1',
  LV2 = 'LV2',
  LV3 = 'LV3',
}

export interface Me {
  name: string;
  profilePicture: string;
}

export interface Room {
  name: string;
  level: RoomLevel;
  players: [Player, Player | null];
  started: boolean;
  ended: boolean;

  ready: [boolean, boolean];
  keycount: number;
  turn: 0 | 1; // index of players
  round: number;
  state: 'showing' | 'guessing';
  time: number;
  score: [number, number]; // index of players
  keys: string[];
  guessedKeys: string[];
}

export interface Player {
  socketId: string;
  name: string;
  profilePicture: string;
  accumulatedScore: number;
}

export interface ChatMessage {
  socketId: string;
  name: String;
  message: string;
  profilePicture: string;
}
