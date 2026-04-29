import paint from "@/assets/icons/paint-98.svg";

import { PaintBox } from "./components/paint-box/PaintBox";
import { OSProvider } from "./components/OSContext";
import { Desktop } from "./components/Dektop";
import { WindowManager } from "./components/WindowManager";
import { StartBar } from "./components/StartBar";

const apps = [{
  id: `palooza.paint`,
  name: 'Paint', 
  icon: paint, 
  comp: PaintBox,
  defaultSize: { width: 600, height: 200 }
}];

export default function App() {
  
	return (
    <OSProvider apps={apps}>
      <Desktop />
      <WindowManager />
      <StartBar />
    </OSProvider>
  );
}
