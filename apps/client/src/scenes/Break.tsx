import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';
// import image from './public/break.png';

export function Break() {
  const { myRoom } = useGame();

  const onClickReady = () => {
    socket.emit('ready');
  };

  const otherPlayerIndex = myRoom?.players.findIndex((player) => player?.socketId !== socket.id) ?? 0;

  return (
    // <div style={{ backgroundImage: `url(${image})` }}>
    <div className="mt-60 ">
      <p className="mx-auto flex justify-center text-3xl ">Are you ready for the next round?</p>
      <p className="mx-auto flex justify-center text-6xl mt-5">
        Other player is {myRoom?.ready[otherPlayerIndex] ? 'Ready' : 'Not Ready'}
      </p>
      <div className="max-w-[15%] mx-auto flex justify-center bg-green-400 hover:bg-green-600 text-white text-6xl font-bold rounded-full py-4 px-8 mt-10">
        <button onClick={onClickReady}>Yes</button>
      </div>
    </div>
    // </div>
  );
}
