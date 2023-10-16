import { socket } from '../common/socket';
import { KeyButton } from '../components/KeyButton';
import { KeyStroke } from '../components/KeyStroke';
import { ScoreBoard } from '../components/ScoreBoard';
import { Timer } from '../components/Timer';
import { useGame } from '../contexts/GameContext';
import { Break } from './Break';
import { Exit } from './Exit';

function GameState() {
  const { myRoom, myPlayerIndex } = useGame();

  const isTurn = myRoom?.turn === myPlayerIndex;

  if (isTurn) {
    return <p>It is your turn! {myRoom.state === 'guessing' && 'Guess Now'}</p>;
  }
  const otherPlayer = myRoom?.players[myPlayerIndex === 1 ? 0 : 1];
  return (
    <p>
      {otherPlayer?.name} is {myRoom?.state === 'guessing' ? 'guessing...' : 'showing you the pattern'}
    </p>
  );
}

export function Game() {
  const { myRoom, myPlayerIndex } = useGame();

  const onKeyClick = (key: string) => {
    socket.emit('key', key);
  };

  if (myRoom?.ended) return <Exit />;
  if (!myRoom?.ready[0] || !myRoom?.ready[1]) return <Break />;
  return (
    <div>
      <GameState />
      <ScoreBoard />
      <Timer />
      <KeyStroke />
      {Array.from({ length: myRoom?.keycount ?? 5 }, (_, i) => String.fromCharCode(65 + i)).map((key) => (
        <KeyButton key={key} code={key} onClick={() => onKeyClick(key)} disabled={myRoom.turn !== myPlayerIndex} />
      ))}
    </div>
  );
}
