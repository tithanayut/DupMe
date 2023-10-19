import { useGame } from '../contexts/GameContext';

export function KeyStroke() {
  const { myRoom } = useGame();

  if (myRoom?.state === 'guessing')
    return (
      <div className="flex text-2xl gap-4">{myRoom?.guessedKeys.map((key, i) => <p key={`${i}${key}`}>{key}</p>)}</div>
    );
  return <div className="flex text-2xl gap-4">{myRoom?.keys.map((key, i) => <p key={`${i}${key}`}>{key}</p>)}</div>;
}
