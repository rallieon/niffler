class BinarySpaceBotStrategy {
    constructor() {}

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

    getNextMoves(game) {
        return ["N"];
    }
}
module.exports = new BinarySpaceBotStrategy();
