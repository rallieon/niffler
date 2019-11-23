class Block {
    constructor(cells, width, height) {
        this.left = null;
        this.right = null;
        this.cells = cells;
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.totalHalite = 0;
        this.distanceFromClosestDropoff = 100000000;
        this.shipsInBlock = 0;
        this.shipsInRouteToBlock = 0;
    }
}
module.exports = {
    Block
};