import arrow from "@/assets/icons/app-arrow.jpg";
import paint from "@/assets/icons/paint-98.svg";
import { PaintBox } from "./components/paint-box/PaintBox";
import { Window } from "./components/Window";
import { StartBar } from "./components/StartBar";
import { useEffect } from "react";
import { OSProvider, useOS } from "./components/OSContext";
import "./App.css";

// let apps = [
//   {
//     name: 'Paint',
//     icon: paint,
//     open: false, //false > closed
//     minimized: false,
//     maximized: false,
//     comp: PaintBox,
//     // menubar: {
//     //   File: ['New', 'Open', 'Save', 'Save As', 'Exit'],
//     //   Edit: ['Undo', 'Cut', 'Copy', 'Paste', 'Clear', 'Select All'],
//     //   View: ['Zoom In', 'Zoom Out', 'Default Zoom', 'Full Screen'],
//     //   Image: ['Flip/Rotate', 'Stretch/Skew', 'Invert Colors', 'Attributes'],
//     //   Options: ['Edit Colors'],
//     //   Help: ['View Help', 'About Paint'],
//     // }
//     //windowSize, windowPosition, etc. could go here too
//   },
// ];

// export default function App() {
// 	const [currentApps, setCurrentApps] = useState(apps);
// 	currentApps.map((app) => console.log(app.name, app.open)) // for testing

// function handleAppUpdate(name, changes) {
// 	setCurrentApps((prev) =>
// 		prev.map((app) => (app.name === name ? { ...app, ...changes } : app)),
// 	);
// }

// 	function handleOpen(icon_app) {
// 		handleAppUpdate(icon_app.name, { open: true, minimized: false });
// 	}

function AppsManager() {
  const {registeredApps, registerApp} = useOS();

  const apps = [{
    id: `palooza.paint`,
    name: 'Paint', 
    icon: paint, 
    comp: PaintBox,
    defaultSize: { width: 600, height: 200 }
  }];

  useEffect(() => {
    for (let app of apps) {
      if (!registeredApps().get(app.id)) registerApp(app);
    }
  }, [])
  return ``
}

function Desktop() {
  const {registeredApps, launch} = useOS();
  const elements = [];
  registeredApps().forEach((app, id) => {
    elements.push(
      <button
        type="button"
        className="app-btn"
        onClick={() => launch(id)}
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
    <OSProvider>
      <AppsManager />
      <Desktop />
      <WindowManager />
      <StartBar />
    </OSProvider>
  );
}
