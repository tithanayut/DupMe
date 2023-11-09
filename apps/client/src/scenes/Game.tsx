import { useEffect, useState } from 'react';

import { MySwal } from '../common/alert';
import { socket } from '../common/socket';
import { KeyButton } from '../components/KeyButton';
import { KeyStroke } from '../components/KeyStroke';
import { ScoreBoard } from '../components/ScoreBoard';
import { Timer } from '../components/Timer';
import { useGame } from '../contexts/GameContext';
import { Break } from './Break';
import { Exit } from './Exit';
//import { RoomLevel } from '@dupme/shared-types';

function GameState() {
  const { myRoom, myPlayerIndex } = useGame();

  const isTurn = myRoom?.turn === myPlayerIndex;

  if (isTurn) {
    return <p className="">It is your turn! {myRoom.state === 'guessing' && 'Guess Now'}</p>;
  }
  const otherPlayer = myRoom?.players[myPlayerIndex === 1 ? 0 : 1];
  return (
    <p className="">
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

function playPianoSound(note: string): void {
  const audioElement = document.getElementById(`note${note}`) as HTMLAudioElement;

  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.play();
  }
}

export function Game() {
  const { myRoom, myPlayerIndex } = useGame();
  const [hintCount, setHintCount] = useState<number>(0);
  const maxCount = 5;
  const [hintsLeft, setHintsLeft] = useState<number>(5);

  useEffect(() => {
    if (myRoom?.ended) return;
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

  useEffect(() => {
    setHintsLeft(5 - hintCount);
  }, [hintCount]);

  const onKeyClick = (key: string) => {
    playPianoSound(key);
    socket.emit('key', key);
  };

  if (myRoom?.ended) return <Exit />;
  if (!myRoom?.ready[0] || !myRoom?.ready[1]) return <Break />;
  // if (myRoom?.level === 'LV1')
  return (
    <div>
      <img src="/assets/lobblycurtain.png" className="-z-10 absolute w-screen top-0" />
      <img src="/assets/lobbyfloor2.png" className="-z-40 absolute w-screen bottom-0" />
      <img src="/assets/light.png" className="-z-30 absolute justify-center h-sceen bottom-0" />
      <img src="/assets/curtainL.png" className="-z-20 absolute h-screen left-0 top-0" />
      <img src="/assets/curtainR.png" className="-z-20 absolute h-screen right-0 top-0" />
      <div className="z-30">
        <div className="w-fit mx-auto flex justify-center bg-yellow-200 text-cyan-800 font-bold text-2xl py-2 px-6 rounded-full mt-5">
          <GameState />
        </div>

        <ScoreBoard />

        <div className=" w-fit mx-auto flex justify-center mt-1 text-2xl">
          <KeyStroke />
        </div>

        {/* flex gap-4 w-fit mx-auto justify-center mt-6 */}
        <div className="flex w-fit mx-auto relative justify-center mt-6">
          <div className="z-10">
            {Array.from({ length: myRoom?.keycount ?? 5 }, (_, i) => String.fromCharCode(65 + i)).map((key) => (
              <KeyButton
                key={key}
                code={key}
                onClick={() => onKeyClick(key)}
                disabled={myRoom.turn !== myPlayerIndex}
              />
            ))}
          </div>

          <div className="z-20 flex">
            {myRoom?.level === 'LV3' && (
              <button
                className="absolute bg-gray-900 disabled:bg-gray-400 px-6 py-16  rounded-md rounded-t-none"
                style={{ marginLeft: '-633px' }}
                disabled={myRoom.turn !== myPlayerIndex}
              ></button>
            )}

            {(myRoom?.level === 'LV2' || myRoom?.level === 'LV3') && (
              <button
                className="absolute bg-gray-900 disabled:bg-gray-400 px-6 py-16  rounded-md rounded-t-none"
                style={{ marginLeft: '-530px' }}
                disabled={myRoom.turn !== myPlayerIndex}
              ></button>
            )}

            <button
              className="absolute bg-gray-900 disabled:bg-gray-400 px-6 py-16  rounded-md rounded-t-none"
              style={{ marginLeft: '-428px' }}
              disabled={myRoom.turn !== myPlayerIndex}
            ></button>

            <button
              className="absolute bg-gray-900 disabled:bg-gray-400 px-6 py-16  rounded-md rounded-t-none"
              style={{ marginLeft: '-328px' }}
              disabled={myRoom.turn !== myPlayerIndex}
            ></button>
            <button
              className="absolute bg-gray-900 disabled:bg-gray-400 px-6 py-16  rounded-md rounded-t-none"
              style={{ marginLeft: '-227px' }}
              disabled={myRoom.turn !== myPlayerIndex}
            ></button>
            <button
              className="absolute bg-gray-900 disabled:bg-gray-400 px-6 py-16  rounded-md rounded-t-none"
              style={{ marginLeft: '-125px' }}
              disabled={myRoom.turn !== myPlayerIndex}
            ></button>
          </div>
        </div>

        <div className="w-fit mx-auto flex justify-center text-gray-700 font-bold text-3xl mt-5">
          <Timer />
        </div>
        {myRoom?.turn == myPlayerIndex && myRoom.state == 'showing' && (
          <button
            className=" mx-auto flex justify-center bg-cyan-500 hover:bg-cyan-700 text-white text-5xl font-bold rounded-full py-4 px-8 mt-10 mb-10"
            onClick={() => {
              var random = genRandomKey(myRoom.keycount);

              for (const r of random) {
                onKeyClick(r);
              }
            }}
          >
            Random🎲
          </button>
        )}

        {myRoom?.turn === myPlayerIndex && myRoom.state === 'guessing' && (
          // <div className="flex items-center">
          <button
            className="mx-auto flex items-center justify-center bg-pink-500 hover:bg-pink-700 text-white text-5xl font-bold rounded-full py-3 px-6 mt-10 mb-10"
            onClick={() => {
              if (hintCount < maxCount) {
                setHintCount(hintCount + 1);
                if (myRoom.keys.length !== myRoom.guessedKeys.length) {
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
              } else {
                MySwal.fire({
                  icon: 'error',
                  title: 'No more hints!',
                });
              }
            }}
          >
            💡Hint
            <span className="mr-1 ml-2 place-content-start bg-white text-black py-1 px-4 rounded-full">
              {hintsLeft}
            </span>
          </button>
          // </div>
        )}
      </div>
    </div>
  );
}
