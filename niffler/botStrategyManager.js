const strategies = require("./strategies");

class BotStrategyManager {
    constructor(logger, params) {
        this.strategies = new Map(strategies);

        this.strategies.forEach(strat => {
            strat.setLogger(logger);
            strat.setParameters(params);
        });
    }

    getNextMoves(strategyName, game) {
        return this.strategies.get(strategyName).getNextMoves(game);
    }
}
module.exports = BotStrategyManager;
