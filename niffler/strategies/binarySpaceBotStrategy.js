const BlockTree = require("../bsp/blocktree");
const ShipOrchestration = require("./shipOrchestration");
const Config = require("../config");

class BinarySpaceBotStrategy {
    constructor() {
        this.tree = null;
        this.shipOrchestrator = null;
        this.config = null;
        this.logger = null;
    }

    setLogger(logger) {
        this.logger = logger;
    }

    setParameters(params) {
        this.config = new Config(params);
    }

    getNextMoves(game) {
        if (
            game.turnNumber === 1 ||
            game.turnNumber % this.config.recreate == 0
        ) {
            this.tree = new BlockTree(game.gameMap, this.config, game.me);
            this.shipOrchestrator = new ShipOrchestration(this.config);
        }

        return this.shipOrchestrator.getNextMoves(game, this.tree);
    }
}
module.exports = BinarySpaceBotStrategy;
