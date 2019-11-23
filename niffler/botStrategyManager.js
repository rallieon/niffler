const strategies = require("./strategies");

class BotStrategyManager {
    constructor() {
        this.strategies = new Map(strategies);
    }

    getNextMoves(strategyName, game) {
        return this.strategies.get(strategyName).getNextMoves(game);
    }
}
module.exports = new BotStrategyManager();