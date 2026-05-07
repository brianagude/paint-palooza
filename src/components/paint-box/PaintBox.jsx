import { useState } from "react";
import { cubes } from "rybitten/cubes";
import { PaintBoxContext } from "@/context/PaintBoxContext";
import { MenuBar, MenuBarGroup, MenuBarItem } from "../MenuBar";
import { StatusBar } from "../StatusBar";
import { ColorPalette } from "./ColorPalette";
import { PaintCanvas } from "./PaintCanvas";
import { Toolbar } from "./Toolbar";

export function PaintBox() {
	const [selectedTool, setSelectedTool] = useState("pencil");
	const [foregroundColor, setForegroundColor] = useState([1, 1, 1]);
	const [backgroundColor, setBackgroundColor] = useState([0, 0, 0]);
	const [colorSpace, setColorSpace] = useState("itten");

	return (
		<PaintBoxContext.Provider
			value={{
				selectedTool,
				setSelectedTool,
				foregroundColor,
				setForegroundColor,
				backgroundColor,
				setBackgroundColor,
				colorSpace,
				setColorSpace,
			}}
		>
			<MenuBar>
				<MenuBarGroup title="Options">
					{[...cubes].slice(0, 4).map(([key, cube]) => (
						<MenuBarItem
							key={key}
							action={() => setColorSpace(key)}
							title={cube.title}
						/>
					))}
				</MenuBarGroup>
			</MenuBar>

			<div className="window-body">
				<Toolbar />
				<PaintCanvas />
				<ColorPalette />
			</div>
			<StatusBar />
		</PaintBoxContext.Provider>
	);
}