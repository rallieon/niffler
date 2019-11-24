class Block {
    constructor(map) {
        this.map = map;
        this.left = null;
        this.right = null;
        this.totalHalite = 0;
        this.distanceFromClosestDropoff = 100000000;
        this.shipsInBlock = 0;
        this.shipsInRouteToBlock = 0;
        this.leaf = false;
    }

    get isLeaf() {
        return this.isLeaf;
    }
}
module.exports = Block;
