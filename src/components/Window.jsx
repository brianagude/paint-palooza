import paint from "@/assets/icons/paint-98.svg";
import { useOS } from "./OSContext";

export function Window({ instanceId }) {
  const {minimize, maximize, close, windows, registeredApps} = useOS();


  const window = windows().get(instanceId);
  const app = registeredApps().get(window.appId);

  return (
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
  );
}
