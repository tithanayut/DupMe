import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

function Result() {
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

export function Exit() {
  const onPlayAgain = () => {
    socket.emit('playagain');
  };

  return (
    <div className="relative bg-cover bg-[url('/assets/bgExit6.png')] min-h-screen min-w-full">
      <div className="absolute scale-[65%]">
        <img src="/assets/winLoseBoard.png" />
      </div>
      <div className="z-30">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="mt-[9%] flex justify-center text-amber-900">
            <Result />
          </div>
          <button
            onClick={onPlayAgain}
            style={{
              width: '400px',
              height: '80px',
              borderRadius: '40px',
              // backgroundColor: 'sky',
              fontWeight: 'bold',
              fontSize: '40px',
              position: 'absolute',
              bottom: '40%',
              left: '50%',
              transform: 'translate(-50%, 0)',
            }}
            className="drop-shadow-md text-red-800 bg-cyan-200 hover:bg-cyan-950 hover:text-red-300"
          >
            PLAY AGAIN
          </button>
        </div>
        <div className="z-40 flex absolute justify-center bottom-0 m-auto left-0 right-0 shadow-2xl">
          <img src="/assets/hihi3.png" />
        </div>
      </div>
    </div>
  );
}
