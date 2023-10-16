import { FormEvent, useRef } from 'react';

import { MySwal } from '../common/alert';
import { socket } from '../common/socket';
import { useGame } from '../contexts/GameContext';

export function Lobby() {
  const nameRef = useRef<HTMLInputElement>(null);
  const levelRef = useRef<HTMLSelectElement>(null);
  const { me, rooms, myRoom } = useGame();

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
    <div>
      Welcome {me?.name} <img src={me?.profilePicture} width={100} />
      {rooms.map((room) => (
        <button
          key={room.name}
          onClick={() => onJoinRoom(room.name)}
          disabled={room.players[0].name === me?.name || room.players[1]?.name === me?.name}
        >
          {room.name} | {room.level} | Joined by {room.players.map((player) => player?.name).join(', ')}
        </button>
      ))}
      {!myRoom ? (
        <form onSubmit={onCreateRoom}>
          <input type="text" placeholder="Room Name" ref={nameRef} />
          <select ref={levelRef}>
            <option value="LV1">LV1</option>
            <option value="LV2">LV2</option>
            <option value="LV3">LV3</option>
          </select>
          <button>Create</button>
        </form>
      ) : (
        'Waiting for others to join!'
      )}
    </div>
  );
}
