# Paint Palooza

A browser-based painting app styled after the classic Windows 98 MS Paint experience. Built with React and p5.js, it features a retro UI with a title bar, menu bar, drawing toolbar, color palette, and status bar — all rendered with the [98.css](https://jdan.github.io/98.css/) design system.

## Features

- Drawing canvas powered by p5.js
- Classic Windows 98 UI (title bar, menu bar, toolbar, status bar, start bar)
- Color palette with RYB color support via [rybitten](https://github.com/meodai/rybitten)
- Icons are from [Old Windows Icons](https://oldwindowsicons.tumblr.com/tagged/windows%2095) and [Win 98 Icons](https://win98icons.alexmeub.com/)
- Desktop inspo from [98.js.org](https://98.js.org/)

## Getting Started

**Prerequisites:** Node.js (v18+) and npm

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Other Scripts

```bash
npm run build    # Build for production
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Tech Stack

- [React 19](https://react.dev)
- [Vite](https://vite.dev)
- [p5.js](https://p5js.org) via react-p5
- [98.css](https://jdan.github.io/98.css/) for Windows 98 styling
- [rybitten](https://github.com/meodai/rybitten) for RYB color palette generation
