# Paint Palooza

(Still in progress! This readme is written with our end goal in mind.)

A browser-based Windows 98-style desktop environment with a fully functional MS Paint clone at its core. Built with React and p5.js, it renders a retro desktop complete with draggable windows, a taskbar, minimize/maximize/close controls, and a color palette powered by RYB color theory.

This project is the successor to [color-palooza](https://github.com/brianagude/color-palooza) — a collaborative effort between [myself](https://github.com/brianagude) and [@abettercoach](https://github.com/abettercoach), whom I met at [Recurse Center](https://github.com/recursecenter).

## What it looks like

A fake Windows 98 desktop in the browser. The Paint app launches into a draggable, resizable window with:

- A **drawing canvas** — pencil, brush, spray paint, shapes, eraser, eyedropper, fill, and more
- A **toolbar** with the classic Win95 icon grid
- A **color palette** generated from RYB color cubes (swap between Itten, Bezold, and others via the Options menu)
- A **menu bar** (File, Edit, View, Image, Options, Help)
- A **status bar** at the bottom
- A **taskbar** for minimizing/restoring windows
- Double-clicking the desktop icon launches a new Paint window

## Getting Started

**Prerequisites:** Node.js (v18+) and npm

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Other Scripts

```bash
npm run build    # Build for production
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Architecture

The app is structured as a lightweight OS shell in React. The key pieces:

- **`OS` / `OSContext`** — global state for registered apps and open window instances. Handles launch, close, minimize, maximize, restore, and focus.
- **`Desktop`** — renders app icons; double-click launches a new window instance.
- **`WindowManager`** — renders all non-minimized windows with correct z-index stacking.
- **`Window`** — the Win98 chrome (title bar, control buttons, dragging).
- **`StartBar`** — taskbar at the bottom; clicking a button minimizes or restores the window.
- **`PaintBox`** — the Paint app itself, composed of `Toolbar`, `PaintCanvas`, `ColorPalette`, `MenuBar`, and `StatusBar`.

The p5.js sketch inside `PaintCanvas` reads tool and color state via refs (not props), so React re-renders don't recreate the canvas.

## What We're Building Next

We're actively working toward an **app SDK** — a `createApp()` factory and `useWindow()` hook that lets any engineer register their own app and have it show up on the desktop as a first-class window. The goal is for other engineers to be able to push their own apps to the desktop without touching the OS shell. See [ROADMAP.md](./ROADMAP.md) for the full phased plan.

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [p5.js](https://p5js.org) via `@p5-wrapper/react`
- [98.css](https://jdan.github.io/98.css/) for Windows 98 styling
- [rybitten](https://github.com/meodai/rybitten) for RYB color palette generation

## Credits

- Icons from [Old Windows Icons](https://oldwindowsicons.tumblr.com/tagged/windows%2095) and [Win 98 Icons](https://win98icons.alexmeub.com/)
- Desktop inspiration from [98.js.org](https://98.js.org/)
