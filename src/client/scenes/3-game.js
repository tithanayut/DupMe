import Swal from 'sweetalert2';

import { socket } from '../socket.js';
import { store } from '../state.js';

export function setupGame() {
  const meIndex = store.get('users').findIndex((user) => user.id === socket.id);
  const me = store.get('users')[meIndex];
  const other = me === 0 ? store.get('users')[1] : store.get('users')[0];

  /* Player’s name and score are appeared on the game client.*/
  document.querySelector('#app').innerHTML = `
    <div class="flex justify-between">
        <div>
            <p>Name: ${me.name} (You)</p>
            <p>Score: 0</p>
            <p>Turn: ${store.get('turn').id === socket.id ? 'Your Turn' : 'Waiting for your turn'}</p>
        </div>
        <div>
            <p>Name: ${other.name}</p>
            <p>Score: 0</p>
        </div>
    </div>
    <div class="flex justify-center items-center h-full">
    </div>
  `;

  /* Welcome message appears on the game starts. */
  const turn = store.get('turn');
  if (turn.id === socket.id) {
    Swal.fire({
      icon: 'info',
      title: 'Welcome, your turn',
      text: 'You first, get ready!',
    });
  } else {
    Swal.fire({
      icon: 'info',
      title: `Welcome, ${turn.name}'s turn`,
      text: 'Wait for your turn',
    });
  }
}
