import paint from "../assets/icons/paint-98.svg";

export function TitleBar() {
  return <div className="title-bar">
    <div className="icon-title">
      <img src={paint} alt="Paint Brushes Icon" />
      <p className="title-bar-text">untitled - Paint</p>
    </div>
    <div class="title-bar-controls">
      <button type="button" aria-label="Minimize"></button>
      <button type="button" aria-label="Maximize"></button>
      <button type="button" aria-label="Close"></button>
    </div>
  </div>
}