import { P5Canvas } from "@p5-wrapper/react";
import { useEffect, useRef, useState } from "react";
import { ryb2rgb } from "rybitten";
import { cubes } from "rybitten/cubes";
import { usePaint } from "@/context/PaintBoxContext";

const W = 450;
const H = 280;
const ERASER_DIAMETER = 10;

function pointerInCanvas(x, y) {
	return x >= 0 && y >= 0 && x < W && y < H;
}

function rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef) {
	if (!rgbLayerRef.current || !rybDataLayerRef.current) return;
	rgbLayerRef.current.loadPixels();
	rybDataLayerRef.current.loadPixels();
	const px = rgbLayerRef.current.pixels;
	const src = rybDataLayerRef.current.pixels;
	for (let i = 0; i < px.length; i += 4) {
		const a = src[i + 3];
		const coords =
			a < 1 ? [0, 0, 0] : [src[i] / 255, src[i + 1] / 255, src[i + 2] / 255];
		const [r, g, b] = ryb2rgb(coords, { cube: colorRef.current.cube });
		px[i] = Math.round(r * 255);
		px[i + 1] = Math.round(g * 255);
		px[i + 2] = Math.round(b * 255);
		px[i + 3] = 255;
	}
	rgbLayerRef.current.updatePixels();
}


export function PaintCanvas() {
	const { selectedTool, foregroundColor, backgroundColor, colorSpace,  } = usePaint();
	
	const rgbLayerRef = useRef(null);
	const rybDataLayerRef = useRef(null);
	const toolRef = useRef(selectedTool);
	const colorRef = useRef({
    foreground: foregroundColor,
    background: backgroundColor,
    cube: cubes.get(colorSpace).cube
	});
	
	useEffect(() => {
		toolRef.current = selectedTool
	}, [selectedTool]);
	
	useEffect(() => {
		colorRef.current.foreground = foregroundColor
		colorRef.current.background = backgroundColor
	}, [foregroundColor, backgroundColor]);
	
	useEffect(() => {
		colorRef.current.cube = cubes.get(colorSpace).cube
		rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
	}, [colorSpace]);
	
	const [sketch] = useState(() => (p5) => {
		function strokeInk(x0, y0, x1, y1, diameter, color=colorRef.current.foreground) {
			rybDataLayerRef.current.push();
			rybDataLayerRef.current.colorMode(p5.RGB, 255);
			rybDataLayerRef.current.stroke(
				color[0] * 255,
				color[1] * 255,
				color[2] * 255,
				255,
			);
			rybDataLayerRef.current.strokeWeight(diameter);
			rybDataLayerRef.current.line(x0, y0, x1, y1);
			rybDataLayerRef.current.pop();
		}

		//TOOLS: brush, pencil, eraser, spray...
		//_x0, _y0 are last point (TODO: needs fix in mouseDragged)
		function applyStroke(_x0, _y0, x1, y1) {
			const tool = toolRef.current;

			if (tool === "eraser") {
				strokeInk(_x0, _y0, x1, y1, ERASER_DIAMETER, colorRef.current.background);
				rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
				return;
			}

			if (tool === "pencil") {
				strokeInk(_x0, _y0, x1, y1, 1);
				rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
				return;
			}

			// if (tool === "brush") {
			//   eachAlongSegment(_x0, _y0, x1, y1, BRUSH_DIAMETER * 0.35, (x, y) => {
			//     if (x >= 0 && y >= 0 && x < W && y < H) stampInk(x, y, BRUSH_DIAMETER);
			//   });
			//   rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
			//   return;
			// }

			// if (tool === "spray") {
			//   segmentSpray(_x0, _y0, x1, y1);
			//   rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
			// }
		}


		//TOOLS: rectangle(shape), polygon, select...
		let anchor = undefined;
		let dataLayerSaved = undefined; //TODO: Flesh into undo feature

		function shapePreview(anchor, x, y) {
			//Clear out any previous previews, resetting the canvas displayed to the latest saved state
			rybDataLayerRef.current.image(dataLayerSaved, 0, 0);

			//Then draw preview
			const color = colorRef.current.foreground;

			rybDataLayerRef.current.push();
			rybDataLayerRef.current.colorMode(p5.RGB, 255);
			rybDataLayerRef.current.stroke(
				color[0] * 255,
				color[1] * 255,
				color[2] * 255,
				255,
			);
			rybDataLayerRef.current.strokeWeight(1);
			rybDataLayerRef.current.noFill();
			rybDataLayerRef.current.rectMode(p5.CORNERS);
			rybDataLayerRef.current.rect(anchor.x, anchor.y, x, y);
			rybDataLayerRef.current.pop();

			rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
		}

		function drawShape(anchor, x, y) {

		}

		p5.setup = () => {
			p5.createCanvas(W, H);
			console.log('cube at setup time:', colorRef.current.cube)

			rgbLayerRef.current = p5.createGraphics(W, H);
			rybDataLayerRef.current = p5.createGraphics(W, H);
			rgbLayerRef.current.pixelDensity(1);
			rybDataLayerRef.current.pixelDensity(1);

			//clearRYBDataLayer();
			rybDataLayerRef.current.background(
				colorRef.current.background[0] * 255,
				colorRef.current.background[1] * 255,
				colorRef.current.background[2] * 255,
				255,
			);

			rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);

			p5.imageMode(p5.CORNER);
		};

		p5.draw = () => {
			p5.image(rgbLayerRef.current, 0, 0);
		};

		p5.mousePressed = () => {
			//Reference for when we flesh out undo: https://stackoverflow.com/questions/71231952/why-does-this-undo-logic-not-work-in-p5-js
			rybDataLayerRef.current.loadPixels();
			dataLayerSaved = rybDataLayerRef.current.get();
		}

		p5.mouseDragged = () => {
			const tool = toolRef.current;

			const x = p5.mouseX;
			const y = p5.mouseY;

			switch(tool) {
				case "rectangle":
					// if anchor is not defined, set anchor to x,y
					if (!anchor) {
						anchor = {x, y};
					}
					console.log(anchor)
					shapePreview(anchor, x, y);
					break;

				case "pencil":
				case "brush":
				case "eraser":
					//TODO: Fix x0,y0 and x1,y1 logic. Currently appears as if only the current coords are passed to applyStroke
					if (!pointerInCanvas(x, y) && !pointerInCanvas(p5.pmouseX, p5.pmouseY))
						return;
					applyStroke(p5.pmouseX, p5.pmouseY, x, y);
					break;

				default:
					break;
			}

		};

		p5.mouseReleased = () => {
			const tool = toolRef.current;

			const x = p5.mouseX;
			const y = p5.mouseY;

			switch(tool) {
				case "rectangle":
					// drawShape(anchor, curr)
					if (anchor) {
						anchor = undefined;
					}
					break;

				default:
					break;
			}
		}
	});

	return <P5Canvas sketch={sketch} />;
}
