import { useGame } from '../contexts/GameContext';

export function Result() {
  const { myRoom, myPlayerIndex } = useGame();

  const myScore = myRoom?.score[myPlayerIndex]!;
  const otherPlayerScore = myRoom?.score[myPlayerIndex === 1 ? 0 : 1]!;

  if (myScore > otherPlayerScore) {
    return (
      <div>
        <div
          style={{
            textAlign: 'center',
            position: 'relative',
            fontSize: '25px',
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
        <div className="z-40 flex absolute justify-center bottom-0 m-auto left-0 right-0 shadow-2xl">
          <img src="/assets/hihi3.png" />
        </div>
      </div>
    );
  }
  if (myScore < otherPlayerScore) {
    return (
      <div>
        <div
          style={{
            textAlign: 'center',
            position: 'relative',
            fontSize: '25px',
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
        <div className="z-40 flex absolute justify-center bottom-0 m-auto left-0 right-0 shadow-2xl">
          <img src="/assets/hihi4.png" />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div
        style={{
          textAlign: 'center',
          position: 'relative',
          fontSize: '25px',
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
      <div className="z-40 flex absolute justify-center bottom-0 m-auto left-0 right-0 shadow-2xl">
        <img src="/assets/hihi3.png" />
      </div>
    </div>
  );
}
