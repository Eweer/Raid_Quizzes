import type { Player } from "../data/player.js";
import type { Spot } from "../data/spots.js";

const assignments: Record<string, number[]> = {
    "1Melee":  [ 1 ],
    "2Melee":  [ 2 ],
    "3Melee":  [ 3 ],
    "4Melee":  [ 4 ],
    "1Ranged": [ 1 ],
    "2Ranged": [ 2 ],
    "3Ranged": [ 3 ],
    "4Ranged": [ 4 ],
    "1Tank":   [ 1 ],
    "2Tank":   [ 2 ],
    "3Tank":   [ 3 ],
    "4Tank":   [ 4 ],
    "1Healer": [ 1, 6 ],
    "2Healer": [ 2, 5 ],
    "3Healer": [ 3 ],
    "4Healer": [ 4 ],
}

const CORRECT_SOAK_POSITIONS = [ 1, 2, 3, 4 ];


export function isInSafeSpot(
    spot: Spot,
    player: Player,
    hasSoak: boolean = false,
    currentSoaks: number[] = []
): boolean {
    const spotNum = spot.id;

    if (player.role === "Healer" && hasSoak && player.isMobile) {
        const duplicate = currentSoaks.find(
            (val, i) => currentSoaks.indexOf(val) !== i
        );

        if (duplicate === undefined) {
            console.log("Error: Soak positions are not valid.\nPlease, report this issue to an admin.");
            return false;
        }

        if (player.group === duplicate) {
            const missing = CORRECT_SOAK_POSITIONS.find(
                pos => !currentSoaks.includes(pos)
            );

            if (missing === undefined) {
                console.log("Error: Soak positions are not valid.\nPlease, report this issue to an admin.");
                return false;
            }

            return assignments[`${missing}Healer`].some(v => v === spotNum);
        }
    }

    return assignments[`${player.group}${player.role}`].some(v => v === spotNum);
}