const startButton = document.getElementById('start-button');

startButton.addEventListener('click', function () {
    alert('Start menu clicked!');
});

// Trigger start menu with Alt+S
document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key.toLowerCase() === 's') {
        startButton.focus();
        startButton.click();
    }
});
