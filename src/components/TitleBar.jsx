import paint from "@/assets/icons/paint-98.svg";

export function TitleBar({ app, onUpdate }) {
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
    <div className="title-bar">
      <div className="icon-title">
        <img src={paint} alt="Paint Brushes Icon" />
        <p className="title-bar-text">untitled - Paint</p>
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
  );
}
