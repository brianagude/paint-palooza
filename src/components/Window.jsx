import { createContext, useContext, useState } from "react";
import { useOS } from "./OS";

import paint from "@/assets/icons/paint-98.svg";

const WindowContext = createContext(null);

export function Window({ instanceId }) {
  let {minimize: minimizeWindow, maximize: maximizeWindow, restore: restoreWindow, focus: focusWindow, close: closeWindow, openWindows, registeredApps} = useOS();

  const window = openWindows.get(instanceId);
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
            <button type="button" aria-label="Minimize" onClick={() => minimize(instanceId)}></button>
            <button type="button" aria-label="Maximize" onClick={() => maximize(instanceId)}></button>
            <button type="button" aria-label="Close" onClick={() => close(instanceId)}></button>
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

  return {
    c
  };
}