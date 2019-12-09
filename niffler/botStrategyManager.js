const strategies = require("./strategies");

class BotStrategyManager {
    constructor(logger, params) {
        this.strategies = new Map();

        strategies.forEach(strat => {
            this.strategies.set(strat[0], new strat[1](logger, params));
        });
    }

    getNextMoves(strategyName, game) {
        return this.strategies.get(strategyName).getNextMoves(game);
    }
}
module.exports = BotStrategyManager;
