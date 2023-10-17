import { MySwal } from '../common/alert';
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

function genRandomKey() {
  const characters = 'ABCDE';
  let result = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

export function Game() {
  const { myRoom, myPlayerIndex } = useGame();

  const onKeyClick = (key: string) => {
    socket.emit('key', key);
  };
  console.log(myRoom);
  if (myRoom?.ended) return <Exit />;
  if (!myRoom?.ready[0] || !myRoom?.ready[1]) return <Break />;
  return (
    <div>
      <GameState />
      <ScoreBoard />
      <Timer />
      <KeyStroke />

      {myRoom?.turn === myPlayerIndex && myRoom.state === 'guessing' && (
        <button
          onClick={() => {
            if (myRoom.keys.length != myRoom.guessedKeys.length) {
              MySwal.fire({
                icon: 'question',
                title: myRoom.keys[myRoom.guessedKeys.length],
              });
            } else {
              MySwal.fire({
                icon: 'error',
                title: `All answer has been guessed`,
              });
            }
          }}
        >
          Hint
        </button>
      )}

      <button
        onClick={() => {
          var random = genRandomKey();
          for (const r of random) {
            onKeyClick(r);
          }
        }}
      >
        random
      </button>

      {Array.from({ length: myRoom?.keycount ?? 5 }, (_, i) => String.fromCharCode(65 + i)).map((key) => (
        <KeyButton key={key} code={key} onClick={() => onKeyClick(key)} disabled={myRoom.turn !== myPlayerIndex} />
      ))}
    </div>
  );
}
