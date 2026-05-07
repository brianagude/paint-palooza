import eraser from "@/assets/icons/eraser.svg";
import eyeDropper from "@/assets/icons/eye-dropper.svg";
import line from "@/assets/icons/line.svg";
import curvyLine from "@/assets/icons/line-curvy.svg";
import magnifyingGlass from "@/assets/icons/magnifying-glass.svg";
import paintBrush from "@/assets/icons/paint-brush.svg";
import paintBucket from "@/assets/icons/paint-bucket.svg";
import pencil from "@/assets/icons/pencil.svg";
import polygon from "@/assets/icons/polygon.svg";
import rectangle from "@/assets/icons/rectangle.svg";
import rectangleDotted from "@/assets/icons/rectangle-dotted.svg";
import sprayPaint from "@/assets/icons/spray-paint.svg";
import star from "@/assets/icons/star.svg";
import text from "@/assets/icons/text.svg";
import { usePaint } from "./PaintBox"

export function Toolbar() {
	const { selectedTool, setSelectedTool } = usePaint();
	const tools = [
		{ id: "star", src: star, alt: "Star Icon" },
		{
			id: "rectangleDotted",
			src: rectangleDotted,
			alt: "Rectangle Dotted Icon",
		},
		{ id: "eraser", src: eraser, alt: "Eraser Icon" },
		{ id: "paintBucket", src: paintBucket, alt: "Paint Bucket Icon" },
		{ id: "eyeDropper", src: eyeDropper, alt: "Eye Dropper Icon" },
		{
			id: "magnifyingGlass",
			src: magnifyingGlass,
			alt: "Magnifying Glass Icon",
		},
		{ id: "pencil", src: pencil, alt: "Pencil Icon" },
		{ id: "paintBrush", src: paintBrush, alt: "Paint Brush Icon" },
		{ id: "sprayPaint", src: sprayPaint, alt: "Spray Paint Icon" },
		{ id: "text", src: text, alt: "Text Icon" },
		{ id: "line", src: line, alt: "Line Icon" },
		{ id: "curvyLine", src: curvyLine, alt: "Curvy Line Icon" },
		{ id: "rectangle", src: rectangle, alt: "Rectangle Icon" },
		{ id: "polygon", src: polygon, alt: "Polygon Icon" },
	];

	return (
		<div className="toolbar">
			<div className="paint-tools">
				{tools.map(({ id, src, alt }) => (
					<button
						key={id}
						type="button"
						className={selectedTool === id ? "selected" : ""}
						onClick={() => setSelectedTool(id)}
					>
						<img src={src} alt={alt} />
					</button>
				))}
			</div>
		</div>
	);
}
