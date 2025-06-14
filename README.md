# Win95 Desktop

This repository contains a small mock desktop inspired by the look of Windows 95. It is implemented with HTML, CSS and a bit of JavaScript.
The current version includes draggable desktop icons, a taskbar clock and a simple Minesweeper clone.  All icons are small SVGs stored in the `icons` folder.

To try it out, open `index.html` in a web browser.


## Keyboard shortcuts

- **Alt+S** – open the Start menu.
- Use **Tab** to focus the Start button, then **Enter** or **Space** to activate it.

## Quick Start

This project now includes a simple Node-based server for convenience.
To start it, install the dependencies and run the `start` script:

```bash
npm install
npm run start
```

The server uses `http-server` to serve files from the repository root. By default it listens on port 8080, so you can view the desktop at [http://localhost:8080](http://localhost:8080).

This project is licensed under the MIT License. See the LICENSE file for details.
