import { Me, Room } from '@dupme/shared-types';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { socket } from '../common/socket';

interface GameContextType {
  me: Me | null;
  setMe: (me: Me) => void;
  rooms: Room[];
  myRoom: Room | null;
  myPlayerIndex: number;
  setRooms: (rooms: Room[]) => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export const useGame = () => useContext(GameContext);

export function GameContextProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [me, setMe] = useState<Me | null>(null);

  const { myRoom, myPlayerIndex } = useMemo(() => {
    const myRoom =
      rooms.find((room) => room.players[0].socketId === socket.id || room.players[1]?.socketId === socket.id) ?? null;
    const myPlayerIndex = myRoom?.players.findIndex((player) => player?.socketId === socket.id) ?? -1;
    return { myRoom, myPlayerIndex: myPlayerIndex >= 0 ? myPlayerIndex : -1 };
  }, [rooms]);

  useEffect(() => {
    const updateRoom = (rooms: Room[]) => {
      setRooms(rooms);
    };
    socket.on('rooms', updateRoom);
    return () => {
      socket.off('rooms', updateRoom);
    };
  }, []);

  useEffect(() => {
    socket.emit('info', (rooms: Room[]) => {
      setRooms(rooms);
    });
  }, []);

  return (
    <GameContext.Provider value={{ me, setMe, rooms, setRooms, myRoom, myPlayerIndex }}>
      {children}
    </GameContext.Provider>
  );
}
