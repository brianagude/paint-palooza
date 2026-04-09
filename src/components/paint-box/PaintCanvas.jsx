import { P5Canvas } from "@p5-wrapper/react";
import { useEffect, useState } from "react";
import { ryb2rgb } from "rybitten";
import { cubes, RYB_ITTEN } from "rybitten/cubes";
import { ColorPalette } from "./ColorPalette";
import { Toolbar } from "./Toolbar";

let rybDataLayer; //TODO: Setup as p5.Graphics and initialize with white background
let rgbLayer;

const W = 450;
const H = 280;

const PENCIL_WEIGHT = 2.25;

const colorState = {
	cubeKey: "itten",
	cube: RYB_ITTEN,
	brushRyb: [0.85, 0.2, 0.15],
};

const toolState = {
	active: "pencil",
};

function rebuildRgbFromRybData() {
	if (!rgbLayer || !rybDataLayer) return;
	rgbLayer.loadPixels();
	rybDataLayer.loadPixels();
	const px = rgbLayer.pixels;
	const src = rybDataLayer.pixels;
	for (let i = 0; i < px.length; i += 4) {
		const a = src[i + 3];
		const coords =
			a < 1 ? [0, 0, 0] : [src[i] / 255, src[i + 1] / 255, src[i + 2] / 255];
		const [r, g, b] = ryb2rgb(coords, { cube: colorState.cube });
		px[i] = Math.round(r * 255);
		px[i + 1] = Math.round(g * 255);
		px[i + 2] = Math.round(b * 255);
		px[i + 3] = 255;
	}
	rgbLayer.updatePixels();
}

function pointerInCanvas(x, y) {
	return x >= 0 && y >= 0 && x < W && y < H;
}

function sketch(p5) {
	function stampInk(x, y, diameter) {
		rybDataLayer.push();
		rybDataLayer.colorMode(p5.RGB, 255);
		rybDataLayer.noStroke();
		rybDataLayer.fill(
			colorState.brushRyb[0] * 255,
			colorState.brushRyb[1] * 255,
			colorState.brushRyb[2] * 255,
			255,
		);
		rybDataLayer.circle(x, y, diameter);
		rybDataLayer.pop();
	}

	function applyStroke(x0, y0, x1, y1) {
		// const tool = "pencil";
		const tool = toolState.active;

		// if (tool === "eraser") {
		//   eachAlongSegment(x0, y0, x1, y1, ERASER_DIAMETER * 0.38, (x, y) => {
		//     if (x >= 0 && y >= 0 && x < W && y < H)
		//       stampErase(x, y, ERASER_DIAMETER);
		//   });
		//   rebuildRgbFromRybData();
		//   return;
		// }

		if (tool === "pencil") {
			//if (Math.hypot(x1 - x0, y1 - y0) < 0.5) {
			// eachAlongSegment(x1, y1, x1, y1, 1, (x, y) => {
			//   if (x >= 0 && y >= 0 && x < W && y < H)
			stampInk(x1, y1, PENCIL_WEIGHT * 1.2);
			// });
			//} else {
			//segmentPencil(x0, y0, x1, y1);
			//}
			rebuildRgbFromRybData();
			return;
		}

		// if (tool === "brush") {
		//   eachAlongSegment(x0, y0, x1, y1, BRUSH_DIAMETER * 0.35, (x, y) => {
		//     if (x >= 0 && y >= 0 && x < W && y < H) stampInk(x, y, BRUSH_DIAMETER);
		//   });
		//   rebuildRgbFromRybData();
		//   return;
		// }

		// if (tool === "spray") {
		//   segmentSpray(x0, y0, x1, y1);
		//   rebuildRgbFromRybData();
		// }
	}

	p5.setup = () => {
		p5.createCanvas(W, H);

		rgbLayer = p5.createGraphics(W, H);
		rybDataLayer = p5.createGraphics(W, H);
		rgbLayer.pixelDensity(1);
		rybDataLayer.pixelDensity(1);

		rybDataLayer.background(0, 0, 0, 0); //clearRYBDataLayer();
		rebuildRgbFromRybData();

		p5.imageMode(p5.CORNER);
	};

	p5.draw = () => {
		p5.image(rgbLayer, 0, 0);
	};

	p5.mouseDragged = () => {
		const x = p5.mouseX;
		const y = p5.mouseY;
		if (!pointerInCanvas(x, y) && !pointerInCanvas(p5.pmouseX, p5.pmouseY))
			return;
		applyStroke(p5.pmouseX, p5.pmouseY, x, y);
	};
}

/* --------- TODO: Rename this? --------- */
export function PaintCanvas() {
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
		<div className="window-body">
			<Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
			<P5Canvas sketch={sketch} />
			{/* TODO: Push array of colors to color palette */}
			<ColorPalette cube={colorState.cube} onSelectSwatch={setSelectedSwatch} currentColor={selectedSwatch} />
		</div>
	);
}
