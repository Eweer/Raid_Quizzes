import type { Spot } from "../data/spots.js"
import { $ } from "../utils.js"

const MASK_CANVAS_ID = "debug-mask-canvas";
const COLOR_TOLERANCE = 5;

export interface SpotHit {
	spot: Spot;
	xPercent: number;
	yPercent: number;
}

export type MapClickHandler = (hit: SpotHit) => void;
export type MapRightClickHandler = (e: MouseEvent) => void;

export class MapCanvas {
	private ctx: CanvasRenderingContext2D | null = null;
	private backgroundImage: HTMLImageElement;
	constructor(
		private readonly spots: Spot[],
		private readonly onSpotClick: MapClickHandler,
		private readonly onRightClick: MapRightClickHandler,
	) {
		this.backgroundImage = $<HTMLImageElement>("raid-map");
	}

	public init(maskImagePath: string): void {
		const maskImg = new Image();
		maskImg.src = maskImagePath;
		maskImg.onload = () => this.setupCanvas(maskImg);

		const container = $("map-container");
		container.addEventListener("click", (e) => this.handleClick(e));
		container.addEventListener("contextmenu", (e) => this.onRightClick(e));
		window.addEventListener("keydown", (e) => this.handleDebugToggle(e));
	}

	private setupCanvas(maskImg: HTMLImageElement): void {
		const canvas = document.createElement("canvas");
		canvas.id = MASK_CANVAS_ID;
		canvas.width = maskImg.width;
		canvas.height = maskImg.height;
		$("map-container").appendChild(canvas);

		this.ctx = canvas.getContext("2d", { willReadFrequently: true });
		this.ctx?.drawImage(maskImg, 0, 0);
	}

	private handleClick(e: MouseEvent): void {
		const hit = this.getSpotAt(e);
		if (hit) {
			this.onSpotClick(hit);
		}
	}

	private handleDebugToggle(e: KeyboardEvent): void {
		const active = document.activeElement;
		if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") {
			return;
		}
		if (e.key.toLowerCase() === "d") {
			document.getElementById(MASK_CANVAS_ID)?.classList.toggle("visible");
		}
	}

	private getSpotAt(e: MouseEvent): SpotHit | null {
		if (!this.ctx) {
			console.error("Rendering context does not exist");
			return null;
		}

		const canvas = document.getElementById(MASK_CANVAS_ID) as HTMLCanvasElement;
		const rect = this.backgroundImage.getBoundingClientRect();

		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		const canvasX = Math.floor((e.clientX - rect.left) * scaleX)
		const canvasY = Math.floor((e.clientY - rect.top) * scaleY)

		console.log(`User click @(${canvasX}, ${canvasY})`);

		const [ r, g, b ] = this.ctx.getImageData(canvasX, canvasY, 1, 1).data;

		const spot = this.spots.find(s =>
			Math.abs(s.rgbMask[0] - r) <= COLOR_TOLERANCE &&
			Math.abs(s.rgbMask[1] - g) <= COLOR_TOLERANCE &&
			Math.abs(s.rgbMask[2] - b) <= COLOR_TOLERANCE
		) ?? null;

		console.log(`${spot ? 'Spot ' + spot.id : 'No spot'} clicked (Mask: [ ${r}, ${g}, ${b} ])`);

		if (!spot) {
			return null;
		}

		return {
			spot: spot,
			xPercent: ((e.clientX - rect.left) / rect.width) * 100,
			yPercent: ((e.clientY - rect.top) / rect.height) * 100,
		};
	}
}
