import { io } from '../server';
import { RoomService } from './gameroom.service';

export const TimerService = {
  countDown: (roomName: string, duration: number, onTimeout: () => void) => {
    const room = RoomService.getRoom(roomName);
    room.time = duration;

    const rooms = RoomService.getRooms();
    io.emit('rooms', rooms);

    const interval = setInterval(() => {
      room.time--;
      const rooms = RoomService.getRooms();
      io.emit('rooms', rooms);
      if (room.time <= 0) {
        clearInterval(interval);
        onTimeout();
      }
    }, 1000);
  },
};
