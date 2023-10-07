import { socket } from '../socket';
import { store } from '../state';
import { setupLobby } from './2-lobby';

export function setupGate() {
  document.querySelector('#app').innerHTML = `
      <div class="flex flex-col h-full justify-center items-center gap-2">
        <input id="input-name" type="text" placeholder="Name" class="w-96 h-14 p-4 border-2 focus:border-gray-600 border-gray-500 rounded-full outline-none" />
        <button id="button-enter" class="w-96 h-10 bg-gray-500 hover:bg-gray-600 text-white rounded-full">Enter</button>
      </div>
    `;
  document.querySelector('#button-enter').addEventListener('click', () => {
    const name = document.querySelector('#input-name').value;
    store.set('name', name);
    socket.emit('hello', name, (rooms) => {
      setupLobby(rooms);
    });
  });
}
