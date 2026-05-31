export class SelectionState {
    constructor() {
        this.player = null;
        this.spot = null;
        this.position = null;
    }
    getPlayer() { return this.player; }
    getSpot() { return this.spot; }
    getPosition() { return this.position; }
    setPlayer(player) { this.player = player; }
    ;
    setSpot(spot) { this.spot = spot; }
    ;
    setPosition(position) { this.position = position; }
    resetSpot() {
        this.spot = null;
        this.position = null;
    }
    resetAll() {
        this.player = null;
        this.spot = null;
        this.position = null;
    }
    isValid() {
        return (this.player !== null && this.spot !== null && this.position !== null);
    }
}
