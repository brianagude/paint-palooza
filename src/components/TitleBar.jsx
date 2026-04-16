import { useRef } from "react";
import paint from "@/assets/icons/paint-98.svg";

export function TitleBar() {
	const barRef = useRef(null);

	function getWindow() {
		return barRef.current?.closest(".window");
	}

	// --- Button handlers ---
	function handleMinimize() {
		getWindow()?.classList.toggle("window--minimized");
	}

	function handleMaximize() {
		getWindow()?.classList.toggle("window--maximized");
	}

	function handleClose() {
		getWindow()?.classList.add("window--closed");
	}

	return (
		<div className="title-bar" ref={barRef}>
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
