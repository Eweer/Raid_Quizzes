import { isInSafeSpot } from "./fs/positionChecker.js";
import { sendRosterData } from "./services/api.js";
import { currentState } from "./state.js";
import { MapCanvas } from "./ui/mapCanvas.js";
import { Renderer } from "./ui/renderer.js";
import { $ } from "./utils.js";
const MASK_PATH = "./assets/raidplan_mask.png";
const ACTIVE_SOAK = [1, 1, 2, 3];
export function initApp(players, spots) {
    const renderer = new Renderer();
    const mapCanvas = new MapCanvas(spots, onSpotHit, onMapRightClick);
    const actionBtn = $("map-action-btn");
    renderer.renderRoster(players, (p) => selectPlayer(p, renderer, actionBtn));
    mapCanvas.init(MASK_PATH);
    actionBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleSubmit(renderer, actionBtn);
    });
    function onSpotHit(hit) {
        const player = currentState.getPlayer();
        if (!player) {
            renderer.logError("Select your name first.");
            return;
        }
        currentState.setSpot(hit.spot);
        currentState.setPosition([hit.xPercent, hit.yPercent]);
        const pos = currentState.getPosition();
        if (!pos) {
            renderer.logError("Position is not valid, try again.");
            return;
        }
        renderer.showVisualPing(pos[0], pos[1]);
        actionBtn.disabled = !currentState.isValid();
        renderer.logZoneEntry(player.name, hit.spot.label, "Confirmed");
    }
    function onMapRightClick(e) {
        e.preventDefault();
        const clickedPing = e.target.closest(".spot.clicked");
        if (clickedPing) {
            clickedPing.remove();
            currentState.resetSpot();
            actionBtn.disabled = !currentState.isValid();
        }
    }
}
function selectPlayer(player, renderer, actionBtn) {
    renderer.resetSpotsLayer();
    currentState.resetAll();
    actionBtn.disabled = !currentState.isValid();
    currentState.setPlayer(player);
    renderer.setActivePlayer(player.name);
    renderer.logPlayerSelected(player);
}
async function handleSubmit(renderer, btn) {
    const player = currentState.getPlayer();
    const spot = currentState.getSpot();
    const pos = currentState.getPosition();
    if (!player || !spot || !pos) {
        return;
    }
    const originalLabel = btn.textContent;
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
            posY: pos[1],
        });
        const correct = isInSafeSpot(spot, player, false, ACTIVE_SOAK);
        console.log(`Answer is ${correct ? "correct." : "incorrect."}`);
        renderer.showModal(correct ? "Correcto" : "Incorrecto", correct ? "Buen trabajo :)" : "... :(");
        renderer.resetSpotsLayer();
        currentState.resetSpot();
    }
    catch (err) {
        console.error(`Could not connect to database: ${err}`);
        alert("Network transmission error. Please try again.");
    }
    finally {
        btn.disabled = !currentState.isValid();
        btn.textContent = originalLabel;
    }
}
