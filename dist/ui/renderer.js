import { $ } from "../utils.js";
import { PlayerLog } from "./playerLog.js";
export class Renderer {
    constructor() {
        this.spotsLayer = $("spots-layer");
        this.modal = $("info-modal");
        this.log = new PlayerLog($("status-bar"));
        $("confirm-btn").addEventListener("click", () => {
            this.modal.close();
        });
    }
    renderRoster(players, onSelect) {
        [1, 2, 3, 4].forEach(group => {
            const ul = $(`g${group}-list`);
            players.filter(p => p.group === group).forEach(p => {
                ul.appendChild(this.createPlayerItem(p, onSelect));
            });
        });
    }
    createPlayerItem(player, onSelect) {
        const li = document.createElement("li");
        li.className = "player-item";
        li.textContent = `${player.name}\t${player.role}`;
        li.dataset["name"] = player.name;
        li.addEventListener("click", () => onSelect(player));
        return li;
    }
    setActivePlayer(name) {
        document.querySelectorAll("li.player-item").forEach(li => {
            li.classList.toggle("active", li.dataset["name"] === name);
        });
        console.log(`Selected player ${name}`);
    }
    logPlayerSelected(player) {
        this.log.newPlayerSelected(player.name, player.group, player.role);
    }
    logZoneEntry(playerName, zoneLabel, action) {
        this.log.addZoneEntry(playerName, zoneLabel, action);
    }
    logError(message) {
        this.log.addErrorEntry(message);
    }
    showVisualPing(xPercent, yPercent) {
        const inner = document.createElement("div");
        inner.className = "spot-inner";
        const ping = document.createElement("div");
        ping.className = "spot clicked";
        ping.style.left = `${xPercent}%`;
        ping.style.top = `${yPercent}%`;
        ping.appendChild(inner);
        this.clearSpotsLayer();
        this.spotsLayer.appendChild(ping);
    }
    resetSpotsLayer() {
        this.clearSpotsLayer();
    }
    clearSpotsLayer() {
        this.spotsLayer.innerHTML = "";
    }
    showModal(title, message) {
        $("modal-title").textContent = title;
        $("modal-message").textContent = message;
        this.modal.showModal();
    }
}
