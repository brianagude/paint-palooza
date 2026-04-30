import { createContext, useContext, useState } from "react";
import { useOS } from "./OS";

import paint from "@/assets/icons/paint-98.svg";

const WindowContext = createContext(null);

export function Window({ instanceId }) {
  let {minimize: minimizeWindow, maximize: maximizeWindow, restore: restoreWindow, focus: focusWindow, close: closeWindow, openWindows, registeredApps} = useOS();
  
  const windowIndex = openWindows.findIndex( w => w.instanceId === instanceId );
  const window = openWindows[windowIndex];
  const app = registeredApps.get(window.appId);

  const minimize = () => minimizeWindow(instanceId);
  const maximize = () => maximizeWindow(instanceId);
  const restore = () => restoreWindow(instanceId);
  const focus = () => focusWindow(instanceId);
  const close = () => closeWindow(instanceId);
  
  const [title, setTitle] = useState(window.title);
  const isMinimized = window.isMinimized;
  const isMaximized = window.isMaximized;
  const isFocused = window.isFocused;

  const position = window.position;
  const size = window.size;
  const zIndex = windowIndex;

  const style = isMaximized
  ? { position: 'fixed', top: 0, left: 0, width: '100%', height: 'calc(100vh - 28px)', zIndex }
  : { position: 'fixed', top: position.y, left: position.x, width: size.width, height: size.height, zIndex }

  return (
    <WindowContext.Provider value={{
      instanceId, title, setTitle, isMinimized, isMaximized, isFocused, position, size,
      minimize, maximize, restore, focus, close
      }}>
      <section className={`paint-box-window window ${window.isMaximized ? 'window--maximized' : ''}`}>
        <div className="title-bar">
          <div className="icon-title">
            <img src={paint} alt={`${app.name} Icon`} />
            <p className="title-bar-text">{window.title}</p>
          </div>
          <div className="title-bar-controls">
            <button type="button" aria-label="Minimize" onClick={minimize}></button>
            <button type="button" aria-label="Maximize" onClick={maximize}></button>
            <button type="button" aria-label="Close" onClick={close}></button>
          </div>
        </div>

        <app.comp />
    </section>
  </WindowContext.Provider>
  );
}

export function useWindow() {
  const c = useContext(WindowContext);
  if (!c) throw new Error("Trying to use context outside provider.");

  return c;
}