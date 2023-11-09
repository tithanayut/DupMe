import { socket } from '../common/socket';
import { Result } from '../components/Result';

export function Exit() {
  const onPlayAgain = () => {
    socket.emit('playagain');
  };

  return (
    <div className="relative bg-cover bg-[url('/assets/bgExit6.png')] min-h-screen min-w-full">
      <a href="/" className="flex items-center  font-bold ">
        <img
          src="/assets/backToGate.png"
          className="hover:scale-125 aspect-square object-cover object-center w-[40px] ml-4 mt-4 overflow-hidden max-w-full self-start"
        />
      </a>
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
        {/* <div className="z-40 flex absolute justify-center bottom-0 m-auto left-0 right-0 shadow-2xl">
          <img src="/assets/hihi3.png" />
        </div> */}
      </div>
    </div>
  );
}
