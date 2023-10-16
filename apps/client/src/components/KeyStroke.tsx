import { useGame } from '../contexts/GameContext';

export function KeyStroke() {
  const { myRoom } = useGame();

  if (myRoom?.state === 'guessing')
    return <div>{myRoom?.guessedKeys.map((key, i) => <p key={`${i}${key}`}>{key}</p>)}</div>;
  return <div>{myRoom?.keys.map((key, i) => <p key={`${i}${key}`}>{key}</p>)}</div>;
}
