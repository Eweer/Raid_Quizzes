const GROUPS_AS_TEXT = { 1: "G1", 2: "G2", 3: "G3", 4: "G4" };
export class PlayerLog {
    constructor(logElement) {
        this.logElement = logElement;
        this.playerName = null;
        this.playerGroup = null;
        this.zonesClicked = [];
    }
    newPlayerSelected(name, group, role) {
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
    addZoneEntry(playerName, zoneLabel, action) {
        if (playerName !== this.playerName) {
            return;
        }
        this.zonesClicked.push(zoneLabel);
        this.addEntry(`Zone ${zoneLabel} ${action}`);
    }
    addErrorEntry(message) {
        this.logElement.innerHTML = "";
        this.addEntry(message);
    }
    addEntry(textContent, className) {
        this.logElement.appendChild(this.createSpan(textContent, className));
    }
    createSpan(textContent, className) {
        const span = document.createElement("span");
        if (className) {
            span.className = className;
        }
        span.textContent = textContent;
        return span;
    }
}
