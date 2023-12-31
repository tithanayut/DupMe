import { useState } from 'react';

import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

//import piano from "./../assets/piano.png";

export function Elevator() {
  const { myRoom, myPlayerIndex } = useGame();
  const [times, setTimes] = useState(0);
  //const [buttonLabel, setButtonLabel] = useState('Ready');
  //const [buttonColor, setButtonColor] = useState('red');

  const onClickReady = () => {
    socket.emit('ready');
    //setButtonLabel('Yes');
    //setButtonColor('grey');
  };
  // const myStyle = {
  //   backgroundImage:
  //     "url('https://www.google.com/url?sa=i&url=https%3A%2F%2Foutrightgames.com%2Fus%2Fgames%2Fmy-friend-peppa-pig%2F&psig=AOvVaw1sC4VxjIbNacmhsFJ2c_N1&ust=1697812579140000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIDmvO-qgoIDFQAAAAAdAAAAABAE')",
  // };

  const onPicClick = () => {
    setTimes(times + 1);
    if (times + 1 == 10) socket.emit('secretWon');
  };

  const otherPlayerIndex = myPlayerIndex === 1 ? 0 : 1;
  //style={{ backgroundImage:`url(${image})` }}
  return (
    // <div style={{ backgroundImage: 'url(/break.png)' }}>
    <div className="bg-rose-200 w-screen h-screen flex justify-center">
      {/* <img src="/assets/piano.png" /> */}
      <img src="/assets/lobblycurtain.png" className="z-30 absolute w-screen top-0" />
      <img src="/assets/curtainL.png" className="z-20 absolute h-screen left-0 top-0 bottom-0" />
      <img src="/assets/curtainR.png" className="z-20 absolute h-screen right-0 top-0 bottom-0" />

      <div className="z-10 mt-32 ">
        <div className="">
          {myRoom?.level === 'LV1' && (
            <p className="w-fit mx-auto">
              <span className="shadow-md flex justify-center bg-blue-300 text-white font-bold py-2 px-6 rounded-full text-2xl">
                <span className=" mr-2 place-content-start bg-white text-black font-bold py-1 px-6 rounded-full ">
                  {myRoom?.level}
                </span>{' '}
                : <span className="ml-2">{myRoom?.name}</span>
              </span>
            </p>
          )}

          {myRoom?.level === 'LV2' && (
            <p className="w-fit mx-auto ">
              <span className="shadow-md flex justify-center bg-blue-400 text-white font-bold py-2 px-6 rounded-full text-2xl">
                <span className=" mr-2 place-content-start bg-white text-black font-bold py-1 px-6 rounded-full ">
                  {myRoom?.level}
                </span>{' '}
                : <span className="ml-2">{myRoom?.name}</span>
              </span>
            </p>
          )}

          {myRoom?.level === 'LV3' && (
            <p className="w-fit mx-auto ">
              <span className="shadow-md flex justify-center bg-blue-500 text-white font-bold py-2 px-6 rounded-full text-2xl">
                <span className=" mr-2 place-content-start bg-white text-black font-bold py-1 px-6 rounded-full ">
                  {myRoom?.level}
                </span>{' '}
                : <span className="ml-2">{myRoom?.name}</span>
              </span>
            </p>
          )}
        </div>

        <p className="text-center mx-auto flex justify-center text-6xl mt-10">
          Other player is {myRoom?.ready[otherPlayerIndex] ? 'Ready' : 'Not Ready'}
        </p>

        <img
          src="/assets/hihi5.png"
          onClick={() => onPicClick()}
          className=" flex left-[20%] bottom-0 absolute w-[30%] h-2/5"
        />

        <p className="max-w-2xl mx-auto flex justify-center text-2xl mt-10 ">Are you ready?</p>
        <div className="shadow-md max-w-[40%] mx-auto flex justify-center bg-red-500 hover:bg-red-700 text-white text-5xl font-bold rounded-full py-4 px-8 mt-10">
          <button onClick={onClickReady}>Ready</button>
        </div>
      </div>
    </div>
  );
}
