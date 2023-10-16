const toggleDarkMode = () => {
  const body = document.body;
  body.classList.toggle('dark-mode'); // Add or remove the 'dark-mode' class to toggle dark mode
};

// Add an event listener to a button or UI element to toggle dark mode
document.querySelector('#dark-mode-toggle-button').addEventListener('click', () => {
  toggleDarkMode();
});
