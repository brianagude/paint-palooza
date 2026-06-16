import { createContext, useContext, useState } from "react";
import paint from "@/assets/icons/paint-98.svg";
import { useOS } from "./OS";

const WindowContext = createContext(null);

export function Window({ instanceId }) {
	const {
		minimize: minimizeWindow,
		maximize: maximizeWindow,
		restore: restoreWindow,
		focus: focusWindow,
		close: closeWindow,
		move,
		openWindows,
		registeredApps,
	} = useOS();

	const windowIndex = openWindows.findIndex((w) => w.instanceId === instanceId);
	const window = openWindows[windowIndex];
	const app = registeredApps.get(window.appId);

	const minimize = () => minimizeWindow(instanceId);
	const maximize = () => maximizeWindow(instanceId);
	const restore = () => restoreWindow(instanceId);
	const focus = () => focusWindow(instanceId);
	const close = () => closeWindow(instanceId);

	const [title, setTitle] = useState(window.title);
	const isMinimized = window.isMinimized;
	const isMaximized = window.isMaximized;
	const isFocused = window.isFocused;

	const position = window.position;
	const size = window.size;
	const zIndex = windowIndex;

	const style = isMaximized
		? {
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "calc(100vh - 28px)",
				zIndex,
			}
		: {
				position: "fixed",
				top: position.y,
				left: position.x,
				width: size.width,
				zIndex,
			};

	function startDrag(e) {
		e.dataTransfer.effectAllowed = "none";

		self.drag = { og: {}, start: {} };

		self.drag.og.x = position.x;
		self.drag.og.y = position.y;

		self.drag.start.x = e.clientX;
		self.drag.start.y = e.clientY;
	}

	function drag(e) {
		e.preventDefault();
		if (e.screenX === 0) {
			return;
		}

		self.drag.dx = e.clientX - self.drag.start.x;
		self.drag.dy = e.clientY - self.drag.start.y;

		console.log("move: ", self.drag, {
			x: self.drag.og.x + self.drag.dx,
			y: self.drag.og.y + self.drag.dy,
		});
		move(instanceId, {
			x: self.drag.og.x + self.drag.dx,
			y: self.drag.og.y + self.drag.dy,
		});
	}

	return (
		<WindowContext.Provider
			value={{
				instanceId,
				title,
				setTitle,
				isMinimized,
				isMaximized,
				isFocused,
				position,
				size,
				minimize,
				maximize,
				restore,
				focus,
				close,
			}}
		>
			<section className={`app-window window`} style={style}>
				<div
					className="title-bar"
					draggable="true"
					onDragStart={startDrag}
					onDrag={drag}
					ondragover={(e) => {
						e.preventDefault();
						e.dataTransfer.dropEffect = "move";
					}}
					ondrop={(e) => {
						e.preventDefault();
						return true;
					}}
				>
					<div className="icon-title">
						<img src={paint} alt={`${app.name} Icon`} />
						<p className="title-bar-text">{app.name}</p>
					</div>
					<div className="title-bar-controls">
						<button
							type="button"
							aria-label="Minimize"
							onClick={minimize}
						></button>
						<button
							type="button"
							aria-label="Maximize"
							onClick={maximize}
						></button>
						<button type="button" aria-label="Close" onClick={close}></button>
					</div>
				</div>

				<app.comp />
			</section>
		</WindowContext.Provider>
	);
}

export function useWindow() {
	const c = useContext(WindowContext);
	if (!c) throw new Error("Trying to use context outside provider.");

	return c;
}
