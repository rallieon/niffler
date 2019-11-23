const strategies = require("./strategies");

class BotStrategyManager {
    constructor() {
        this.strategies = new Map(strategies);
    }

    setLogger(logger) {
        this.strategies.forEach(strat => {
            strat.setLogger(logger);
        });
    }

    setParameters(params) {
        this.strategies.forEach(strat => {
            strat.setParameters(params);
        });
    }

    getNextMoves(strategyName, game) {
        return this.strategies.get(strategyName).getNextMoves(game);
    }
}
module.exports = new BotStrategyManager();
