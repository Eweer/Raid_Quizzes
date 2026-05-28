import { $ } from "../utils.js";
const GROUP_CLASSES = { 1: "g1", 2: "g2", 3: "g3", 4: "g4" };
;
export class Renderer {
    constructor() {
        this.statusBar = $("status-bar");
        this.spotsLayer = $("spots-layer");
        this.actionBtn = $("map-action-btn");
        this.modal = $("info-modal");
        this.hiddenCtx = null;
        this.mapContainer = $("map-container");
        this.backgroundImage = $("raid-map");
        const confirmBtn = $("confirm-btn");
        confirmBtn.addEventListener("click", () => {
            this.modal.close();
        });
    }
    renderRoster(players, onSelect) {
        [1, 2, 3, 4].forEach((g) => {
            const ul = document.getElementById(`g${g}-list`);
            players.filter((p) => p.group === g).forEach((p) => {
                const li = document.createElement("li");
                li.className = "player-item";
                li.textContent = `${p.name} — ${p.role}`;
                li.dataset["name"] = p.name;
                li.addEventListener("click", () => onSelect(p));
                ul.appendChild(li);
            });
        });
    }
    showVisualPing(percentX, percentY) {
        const ping = document.createElement("div");
        ping.className = "spot clicked";
        ping.style.left = `${percentX}%`;
        ping.style.top = `${percentY}%`;
        const inner = document.createElement("div");
        inner.className = "spot-inner";
        ping.appendChild(inner);
        this.clearSpotsLayer();
        this.spotsLayer.appendChild(ping);
    }
    updateStatus(content) {
        this.statusBar.innerHTML = "";
        if (content.type === 'error') {
            this.statusBar.appendChild(document.createTextNode(content.data));
        }
        else if (content.type === 'player') {
            const { name, group, role } = content.data;
            this.updateStatusBar(this.createPlayerTag(name, group, role));
        }
        else if (content.type === 'zone') {
            const { name, label } = content.data;
            this.updateStatusBar(this.createZoneConfirmedTag(name, label));
        }
    }
    showModal(title, message) {
        document.getElementById("modal-title").textContent = title;
        document.getElementById("modal-message").textContent = message;
        this.modal.showModal();
    }
    initHiddenCanvas(maskImagePath, onMapClick, onMapRightClick) {
        const maskImg = new Image();
        maskImg.src = maskImagePath;
        maskImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = maskImg.width;
            canvas.height = maskImg.height;
            canvas.id = "debug-mask-canvas";
            $("map-container").appendChild(canvas);
            this.hiddenCtx = canvas.getContext('2d', { willReadFrequently: true });
            this.hiddenCtx?.drawImage(maskImg, 0, 0);
        };
        this.mapContainer.addEventListener('click', onMapClick);
        this.mapContainer.addEventListener('contextmenu', onMapRightClick);
        window.addEventListener('keydown', (e) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                return;
            }
            if (e.key.toLowerCase() === 'd') {
                document.getElementById("debug-mask-canvas")?.classList.toggle("visible");
            }
        });
    }
    getSpotAt(e, spots) {
        if (!this.hiddenCtx) {
            return null;
        }
        const ctx = $("debug-mask-canvas");
        const rect = this.backgroundImage.getBoundingClientRect();
        // Calculate coordinate logic
        const scaleX = ctx.width / rect.width;
        const scaleY = ctx.height / rect.height;
        const x = Math.floor((e.clientX - rect.left) * scaleX);
        const y = Math.floor((e.clientY - rect.top) * scaleY);
        const pixel = this.hiddenCtx?.getImageData(x, y, 1, 1).data;
        if (!pixel) {
            return null;
        }
        const [r, g, b] = pixel;
        const clickedSpot = spots.find(s => Math.abs(s.maskRgb[0] - r) <= 5 &&
            Math.abs(s.maskRgb[1] - g) <= 5 &&
            Math.abs(s.maskRgb[2] - b) <= 5) || null;
        if (!clickedSpot) {
            return null;
        }
        const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;
        return { spot: clickedSpot, x: clickXPercent, y: clickYPercent };
    }
    setActivePlayer(name) {
        document.querySelectorAll(".player-item").forEach((li) => {
            li.classList.toggle("active", li.dataset["name"] === name);
        });
    }
    updateStatusBar(elements) {
        this.statusBar.innerHTML = "";
        elements.forEach(el => this.statusBar.appendChild(el));
    }
    createSpan(textContent, className = null) {
        const newSpan = document.createElement("span");
        if (className) {
            newSpan.className = className;
        }
        newSpan.textContent = textContent;
        return newSpan;
    }
    createPlayerTag(name, group, role) {
        const nameSpan = this.createSpan(name, "player-name");
        const groupSpan = this.createSpan(`Group ${group} · ${role}`, `group-tag ${GROUP_CLASSES[group]}`);
        return [nameSpan, groupSpan];
    }
    createZoneConfirmedTag(name, label) {
        const nameSpan = this.createSpan(name, "player-name");
        const infoSpan = this.createSpan(`Zone ${label} Confirmed`);
        return [nameSpan, infoSpan];
    }
    clearSpotsLayer() {
        if (this.spotsLayer) {
            this.spotsLayer.innerHTML = "";
        }
    }
}
