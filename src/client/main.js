import './style.css';

import io from 'socket.io-client';

import viteLogo from '/assets/vite.svg';

import javascriptLogo from './assets/javascript.svg';

const socket = io();

socket.on('connect', () => {
  alert(`Connected to server: ${socket.id}`);
});

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>DupMe!</h1>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`;
