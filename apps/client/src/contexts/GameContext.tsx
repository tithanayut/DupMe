import { Me, Room } from '@dupme/shared-types';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { MySwal } from '../common/alert';
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

  useEffect(() => {
    const onReset = async () => {
      await MySwal.fire({
        icon: 'warning',
        title: 'Oh no!',
        text: 'The server has been reset. Everything will begin from scratch.',
      });
      window.location.reload();
    };
    socket.on('reset', onReset);
    return () => {
      socket.off('reset', onReset);
    };
  }, []);

  useEffect(() => {
    const secretTextWon = () => {
      MySwal.fire({
        icon: 'warning',
        title: 'You have lost!',
        text: 'Unfortunately, the other player has used the secret key.',
      });
    };
    socket.on('wonBySecret', secretTextWon);
    return () => {
      socket.off('wonBySecret', secretTextWon);
    };
  }, []);

  return (
    <GameContext.Provider value={{ me, setMe, rooms, setRooms, myRoom, myPlayerIndex }}>
      {children}
    </GameContext.Provider>
  );
}
