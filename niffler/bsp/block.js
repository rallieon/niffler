class Block {
    constructor(map, level, config) {
        this.map = map;
        this.level = level;
        this.config = config;
        this.left = null;
        this.right = null;
        this.totalHalite = 0;
        this.distanceFromClosestDropoff = 100000000;
        this.shipsInRouteToBlock = 0;
        this.leaf = false;
        this.orientation = null;
        this.partition = null;
    }

    getFitness() {
        //TODO parameterize these fitness values as apart of the genetic algorithm
        //maximum value is the best
        return (
            (this.shipsInRouteToBlock >= this.config.maxships
                ? this.shipsInRouteToBlock * 5000
                : this.shipsInRouteToBlock * 1000) +
            this.distanceFromClosestDropoff * (1 / 10) +
            this.totalHalite
        );
    }
}
module.exports = Block;
