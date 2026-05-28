import type { Player, Spot } from "./data.js";

// State
let selectedPlayer: Player | null = null;
let selectedSpot: Spot | null = null;
let selectedPosition: [number, number] | null = null;

// Getters
export const getSelectedPlayer = () => selectedPlayer;
export const getSelectedSpot = () => selectedSpot;
export const getSelectedPosition = () => selectedPosition;

// Setters
export const setSelectedPlayer = (p: Player | null) => { selectedPlayer = p; };
export const setSelectedSpot = (s: Spot | null) => { selectedSpot = s; };
export const setSelectedPosition = (pos: [number, number] | null) => { selectedPosition = pos; };

export const resetState = () => {
  selectedPlayer = null;
  selectedSpot = null;
  selectedPosition = null;
};