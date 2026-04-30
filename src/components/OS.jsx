import { createContext, useContext, useEffect, useState } from "react";

const OSContext = createContext(null);

export function OS({ apps, children }) {
  const [registeredApps, setAppsMap] = useState(new Map());
  const [openWindows, setOpenWindows] = useState(new Array());

  function registerApp(manifest) {
    setAppsMap(prev => new Map(prev.set(manifest.id, manifest)));
  }

  function launch(appId) {
    const manifest = registeredApps.get(appId);
    const timestamp = Date.now();

    const id = crypto.randomUUID();
    const newWindow = {
      appId: appId,
      launchTime: timestamp,
      instanceId: id,
      title: id,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      position: { x: 100, y: 100 },
      size: manifest.defaultSize
    }

    setOpenWindows(prev => [...prev, newWindow]);
    focus(newWindow.instanceId);//TODO: This is an async race condition
  }

  function close(instanceId) {
    setOpenWindows(prev => 
      prev.filter(w => w.instanceId != instanceId)
    );
  }

  function minimize(instanceId) {
    setOpenWindows(prev => {
      const mod = prev.map(w => w.instanceId === instanceId
        ? {...w, isMinimized: true, isFocused: false}
        : w)  
      return mod;
    });

    let next = openWindows.filter(w => !w.isMinimized).at(-1);
    if (next) focus(next.instanceId);
  }

  function restore(instanceId) {
    setOpenWindows(prev => 
      prev.map(w => w.instanceId === instanceId
        ? {...w, isMinimized: false}
        : w)
    );
    focus(instanceId); //TODO: This is an async race condition
  }

  function focus(instanceId) {
    setOpenWindows(prev => {
      const targetIndex = prev.findIndex(w => w.instanceId === instanceId);
      const targetWindow = prev[targetIndex];
      const rest = prev.filter(w => w.instanceId != instanceId).map(w => ({...w, isFocused: false}));

      return [
        ...rest,
        {...targetWindow, isFocused: true}
      ]
    });
  }

  function maximize(instanceId) {
    setOpenWindows(prev => 
      prev.map(w => w.instanceId === instanceId
        ? {...w, isMaximized: !w.isMaximized}
        : w)
    );
    focus(instanceId);//TODO: This is an async race condition
  }
  
  useEffect(() => {
    apps.forEach(registerApp);
  }, [])

  return (
    <OSContext.Provider value={{ 
      registeredApps, registerApp, openWindows,
      launch, minimize, maximize, close, restore, focus
      }}>
      {children}
    </OSContext.Provider>
  );
}

export function useOS() {
  return useContext(OSContext);
}