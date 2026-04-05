import { ColorPalette } from "./components/ColorPalette";
import { MenuBar } from "./components/MenuBar";
import { PaintCanvas } from "./components/PaintCanvas";
import { StartBar } from "./components/StartBar";
import { StatusBar } from "./components/StatusBar";
import { TitleBar } from "./components/TitleBar";
import { Toolbar } from "./components/Toolbar";
import "./App.css";

export default function  App() {
	return (
		<>
      <section className="paint-box-window window">
        <TitleBar/>
        <MenuBar/>
        <div class="window-body">
          <Toolbar/>
          <PaintCanvas/>
          <ColorPalette/>
        </div>
        <StatusBar/>
      </section>
      
      <StartBar/>
		</>
	);
}
