import { useGame } from '../contexts/GameContext';

export function Result() {
  const { myRoom, myPlayerIndex } = useGame();

  const myScore = myRoom?.score[myPlayerIndex]!;
  const otherPlayerScore = myRoom?.score[myPlayerIndex === 1 ? 0 : 1]!;

  if (myScore > otherPlayerScore) {
    return (
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          fontSize: '25px',
          top: '20%',
        }}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '60px',
          }}
        >
          WIN
        </p>
        <p>
          With score {myScore} (you) vs score {otherPlayerScore}, you will be the first player next round
        </p>
      </div>
    );
  }
  if (myScore < otherPlayerScore) {
    return (
      <div
        style={{
          textAlign: 'center',
          position: 'absolute',
          fontSize: '25px',
          top: '20%',
        }}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '60px',
          }}
        >
          LOSE
        </p>
        <p>
          With score {myScore} (you) vs score {otherPlayerScore}, you will be the second player next round
        </p>
      </div>
    );
  }
  return (
    <div
      style={{
        textAlign: 'center',
        position: 'absolute',
        fontSize: '25px',
        top: '20%',
      }}
    >
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '60px',
        }}
      >
        You draw
      </p>
      <p>With score {myScore}, next round first start will be random</p>
    </div>
  );
}
