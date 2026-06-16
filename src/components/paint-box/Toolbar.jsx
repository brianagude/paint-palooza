import eraser from "@/assets/icons/eraser.svg";
import eyeDropper from "@/assets/icons/eye-dropper.svg";
import line from "@/assets/icons/line.svg";
import curvyLine from "@/assets/icons/line-curvy.svg";
import magnifyingGlass from "@/assets/icons/magnifying-glass.svg";
import optionOpaque from "@/assets/icons/options-opaque.png";
import optionTransparent from "@/assets/icons/options-transparent.png";
import paintBrush from "@/assets/icons/paint-brush.svg";
import paintBucket from "@/assets/icons/paint-bucket.svg";
import pencil from "@/assets/icons/pencil.svg";
import polygon from "@/assets/icons/polygon.svg";
import rectangle from "@/assets/icons/rectangle.svg";
import rectangleDotted from "@/assets/icons/rectangle-dotted.svg";
import sprayPaint from "@/assets/icons/spray-paint.svg";
import star from "@/assets/icons/star.svg";
import text from "@/assets/icons/text.svg";
import { usePaint } from "@/context/PaintBoxContext";

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
		{ id: "ellipse", src: polygon, alt: "Ellipse Icon" }, //TODO: fix icon
		{ id: "roundedRectangle", src: polygon, alt: "Rounded Rectangle Icon" }, //TODO: fix icon
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
			<div className="tool-support status-bar-field">
				{selectedTool === "star" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected transparency-option">
							<img src={optionOpaque} alt="opaque" />
						</button>
						<button type="button" className="remove-styling transparency-option">
							<img src={optionTransparent} alt="transparent" />
						</button>
					</div>
				)}
				{selectedTool === "rectangleDotted" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling transparency-option">
							<img src={optionOpaque} alt="opaque" />
						</button>
						<button type="button" className="remove-styling transparency-option">
							<img src={optionTransparent} alt="transparent" />
						</button>
					</div>
				)}
				{selectedTool === "text" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling transparency-option">
							<img src={optionOpaque} alt="opaque" />
						</button>
						<button type="button" className="remove-styling transparency-option">
							<img src={optionTransparent} alt="transparent" />
						</button>
					</div>
				)}

				{selectedTool === "eraser" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected brush-size">
							<div className="square xs" />
						</button>
						<button type="button" className="remove-styling brush-size">
							<div className="square sm" />
						</button>
						<button type="button" className="remove-styling brush-size">
							<div className="square md" />
						</button>
						<button type="button" className="remove-styling brush-size">
							<div className="square lg" />
						</button>
					</div>
				)}

				{selectedTool === "magnifyingGlass" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected magnify-size">
							<p>1x</p> <div className="square xs" />
						</button>
						<button type="button" className="remove-styling magnify-size">
							<p>2x</p> <div className="square sm" />
						</button>
						<button type="button" className="remove-styling magnify-size">
							<p>6x</p> <div className="square md" />
						</button>
						<button type="button" className="remove-styling magnify-size">
							<p>8x</p> <div className="square lg" />
						</button>
					</div>
				)}

				{selectedTool === "line" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected line-size">
							<div className="line xs" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line sm" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line md" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line lg" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line xl" />
						</button>
					</div>
				)}

				{selectedTool === "curvyLine" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected line-size">
							<div className="line xs" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line sm" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line md" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line lg" />
						</button>
						<button type="button" className="remove-styling line-size">
							<div className="line xl" />
						</button>
					</div>
				)}

				{selectedTool === "rectangle" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected box">
							<div className="outline" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="outline filled" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="filled" />
						</button>
					</div>
				)}

				{selectedTool === "polygon" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected box">
							<div className="outline" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="outline filled" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="filled" />
						</button>
					</div>
				)}

				{selectedTool === "ellipse" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected box">
							<div className="outline" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="outline filled" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="filled" />
						</button>
					</div>
				)}

				{selectedTool === "roundedRectangle" && (
					<div className="tool-support-inner">
						<button type="button" className="remove-styling selected box">
							<div className="outline" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="outline filled" />
						</button>
						<button type="button" className="remove-styling box">
							<div className="filled" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
