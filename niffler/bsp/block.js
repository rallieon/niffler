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
        this.orientation = null;
        this.partition = null;
    }

    getFitness() {
        //TODO parameterize these fitness values as apart of the genetic algorithm
        //maximum value is the best
        return (
            this.shipsInBlock * 10000 +
            this.shipsInRouteToBlock * 50000 +
            this.distanceFromClosestDropoff * (1 / 10) +
            this.totalHalite
        );
    }
}
module.exports = Block;
