const GROUPS_AS_TEXT = { 1: "G1", 2: "G2", 3: "G3", 4: "G4" };
export class PlayerLog {
    static newPlayerSelected(name, group, role) {
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
    static addZoneEntry(playerName, zoneLabel, action) {
        if (!this.logElement || playerName !== this.playerName) {
            return;
        }
        this.zonesClicked.push(zoneLabel);
        this.addEntry(`Zone ${zoneLabel} ${action}`);
    }
    static addErrorEntry(message) {
        if (!this.logElement) {
            return;
        }
        this.logElement.innerHTML = "";
        this.addEntry(message);
    }
    static addEntry(textContent, className) {
        this.logElement?.appendChild(this.createSpan(textContent, className));
    }
    static createSpan(textContent, className) {
        const span = document.createElement("span");
        if (className) {
            span.className = className;
        }
        span.textContent = textContent;
        return span;
    }
}
PlayerLog.playerName = null;
PlayerLog.playerGroup = null;
PlayerLog.zonesClicked = [];
PlayerLog.logElement = document.getElementById("status-bar");
