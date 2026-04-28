# Paint Palooza — Windows 95 Platform Roadmap

## Codebase Audit

### What exists and maps to the architecture

| Existing file | Maps to | Status |
|---|---|---|
| `App.jsx` — holds `currentApps` state, renders icons and windows | OSProvider + Desktop + WindowManager | Monolith. Split across three phases. |
| `Window.jsx` — renders title bar + control buttons + `app.comp` | `Window` chrome | Mostly right shape; needs WindowContext, position/size, z-index. |
| `StartBar.jsx` — renders taskbar buttons for open apps, toggles minimized | `Taskbar` | Logic is close. Rename + fix focus/restore semantics. |
| `MenuBar.jsx` — renders `File Edit View Image Options Help` | MenuBar primitives | Stub. Hard-coded, ignores `items` prop, no interactivity. |
| `StatusBar.jsx` — hard-coded fields | StatusBar | Stub. Stays as-is until an app needs it. |
| `PaintBox.jsx` + `PaintCanvas.jsx` + `Toolbar.jsx` + `ColorPalette.jsx` | First registered app | Fully working. Migrated to `createApp` in Phase 5. |

### What does not exist yet

- `OSContext` — no context system at all; everything prop-drills from `App.jsx`
- `WindowContext` — no per-window context
- `Desktop.jsx` — icon grid is inline in `App.jsx`
- `WindowManager.jsx` — window rendering is inline in `App.jsx`
- `createApp()` — no app registration SDK
- `useWindow()` hook
- Window dragging
- Z-index / focus stacking
- Multi-instance support (launching two Paint windows)

### Key problems in the current model

1. **State shape is wrong for the target architecture.** App objects carry `open`, `minimized`, `maximized` booleans instead of a `windows` instances array with a `state` field. There is no `instanceId` — windows are identified by `app.name`.

2. **Minimize is CSS, not data.** `Window.jsx` renders with `className="window--minimized"` which sets `display: none`. The target model hides minimized windows by filtering them out of `WindowManager`'s render, keeping them alive in state so the taskbar button persists.

3. **Taskbar minimize toggle is wrong.** `StartBar` does `minimized: !app.minimized`. The target behavior: clicking a focused+normal window minimizes it; clicking anything else restores+focuses it.

4. **No focus or z-index.** `isFocused` doesn't exist. Windows can't be brought to front.

5. **No position/size in state.** `Window` is hardcoded to `position: fixed; top: 20%; left: 30%` in CSS. Moving to data-driven position enables dragging and multi-instance placement.

---

## Phases

Each phase ends with the app fully working.

---

### Phase 1 — OSContext: replace the state model

**Goal:** Introduce the correct data model. Replace `App.jsx`'s `currentApps` array with a proper `OSContext` that holds `registeredApps` and `windows` instances. Nothing visible changes to the user.

**Files to create:**

**`src/contexts/OSContext.jsx`**
```
- createContext(null) → OSContext
- export useOS() hook (throws if used outside OSProvider)
- OSProvider component:
    - registeredApps: Map<appId, manifest>  (built from registerApp calls)
    - windows: array of window instances
    - registerApp(manifest) — adds to registeredApps
    - launchApp(appId) — creates new instance:
        { instanceId: crypto.randomUUID(), appId, title: manifest.title,
          state: 'normal', isFocused: true, position: {x:80, y:60}, size: manifest.defaultSize }
        Sets all other windows isFocused: false
    - closeWindow(instanceId) — removes from windows array
    - minimizeWindow(instanceId) — state:'minimized', isFocused:false
    - maximizeWindow(instanceId) — state:'maximized', isFocused:true; others isFocused:false
    - restoreWindow(instanceId) — state:'normal', isFocused:true; others isFocused:false
    - focusWindow(instanceId) — isFocused:true; others isFocused:false
```

**`src/App.jsx`** (modify)
- Remove `apps` array and all state/handler functions
- Wrap content in `<OSProvider>`
- Register Paint app via `registerApp` inside the provider (or a bootstrap call)
- Keep rendering Desktop icons, windows, and StartBar inline for now (these get extracted in Phase 2)
- Window rendering: `windows.filter(w => w.state !== 'minimized').map(...)` — drop the CSS `window--minimized` approach

**`src/components/Window.jsx`** (modify)
- Change signature from `({ app, onUpdate })` to `({ instanceId })` — reads everything else from `useOS()`
- Update close/minimize/maximize handlers to call the OSContext functions by `instanceId`
- Remove `window--minimized` className (minimized windows no longer render at all)
- Keep `window--maximized` className for now (position/size come from data in Phase 4)

**`src/components/StartBar.jsx`** (modify)
- Read `windows` from `useOS()` instead of accepting `apps` + `onUpdate` props
- Fix taskbar button click logic:
  ```
  if (window.isFocused && window.state === 'normal') → minimizeWindow
  else → restoreWindow + focusWindow
  ```
- Show buttons for ALL windows (not just `app.open`) — minimized windows still appear

---

### Phase 2 — Extract Desktop and WindowManager

**Goal:** Break `App.jsx` apart into the four OS shell components. `App.jsx` becomes a thin composition root.

**Files to create:**

**`src/components/Desktop.jsx`**
- Reads `registeredApps` from `useOS()`
- Renders one icon button per registered app
- `onDoubleClick` → `launchApp(appId)` (single-click to select is optional later)
- Absorbs the `.app-icons`, `.app-btn`, `.app-icon`, `.app-icon-arrow`, `.app-title` CSS from `App.css`

**`src/components/WindowManager.jsx`**
- Reads `windows` from `useOS()`
- Renders `windows.filter(w => w.state !== 'minimized').map(w => <Window key={w.instanceId} instanceId={w.instanceId} />)`
- Handles z-index stacking: focused window gets the highest z-index. Simple approach: `zIndex: windows.indexOf(w)` after moving focused window to end of array on focus.

**`src/App.jsx`** (modify)
- Body becomes:
  ```jsx
  <OSProvider>
    <Desktop />
    <WindowManager />
    <Taskbar />
  </OSProvider>
  ```
- All state, handlers, and rendering logic removed

**`src/components/StartBar.jsx`** (rename → **`src/components/Taskbar.jsx`**)
- Name change only in this phase; logic already updated in Phase 1

**`src/App.css`** (trim)
- Move desktop icon styles into `Desktop.jsx`'s colocated CSS or a `Desktop.css`
- Remove window state classes that are no longer used

---

### Phase 3 — WindowContext: per-window context

**Goal:** Each Window provides its own context so app components can call `useWindow()` without needing to know their `instanceId`.

**Files to create:**

**`src/contexts/WindowContext.jsx`**
```
- createContext(null) → WindowContext
- export useWindow() hook (throws if used outside Window)
- WindowContext.Provider value:
    { instanceId, title, state, isFocused, position, size,
      minimize, maximize, restore, close, setTitle }
  All action functions delegate to OSContext via instanceId.
```

**`src/components/Window.jsx`** (modify)
- Wrap render output in `<WindowContext.Provider value={windowContextValue}>`
- `windowContextValue` is built from the window instance + OSContext action functions bound to this `instanceId`
- `app.comp` rendered inside the provider — it can now call `useWindow()` if it wants

---

### Phase 4 — Window chrome: position, size, z-index, dragging

**Goal:** Windows sit at real coordinates, can be dragged, and maximize correctly fills the viewport above the taskbar.

**`src/components/Window.jsx`** (modify)

Position/size from data:
```jsx
const style = state === 'maximized'
  ? { position: 'fixed', top: 0, left: 0, width: '100%', height: 'calc(100vh - 28px)', zIndex }
  : { position: 'fixed', top: position.y, left: position.x, width: size.width, height: size.height, zIndex }
```

Remove all positional CSS from `App.css` (`.paint-box-window { top: 20%; left: 30%; }`).

Dragging:
- `onPointerDown` on the title bar sets a drag flag and captures the pointer
- `onPointerMove` on the window calls `updateWindowPosition(instanceId, newPos)` — a new OSContext action that patches `position`
- `onPointerUp` releases the pointer
- Guard: no drag when maximized

Focus on click:
- `onPointerDown` anywhere on the window calls `focusWindow(instanceId)`

**`src/contexts/OSContext.jsx`** (modify)
- Add `updateWindowPosition(instanceId, { x, y })` action
- On `focusWindow`, move the instance to the end of the `windows` array (so it renders last = highest z-index in `WindowManager`)

**`src/components/WindowManager.jsx`** (modify)
- Pass `zIndex: index + 10` to each `<Window>` based on its position in the `windows` array (focused is last = highest)

---

### Phase 5 — App SDK: createApp and useWindow

**Goal:** PaintBox registers itself as an app via the SDK. App developers get a clean contract.

**Files to create:**

**`src/sdk/createApp.js`**
```js
export function createApp({ id, title, icon, component, defaultSize, minSize, capabilities }) {
  return { id, title, icon, component, defaultSize, minSize, capabilities }
}
```
This is a plain factory — no magic. Its value is enforcing the manifest shape.

**`src/sdk/index.js`**
```js
export { createApp } from './createApp'
export { useWindow } from '../contexts/WindowContext'
```

**`src/apps/paint/index.js`** (new file)
- Move `PaintBox.jsx` and its siblings into `src/apps/paint/`
- Call `createApp({ id: 'paint', title: 'Paint', icon: paint98, component: PaintBox, defaultSize: { width: 600, height: 420 } })`
- Export the manifest

**`src/App.jsx`** (modify)
- Import paint manifest and pass to `registerApp` inside `OSProvider` bootstrap

**`src/components/MenuBar.jsx`** (rebuild)

Replace the stub with composable primitives (no Radix dependency — pure React + 98.css):

```
MenuBar — wrapper div with .menu-bar className
MenuBarMenu — manages open/close state for one menu
MenuBarTrigger — the clickable label (File, Edit, etc.)
MenuBarContent — the dropdown panel, positioned below trigger
MenuBarItem — a single menu item, calls onClick
MenuBarSeparator — a <hr> divider
```

Wire the existing Paint menu structure (commented out in `PaintBox.jsx`) into these primitives.

**`src/apps/paint/PaintBox.jsx`** (modify)
- Uncomment and rewire the `<MenuBar>` block using the new primitives
- Use `useWindow()` from the SDK for any window-level actions (e.g., setTitle when saving)

---

### Phase 6 — Multi-instance and polish

**Goal:** Multiple windows of the same app can be open simultaneously. Launch behavior is correct.

**`src/contexts/OSContext.jsx`** (modify)
- `launchApp` already creates a new instance per call (Phase 1 design). Verify there is no guard preventing duplicate `appId`s in `windows`.
- Offset successive instances so they don't stack exactly: `position: { x: 80 + windows.length * 20, y: 60 + windows.length * 20 }`

**`src/components/Desktop.jsx`** (modify)
- Change icon click from `onClick` to `onDoubleClick` to match Win95 convention
- Add single-click selection state (highlights the icon) — purely visual, no action

**`src/components/Taskbar.jsx`** (modify)
- When multiple instances of the same app are open, each gets its own button showing `title` (which may include the document name set via `setTitle`)
- Truncate long titles with `text-overflow: ellipsis`

**`src/components/Window.jsx`** (modify)
- Min-size constraint: don't let dragging or future resize go below `manifest.minSize`
- Title bar double-click → `maximizeWindow` / `restoreWindow` toggle (Win95 behavior)

---

## File map after all phases

```
src/
  main.jsx                         — unchanged
  App.jsx                          — OSProvider + Desktop + WindowManager + Taskbar only
  App.css                          — trimmed to only truly global overrides
  index.css                        — unchanged

  contexts/
    OSContext.jsx                  — NEW: registeredApps, windows, all OS actions
    WindowContext.jsx              — NEW: per-instance context, useWindow()

  components/
    Desktop.jsx                    — NEW: icon grid, launchApp on double-click
    WindowManager.jsx              — NEW: filter + render non-minimized windows
    Taskbar.jsx                    — RENAMED + refactored from StartBar.jsx
    Window.jsx                     — REFACTORED: WindowContext provider, data-driven pos/size
    MenuBar.jsx                    — REBUILT: composable primitives
    StatusBar.jsx                  — unchanged stub

  sdk/
    createApp.js                   — NEW: manifest factory
    index.js                       — NEW: public exports (createApp, useWindow)

  apps/
    paint/
      index.js                     — NEW: createApp manifest
      PaintBox.jsx                 — MOVED from components/paint-box/
      PaintCanvas.jsx              — MOVED
      Toolbar.jsx                  — MOVED
      ColorPalette.jsx             — MOVED
```

---

## What to leave alone

- `PaintCanvas.jsx` internals — the p5/RYB architecture is solid. No changes beyond the move.
- `index.css` — font faces, CSS custom properties, body background are correct.
- `98.css` — provides all the Win95 chrome styling. Don't fight it.
- `StatusBar.jsx` — stub is fine until an app actually needs dynamic fields.
