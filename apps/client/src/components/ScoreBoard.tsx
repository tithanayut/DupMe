import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

export function ScoreBoard() {
  const { myRoom, myPlayerIndex } = useGame();

  const me = myRoom?.players[myPlayerIndex];
  const other = myRoom?.players[myPlayerIndex === 0 ? 1 : 0];

  return (
    <div className="flex justify-center  space-x-[40%]">
      <div className="ml-10">
        <p>
          <img src={me?.profilePicture} width={100} className="" />
          <p className="-ml-10">
            Player 1: {me?.name} (You) | Score: {myRoom?.score[myPlayerIndex]}
          </p>{' '}
          <p>
            <button
              className="mt-4 -ml-20 bg-amber-200 hover:bg-cyan-500 text-rose-500 text-2xl font-bold rounded-full py-2 px-4"
              onClick={() => {
                window.open(
                  import.meta.env.MODE === 'development'
                    ? `http://localhost:3000/payment?socketId=${socket.id}`
                    : `https://dupme.up.railway.app/payment?socketId=${socket.id}`,
                );
              }}
            >
              🤑 Buy 100,000 points
            </button>
          </p>
        </p>
      </div>

      <div>
        <img src={other?.profilePicture} width={100} className="mx-auto flex mr-10" />
        <p className="mx-auto flex justify-end mr-10">
          Player 2: {other?.name} | Score: {myRoom?.score[myPlayerIndex === 0 ? 1 : 0]}
        </p>
      </div>
    </div>
    // <div>
    //   <p>
    //     <img src={me?.profilePicture} width={100} className="" />
    //     Player 1: {me?.name} (You) | Score: {myRoom?.score[myPlayerIndex]} (
    //     <button
    //       onClick={() => {
    //         window.open(
    //           import.meta.env.MODE === 'development'
    //             ? `http://localhost:3000/payment?socketId=${socket.id}`
    //             : `https://dupme.up.railway.app/payment?socketId=${socket.id}`,
    //         );
    //       }}
    //     >
    //       Buy 100,000 points
    //     </button>
    //     )
    //   </p>

    //   <div>
    //     <img src={other?.profilePicture} width={100} className="mx-auto flex mr-10" />
    //     <p className="mx-auto flex justify-end mr-10">
    //       Player 2: {other?.name} | Score: {myRoom?.score[myPlayerIndex === 0 ? 1 : 0]}
    //     </p>
    //   </div>
    // </div>
  );
}
