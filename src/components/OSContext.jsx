import { createContext, useContext, useEffect, useState } from "react";

const OSContext = createContext(null);

export function OSProvider({ apps, children }) {
  const [registeredApps, setAppsMap] = useState(new Map());
  const [openWindows, setOpenWindows] = useState(new Map());

  function registerApp(manifest) {
    setAppsMap(prev => new Map(prev.set(manifest.id, manifest)));
  }

  function launch(appId) {
    const manifest = registeredApps.get(appId);

    const instanceId = crypto.randomUUID();
    const newWindow = {
      appId: appId,
      title: manifest.name,
      isMinimized: false,
      isMaximized: false,
      isFocused: true,
      position: { x: 100, y: 100 },
      size: manifest.defaultSize
    }

    setOpenWindows(prev => new Map(prev.set(instanceId, newWindow)));

    return instanceId;
  }

  function close(instanceId) {
    setOpenWindows(prev => {
      prev.delete(instanceId);
      return new Map(prev);
    });
  }

  function minimize(instanceId) {
    setOpenWindows(prev => 
      new Map(prev.set(instanceId, { 
        ...prev.get(instanceId), 
        isMinimized: true,
        isFocused: false }
      )
    ));
  }

  function restore(instanceId) {
    setOpenWindows(prev => 
      new Map(prev.set(instanceId, { 
        ...prev.get(instanceId), 
        isMinimized: false,
        isFocused: true }
      )
    ));
  }

  function focus(instanceId) {
    setOpenWindows(prev => {
      const updated = new Map(prev);
      const targetWindow = updated.get(instanceId);
      if (targetWindow) {
        // Unfocus all windows
        for (let [id, win] of updated) {
          updated.set(id, { ...win, isFocused: false });
        }
        // Focus the target window
        updated.set(instanceId, { ...targetWindow, isFocused: true });
      }
      return updated;
    });
  }

  function maximize(instanceId) {
    setOpenWindows(prev => 
      new Map(prev.set(instanceId, { 
        ...prev.get(instanceId), 
        isMaximized: !prev.get(instanceId).isMaximized
      }))
    );
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