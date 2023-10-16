import { useGame } from '../contexts/GameContext';

export function Timer() {
  const { myRoom } = useGame();

  if (!myRoom?.time) return 'No time';
  return <div>Time left: {myRoom?.time}</div>;
}
