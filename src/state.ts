import type { Player } from "./data/player.js";
import type { Spot } from "./data/spots.js";

class SelectionState {
	private player: Player | null = null;
	private spot: Spot | null = null;
	private position: [ number, number ] | null = null;

	getPlayer(): Player | null { return this.player; }
	getSpot(): Spot | null { return this.spot; }
	getPosition(): [ number, number ] | null { return this.position; }

	setPlayer(player: Player): void { this.player = player };
	setSpot(spot: Spot): void { this.spot = spot };
	setPosition(position: [ number, number ]): void { this.position = position; }

	resetSpot(): void {
		this.spot = null;
		this.position = null;
	}

	resetAll(): void {
		this.player = null;
		this.spot = null;
		this.position = null;
	}

	isValid(): boolean {
		return (this.player !== null && this.spot !== null && this.position !== null);
	}
}

export const currentState = new SelectionState();
