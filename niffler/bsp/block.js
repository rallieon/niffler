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
        this.xModifier = 0;
        this.yModifier = 0;
    }

    getModifiedPosition(x, y) {
        return { x: x + this.xModifier, y: y + this.yModifier };
    }

    getFitness() {
        //maximum value is the best
        return (
            (this.shipsInRouteToBlock < this.config.params.maxships
                ? this.config.params.fitnessformaxships
                : this.shipsInRouteToBlock) +
            this.config.params.fitnessfordistancetodropoff /
                this.distanceFromClosestDropoff +
            this.totalHalite
        );
    }
}
module.exports = Block;
