import { StatusBar } from "../StatusBar";
import { TitleBar } from "../TitleBar";
import { PaintCanvas } from "./PaintCanvas";

export function PaintBox() {
	return (
		<section className="paint-box-window window">
			<TitleBar />
			<div className="menu-bar">
				<p>File</p>
				<p>Edit</p>
				<p>View</p>
				<p>Image</p>
				<p>Options</p>
				<p>Help</p>
				{/* Add the Color Space picker here, pass currently selected item to paint canvas */}
			</div>
			<PaintCanvas /> {/* Controls toolbar, canvas, and color palette */}
			<StatusBar />
		</section>
	);
}