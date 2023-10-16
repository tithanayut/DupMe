import { useGame } from '../contexts/GameContext';

export function ScoreBoard() {
  const { myRoom, myPlayerIndex } = useGame();

  const me = myRoom?.players[myPlayerIndex];
  const other = myRoom?.players[myPlayerIndex === 0 ? 1 : 0];

  return (
    <div>
      <p>
        <img src={me?.profilePicture} width={100} />
        Player 1: {me?.name} (You) | {myRoom?.score[myPlayerIndex]}
      </p>
      <p>
        <img src={other?.profilePicture} width={100} />
        Player 2: {other?.name} | {myRoom?.score[myPlayerIndex === 0 ? 1 : 0]}
      </p>
    </div>
  );
}
