import Swal from 'sweetalert2';

import { socket } from '../socket.js';
import { store } from '../state.js';

export async function setupGame() {
  const meIndex = store.get('users').findIndex((user) => user.id === socket.id);
  const me = store.get('users')[meIndex];
  const other = meIndex === 0 ? store.get('users')[1] : store.get('users')[0];
  const secret = [];
  const realSecret = ['C', 'D', 'E', 'F'];
  const unsecureKeystore = [];

  /* Game client has at least 5 buttons or keys */
  /* Player’s name and score are appeared on the game client.*/
  const playerProfile = `<div>
                          <p>Name: ${me.name} (You)</p>
                          <p>Score: <span id="${me.id}">${store.get(me.id)}</span></p>
                        </div>
                        <button class="fixed bottom-4 left-4 bg-gray-500 hover:bg-gray-600 text-white rounded-full px-5 py-2">Hint</button>
                        <div class="flex flex-col gap-2 items-center">
                          <p id="whotext">${
                            store.get('turn').id === socket.id ? 'Your Turn' : 'Waiting for your turn'
                          }</p>
                          <p><span id="timer" class="text-3xl">-</span></p>
                        </div>
                        <div>
                          <p>Name: ${other.name}</p>
                          <p>Score: <span id="${other.id}">${store.get(other.id)}</span></p>
                        </div>`;

  /* Check if hint is availiable yet? How much answer should be shown per hint? How many time it can be used? Deduct seore per hint? 
  or hint makes the next click on button show error message if wrong */

  document.querySelector('#app').innerHTML = `
    <div class="flex justify-between my-2">
        ${playerProfile}
    </div>
    <div id="log" class="flex justify-center items-center gap-4 my-8"></div>
    <div class="flex justify-center items-center h-full my-8">
      <div class="flex w-full h-full" id="btnContainer">
      </div>
    </div>
  `;

  const index = Array.from({ length: 5 }, (_, i) => i + 1);
  index.forEach((i) => {
    const a = String.fromCharCode(64 + i);
    const btn = document.createElement('button');
    btn.setAttribute('id', `${a}btn`);
    btn.setAttribute(
      'class',
      'w-full h-1/2 hover:bg-yellow-100 text-gray-900 text-2xl rounded-full transition duration-100',
    );
    if (i % 2 == 0) {
      btn.classList.add('bg-gray-300');
    } else {
      btn.classList.add('bg-gray-200');
    }
    btn.textContent = a;
    document.querySelector('#btnContainer').appendChild(btn);
  });
  setupEvent();

  function handleAllowKey(opposite = false) {
    if (opposite ? store.get('turn').id !== socket.id : store.get('turn').id === socket.id) {
      index.forEach((i) => {
        const a = String.fromCharCode(64 + i);
        document.querySelector(`#${a}btn`).disabled = false;
        document.querySelector(`#${a}btn`).classList.add('hover:bg-yellow-100');
      });
    } else {
      index.forEach((i) => {
        const a = String.fromCharCode(64 + i);
        document.querySelector(`#${a}btn`).disabled = true;
        document.querySelector(`#${a}btn`).classList.remove('hover:bg-yellow-100');
      });
    }
  }

  function setupEvent() {
    index.forEach((i) => {
      let btn = document.querySelector(`#${String.fromCharCode(64 + i)}btn`);
      btn.replaceWith(btn.cloneNode(true)); // remove all event listeners
      btn = document.querySelector(`#${String.fromCharCode(64 + i)}btn`);
      btn.addEventListener('click', () => {
        socket.emit('key', String.fromCharCode(64 + i));

        secret.push(String.fromCharCode(64 + i));
        const allEqual = JSON.stringify(realSecret) === JSON.stringify(secret);
        if (allEqual) {
          console.log('You win!');
        }
      });
    });
    handleAllowKey();
  }

  /* The second player can see the first player pattern and vice versa. */
  socket.on('key', (key) => {
    if (!store.get('guessing')) {
      unsecureKeystore.push(key);
    }
    document.querySelector(`#${key}btn`).classList.add('bg-yellow-200');
    setTimeout(() => {
      document.querySelector(`#${key}btn`).classList.remove('bg-yellow-200');
    }, 400);
    const logEl = document.createElement('p');
    logEl.setAttribute('class', 'text-xl');
    logEl.textContent = key;
    document.querySelector('#log').appendChild(logEl);
  });

  socket.on('score', (id, toAdd) => {
    const score = document.querySelector(`#${id}`);
    score.textContent = parseInt(score.textContent) + toAdd;
    store.set(id, parseInt(score.textContent));
  });

  /* Time can be counted down. */
  socket.on('startTimer', (timer) => {
    Swal.close();
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

  socket.on('clearLog', () => {
    document.querySelector('#log').innerHTML = '';
  });

  socket.on('guessAllCorrect', async (id) => {
    if (id !== socket.id) {
      const otherName = store.get('users').find((user) => user.id === id).name;
      await Swal.fire({
        icon: 'info',
        title: `Whoops! ${otherName} guesses all correct!,`,
        text: 'Waiting for them to start a new turn...',
      });
    }
  });

  socket.on('startGuess', () => {
    handleAllowKey(true);
    document.querySelector('#log').innerHTML = '';
    const other = store.get('users').find((user) => user.id !== socket.id);
    if (document.querySelector('#whotext').textContent === 'Your Turn') {
      document.querySelector('#whotext').textContent = `${other.name}'s is guessing...`;
      index.forEach((i) => {
        const a = String.fromCharCode(64 + i);
        const btn = document.querySelector(`#${a}btn`);
        btn.replaceWith(btn.cloneNode(true)); // remove all event listeners
      });
      store.set('guessing', false);
    } else {
      document.querySelector('#whotext').textContent = 'Guess Now!';
      store.set('guessIndex', 0);
      store.set('scoreAdded', 0);
      store.set('guessing', true);
      index.forEach((i) => {
        const a = String.fromCharCode(64 + i);
        let btn = document.querySelector(`#${a}btn`);
        btn.replaceWith(btn.cloneNode(true)); // remove all event listeners
        btn = document.querySelector(`#${a}btn`);
        btn.addEventListener('click', async () => {
          socket.emit('key', String.fromCharCode(64 + i));
          if (store.get('guessIndex') < unsecureKeystore.length) {
            /* Increase scores when follow the right pattern. */
            if (unsecureKeystore[store.get('guessIndex')] === a) {
              document.querySelector('#whotext').textContent = 'Guess Now!';
              store.set('scoreAdded', store.get('scoreAdded') + 1);
              store.set('guessIndex', store.get('guessIndex') + 1);
              socket.emit('addMyScore', 1);
            } else {
              socket.emit('minusMyScore', store.get('scoreAdded'));
              document.querySelector('#whotext').textContent = 'Wrong! Guess again...';
              socket.emit('clearLog');
              store.set('scoreAdded', 0);
              store.set('guessIndex', 0);
            }
          }
          if (store.get('guessIndex') === unsecureKeystore.length) {
            socket.emit('guessAllCorrect');
            await Swal.fire({
              icon: 'info',
              title: 'Congratulation!',
              text: 'You guess all correct this turn!',
            });
          }
        });
      });
    }
  });

  /* Welcome message appears on the game starts. */
  const turn = store.get('turn');
  if (turn.id === socket.id) {
    await Swal.fire({
      icon: 'info',
      title: 'Welcome, your turn!',
      text: 'You first, get ready!',
    });
    socket.emit('startTurn');
  } else {
    Swal.fire({
      icon: 'info',
      title: `Welcome, it's ${turn.name}'s turn`,
      text: `Waiting for ${turn.name}`,
    });
  }
}
