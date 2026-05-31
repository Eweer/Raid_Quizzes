const CORRECT_SOAK_POSITIONS = [1, 2, 3, 4];
const assignments = {
    1: { Tank: [1], Melee: [1], Ranged: [1], Healer: [1, 6] },
    2: { Tank: [2], Melee: [2], Ranged: [2], Healer: [2, 5] },
    3: { Tank: [3], Melee: [3], Ranged: [3], Healer: [3] },
    4: { Tank: [4], Melee: [4], Ranged: [4], Healer: [4] },
};
export function isInSafeSpot(spot, player, hasSoak = false, currentSoaks = []) {
    const spotNum = spot.id;
    if (player.role === "Healer" && hasSoak && player.isMobile) {
        const duplicate = currentSoaks.find((val, i) => currentSoaks.indexOf(val) !== i);
        if (duplicate === undefined) {
            console.log("Error: Soak positions are not valid.\nPlease, report this issue to an admin.");
            return false;
        }
        if (player.group === duplicate) {
            const missing = CORRECT_SOAK_POSITIONS.find(pos => !currentSoaks.includes(pos));
            if (missing === undefined) {
                console.log("Error: Soak positions are not valid.\nPlease, report this issue to an admin.");
                return false;
            }
            return assignments[missing]["Healer"].some(v => v === spotNum);
        }
    }
    return assignments[player.group][player.role].some(v => v === spotNum);
}
