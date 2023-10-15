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
              <p>${room.level} ${room.name}</p>
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

    users.forEach((user) => {
      store.set(user.id, 0);
    });

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
            
            <button id="hint-info" class="fixed bottom-16 left-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full px-5 py-2">Level description</button>
            <div class="fixed bottom-4 left-4 grid gap-2 grid-cols-3 text-white rounded-full">
              <button id="hint-info1" class="bg-gray-500 hover:bg-gray-600 rounded-full px-flex py-2">Lv.1</button>
              <button id="hint-info2" class="bg-gray-500 hover:bg-gray-600 rounded-full px-3 py-2">Lv.2</button>
              <button id="hint-info3" class="bg-gray-500 hover:bg-gray-600 rounded-full px-3 py-2">Lv.3</button>
            </div>

            <button class="w-96 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full">Select level :
              <select id="select1" class="bg-gray-500 hover:bg-gray-600 text-white">
                <option value="Lv.1">Lv.1 Beginner</option>
                <option value="Lv.2">Lv.2 Intermediate</option>
                <option value="Lv.3">Lv.3 Advanced</option>
              </select>
            </button>
 
            <button id="button-create-room" class="w-96 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full">Create New Room</button>
    
          </div>
        </div>
        <div>
        <button id="back" onClick="history.go(0)"
        class="fixed top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full px-4 py-2"> Exit
        </button>
          <div class="flex flex-col h-full justify-center items-center gap-4">
            <p class="text-3xl font-semibold text-gray-600">${store.get('name')}</p>
            <img src=${ghost} />          
          </div>
        </div>
      </div>
    `;
  document.querySelector('#hint-info').addEventListener('click', () => {
    Swal.fire({
      icon: 'info',
      title: 'Description',
      text: 'Select level dropdown is made to choose how helpful the hint would be',
    });
    return;
  });

  document.querySelector('#hint-info1').addEventListener('click', () => {
    Swal.fire({
      icon: 'info',
      title: 'Lv.1 Beginner',
      text: 'Hint with no penalty',
    });
    return;
  });

  document.querySelector('#hint-info2').addEventListener('click', () => {
    Swal.fire({
      icon: 'info',
      title: 'Lv.2 Intermediate',
      text: 'Hint will not increase score',
    });
    return;
  });

  document.querySelector('#hint-info3').addEventListener('click', () => {
    Swal.fire({
      icon: 'info',
      title: 'Lv.3 Advanced',
      text: 'No hint',
    });
    return;
  });

  updateRooms(rooms);
  document.querySelector('#button-create-room').addEventListener('click', () => {
    const roomName = document.querySelector('#input-room-name').value;
    const roomLevel = document.querySelector('#select1').value;
    if (!roomName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Room name cannot be blank!',
      });
      return;
    }

    socket.emit('newRoom', roomName, roomLevel, (success) => {
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
