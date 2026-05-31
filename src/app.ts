import { Player } from "./data/player.js";
import { Spot } from "./data/spots.js";
import { isInSafeSpot } from "./fs/positionChecker.js";
import { sendRosterData } from "./services/api.js";
import { SelectionState } from "./state.js";
import { MapCanvas, SpotHit } from "./ui/mapCanvas.js";
import { Renderer } from "./ui/renderer.js";
import { $ } from "./utils.js";

const MASK_PATH = "./assets/raidplan_mask.png";
const ACTIVE_SOAK = [ 1, 1, 2, 3 ];

export class App {
	private readonly state 	= new SelectionState();
	private readonly renderer = new Renderer();
	private readonly mapCanvas: MapCanvas;
	private readonly actionBtn = $<HTMLButtonElement>("map-action-btn");

	private onSpotHit = (hit: SpotHit): void => {
		const player = this.state.getPlayer();
		if (!player) {
			this.renderer.logError("Select your name first.");
			return;
		}

		this.state.setSpot(hit.spot);
		this.state.setPosition([ hit.xPercent, hit.yPercent ]);

		const pos = this.state.getPosition();
		if (!pos) {
			this.renderer.logError("Position is not valid, try again.");
			return;
		}
		this.renderer.showVisualPing(pos[0], pos[1]);
		this.actionBtn.disabled = !this.state.isValid();
		this.renderer.logZoneEntry(player.name, hit.spot.label, "Confirmed");
	}

	private onMapRightClick = (e: MouseEvent): void => {
		e.preventDefault();
		const clickedPing = (e.target as HTMLElement).closest(".spot.clicked");
		if (clickedPing) {
			clickedPing.remove();
			this.state.resetSpot();
			this.actionBtn.disabled = !this.state.isValid();
		}
	}

	constructor(players: Player[], spots: Spot[]) {
		this.mapCanvas = new MapCanvas(spots, this.onSpotHit, this.onMapRightClick);
		this.mapCanvas.init(MASK_PATH);
		this.renderer.renderRoster(players, (p) => this.selectPlayer(p));
		this.actionBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this.handleSubmit();
		});
	}

	public init() {
	}

	private selectPlayer(player: Player): void {
		this.renderer.resetSpotsLayer();
		this.state.resetAll();
		this.actionBtn.disabled = !this.state.isValid();

		this.state.setPlayer(player);
		this.renderer.setActivePlayer(player.name);
		this.renderer.logPlayerSelected(player);
	}

	private async handleSubmit(): Promise<void> {
		const player    = this.state.getPlayer();
		const spot      = this.state.getSpot();
		const pos       = this.state.getPosition();

		if (!player || !spot || !pos) {
			return;
		}

		const originalLabel = this.actionBtn.textContent;
		this.actionBtn.disabled = true;
		this.actionBtn.textContent = "Submitting...";

		try {
			await sendRosterData({
				playerName: player.name,
				group: 		player.group,
				role:		player.role,
				spotLabel:	spot.label,
				spotId: 	spot.id,
				posX:		pos[0],
				posY:		pos[1],
			});

			const correct = isInSafeSpot(spot, player, false, ACTIVE_SOAK);
			console.log(`Answer is ${correct ? "correct." : "incorrect."}`);
			this.renderer.showModal(
				correct ? "Correcto"		: "Incorrecto",
				correct ? "Buen trabajo :)" : "... :(",
			);

			this.renderer.resetSpotsLayer();
			this.state.resetSpot();
		} catch (err) {
			console.error(`Could not connect to database: ${err}`);
			alert("Network transmission error. Please try again.");
		} finally {
			this.actionBtn.disabled = !this.state.isValid();
			this.actionBtn.textContent = originalLabel;
		}
	}

}
