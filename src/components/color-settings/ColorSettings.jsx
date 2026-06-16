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
      <div className="window-body color-settings">

        {/* 
          To Do 
          (1) Add name, date and author table headers  
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