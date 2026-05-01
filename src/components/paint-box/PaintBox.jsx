import { createContext, useContext, useEffect, useRef, useState } from "react";
import { cubes, RYB_ITTEN } from "rybitten/cubes";
import { MenuBar, MenuBarGroup, MenuBarItem } from "../MenuBar";
import { StatusBar } from "../StatusBar";
import { ColorPalette } from "./ColorPalette";
import { PaintCanvas } from "./PaintCanvas";
import { Toolbar } from "./Toolbar";

const PaintBoxContext = createContext(null);

export function PaintBox() {
	// React state — drives UI re-renders (button highlights, swatch selection ring, etc.)
	const [selectedTool, setSelectedTool] = useState("pencil");
	const [selectedSwatch, setSelectedSwatch] = useState([0, 0, 0]);

	/* 
  ^^^ Claudiani suggested that we rethink using useState here. Below is why:
  But there's a problem: the actual drawing happens inside a p5.js sketch, which is not a React component. p5.js has its own draw() loop that runs 60 times per second. If PaintBox passed selectedTool as a prop to the canvas, the canvas would have to re-render every time you change tools — and re-creating a canvas is expensive.                                                                
                                                        
  The solution: Refs

  const toolRef = useRef({ active: 'pencil' })
  const colorRef = useRef({ cube: null, brushRyb: [0, 0, 0] })           
                                                                                                                                      
  Refs are like a box you can read and write without triggering a re-render. PaintBox syncs its state into refs using useEffect:                                                                                                                         
  useEffect(() => { toolRef.current.active = selectedTool }, [selectedTool]) 
                          
  Now the p5 sketch can read toolRef.current.active at draw time and always get the latest value — without React being involved.
*/

	// TODO: wire setCubeKey to a cube picker UI when that feature is built
	const [cubeKey, setCubeKey] = useState("itten");

	// Refs — stable mutable objects the p5 sketch reads at draw time.
	// Changing .current does NOT trigger re-renders, so the sketch stays alive.
	const toolRef = useRef({ active: "pencil" });
	const colorRef = useRef({ cube: RYB_ITTEN, brushRyb: [0, 0, 0] });

	// Sync React state → refs after each render.
	// The sketch always reads the latest value because refs are live objects.
	useEffect(() => {
		toolRef.current.active = selectedTool;
	}, [selectedTool]);
	useEffect(() => {
		colorRef.current.brushRyb = selectedSwatch;
	}, [selectedSwatch]);
	// Note: colorRef.current.cube is managed inside PaintCanvas's cube useEffect

	return (
		<PaintBoxContext.Provider
			value={{
				setCubeKey,
			}}
		>
			<MenuBar>
				<MenuBarGroup title="Options">
					{[...cubes].slice(0, 4).map(([key, cube]) => (
						<MenuBarItem
							key={key}
							action={() => setCubeKey(key)}
							title={cube.title}
						/>
					))}
				</MenuBarGroup>
			</MenuBar>

			<div className="window-body">
				<Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
				<PaintCanvas toolRef={toolRef} colorRef={colorRef} cubeKey={cubeKey} />
				<ColorPalette
					cubeKey={cubeKey}
					onSelectSwatch={setSelectedSwatch}
					currentColor={selectedSwatch}
				/>
			</div>

			<StatusBar />
		</PaintBoxContext.Provider>
	);
}

export function usePaint() {
	const c = useContext(PaintBoxContext);
	if (!c) throw new Error("Trying to use context outside provider.");

	return c;
}
