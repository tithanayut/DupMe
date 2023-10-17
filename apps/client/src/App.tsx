import { useEffect, useRef } from 'react';

import { MySwal } from './common/alert';
import { socket } from './common/socket';
import { useGame } from './contexts/GameContext';
import { Elevator } from './scenes/Elevator';
import { Game } from './scenes/Game';
import { Gate } from './scenes/Gate';
import { Lobby } from './scenes/Lobby';

export function App() {
  const { myRoom, me } = useGame();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    socket.emit('hello', (clientCount: number, registeredUserCount: number, users: string) => {
      MySwal.fire({
        icon: 'info',
        title: 'Hello!',
        text: `There are ${clientCount} clients connected, ${registeredUserCount} have registered: ${users}`,
      });
    });
  }, []);

  if (!me) return <Gate />;
  if (!myRoom || myRoom.players[1] === null) return <Lobby />;
  if (!myRoom.started) return <Elevator />;
  return <Game />;
}
