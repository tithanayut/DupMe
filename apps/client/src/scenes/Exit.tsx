import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

function Result() {
  const { myRoom, myPlayerIndex } = useGame();

  const myScore = myRoom?.score[myPlayerIndex]!;
  const otherPlayerScore = myRoom?.score[myPlayerIndex === 1 ? 0 : 1]!;

  if (myScore > otherPlayerScore) {
    return (
      <p>
        You win with {myScore} (you) vs {otherPlayerScore}, you will be the first player next round
      </p>
    );
  }
  if (myScore < otherPlayerScore) {
    return (
      <p>
        You lose with {myScore} (you) vs {otherPlayerScore}, you will be the second player next round
      </p>
    );
  }
  return <p>You draw with {myScore}, next round first start will be random</p>;
}

export function Exit() {
  const onPlayAgain = () => {
    socket.emit('playagain');
  };

  return (
    <div>
      <Result />
      <button onClick={onPlayAgain}>Play again</button>
    </div>
  );
}
