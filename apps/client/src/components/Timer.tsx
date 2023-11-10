import { useGame } from '../contexts/GameContext';

export function Timer() {
  const { myRoom } = useGame();

  if (!myRoom?.time) return 'No time';
  return (
    <div className="text-black dark:text-white text-xxxl font-semibold self-center w-[175px]">
      Time left: {myRoom?.time}
    </div>
  );
}
