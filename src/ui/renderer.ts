import type { Player } from "../data/player.js";
import { $ } from "../utils.js";
import { PlayerLog } from "./playerLog.js";

export class Renderer {
	private readonly log: PlayerLog;
	private readonly spotsLayer: HTMLElement;
	private readonly modal: HTMLDialogElement;

	constructor() {
		this.spotsLayer = $("spots-layer");
		this.modal = $<HTMLDialogElement>("info-modal");
		this.log = new PlayerLog($("status-bar"));

		$<HTMLButtonElement>("confirm-btn").addEventListener("click", () => {
			this.modal.close();
		});
	}

	public renderRoster(players: Player[], onSelect: (p: Player) => void): void {
		([1, 2, 3, 4] as const).forEach(group => {
			const ul = $(`g${group}-list`);
			players.filter(p => p.group === group).forEach(p => {
				ul.appendChild(this.createPlayerItem(p, onSelect));
			});
		});
	}

	private createPlayerItem(player: Player, onSelect: (p: Player) => void): HTMLLIElement {
		const li = document.createElement("li");
		li.className = "player-item";
		li.textContent = `${player.name}\t${player.role}`;
		li.dataset["name"] = player.name;
		li.addEventListener("click", () => onSelect(player));
		return li;
	}

	public setActivePlayer(name: string): void {
		document.querySelectorAll<HTMLElement>("li.player-item").forEach(li => {
			li.classList.toggle("active", li.dataset["name"] === name);
		});
		console.log(`Selected player ${name}`);
	}

	public logPlayerSelected(player: Player): void {
		this.log.newPlayerSelected(player.name, player.group, player.role);
	}

	public logZoneEntry(playerName: string, zoneLabel: string, action: string): void {
		this.log.addZoneEntry(playerName, zoneLabel, action);
	}

	public logError(message: string): void {
		this.log.addErrorEntry(message);
	}

	public showVisualPing(xPercent: number, yPercent: number): void {
		const inner = document.createElement("div");
		inner.className = "spot-inner";

		const ping          = document.createElement("div");
		ping.className      = "spot clicked";
		ping.style.left     = `${xPercent}%`;
		ping.style.top      = `${yPercent}%`;
		ping.appendChild(inner);

		this.clearSpotsLayer();
		this.spotsLayer.appendChild(ping);
	}

	public resetSpotsLayer() {
		this.clearSpotsLayer();
	}

	private clearSpotsLayer() {
		this.spotsLayer.innerHTML = "";
	}

	public showModal(title: string, message: string): void {
		$("modal-title").textContent    = title;
		$("modal-message").textContent  = message;
		this.modal.showModal();
	}
}
