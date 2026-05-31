const GROUPS_AS_TEXT: Record<number, string> = { 1: "G1", 2: "G2", 3: "G3", 4: "G4" };

export class PlayerLog {
	private playerName: string | null = null
	private playerGroup: 1 | 2 | 3 | 4 | null = null
	private zonesClicked: string[] = []

	constructor(private readonly logElement: HTMLElement) {}

	public newPlayerSelected(name: string, group: 1 | 2 | 3 | 4, role?: string) {
		if (!this.logElement) {
			return;
		}
		this.playerName = name;
		this.playerGroup = group;
		this.zonesClicked = [];
		this.logElement.innerHTML = "";
		this.addEntry(name, "player-name");
		this.addEntry(`Group ${this.playerGroup} (${role})`, `group-tag ${GROUPS_AS_TEXT[group]}`);
	}

	// TBD: action is supposed to be "clicked", "confirmed", "failed", idk the specifics
	public addZoneEntry(playerName: string, zoneLabel: string, action: string): void {
		if (playerName !== this.playerName) {
			return;
		}
		this.zonesClicked.push(zoneLabel);
		this.addEntry(`Zone ${zoneLabel} ${action}`);
	}

	public addErrorEntry(message: string): void {
		this.logElement.innerHTML = "";
		this.addEntry(message);
	}

	private addEntry(textContent: string, className?: string): void {
		this.logElement.appendChild(this.createSpan(textContent, className));
	}

	private createSpan(textContent: string, className?: string): HTMLSpanElement {
		const span = document.createElement("span");
		if (className) {
			span.className = className;
		}
		span.textContent = textContent;
		return span;
	}
}
