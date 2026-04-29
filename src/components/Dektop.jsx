import {useOS} from "./OSContext"
import arrow from "@/assets/icons/app-arrow.jpg";
import "../App.css";

export function Desktop() {
  const {registeredApps, launch} = useOS();
  const elements = [];
  registeredApps.forEach((app, id) => {
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