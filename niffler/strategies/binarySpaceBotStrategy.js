class BinarySpaceBotStrategy {
    constructor() {
        this.HALITE_BLOCK_MAX = 10000;
        this.MAX_SHIPS_PER_BLOCK = 2;
        this.IDEAL_CAPACITY = 700;
        this.TURNS_TO_RECREATE = 500;
        this.tree = null;
    }

    setLogger(logger) {
        this.logger = logger;
    }

    setParameters([
        haliteBlockMax = 10000,
        maxShips = 2,
        idealCapacity = 700,
        turnsToRecreate = 500
    ]) {
        this.HALITE_BLOCK_MAX = parseInt(haliteBlockMax);
        this.MAX_SHIPS_PER_BLOCK = parseInt(maxShips);
        this.IDEAL_CAPACITY = parseInt(idealCapacity);
        this.TURNS_TO_RECREATE = parseInt(turnsToRecreate);
    }

    buildTree() {}

    getNextMoves(game) {
        if (!this.tree || game.turnNumber % this.TURNS_TO_RECREATE == 0) {
            this.buildTree();
        }

        return ["N"];
    }
}
module.exports = BinarySpaceBotStrategy;
