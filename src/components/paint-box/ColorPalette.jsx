import { ryb2rgb } from 'rybitten';
import { cubes } from 'rybitten/cubes';
import { usePaint } from "@/context/PaintBoxContext";

export function ColorPalette() {
  const { colorSpace, foregroundColor, setForegroundColor, backgroundColor, setBackgroundColor } = usePaint();

  const PALETTE_RYB = [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
    [1, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
    [0.5, 0, 0],
    [0, 0.5, 0],
    [0, 0, 0.5],
    [0.5, 0.5, 0],
    [0.5, 0, 0.5],
    [0, 0.5, 0.5],
    [0.25, 0.25, 0.25],
    [0.75, 0.75, 0.75],
    [1, 0.5, 0],
    [0.5, 1, 0],
    [0, 0.5, 1],
    [0.5, 0, 0.25],
    [0.25, 0.5, 0.25],
    [0.35, 0.2, 0.45],
    [0.6, 0.35, 0.15],
    [0.2, 0.45, 0.35],
    [0.85, 0.65, 0.2],
    [0.5, 0.35, 0.35],
    [0.35, 0.35, 0.5],
    [0.15, 0.25, 0.55],
  ];

  function rybToRgbString([r, y, b]) {
    const [cr, cg, cb] = ryb2rgb([r, y, b], { cube: cubes.get(colorSpace).cube });
    return `rgb(${Math.round(cr * 255)}, ${Math.round(cg * 255)}, ${Math.round(cb * 255)})`;
  }

  const currentBg = rybToRgbString(backgroundColor);
  const currentFg = rybToRgbString(foregroundColor);

  return (
    <div className="color-palette">
      <button 
        type="button" 
        className="current-swatches"
        onClick={() => {
          setBackgroundColor(foregroundColor)
          setForegroundColor(backgroundColor)
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setBackgroundColor(currentFg)
          setForegroundColor(currentBg)
        }}
      >
        <div className="current-color foreground" style={{ background: currentFg }}/>
        <div className="current-color background" style={{ background: currentBg }}/>
      </button>

      <div className="swatch-rows">
        {PALETTE_RYB.map((c, i) => {
          return (
            <button
              key={`button-${c[0]}-${c[1]}-${c[2]}-${i}`}
              type="button"
              className="swatch-btn selected"
              style={{ background: rybToRgbString(c) }}
              onClick={() => setForegroundColor(c)}
              onContextMenu={(e) => {
                e.preventDefault();
                setBackgroundColor(c)
              }}
            />
          );
        })}
      </div>
    </div>
  )
}
