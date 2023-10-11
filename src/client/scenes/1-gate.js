import Swal from 'sweetalert2';

import avatar_1 from '../assets/Profile1.jpg';
import avatar_2 from '../assets/Profile2.jpg';
import avatar_3 from '../assets/Profile3.jpg';
import avatar_4 from '../assets/Profile4.jpg';
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
    <div class="avatar-container">
      <img src=${avatar_1} class="avatar" id="avatar" />
      <button id="prev-avatar" class="btnl">&#8592;</button>
      <button id="next-avatar" class="btnr">&#8594;</button>
    </div>
    <input id="input-name" type="text" placeholder="Nickname" class="w-96 h-14 p-4 border-2 focus-border-gray-600 border-gray-500 rounded-full outline-none" />
    <button id="button-enter" class="w-96 h-10 bg-gray-500 hover-bg-gray-600 text-white rounded-full">Enter</button>
  </div>
`;

  /* Can put your nickname when the game starts. */
  document.querySelector('#button-enter').addEventListener('click', () => {
    const name = document.querySelector('#input-name').value;
    store.set('name', name);
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
  // darkmode.js

  // Function to toggle dark mode
  function toggleDarkMode() {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark'); // Toggle the 'dark' class on the <html> element
  }

  // Add an event listener to the button
  const darkModeButton = document.getElementById('dark-mode-toggle-button');
  darkModeButton.addEventListener('click', toggleDarkMode);

  // JavaScript code to handle avatar navigation
  const avatars = [avatar_1, avatar_2, avatar_3, avatar_4];
  let currentAvatarIndex = 0;
  const avatarElement = document.getElementById('avatar');

  // Function to update the displayed avatar
  function updateAvatar() {
    avatarElement.src = avatars[currentAvatarIndex];
  }

  // Event listeners for previous and next buttons
  const prevAvatarButton = document.getElementById('prev-avatar');
  prevAvatarButton.addEventListener('click', () => {
    currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
    updateAvatar();
  });

  const nextAvatarButton = document.getElementById('next-avatar');
  nextAvatarButton.addEventListener('click', () => {
    currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
    updateAvatar();
  });

  // Initialize the displayed avatar
  updateAvatar();
}
