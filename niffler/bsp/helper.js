const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");

class Helper {
    sumHaliteRow(gameMap, row) {
        return gameMap.get(new Position(0, 0));
    }

    sumHaliteCol(gameMap, col) {}
}

module.exports = new Helper();
