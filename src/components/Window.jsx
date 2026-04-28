import paint from "@/assets/icons/paint-98.svg";
import { StatusBar } from "./StatusBar";

export function Window({ app, onUpdate }) {
  function handleMinimize() {
    onUpdate(app.name, { minimized: true });
  }

  function handleClose() {
    onUpdate(app.name, { open: false });
  }

    function handleMaximize() {
    onUpdate(app.name, { maximized: !app.maximized });
  }


  return (
        <section
            className={`paint-box-window window ${app.maximized ? 'window--maximized' : ''} ${app.minimized ? 'window--minimized' : ''}`}
        >
            <div className="title-bar">
              <div className="icon-title">
                  <img src={paint} alt={`${app.name} Icon`} />
                  <p className="title-bar-text">untitled - ${app.name}</p>
              </div>
              <div className="title-bar-controls">
                  <button
                  type="button"
                  aria-label="Minimize"
                  onClick={handleMinimize}
                  ></button>
                  <button
                  type="button"
                  aria-label="Maximize"
                  onClick={handleMaximize}
                  ></button>
                  <button type="button" aria-label="Close" onClick={handleClose}></button>
              </div>
            </div>

            <div className="menu-bar">
              <p>File</p>
              <p>Edit</p>
              <p>View</p>
              <p>Image</p>
              <p>Options</p>
              <p>Help</p>
              {/* TODO: Add cube picker here — pass setCubeKey */}
            </div>
            
            <div className="window-body">
              <app.comp />
            </div>
            <StatusBar />
        </section>

  );
}
