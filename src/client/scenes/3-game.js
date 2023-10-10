import Swal from 'sweetalert2';

import { socket } from '../socket.js';
import { store } from '../state.js';

export async function setupGame() {
  const meIndex = store.get('users').findIndex((user) => user.id === socket.id);
  const me = store.get('users')[meIndex];
  const other = me === 0 ? store.get('users')[1] : store.get('users')[0];
  const secret = [];

  /* Player’s name and score are appeared on the game client.*/
  /* Game client has at least 5 buttons or keys */
  document.querySelector('#app').innerHTML = `
    <div class="flex justify-between my-2">
        <div>
            <p>Name: ${me.name} (You)</p>
            <p>Score: 0</p>
        </div>
        <p>${store.get('turn').id === socket.id ? 'Your Turn' : 'Waiting for your turn'}</p>
        <p><span id="timer" class="text-xl">-</span></p>
        <div>
            <p>Name: ${other.name}</p>
            <p>Score: 0</p>
        </div>
    </div>
    <div class="flex justify-center items-center h-full">
      <div class="flex w-full h-full">
        <button class="text-2xl bg-gray-200 w-full h-full" id="Cbtn">C</button>
        <button class="text-2xl bg-gray-300 w-full h-full" id="Dbtn">D</button>
        <button class="text-2xl bg-gray-200 w-full h-full" id="Ebtn">E</button>
        <button class="text-2xl bg-gray-300 w-full h-full" id="Fbtn">F</button>
        <button class="text-2xl bg-gray-200 w-full h-full" id="Gbtn">G</button>
      </div>
    </div>
  `;

  document.querySelector('#Cbtn').addEventListener('click', () => {
    secret.push('C');
    let realSecret = ['C', 'D', 'E', 'F'];
    const allEqual = JSON.stringify(realSecret) === JSON.stringify(secret);
    if (allEqual == true) {
      console.log('You win!');
    }
  });
  document.querySelector('#Dbtn').addEventListener('click', () => {
    secret.push('D');
    let realSecret = ['C', 'D', 'E', 'F'];
    const allEqual = JSON.stringify(realSecret) === JSON.stringify(secret);
    if (allEqual == true) {
      console.log('You win!');
    }
  });
  document.querySelector('#Ebtn').addEventListener('click', () => {
    secret.push('E');
    let realSecret = ['C', 'D', 'E', 'F'];
    const allEqual = JSON.stringify(realSecret) === JSON.stringify(secret);
    if (allEqual == true) {
      console.log('You win!');
    }
  });
  document.querySelector('#Fbtn').addEventListener('click', () => {
    secret.push('F');
    let realSecret = ['C', 'D', 'E', 'F'];
    const allEqual = JSON.stringify(realSecret) === JSON.stringify(secret);
    if (allEqual == true) {
      console.log('You win!');
    }
  });
  document.querySelector('#Gtbn').addEventListener('click', () => {
    secret.push('G');
    let realSecret = ['C', 'D', 'E', 'F'];
    const allEqual = JSON.stringify(realSecret) === JSON.stringify(secret);
    if (allEqual == true) {
      console.log('You win!');
    }
  });

  socket.on('startTimer', (timer) => {
    document.querySelector('#timer').textContent = timer;
    let time;
    time = setInterval(() => {
      const timer = parseInt(document.querySelector('#timer').textContent);
      if (timer > 0) {
        document.querySelector('#timer').textContent = timer - 1;
      } else {
        clearInterval(time);
      }
    }, 1000);
  });

  /* Welcome message appears on the game starts. */
  const turn = store.get('turn');
  if (turn.id === socket.id) {
    await Swal.fire({
      icon: 'info',
      title: 'Welcome, your turn',
      text: 'You first, get ready!',
    });
    socket.emit('startTurn');
  } else {
    Swal.fire({
      icon: 'info',
      title: `Welcome, ${turn.name}'s turn`,
      text: 'Wait for your turn',
    });
  }
}
