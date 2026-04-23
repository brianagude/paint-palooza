import { useEffect, useRef, useState } from "react";
import { cubes, RYB_ITTEN } from "rybitten/cubes";
import { StatusBar } from "../StatusBar";
import { TitleBar } from "../TitleBar";
import { ColorPalette } from "./ColorPalette";
import { PaintCanvas } from "./PaintCanvas";
import { Toolbar } from "./Toolbar";

export function PaintBox({ app, onUpdate }) {
  // React state — drives UI re-renders (button highlights, swatch selection ring, etc.)
  const [selectedTool, setSelectedTool] = useState('pencil');
  const [selectedSwatch, setSelectedSwatch] = useState([0, 0, 0]);
  // TODO: wire setCubeKey to a cube picker UI when that feature is built
  const [cubeKey] = useState('itten');

  // Refs — stable mutable objects the p5 sketch reads at draw time.
  // Changing .current does NOT trigger re-renders, so the sketch stays alive.
  const toolRef = useRef({ active: 'pencil' });
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

  const cube = cubes[cubeKey];

  return (
    <section
      className={`paint-box-window window ${app.maximized ? 'window--maximized' : ''} ${app.minimized ? 'window--minimized' : ''}`}
    >
      <TitleBar app={app} onUpdate={onUpdate} />
      <div className="menu-bar">
        <p>File</p>
        <p>Edit</p>
        <p>View</p>
        <p>Image</p>
        <p>Options</p>
        <p>Help</p>
        {/* TODO: Add cube picker here — pass setCubeKey */}
      </div>
      <div className="window-body">
        <Toolbar selectedTool={selectedTool} onSelectTool={setSelectedTool} />
        <PaintCanvas toolRef={toolRef} colorRef={colorRef} cube={cube} />
        <ColorPalette
          cube={cube}
          onSelectSwatch={setSelectedSwatch}
          currentColor={selectedSwatch}
        />
      </div>
      <StatusBar />
    </section>
  );
}
