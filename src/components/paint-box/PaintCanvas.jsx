import { P5Canvas } from "@p5-wrapper/react";
import { useEffect, useRef, useState } from "react";
import { ryb2rgb } from "rybitten";
import { cubes } from "rybitten/cubes";
import { usePaint } from "./PaintBox"

const W = 450;
const H = 280;
const PENCIL_WEIGHT = 2.25;
const ERASER_DIAMETER = 2.25;

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
	const { selectedTool, foregroundColor, backgroundColor, colorSpace } = usePaint();
	
	const rgbLayerRef = useRef(null);
	const rybDataLayerRef = useRef(null);
	const toolRef = useRef(selectedTool);
	const colorRef = useRef({
    foreground: foregroundColor,
    background: backgroundColor,
    cube: cubes.get(colorSpace).cube
	});
	
	useEffect(() => {
		colorRef.current.foreground = foregroundColor
		colorRef.current.background = backgroundColor
	}, [foregroundColor, backgroundColor]);
	
	useEffect(() => {
		colorRef.current.cube = cubes.get(colorSpace).cube
		rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
	}, [colorSpace]);
	
	const [sketch] = useState(() => (p5) => {
		function stampInk(x, y, diameter) {
			rybDataLayerRef.current.push();
			rybDataLayerRef.current.colorMode(p5.RGB, 255);
			rybDataLayerRef.current.noStroke();
			rybDataLayerRef.current.fill(
				colorRef.current.foreground[0] * 255,
				colorRef.current.foreground[1] * 255,
				colorRef.current.foreground[2] * 255,
				255,
			);
			rybDataLayerRef.current.circle(x, y, diameter);
			rybDataLayerRef.current.pop();
		}
		function stampErase(x, y, diameter) {
			rybDataLayerRef.current.push();
			rybDataLayerRef.current.colorMode(p5.RGB, 255);
			rybDataLayerRef.current.noStroke();
			rybDataLayerRef.current.fill(
				colorRef.current.erase[0] * 255,
				colorRef.current.erase[1] * 255,
				colorRef.current.erase[2] * 255,
				255,
			);
			rybDataLayerRef.current.circle(x, y, diameter);
			rybDataLayerRef.current.pop();
		}

		function applyStroke(_x0, _y0, x1, y1) {
			const tool = toolRef.current;

			if (tool === "eraser") {
				// eachAlongSegment(_x0, _y0, x1, y1, ERASER_DIAMETER * 0.38, (x, y) => {
				// 	if (x >= 0 && y >= 0 && x < W && y < H)
						stampErase(x1, y1, ERASER_DIAMETER);
				// });
				rebuildRgbFromRybData(rgbLayerRef, rybDataLayerRef, colorRef);
				return;
			}

			if (tool === "pencil") {
				//if (Math.hypot(x1 - _x0, y1 - _y0) < 0.5) {
				// eachAlongSegment(x1, y1, x1, y1, 1, (x, y) => {
				//   if (x >= 0 && y >= 0 && x < W && y < H)
				stampInk(x1, y1, PENCIL_WEIGHT * 1.2);
				// });
				//} else {
				//segmentPencil(_x0, _y0, x1, y1);
				//}
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

		p5.mouseDragged = () => {
			const x = p5.mouseX;
			const y = p5.mouseY;
			if (!pointerInCanvas(x, y) && !pointerInCanvas(p5.pmouseX, p5.pmouseY))
				return;
			applyStroke(p5.pmouseX, p5.pmouseY, x, y);
		};
	});

	return <P5Canvas sketch={sketch} />;
}
