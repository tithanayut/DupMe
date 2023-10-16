import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

export function Elevator() {
  const { myRoom, myPlayerIndex } = useGame();

  const onClickReady = () => {
    socket.emit('ready');
  };

  const otherPlayerIndex = myPlayerIndex === 1 ? 0 : 1;

  return (
    <div>
      <p>Other player is {myRoom?.ready[otherPlayerIndex] ? 'Ready' : 'Not Ready'}</p>
      <p>Are you ready?</p>
      <button onClick={onClickReady}>Yes</button>
    </div>
  );
}
