import arrow from "@/assets/icons/app-arrow.jpg";
import paint from "@/assets/icons/paint-98.svg";
import { PaintBox } from "./components/paint-box/PaintBox";
import { Window } from "./components/Window";
import { StartBar } from "./components/StartBar";
import { useEffect } from "react";
import { OSProvider, useOS } from "./components/OSContext";
import "./App.css";

const apps = [{
  id: `palooza.paint`,
  name: 'Paint', 
  icon: paint, 
  comp: PaintBox,
  defaultSize: { width: 600, height: 200 }
}];

function Desktop() {
  const {registeredApps, launch} = useOS();
  const elements = [];
  registeredApps().forEach((app, id) => {
    elements.push(
      <button
        type="button"
        className="app-btn"
        onDoubleClick={() => launch(id)}
      >
        <div>
          <img
            src={app.icon}
            alt={app.name + ' Icon'}
            className="app-icon"
          />
          <img src={arrow} alt="Arrow Icon" className="app-icon-arrow" />
        </div>
        <p className="app-title">{app.name}</p>
      </button>
    );
  });
  return (
    <div className="app-icons">
      {elements}
    </div>
  )
}

function WindowManager() {
  const {windows} = useOS();
  const elements = [];

  windows().forEach((window, instanceId) => {
    if (!window.isMinimized) {
      elements.push(<Window key={instanceId} instanceId={instanceId} />);
    }
  });

  return elements;
}

export default function App() {
  
	return (
    <OSProvider apps={apps}>
      <Desktop />
      <WindowManager />
      <StartBar />
    </OSProvider>
  );
}
