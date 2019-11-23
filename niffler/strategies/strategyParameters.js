class StrategyParameters {
    constructor(haliteBlockMax = 5000, maxShips = 1, idealCapacity = 500, turnsToRecreate = 100) {
        this.HALITE_BLOCK_MAX = haliteBlockMax;
        this.MAX_SHIPS_PER_BLOCK = maxShips;
        this.IDEAL_CAPACITY = idealCapacity;
        this.TURNS_TO_RECREATE = turnsToRecreate;
    }
}

module.exports = {
    StrategyParameters
};