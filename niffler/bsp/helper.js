const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");

class Helper {
    findCellWithHostHalite(gameMap) {
        return gameMap.get(new Position(0, 0));
    }
}

module.exports = new Helper();
