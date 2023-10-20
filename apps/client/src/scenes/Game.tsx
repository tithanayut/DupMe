import { useEffect } from 'react';

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

function genRandomKey(length: number) {
  const characters = 'ABCDEFG';
  let cha = characters.slice(0, length);
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * cha.length);
    result += characters[randomIndex];
  }
  return result;
}

function playPianoSound(note: string) {
  const audioElement = document.getElementById(`note${note}`);
  if (audioElement) {
    (audioElement as HTMLAudioElement).play();
  }
}

export function Game() {
  const { myRoom, myPlayerIndex, paused, setPaused } = useGame();

  useEffect(() => {
    MySwal.fire({
      icon: 'info',
      title: 'Welcome!',
      timer: 1200,
      showConfirmButton: false,
      allowOutsideClick: false,
    });
  }, []);

  useEffect(() => {
    const onWrong = () => {
      MySwal.fire({
        icon: 'error',
        title: 'Wrong!',
        timer: 600,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    };
    socket.on('wrong', onWrong);
  }, []);

  const onKeyClick = (key: string) => {
    playPianoSound(key);
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

      {myRoom?.turn == myPlayerIndex && myRoom.state == 'showing' && (
        <button
          onClick={() => {
            var random = genRandomKey(myRoom.keycount);

            // if (myRoom.level == RoomLevel.LV1) {
            //   var random = genRandomKey(5);
            // } else if (myRoom.level == RoomLevel.LV2) {
            //   var random = genRandomKey(6);
            // } else if (myRoom.level == RoomLevel.LV3) {
            //   var random = genRandomKey(7); //myRoom.keycount
            // } else var random = genRandomKey(5);

            for (const r of random) {
              onKeyClick(r);
            }
          }}
        >
          Random🎲
        </button>
      )}
      <button onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</button>

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
          Hint💡
        </button>
      )}

      <div className="flex gap-4">
        {Array.from({ length: myRoom?.keycount ?? 5 }, (_, i) => String.fromCharCode(65 + i)).map((key) => (
          <KeyButton
            key={key}
            code={key}
            onClick={() => onKeyClick(key)}
            disabled={paused || myRoom.turn !== myPlayerIndex}
          />
        ))}
      </div>
    </div>
  );
}
