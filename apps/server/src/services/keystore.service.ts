import { io } from '../server';
import { RoomService } from './gameroom.service';

export const KeyStoreService = {
  appendKey: (roomName: string, key: string) => {
    const room = RoomService.getRoom(roomName);
    room.keys.push(key);
    io.emit('rooms', RoomService.getRooms());
  },
  getGuessedKeys: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    return room.guessedKeys;
  },
  appendGuessedKey: (roomName: string, key: string) => {
    const room = RoomService.getRoom(roomName);
    room.guessedKeys.push(key);
    io.emit('rooms', RoomService.getRooms());
  },
  verifyGuessedKey: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    return room.keys.join('').startsWith(room.guessedKeys.join(''));
  },
  clearKeys: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    room.keys = [];
    io.emit('rooms', RoomService.getRooms());
  },
  clearGuessedKeys: (roomName: string) => {
    const room = RoomService.getRoom(roomName);
    room.guessedKeys = [];
    io.emit('rooms', RoomService.getRooms());
  },
};
