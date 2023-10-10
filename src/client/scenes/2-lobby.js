import Swal from 'sweetalert2';

import ghost from '../assets/ghost.png';
import { socket } from '../socket';
import { store } from '../state';
import { setupGame } from './3-game';

export function setupLobby(rooms) {
  function updateRooms(newRooms) {
    if (newRooms.length > 0) {
      document.querySelector('#rooms').innerHTML = '';
      newRooms.forEach((room) => {
        const roomEl = document.createElement('div');
        roomEl.innerHTML = `
            <button class="flex justify-between items-center w-96 h-14 p-4 border-2 bg-gray-200 rounded-full">
              <p>${room.name}</p>
              <p> ${
                room.users.some((user) => user.id === socket.id)
                  ? 'Waiting for other player'
                  : `Created by ${room.users.map((user) => user.name).join(', ')}`
              }</p>
                
            </button>
          `;
        if (!room.users.some((user) => user.id === socket.id)) {
          roomEl.addEventListener('click', () => {
            socket.emit('joinRoom', room.name, (success) => {
              if (!success) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Room is full!',
                });
              }
            });
          });
        } else {
          roomEl.querySelector('button').classList.add('bg-gray-400');
          roomEl.querySelector('button').classList.remove('bg-gray-200');
          roomEl.querySelector('button').disabled = true;
        }
        document.querySelector('#rooms').appendChild(roomEl);
      });
    } else {
      document.querySelector('#rooms').innerHTML = `
          <p class="text-center">No rooms available</p>
        `;
    }
  }
  socket.on('rooms', (newRooms) => {
    updateRooms(newRooms);
  });
  socket.on('startGame', (users, turn) => {
    store.set('users', users);
    store.set('turn', turn);

    socket.off('rooms');
    socket.off('startGame');
    setupGame();
  });

  document.querySelector('#app').innerHTML = `
      <div class="grid grid-cols-2 h-full">
        <div class="flex flex-col justify-center items-center gap-4">
          <div id="rooms" class="flex flex-col gap-2"></div>
          <div class="flex flex-col gap-1" id="form-create-room">
            <input id="input-room-name" type="text" placeholder="Room Name" class="w-96 h-12 p-4 border-2 focus:border-gray-600 border-gray-500 rounded-full outline-none" />
            <button id="button-create-room" class="w-96 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full">Create New Room</button>
          </div>
        </div>
        <div>
          <div class="flex flex-col h-full justify-center items-center gap-4">
            <p class="text-3xl font-semibold text-gray-600">${store.get('name')}</p>
            <img src=${ghost} />          
          </div>
        </div>
      </div>
    `;
  updateRooms(rooms);
  document.querySelector('#button-create-room').addEventListener('click', () => {
    const roomName = document.querySelector('#input-room-name').value;
    if (!roomName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Room name cannot be blank!',
      });
      return;
    }

    socket.emit('newRoom', roomName, (success) => {
      if (success) {
        document.querySelector('#form-create-room').style.display = 'none';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Room name is already taken!',
        });
      }
    });
  });
}
