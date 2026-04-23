import arrow from "@/assets/icons/app-arrow.jpg";
import paint from "@/assets/icons/paint-98.svg";
import { PaintBox } from "./components/paint-box/PaintBox";
import { StartBar } from "./components/StartBar";
import { useState } from "react";
import "./App.css";

let apps = [
  {
    name: 'Paint',
    icon: paint,
    open: false, //false > closed
    minimized: false,
    maximized: false,
    comp: PaintBox,
    //windowSize, windowPosition, etc. could go here too
  },
];


export default function App() {
	const [currentApps, setCurrentApps] = useState(apps);
	currentApps.map((app) => console.log(app.name, app.open)) // for testing

function handleAppUpdate(name, changes) {
	setCurrentApps((prev) =>
		prev.map((app) => (app.name === name ? { ...app, ...changes } : app)),
	);
}

	function handleOpen(icon_app) {
		handleAppUpdate(icon_app.name, { open: true, minimized: false });
	}

	return (
    <div>
      <div className="app-icons">
        {currentApps.map((app) => {
          console.log('current app: ', app);
          return (
            <button
              type="button"
              className="app-btn"
              onClick={() => handleOpen(app)}
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
        })}
      </div>

      {currentApps.map((app) =>
        app.open ? (
          <app.comp key={app.name} app={app} onUpdate={handleAppUpdate} />
        ) : null,
      )}

      <StartBar onUpdate={handleAppUpdate} apps={currentApps} />
    </div>
  );
}
