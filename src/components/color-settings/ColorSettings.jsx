import { useState } from "react";
import { cubes } from "rybitten/cubes";
import { MenuBar, MenuBarGroup, MenuBarItem } from "../MenuBar";
import { StatusBar } from "../StatusBar";
import { ColorSettingsContext } from "@/context/ColorSettingsContext";

export function ColorSettings() {
  const [colorSpace, setColorSpace] = useState("itten");

  return (
    <ColorSettingsContext.Provider
      value={{
        colorSpace,
        setColorSpace,
      }}
    >
      {/* <div 
        className="menu-select-wrapper toolbars"
      >
        <div className="color-space-wrapper toolbar">
          <label htmlFor="colorSpace">Color Space:</label>
          <select
            name="colorSpace"
            onChange={(e) => setColorSpace(e.target.value)}
          >
            {[...cubes].map(([key, cube]) => (
              <option key={key} value={key}>
                {cube.title}
              </option>
            ))}
          </select>
        </div>
      </div> */}
      

      <div className="window-body color-settings">

        {/* 
          To Do 
          (1) Add date and author table headers  
          (2) Create click functions
          (3) P5 Visualizations
          (4) Landmarks
        */}
        
        <fieldset>
          <legend>Color Cube</legend>
          <div 
            className="sunken-panel"
          >
            <table className="">
              <tbody>
              {[...cubes].map(([key, cube]) => (
                <tr key={key} value={key}>
                  <td>{cube.title}</td>
                </tr>
              ))}

              </tbody>
            </table>
          </div>
        </fieldset>

        <fieldset>
          <legend>Visualization</legend>
        </fieldset>

        <fieldset className="full-width">
          <legend>Landmarks</legend>
        </fieldset>

      </div>
      
      <StatusBar />
    </ColorSettingsContext.Provider>
  );
}