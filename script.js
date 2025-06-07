const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');

startButton.addEventListener('click', function(event) {
    event.stopPropagation();
    if (startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
    } else {
        startMenu.style.display = 'block';
    }
});

document.addEventListener('click', function(event) {
    if (!startMenu.contains(event.target) && event.target !== startButton) {
        startMenu.style.display = 'none';
    }
});
