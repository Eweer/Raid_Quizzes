// State
let selectedPlayer = null;
let selectedSpot = null;
let selectedPosition = null;
// Getters
export const getSelectedPlayer = () => selectedPlayer;
export const getSelectedSpot = () => selectedSpot;
export const getSelectedPosition = () => selectedPosition;
// Setters
export const setSelectedPlayer = (p) => { selectedPlayer = p; };
export const setSelectedSpot = (s) => { selectedSpot = s; };
export const setSelectedPosition = (pos) => { selectedPosition = pos; };
export const resetState = () => {
    selectedPlayer = null;
    selectedSpot = null;
    selectedPosition = null;
};
