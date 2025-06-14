'use strict';

let highestZ = 1;
const openApps = new Map(); // appName -> {win, button}

function makeDraggable(win, handle) {
    handle.addEventListener('mousedown', function (e) {
        const offsetX = e.clientX - win.offsetLeft;
        const offsetY = e.clientY - win.offsetTop;
        function mouseMove(ev) {
            win.style.left = ev.clientX - offsetX + 'px';
            win.style.top = ev.clientY - offsetY + 'px';
        }
        function mouseUp() {
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    });
}

function bringToFront(win) {
    highestZ += 1;
    win.style.zIndex = highestZ;
}

function createTaskbarButton(appName, win) {
    const container = document.getElementById('taskbar-apps');
    const btn = document.createElement('button');
    btn.textContent = appName;
    btn.className = 'taskbar-app active';
    btn.addEventListener('click', () => {
        if (win.style.display === 'none') {
            win.style.display = 'block';
            btn.classList.add('active');
            bringToFront(win);
        } else {
            win.style.display = 'none';
            btn.classList.remove('active');
        }
    });
    container.appendChild(btn);
    return btn;
}

function openApp(appName) {
    const win = document.getElementById('window-' + appName);
    if (!win) return;
    if (openApps.has(appName)) {
        const data = openApps.get(appName);
        win.style.display = 'block';
        data.button.classList.add('active');
        bringToFront(win);
        return;
    }
    win.style.display = 'block';
    bringToFront(win);
    const btn = createTaskbarButton(appName, win);
    openApps.set(appName, { win, button: btn });
}

function closeApp(appName) {
    const data = openApps.get(appName);
    if (data) {
        data.win.style.display = 'none';
        data.button.remove();
        openApps.delete(appName);
    } else {
        const win = document.getElementById('window-' + appName);
        if (win) win.style.display = 'none';
    }
}

function minimizeApp(appName) {
    const data = openApps.get(appName);
    if (data) {
        data.win.style.display = 'none';
        data.button.classList.remove('active');
    } else {
        const win = document.getElementById('window-' + appName);
        if (win) win.style.display = 'none';
    }
}

function setupWindow(appName) {
    const win = document.getElementById('window-' + appName);
    if (!win) return;
    const titleBar = win.querySelector('.title-bar');
    const closeBtn = win.querySelector('.close-button');
    const minBtn = win.querySelector('.minimize-button');
    if (titleBar) {
        makeDraggable(win, titleBar);
        titleBar.addEventListener('mousedown', () => bringToFront(win));
    }
    if (closeBtn) closeBtn.addEventListener('click', () => closeApp(appName));
    if (minBtn) minBtn.addEventListener('click', () => minimizeApp(appName));
}

function initMinesweeper() {
    const boardEl = document.getElementById('minesweeper-board');
    if (!boardEl) return;
    const rows = 5, cols = 5, mines = 5;
    const cells = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const div = document.createElement('div');
            boardEl.appendChild(div);
            row.push({ mine: false, revealed: false, number: 0, el: div, r, c });
        }
        cells.push(row);
    }
    // place mines
    let placed = 0;
    while (placed < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!cells[r][c].mine) {
            cells[r][c].mine = true;
            placed++;
        }
    }
    function count(r, c) {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && cells[nr][nc].mine) n++;
            }
        }
        return n;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells[r][c].number = count(r, c);
        }
    }
    function reveal(cell) {
        if (cell.revealed) return;
        cell.revealed = true;
        cell.el.classList.add('revealed');
        if (cell.mine) {
            cell.el.textContent = 'X';
            alert('Boom!');
            return;
        }
        if (cell.number > 0) {
            cell.el.textContent = cell.number;
        } else {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = cell.r + dr, nc = cell.c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) reveal(cells[nr][nc]);
                }
            }
        }
    }
    cells.flat().forEach(cell => {
        cell.el.addEventListener('click', () => reveal(cell));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    function toggleStartMenu() {
        const visible = startMenu.style.display === 'block';
        startMenu.style.display = visible ? 'none' : 'block';
    }
    startButton.addEventListener('click', (e) => { e.stopPropagation(); toggleStartMenu(); });
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && e.target !== startButton) startMenu.style.display = 'none';
    });

    ['notepad','minesweeper','sample'].forEach(setupWindow);

    document.getElementById('icon-notepad').addEventListener('dblclick', () => openApp('notepad'));
    document.getElementById('icon-minesweeper').addEventListener('dblclick', () => openApp('minesweeper'));

    document.getElementById('menu-notepad').addEventListener('click', () => { toggleStartMenu(); openApp('notepad'); });
    document.getElementById('menu-minesweeper').addEventListener('click', () => { toggleStartMenu(); openApp('minesweeper'); });

    initMinesweeper();

    // make desktop icons draggable
    document.querySelectorAll('.icon').forEach(icon => {
        makeDraggable(icon, icon);
        icon.addEventListener('mousedown', () => bringToFront(icon));
    });

    // taskbar clock
    const clockEl = document.getElementById('taskbar-clock');
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();
});
