import { FormEvent, useRef } from 'react';

import { MySwal } from '../common/alert';
import { socket } from '../common/socket';
import { Chatbox } from '../components/Chatbox';
import { Leaderboard } from '../components/Leaderboard';
import { useGame } from '../contexts/GameContext';

export function Lobby() {
  const { me, rooms, myRoom } = useGame();
  const nameRef = useRef<HTMLInputElement>(null);
  const levelRef = useRef<HTMLSelectElement>(null);

  const onCreateRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameRef.current || nameRef.current.value === '') {
      MySwal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Room name cannot be blank!',
      });
      return;
    }

    const name = nameRef.current.value;
    const level = levelRef.current?.value;
    socket.emit('createRoom', name, level, (success: boolean, error: string) => {
      if (!success) {
        MySwal.fire({
          icon: 'error',
          title: `Whoops! ${error}`,
        });
      }
    });
  };

  const onJoinRoom = (roomName: string) => {
    socket.emit('joinRoom', roomName, (success: boolean, error: string) => {
      if (!success) {
        MySwal.fire({
          icon: 'error',
          title: `Whoops! ${error}`,
        });
      }
    });
  };

  return (
    <div className="bg-sky-200 flex flex-col min-h-screen">
      <img src="/assets/lobblycurtain.png" className="z-10 fixed w-screen top-0" />
      <img src="/assets/lobbyfloor2.png" className="z-10 fixed w-screen bottom-0" />

      <div className="z-20 self-center w-full max-w-[1351px] mt-3.5 max-md:max-w-full">
        <div className="gap-5 flex flex-col md:flex-row mr-14 ml-14 md:m-0">
          <div className="flex flex-col items-stretch w-full max-md:ml-0">
            <div className="flex flex-col max-md:max-w-full max-md:mt-10 grow">
              <a href="/" className="flex items-center gap-3 font-bold mx-[-40px]">
                <img
                  src="/assets/home1.png"
                  className="hover:scale-125 aspect-square object-cover object-center w-[40px] ml-4 overflow-hidden max-w-full self-start"
                />
                <p className="bg-green-200 text-amber-950 shadow-xl font-bold py-1 px-4 rounded-full text-xl">
                  Welcome {me?.name}!
                </p>
              </a>
              <div className="mt-6 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)_inset] bg-white min-h-[300px] flex grow flex-col pt-9 rounded-[30px] self-end w-full md:w-4/5 justify-start items-center">
                <div className="self-center flex  max-w-full flex-col w-full justify-between items-center grow">
                  <div className="flex flex-col w-full justify-center items-center gap-4 px-8">
                    <div className="text-black text-2xl font-semibold self-center whitespace-nowrap mb-4">
                      GAME ROOM
                    </div>
                    {rooms.map((room) => (
                      <button
                        key={room.name}
                        onClick={() => onJoinRoom(room.name)}
                        disabled={room.players[0].name === me?.name || room.players[1]?.name === me?.name}
                        className="shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] bg-gray-200 flex items-center gap-4 px-4 py-2 w-full justify-between"
                      >
                        <div className="text-white text-xl font-semibold bg-pink-300 w-10 h-10 max-w-full flex justify-center items-center rounded-md self-start whitespace-nowrap">
                          {room.level}
                        </div>
                        <div className="text-neutral-700 text-xl font-semibold my-auto"> {room.name} </div>
                        <div
                          className={
                            'text-white text-xl h-10 font-semibold self-stretch  px-3 flex justify-center items-center  rounded-md whitespace-nowrap ' +
                            (room.players[1] === null ? 'bg-[#74DE43]' : 'bg-[#B1010C]')
                          }
                        >
                          {room.players[1] === null ? 'waiting' : 'playing'}
                        </div>
                      </button>
                    ))}
                  </div>
                  {myRoom === null && (
                    <form
                      className="relative bg-neutral-200 p-4 rounded-b-[30px] self-stretch flex w-full items-start justify-between gap-2"
                      onSubmit={onCreateRoom}
                    >
                      <div className="relative">
                        <select
                          ref={levelRef}
                          className="text-xl relative rounded-full text-white appearance-none font-bold py-2.5 pr-10 px-6 bg-[#005853]"
                        >
                          <option value="LV1">LV1</option>
                          <option value="LV2">LV2</option>
                          <option value="LV3">LV3</option>
                        </select>
                        <svg
                          className="absolute right-4 top-4"
                          width="12"
                          height="18"
                          viewBox="0 0 20 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.31499 17.2717L0.459872 0.268821H4.87216L10.055 12.3498L9.81889 12.2131H10.3906L10.1545 12.3498L15.3374 0.268821L19.7496 0.268821L11.8945 17.2717H8.31499Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <input
                        className="text-neutral-500 text-xl font-semibold self-stretch w-full max-w-full shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] bg-white grow basis-auto pt-2 pb-2 px-5 rounded-[50px] max-md:max-w-full max-md:pl-1"
                        placeholder="Room Name"
                        ref={nameRef}
                      />
                      <button>
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="48" height="48" rx="5" fill="#005853" />
                          <path
                            d="M25.3748 15.6775V38.5H21.6248V15.6775L11.5673 25.735L8.91602 23.0837L23.4998 8.5L38.0835 23.0837L35.4323 25.735L25.3748 15.6775Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch w-full">
            <div className="flex flex-col md:mt-10 mb-10 md:mb-0 w-full">
              <div className="shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)_inset] bg-white flex flex-col mt-6 rounded-[30px] md:w-4/5 w-full">
                <div className="shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)_inset] bg-amber-500 self-stretch flex flex-col pt-9 rounded-[30px] max-md:max-w-full">
                  <div className="bg-amber-500 self-stretch flex grow pt-0 flex-col  px-5">
                    <div className="self-center mt-[-4px] z-[1] flex ml-0 items-start gap-3.5 pb-3">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8948cf76-79ef-4eac-9e1d-7a006dceef13?"
                        className="aspect-square mt-[-10px] object-cover object-center w-9 overflow-hidden self-stretch max-w-full"
                      />
                      <div className="text-white mt-[-4px] text-xl font-semibold self-center my-auto whitespace-nowrap">
                        Leader Board
                      </div>
                    </div>
                  </div>
                </div>
                <Leaderboard />
              </div>
              <div className="shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)_inset] bg-white self-stretch flex grow flex-col w-full md:w-4/5 mt-10 justify-between rounded-[30px]">
                <div className="shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)_inset] bg-sky-700 text-center flex flex-col  py-4 rounded-t-[30px] max-md:max-w-full">
                  <div className="text-white text-xl font-semibold self-center w-[243px]">CHAT</div>
                </div>
                <Chatbox />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
