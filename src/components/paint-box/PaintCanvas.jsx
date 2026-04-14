import { P5Canvas } from "@p5-wrapper/react";
import { useRef } from "react";
import { ryb2rgb } from "rybitten";

/* --------- TODO: Rename this? --------- */
export function PaintCanvas({ toolState, colorState }) {
	const rgbLayerRef = useRef(null);
	const rybDataLayerRef = useRef(null);

	const W = 450;
	const H = 280;

	const PENCIL_WEIGHT = 2.25;

	function rebuildRgbFromRybData() {
		if (!rgbLayerRef.current || !rybDataLayerRef.current) return;
		rgbLayerRef.current.loadPixels();
		rybDataLayerRef.current.loadPixels();
		const px = rgbLayerRef.current.pixels;
		const src = rybDataLayerRef.current.pixels;
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
		rgbLayerRef.current.updatePixels();
	}

	function pointerInCanvas(x, y) {
		return x >= 0 && y >= 0 && x < W && y < H;
	}

	function sketch(p5) {
		function stampInk(x, y, diameter) {
			rybDataLayerRef.current.push();
			rybDataLayerRef.current.colorMode(p5.RGB, 255);
			rybDataLayerRef.current.noStroke();
			rybDataLayerRef.current.fill(
				colorState.brushRyb[0] * 255,
				colorState.brushRyb[1] * 255,
				colorState.brushRyb[2] * 255,
				255,
			);
			rybDataLayerRef.current.circle(x, y, diameter);
			rybDataLayerRef.current.pop();
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

			rgbLayerRef.current = p5.createGraphics(W, H);
			rybDataLayerRef.current = p5.createGraphics(W, H);
			rgbLayerRef.current.pixelDensity(1);
			rybDataLayerRef.current.pixelDensity(1);

			rybDataLayerRef.current.background(0, 0, 0, 0); //clearRYBDataLayer();
			rebuildRgbFromRybData();

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
	}

	return <P5Canvas sketch={sketch} />;
}
