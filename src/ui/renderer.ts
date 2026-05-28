import { Spot } from "../data.js";
import { $ } from "../utils.js";

const GROUP_CLASSES: Record<number, string> = { 1: "g1", 2: "g2", 3: "g3", 4: "g4" };

interface SpotHit {
        spot: Spot;
        x: number;
        y: number;
};

export class Renderer {
    private statusBar = $("status-bar");
    private spotsLayer = $("spots-layer");
    private actionBtn = $("map-action-btn") as HTMLButtonElement;
    private modal = $("info-modal") as HTMLDialogElement;
    private hiddenCtx: CanvasRenderingContext2D | null = null;
    private mapContainer = $("map-container");
    private backgroundImage = $("raid-map") as HTMLImageElement;

    constructor() {
        const confirmBtn = $("confirm-btn") as HTMLButtonElement;
        confirmBtn.addEventListener("click", () => {
            this.modal.close();
        });
    }

    public renderRoster(players: any[], onSelect: (p: any) => void) {
        [1, 2, 3, 4].forEach((g) => {
            const ul = document.getElementById(`g${g}-list`) as HTMLElement;
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

    public showVisualPing(percentX: number, percentY: number) {
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

    public updateStatus(content: { type: 'error' | 'player' | 'zone', data?: any }) {
        this.statusBar.innerHTML = "";
        if (content.type === 'error') {
            this.statusBar.appendChild(document.createTextNode(content.data));
        } else if (content.type === 'player') {
            const { name, group, role } = content.data;
            this.updateStatusBar(this.createPlayerTag(name, group, role));
        } else if (content.type === 'zone') {
            const { name, label } = content.data;
            this.updateStatusBar(this.createZoneConfirmedTag(name, label));
        }
    }

    public showModal(title: string, message: string) {
        document.getElementById("modal-title")!.textContent = title;
        document.getElementById("modal-message")!.textContent = message;
        this.modal.showModal();
    }

    public initHiddenCanvas(maskImagePath: string, onMapClick: (e: MouseEvent) => void, onMapRightClick: (e: MouseEvent) => void): void {
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

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            const activeEl = document.activeElement;
            if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
                return;
            }
            if (e.key.toLowerCase() === 'd') {
                document.getElementById("debug-mask-canvas")?.classList.toggle("visible");
            }
        });
    }

    public getSpotAt(e: MouseEvent, spots: Spot[]): SpotHit | null {
        if (!this.hiddenCtx) {
            return null;
        }

        const ctx = $("debug-mask-canvas") as HTMLCanvasElement;
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
        const clickedSpot = spots.find(s =>
            Math.abs(s.maskRgb[0] - r) <= 5 &&
            Math.abs(s.maskRgb[1] - g) <= 5 &&
            Math.abs(s.maskRgb[2] - b) <= 5
        ) || null;

        if (!clickedSpot) {
            return null;
        }
        const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;
        return { spot: clickedSpot, x: clickXPercent, y: clickYPercent };

    }

    public setActivePlayer(name: string) {
        document.querySelectorAll<HTMLElement>(".player-item").forEach((li) => {
            li.classList.toggle("active", li.dataset["name"] === name);
        });
    }

    private updateStatusBar(elements: HTMLElement[]) {
        this.statusBar.innerHTML = "";
        elements.forEach(el => this.statusBar.appendChild(el));
    }

    private createSpan(textContent: string, className: string | null = null) {
        const newSpan = document.createElement("span");
        if (className) {
            newSpan.className = className;
        }
        newSpan.textContent = textContent;
        return newSpan;
    }

    private createPlayerTag(name: string, group: number, role: string): HTMLElement[] {
        const nameSpan = this.createSpan(name, "player-name");
        const groupSpan = this.createSpan(`Group ${group} · ${role}`, `group-tag ${GROUP_CLASSES[group]}`);
        return [nameSpan, groupSpan];
    }

    private createZoneConfirmedTag(name: string, label: string): HTMLElement[] {
        const nameSpan = this.createSpan(name, "player-name");
        const infoSpan = this.createSpan(`Zone ${label} Confirmed`);
        return [nameSpan, infoSpan];
    }

    public clearSpotsLayer() {
        if (this.spotsLayer) {
            this.spotsLayer.innerHTML = "";
        }
    }
}