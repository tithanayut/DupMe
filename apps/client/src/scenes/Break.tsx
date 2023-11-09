import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

export function Break() {
  const { myRoom } = useGame();

  const onClickReady = () => {
    socket.emit('ready');
  };

  const otherPlayerIndex = myRoom?.players.findIndex((player) => player?.socketId !== socket.id) ?? 0;

  return (
    <div className="bg-lime-100 w-screen h-screen flex justify-center">
      {/* <img src="/assets/piano.png" /> */}
      <img src="/assets/lobblycurtain.png" className="z-30 absolute w-screen top-0" />
      <img src="/assets/curtainL.png" className="z-20 absolute h-screen left-0 top-0 bottom-0" />
      <img src="/assets/curtainR.png" className="z-20 absolute h-screen right-0 top-0 bottom-0" />

      <div className="mt-52 ">
        <p className="mx-auto flex justify-center text-3xl ">Are you ready for the next round?</p>
        <p className="mx-auto flex justify-center text-6xl mt-5">
          Other player is {myRoom?.ready[otherPlayerIndex] ? 'Ready' : 'Not Ready'}
        </p>

        <div className="shadow-md max-w-[35%] mx-auto  flex justify-center bg-green-400 hover:bg-green-600 text-white text-6xl font-bold rounded-full py-4 px-8 mt-10">
          <button onClick={onClickReady}>Yes</button>
        </div>
        <img src="/assets/hihi7.png" className="absolute right-[20%] bottom-0 w-[30%] h-1/2" />
      </div>
    </div>
  );
}
