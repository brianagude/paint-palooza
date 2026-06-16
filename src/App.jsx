import paint from "@/assets/icons/paint-98.svg";
import smile from "@/assets/icons/smile.svg";

import { PaintBox } from "./components/paint-box/PaintBox";
import { ColorSettings } from "./components/color-settings/ColorSettings";
import { OS } from "./components/OS";
import { Desktop } from "./components/Dektop";
import { WindowManager } from "./components/WindowManager";
import { StartBar } from "./components/StartBar";

const apps = [{
  id: `palooza.paint`,
  name: 'Paint', 
  icon: paint, 
  comp: PaintBox,
  defaultSize: { width: 600, height: 200 }
},
{
  id: `palooza.settings`,
  name: 'Color Settings', 
  icon: smile, 
  comp: ColorSettings,
  defaultSize: { width: 600, height: 200 }
}];

export default function App() {
  
	return (
    <OS apps={apps}>
      <Desktop />
      <WindowManager />
      <StartBar />
    </OS>
  );
}
