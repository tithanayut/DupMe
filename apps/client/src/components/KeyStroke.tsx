import { useEffect, useRef } from 'react';

import { useGame } from '../contexts/GameContext';

export function KeyStroke() {
  const { myRoom } = useGame();
  const lastKey = useRef<string[]>();

  useEffect(() => {
    if (myRoom?.state === 'guessing') {
      lastKey.current = myRoom?.keys;
    } else {
      lastKey.current = myRoom?.guessedKeys;
    }
  }, [myRoom?.keys]);

  if (myRoom?.state === 'guessing')
    return (
      <div className="flex text-2xl gap-4">{myRoom?.guessedKeys.map((key, i) => <p key={`${i}${key}`}>{key}</p>)}</div>
    );
  return <div className="flex text-2xl gap-4">{myRoom?.keys.map((key, i) => <p key={`${i}${key}`}>{key}</p>)}</div>;
}
