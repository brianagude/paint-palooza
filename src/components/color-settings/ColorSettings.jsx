import { P5Canvas } from "@p5-wrapper/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ryb2rgb } from "rybitten";
import { cubes } from "rybitten/cubes";
import { ColorSettingsContext } from "@/context/ColorSettingsContext";
import { StatusBar } from "../StatusBar";

export function ColorSettings() {
	const [colorSpace, setColorSpace] = useState("itten");
	const colorRef = useRef(cubes.get(colorSpace).cube);

	useEffect(() => {
		colorRef.current = cubes.get(colorSpace).cube;
	}, [colorSpace]);

	const LANDMARKS = [
		[0, 0, 0],
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[1, 0, 1],
		[0, 1, 1],
		[1, 1, 1],
	];

	function lerp3D(p0, p1, t) {
		return [
			p0[0] + (p1[0] - p0[0]) * t,
			p0[1] + (p1[1] - p0[1]) * t,
			p0[2] + (p1[2] - p0[2]) * t,
		];
	}

	function curr_ryb2rgb(r,y,b) {
		return ryb2rgb([r,y,b], {
			cube: colorRef.current
		});
	}

	function rybToRgbString([r, y, b]) {
		const [cr, cg, cb] = ryb2rgb([r, y, b], {
			cube: cubes.get(colorSpace).cube,
		});
		return `rgb(${Math.round(cr * 255)}, ${Math.round(cg * 255)}, ${Math.round(cb * 255)})`;
	}

	function rgbToHex(r, g, b) {
		const toHex = (n) => {
			n = Math.round(n);
			n = Math.max(0, Math.min(255, n));
			return n.toString(16).padStart(2, "0").toUpperCase();
		};
		return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}

	function rybToRgbHex([r, y, b]) {
		const [cr, cg, cb] = ryb2rgb([r, y, b], {
			cube: cubes.get(colorSpace).cube,
		});
		return rgbToHex(
			Math.round(cr * 255),
			Math.round(cg * 255),
			Math.round(cb * 255),
		);
	}

	const canvasParentRef = useRef(null);
	const [canvasSize, setCanvasSize] = useState([0, 0]); // You don't know real height yet
	const [p5, setP5] = useState(0);

	useLayoutEffect(() => {
		const { height, width } = canvasParentRef.current.getBoundingClientRect();
		setCanvasSize([width, height]); // Re-render now that you know the real height
		if (p5) {
			// console.log("resizing p5: ", width, height);
			p5.resizeCanvas(width, height);
		}
	}, [p5]);

	const [sketch] = useState(() => (p5) => {
		setP5(p5);

		function drawLine(p0, p1) {
			
			p5.push();
			p5.translate(-50,-50,-50);
			p5.scale(100);

			let n = 15; //segments / resolution

			
			let prev = p0;
			for (let i = 1; i <= n; i++) {
				const curr = lerp3D(p0, p1, i / n);
			

				let rgb = curr_ryb2rgb(...prev);
				p5.stroke(rgb[0]*255,rgb[1]*255,rgb[2]*255);
				p5.line(...prev, ...curr);
				prev = curr;
			}

			p5.pop();
		}

		p5.setup = () => {
			p5.createCanvas(canvasSize[0], canvasSize[1], p5.WEBGL);
			p5.frameRate(30);

			p5.fill(255);
			p5.strokeWeight(1);
		};

		p5.draw = () => {
			p5.clear();

			// Rotate Animation
			p5.rotateX(p5.frameCount * 0.01);
  		p5.rotateY(p5.frameCount * 0.01);

			// For each pair of landmarks, draw line
			for (let i = 0; i < LANDMARKS.length; i++) {
				for (let j = i+1; j < LANDMARKS.length; j++) {
					let p0 = LANDMARKS[i];
					let p1 = LANDMARKS[j];

					drawLine(curr_ryb2rgb(...p0), curr_ryb2rgb(...p1));
				}
			}
		};

		p5.mousePressed = () => {};

		p5.mouseDragged = () => {};

		p5.mouseReleased = () => {};
	});

	return (
		<ColorSettingsContext.Provider
			value={{
				colorSpace,
				setColorSpace,
			}}
		>
			<div className="window-body color-settings">
				{/* 
          To Do 
          (1) P5 Visualizations
          (2) App / Canvas resizing
        */}

				<fieldset>
					<legend>Landmarks</legend>
					<div className="landmarks-wrapper">
						{LANDMARKS.map((c, i) => {
							return (
								<div
									key={`button-${c[0]}-${c[1]}-${c[2]}-${i}`}
									className="landmark"
								>
									<button
										type="button"
										className="swatch-btn selected"
										style={{ background: rybToRgbString(c) }}
									/>

									<span>{rybToRgbHex(c)}</span>
								</div>
							);
						})}
					</div>
				</fieldset>

				<fieldset ref={canvasParentRef}>
					<legend>Visualization</legend>
					<P5Canvas sketch={sketch} />
				</fieldset>

				<fieldset className="full-width">
					<legend>Color Cube</legend>
					<div className="sunken-panel">
						<table className="">
							<thead>
								<tr>
									<th>Name</th>
									<th>Author</th>
									<th>Year</th>
								</tr>
							</thead>
							<tbody>
								{[...cubes].map(([key, cube]) => (
									<tr
										key={key}
										value={key}
										onClick={() => setColorSpace(key)}
										className={colorSpace === key ? "highlighted" : ""}
									>
										<td>{cube.title}</td>
										<td>{cube.author}</td>
										<td>{cube.year}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</fieldset>
			</div>

			<StatusBar />
		</ColorSettingsContext.Provider>
	);
}
