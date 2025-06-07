const startButton = document.getElementById('start-button');


startButton.addEventListener('click', function () {
    alert('Start menu clicked!');

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

function makeDraggable(win, handle) {
    handle.addEventListener('mousedown', function(e) {
        const offsetX = e.clientX - win.offsetLeft;
        const offsetY = e.clientY - win.offsetTop;

        function mouseMove(ev) {
            win.style.left = (ev.clientX - offsetX) + 'px';
            win.style.top = (ev.clientY - offsetY) + 'px';
        }

        function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    });
}

function createWindow(title) {
    const win = document.createElement('div');
    win.className = 'window';
    win.style.left = '100px';
    win.style.top = '100px';

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => win.remove());

    titleBar.appendChild(titleSpan);
    titleBar.appendChild(closeButton);
    win.appendChild(titleBar);

    const content = document.createElement('div');
    content.className = 'window-content';
    content.textContent = title + ' content';
    win.appendChild(content);

    document.getElementById('desktop').appendChild(win);

    makeDraggable(win, titleBar);
}

document.getElementById('icon-computer').addEventListener('dblclick', function() {
    createWindow('My Computer');
});

document.getElementById('icon-trash').addEventListener('dblclick', function() {
    createWindow('Recycle Bin');

});

// Trigger start menu with Alt+S
document.addEventListener('keydown', function (e) {
    if (e.altKey && e.key.toLowerCase() === 's') {
        startButton.focus();
        startButton.click();
    }
});
