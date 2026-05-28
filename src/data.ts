export interface Player {
  name: string;
  group: 1 | 2 | 3 | 4;
  role: string;
  isMobile: boolean;
}

export interface Spot {
  id: string;
  label: string;
  maskRgb: [number, number, number];
}

export const players: Player[] = [
  { name: "Bloodbornd",   group: 1, role: "Tank",   isMobile: false },
  { name: "Cocorota",     group: 1, role: "Melee",  isMobile: false },
  { name: "Teese",        group: 1, role: "Melee",  isMobile: false },
  { name: "Garrïdan",     group: 1, role: "Melee",  isMobile: false },
  { name: "Bunnyson",     group: 1, role: "Healer", isMobile: false },
  { name: "Rinók",        group: 2, role: "Ranged", isMobile: false },
  { name: "Zopenric",     group: 2, role: "Melee",  isMobile: false },
  { name: "Nyldur",       group: 2, role: "Melee",  isMobile: false },
  { name: "Barrydruid",   group: 2, role: "Healer", isMobile: false },
  { name: "Géodes",       group: 2, role: "Healer", isMobile: false },
  { name: "Demiân",       group: 3, role: "Ranged", isMobile: false },
  { name: "Spaceypriest", group: 3, role: "Ranged", isMobile: false },
  { name: "Shadraen",     group: 3, role: "Melee",  isMobile: false },
  { name: "Kaiserto",     group: 3, role: "Ranged", isMobile: false },
  { name: "Minarete",     group: 3, role: "Healer", isMobile: false },
  { name: "Cooldan",      group: 4, role: "Ranged", isMobile: false },
  { name: "Zylua",        group: 4, role: "Ranged", isMobile: false },
  { name: "Brewcarry",    group: 4, role: "Tank",   isMobile: false },
  { name: "Dellilah",     group: 4, role: "Healer", isMobile: false  },
  { name: "Okito",        group: 4, role: "Healer", isMobile: false },
];

export const spots: Spot[] = [
  { id: "S1", label: "1", maskRgb: [   0, 255,   0 ] },
  { id: "S2", label: "2", maskRgb: [ 255, 255,   0 ] },
  { id: "S3", label: "3", maskRgb: [ 255,   0, 255 ] },
  { id: "S4", label: "4", maskRgb: [   0, 255, 255 ] },
  { id: "S5", label: "5", maskRgb: [   0,   0, 255 ] },
  { id: "S6", label: "6", maskRgb: [ 255, 143,  68 ] },
  { id: "S7", label: "7", maskRgb: [ 255,   0,   0 ] },
  { id: "S8", label: "8", maskRgb: [   0,   0,   0 ] },
];

export function isInSafeSpot(spot: Spot, player: Player, hasSoak: boolean = false, currentSoaks: number[] = []) {
  if (player.role == "Melee" || player.role == "Ranged" || player.role == "Tank") {
    return player.group == Number(spot.label);
  }
  if (!hasSoak) {
    if (player.group == 1) {
      return Number(spot.label) == 6;
    }
    if (player.group == 2) {
      return Number(spot.label) == 5;
    }
    return Number(spot.label) == 5 || Number(spot.label) == 6;
  }
  if (!player.isMobile) {
    if (player.group == Number(spot.label)) {
      return true;
    }
    if (player.group == 1) {
      return Number(spot.label) == 6;
    }
    if (player.group == 2) {
      return Number(spot.label) == 5;
    }
    return false;
  }
  const allPositions = [1, 2, 3, 4];
  for (const n in currentSoaks) {
    allPositions[n] = 0;
  }
  const remainingPosition = allPositions.find(v => v != 0);
  return remainingPosition === Number(spot.label);
}