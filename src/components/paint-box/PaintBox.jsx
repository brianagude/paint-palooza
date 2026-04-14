import { useEffect, useState } from "react";
import { ryb2rgb } from "rybitten";
import { cubes, RYB_ITTEN } from "rybitten/cubes";
import { StatusBar } from "../StatusBar";
import { TitleBar } from "../TitleBar";
import { ColorPalette } from "./ColorPalette";
import { PaintCanvas } from "./PaintCanvas";
import { Toolbar } from "./Toolbar";

const colorState = {
	cubeKey: "itten",
	cube: RYB_ITTEN,
	brushRyb: [0.85, 0.2, 0.15],
};

const toolState = {
	active: "pencil",
};

export function PaintBox() {
	const [selectedTool, setSelectedTool] = useState("pencil");
	const [selectedSwatch, setSelectedSwatch] = useState([0, 0, 0]);
	// const [selectedCube, setSelectedCube] = useState(RYB_ITTEN);

	useEffect(() => {
		toolState.active = selectedTool;
	}, [selectedTool]);

	useEffect(() => {
		colorState.brushRyb = selectedSwatch;
	}, [selectedSwatch]);

	// useEffect(() => {
	// 	// colorState.cube = selectedSwatch;
	// 	// colorState.cube = selectedCube;
	// }, [selectedSwatch]);

	return (
		<section className="paint-box-window window">
			<TitleBar />
			<div className="menu-bar">
				<p>File</p>
				<p>Edit</p>
				<p>View</p>
				<p>Image</p>
				<p>Options</p>
				<p>Help</p>
				{/* Add the Color Space picker here, pass currently selected item to paint canvas */}
			</div>
			<div className="window-body">
				<Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />

				{/* PaintCanvas controls toolbar, canvas, and color palette */}
				<PaintCanvas toolState={toolState} colorState={colorState} /> 

				{/* TODO: Push array of colors to color palette */}
				<ColorPalette
					cube={colorState.cube}
					onSelectSwatch={setSelectedSwatch}
					currentColor={selectedSwatch}
				/>
			</div>
			<StatusBar />
		</section>
	);
}