const GROUPS_AS_TEXT: Record<number, string> = { 1: "G1", 2: "G2", 3: "G3", 4: "G4" };

export class PlayerLog {
	private static playerName: string | null = null
	private static playerGroup: 1 | 2 | 3 | 4 | null = null
	private static zonesClicked: string[] = []
	private static logElement = document.getElementById("status-bar");

	public static newPlayerSelected(name: string, group: 1 | 2 | 3 | 4, role?: string) {
		if (!this.logElement) {
			return;
		}
		this.playerName = name;
		this.playerGroup = group;
		this.zonesClicked = [];
		this.logElement.innerHTML = "";
		this.addEntry(name, "player-name");
		this.addEntry(`Group ${group} (${role})`, `group-tag ${GROUPS_AS_TEXT[group]}`);
	}

	// TBD: action is supposed to be "clicked", "confirmed", "failed", idk the specifics
	public static addZoneEntry(playerName: string, zoneLabel: string, action: string) {
		if (!this.logElement || playerName !== this.playerName) {
			return;
		}
		this.zonesClicked.push(zoneLabel);
		this.addEntry(`Zone ${zoneLabel} ${action}`);
	}

	public static addErrorEntry(message: string): void {
		if (!this.logElement) {
			return;
		}

		this.logElement.innerHTML = "";
		this.addEntry(message);
	}

	private static addEntry(textContent: string, className?: string) {
		this.logElement?.appendChild(this.createSpan(textContent, className));
	}

	private static createSpan(textContent: string, className?: string): HTMLSpanElement {
		const span = document.createElement("span");
		if (className) {
			span.className = className;
		}
		span.textContent = textContent;
		return span;
	}
}
