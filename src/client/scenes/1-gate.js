import Swal from 'sweetalert2';

import { socket } from '../socket';
import { store } from '../state';
import { setupLobby } from './2-lobby';

export function setupGate() {
  /* Client connects to server first and gets information about other clients from server program. */
  socket.emit('getOtherClient', (clientCount, userCount, roomCount) => {
    Swal.fire({
      icon: 'info',
      title: 'Hello!',
      text: `There are ${clientCount} clients online (${userCount} has entered their name), and ${roomCount} rooms available by the way.`,
    });
  });

  document.querySelector('#app').innerHTML = `
      <div class="flex flex-col h-full justify-center items-center gap-2">
        <input id="input-name" type="text" placeholder="Nickname" class="w-96 h-14 p-4 border-2 focus:border-gray-600 border-gray-500 rounded-full outline-none" />
        <button id="button-enter" class="w-96 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full">Enter</button>
      </div>
    `;
  /* Can put your nickname when the game starts. */
  document.querySelector('#button-enter').addEventListener('click', () => {
    const name = document.querySelector('#input-name').value;
    store.set('name', name);
    if (!name) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Name cannot be blank!',
      });
      return;
    }
    socket.emit('hello', name, (success, rooms) => {
      if (success) {
        setupLobby(rooms);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Name already taken!',
        });
      }
    });
  });
  socket.on('otherPlayerDisconnected', () => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Other player disconnected!',
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });
  socket.on('reset', () => {
    Swal.fire({
      icon: 'warning',
      title: 'Game Reset',
      text: 'Reloading your gamer...',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
}
