import { ryb2rgb } from 'rybitten';

// const [r0, g0, b0] = ryb2rgb([x, y, z], { cube });

export function ColorPalette({cube, onSelectSwatch, currentColor}) {
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
    const [cr, cg, cb] = ryb2rgb([r, y, b], { cube });
    return `rgb(${Math.round(cr * 255)}, ${Math.round(cg * 255)}, ${Math.round(cb * 255)})`;
  }
  const currentBg = rybToRgbString(currentColor);

  return <div className="color-palette">
    <div className="current-swatches">
      <button type="button" className="swatch-btn selected" style={{ background: currentBg }}/>
    </div>
    <div className="swatch-rows">
      {PALETTE_RYB.map(([r, y, b]) => {
        return (
          <button
            key={r+y+b}
            type="button"
            className="swatch-btn selected"
            style={{ background: rybToRgbString([r, y, b]) }}
            onClick={() => onSelectSwatch([r, y, b])}
          />
        );
      })}
    </div>
  </div>
}
