import arrow from "@/assets/icons/app-arrow.jpg";
import paint from "@/assets/icons/paint-98.svg";
import { PaintBox } from "./components/paint-box/PaintBox";
import { StartBar } from "./components/StartBar";
import "./App.css";

export default function App() {
	return (
		<>
			<div className="app-icons">
				<button type="button" className="app-btn">
					<div>
						<img src={paint} alt="Paint Brushes Icon" className="app-icon" />
						<img src={arrow} alt="Arrow Icon" className="app-icon-arrow" />
					</div>
					<p className="app-title">Paint</p>
				</button>
			</div>
			<PaintBox />
			<StartBar />
		</>
	);
}
