const BlockTree = require("../bsp/blocktree");
const ShipOrchestration = require("./shipOrchestration");
const Config = require("../config");

class BinarySpaceBotStrategy {
    constructor(logger, params) {
        this.tree = null;
        this.shipOrchestrator = null;
        this.config = new Config(params);
        this.logger = logger;
    }

    getNextMoves(game) {
        if (
            game.turnNumber === 1 ||
            game.turnNumber % this.config.params.recreate == 0
        ) {
            this.tree = new BlockTree(game.gameMap, this.config, game.me);
            this.shipOrchestrator = new ShipOrchestration(
                this.config,
                this.logger
            );
        }

        return this.shipOrchestrator.getNextMoves(game, this.tree);
    }
}
module.exports = BinarySpaceBotStrategy;
