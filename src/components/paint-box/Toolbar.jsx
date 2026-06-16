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

function optionClass(baseClass, index, activeSetting) {
	return `remove-styling ${baseClass}${activeSetting === index ? " selected" : ""}`;
}

function FillOptions({ activeSetting, onSelect }) {
	return (
		<div className="tool-options-list">
			<button type="button" className={optionClass("fill-option", 0, activeSetting)} onClick={() => onSelect(0)}>
				<img src={optionOpaque} alt="opaque" />
			</button>
			<button type="button" className={optionClass("fill-option", 1, activeSetting)} onClick={() => onSelect(1)}>
				<img src={optionTransparent} alt="transparent" />
			</button>
		</div>
	);
}

function ShapeStyleOptions({ activeSetting, onSelect }) {
	return (
		<div className="tool-options-list">
			<button type="button" className={optionClass("shape-style", 0, activeSetting)} onClick={() => onSelect(0)}>
				<div className="outline" />
			</button>
			<button type="button" className={optionClass("shape-style", 1, activeSetting)} onClick={() => onSelect(1)}>
				<div className="outline filled" />
			</button>
			<button type="button" className={optionClass("shape-style", 2, activeSetting)} onClick={() => onSelect(2)}>
				<div className="filled" />
			</button>
		</div>
	);
}

export function Toolbar() {
	const { selectedTool, setSelectedTool, toolSettings, setToolSetting } = usePaint();
	const activeSetting = toolSettings[selectedTool] ?? 0;

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
		{
			id: "roundedRectangle",
			src: polygon,
			alt: "Rounded Rectangle Icon",
		}, //TODO: fix icon
	];

	const sharedProps = { activeSetting, onSelect: (i) => setToolSetting(selectedTool, i) };

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
			<div className="tool-options status-bar-field">
				{selectedTool === "star" && <FillOptions {...sharedProps} />}
				{selectedTool === "rectangleDotted" && <FillOptions {...sharedProps} />}
				{selectedTool === "text" && <FillOptions {...sharedProps} />}

				{selectedTool === "eraser" && (
					<div className="tool-options-list">
						<button type="button" className={optionClass("size-picker", 0, activeSetting)} onClick={() => setToolSetting(selectedTool, 0)}>
							<div className="square xs" />
						</button>
						<button type="button" className={optionClass("size-picker", 1, activeSetting)} onClick={() => setToolSetting(selectedTool, 1)}>
							<div className="square sm" />
						</button>
						<button type="button" className={optionClass("size-picker", 2, activeSetting)} onClick={() => setToolSetting(selectedTool, 2)}>
							<div className="square md" />
						</button>
						<button type="button" className={optionClass("size-picker", 3, activeSetting)} onClick={() => setToolSetting(selectedTool, 3)}>
							<div className="square lg" />
						</button>
					</div>
				)}

				{selectedTool === "magnifyingGlass" && (
					<div className="tool-options-list">
						<button type="button" className={optionClass("zoom-picker", 0, activeSetting)} onClick={() => setToolSetting(selectedTool, 0)}>
							<p>1x</p> <div className="square xs" />
						</button>
						<button type="button" className={optionClass("zoom-picker", 1, activeSetting)} onClick={() => setToolSetting(selectedTool, 1)}>
							<p>2x</p> <div className="square sm" />
						</button>
						<button type="button" className={optionClass("zoom-picker", 2, activeSetting)} onClick={() => setToolSetting(selectedTool, 2)}>
							<p>6x</p> <div className="square md" />
						</button>
						<button type="button" className={optionClass("zoom-picker", 3, activeSetting)} onClick={() => setToolSetting(selectedTool, 3)}>
							<p>8x</p> <div className="square lg" />
						</button>
					</div>
				)}

				{(selectedTool === "line" || selectedTool === "curvyLine") && (
					<div className="tool-options-list">
						<button type="button" className={optionClass("stroke-picker", 0, activeSetting)} onClick={() => setToolSetting(selectedTool, 0)}>
							<div className="line xs" />
						</button>
						<button type="button" className={optionClass("stroke-picker", 1, activeSetting)} onClick={() => setToolSetting(selectedTool, 1)}>
							<div className="line sm" />
						</button>
						<button type="button" className={optionClass("stroke-picker", 2, activeSetting)} onClick={() => setToolSetting(selectedTool, 2)}>
							<div className="line md" />
						</button>
						<button type="button" className={optionClass("stroke-picker", 3, activeSetting)} onClick={() => setToolSetting(selectedTool, 3)}>
							<div className="line lg" />
						</button>
						<button type="button" className={optionClass("stroke-picker", 4, activeSetting)} onClick={() => setToolSetting(selectedTool, 4)}>
							<div className="line xl" />
						</button>
					</div>
				)}

				{selectedTool === "rectangle" && <ShapeStyleOptions {...sharedProps} />}
				{selectedTool === "polygon" && <ShapeStyleOptions {...sharedProps} />}
				{selectedTool === "ellipse" && <ShapeStyleOptions {...sharedProps} />}
				{selectedTool === "roundedRectangle" && <ShapeStyleOptions {...sharedProps} />}
			</div>
		</div>
	);
}
