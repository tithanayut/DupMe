import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

export function Break() {
  const { myRoom } = useGame();

  const onClickReady = () => {
    socket.emit('ready');
  };

  const otherPlayerIndex = myRoom?.players.findIndex((player) => player?.socketId !== socket.id) ?? 0;

  return (
    <div>
      <p>Are you ready for the next round?</p>
      <p>Other player is {myRoom?.ready[otherPlayerIndex] ? 'Ready' : 'Not Ready'}</p>
      <button onClick={onClickReady}>Yes</button>
    </div>
  );
}
