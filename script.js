"use strict";

function makeDraggable(win, handle) {
    handle.addEventListener("mousedown", function (e) {
        const offsetX = e.clientX - win.offsetLeft;
        const offsetY = e.clientY - win.offsetTop;

        function mouseMove(ev) {
            win.style.left = ev.clientX - offsetX + "px";
            win.style.top = ev.clientY - offsetY + "px";
        }

        function mouseUp() {
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
        }

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    });
}

function createWindow(title) {
    const win = document.createElement("div");
    win.className = "window";
    win.style.left = "100px";
    win.style.top = "100px";

    const titleBar = document.createElement("div");
    titleBar.className = "title-bar";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = title;

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.textContent = "X";
    closeButton.setAttribute("aria-label", "Close window");
    closeButton.addEventListener("click", () => win.remove());

    titleBar.appendChild(titleSpan);
    titleBar.appendChild(closeButton);
    win.appendChild(titleBar);

    const content = document.createElement("div");
    content.className = "window-content";
    content.textContent = title + " content";
    win.appendChild(content);

    document.getElementById("desktop").appendChild(win);

    makeDraggable(win, titleBar);
    return win;
}

document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const startMenu = document.getElementById("start-menu");
    const programsItem = document.getElementById("menu-programs");
    const shutdownItem = document.getElementById("menu-shutdown");

    function toggleStartMenu() {
        const visible = startMenu.style.display === "block";
        startMenu.style.display = visible ? "none" : "block";
        startMenu.setAttribute("aria-hidden", visible);
    }

    startButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleStartMenu();
    });

    document.addEventListener("click", (event) => {
        if (!startMenu.contains(event.target) && event.target !== startButton) {
            startMenu.style.display = "none";
            startMenu.setAttribute("aria-hidden", "true");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === "s") {
            startButton.focus();
            toggleStartMenu();
        }
    });

    programsItem.addEventListener("click", () => {
        toggleStartMenu();
        createWindow("Programs");
    });

    shutdownItem.addEventListener("click", () => {
        toggleStartMenu();
        const shut = createWindow("Shutdown");
        shut.querySelector(".window-content").textContent = "It's now safe to turn off your computer.";
    });

    const sampleWindow = document.getElementById("window-sample");
    const sampleTitle = sampleWindow.querySelector(".title-bar");
    const sampleClose = sampleWindow.querySelector(".close-button");

    makeDraggable(sampleWindow, sampleTitle);
    sampleClose.addEventListener("click", () => sampleWindow.remove());

    const computerIcon = document.getElementById("icon-computer");
    const trashIcon = document.getElementById("icon-trash");

    function openIconWindow(title) {
        createWindow(title);
    }

    computerIcon.addEventListener("dblclick", () => openIconWindow("My Computer"));
    computerIcon.addEventListener("click", () => openIconWindow("My Computer"));
    trashIcon.addEventListener("dblclick", () => openIconWindow("Recycle Bin"));
    trashIcon.addEventListener("click", () => openIconWindow("Recycle Bin"));

    [computerIcon, trashIcon].forEach((icon) => {
        icon.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                icon.click();
            }
        });
    });
});
