const socket = io();

socket.on('connect', () => {
  console.log('connected');
});

socket.on('concurrent', (connectedCount, registeredCount, players) => {
  document.getElementById('connected-count').innerHTML = connectedCount;
  document.getElementById('registered-count').innerHTML = registeredCount;
  document.getElementById('players').innerHTML = '';
  players.forEach((player) => {
    const li = document.createElement('div');
    li.style =
      'display: flex; align-items: center; gap:6px; border: 1px solid black; width: fit-content; padding: 2px 16px;';
    li.innerHTML = `<img width="100px" src="${player.profilePicture}" />  <div><p>Name: ${player.name}</p><p>Score: ${player.accumulatedScore}</p></div>`;
    document.getElementById('players').appendChild(li);
  });
});

document.getElementById('reset-button').addEventListener('click', () => {
  const go = confirm('Are you sure you want to reset the game?');
  if (go) {
    socket.emit('reset', (success) => {
      if (success) {
        alert('Reset successful');
      } else {
        alert('Reset failed');
      }
    });
  }
});
