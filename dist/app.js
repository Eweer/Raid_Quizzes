// app.ts
import { isInSafeSpot } from "./data.js";
import { getSelectedPlayer, getSelectedSpot, getSelectedPosition, setSelectedPlayer, setSelectedSpot, setSelectedPosition, resetState } from "./state.js";
import { sendRosterData } from "./services/api.js";
import { Renderer } from "./ui/renderer.js";
import { $ } from "./utils.js";
let currentSpots = [];
const renderer = new Renderer();
const mapActionButton = $("map-action-btn");
export function initApp(players, spots) {
    currentSpots = spots;
    renderer.renderRoster(players, selectPlayer);
    renderer.initHiddenCanvas('./assets/raidplan_mask.png', handleMapClick, handleMapRightClick);
    mapActionButton.addEventListener("click", (e) => {
        e.stopPropagation();
        handleActionButtonClick();
    });
}
function resetTrackingVariables() {
    renderer.clearSpotsLayer();
    resetState();
    updateActionButtonState();
}
function updateActionButtonState() {
    const hasActivePing = document.querySelector(".spot.clicked") !== null;
    mapActionButton.disabled = !hasActivePing;
}
async function handleActionButtonClick() {
    const player = getSelectedPlayer();
    const spot = getSelectedSpot();
    const pos = getSelectedPosition();
    if (!player || !spot || !pos) {
        return;
    }
    const btn = $("map-action-btn");
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting...";
    try {
        await sendRosterData({
            playerName: player.name,
            group: player.group,
            role: player.role,
            spotLabel: spot.label,
            spotId: spot.id,
            posX: pos[0],
            posY: pos[1]
        });
        if (isInSafeSpot(spot, player, true, [0, 1, 2, 0])) {
            renderer.showModal("Correcto", "Buen trabajo :)");
        }
        else {
            renderer.showModal("Incorrecto", "... :(");
        }
        resetTrackingVariables();
    }
    catch (error) {
        console.error("Could not connect to database:", error);
        alert("Network transmission error. Please try again!");
        btn.disabled = false;
    }
    finally {
        btn.textContent = originalText;
    }
}
function filterPlayer(val, players) {
    const v = val.toLowerCase();
    document.querySelectorAll(".player-item").forEach((li) => {
        const name = (li.dataset["name"] ?? "").toLowerCase();
        li.style.display = name.includes(v) ? "" : "none";
        if (v && name === v) {
            const p = players.find((p) => p.name.toLowerCase() === v);
            if (p) {
                selectPlayer(p);
            }
        }
    });
}
function selectPlayer(p) {
    resetTrackingVariables();
    setSelectedPlayer(p);
    renderer.setActivePlayer(p.name);
    renderer.updateStatus({
        type: 'player',
        data: {
            name: p.name,
            group: p.group,
            role: p.role
        }
    });
}
function handleMapClick(e) {
    const clickedAt = renderer.getSpotAt(e, currentSpots);
    if (clickedAt) {
        handleSpotClick(clickedAt.spot, clickedAt.x, clickedAt.y);
    }
}
function handleSpotClick(s, posX, posY) {
    const player = getSelectedPlayer();
    if (!player) {
        renderer.updateStatus({ type: 'error', data: "Select your name first." });
        return;
    }
    setSelectedSpot(s);
    setSelectedPosition([posX, posY]);
    renderer.showVisualPing(posX, posY);
    updateActionButtonState();
    renderer.updateStatus({
        type: 'zone',
        data: { name: player.name, label: s.label }
    });
}
function handleMapRightClick(e) {
    e.preventDefault();
    const target = e.target;
    const clickedPing = target.closest(".spot.clicked");
    if (clickedPing) {
        clickedPing.remove();
        setSelectedSpot(null);
        setSelectedPosition(null);
        updateActionButtonState();
    }
}
