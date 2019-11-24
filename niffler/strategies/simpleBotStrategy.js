const hlt = require("../../hlt");
const { Direction } = require("../../hlt/positionals");

class SimpleBotStrategy {
    constructor() {
        this.params = null;
    }
    setParameters(params) {
        this.params = params; //not used in simple strategy
    }

    setLogger(logger) {
        this.logger = logger; //not used in simple strategy
    }

    getNextMoves(game) {
        const commandQueue = [];
        const { gameMap, me } = game;

        for (const ship of me.getShips()) {
            if (ship.haliteAmount > hlt.constants.MAX_HALITE / 2) {
                // if the current ships halite is greater than half the amount the ship can hold
                // (default 1000) then move back to the shipyard.
                const destination = me.shipyard.position;
                const safeMove = gameMap.naiveNavigate(ship, destination);
                commandQueue.push(ship.move(safeMove));
            } else if (
                gameMap.get(ship.position).haliteAmount <
                hlt.constants.MAX_HALITE / 10
            ) {
                // else if the current cells haliate is less than 1/10 of the max malite of a ship
                // (default 1000) then pick a random direction and get off the cell.
                const direction = Direction.getAllCardinals()[
                    Math.floor(4 * Math.random())
                ];
                const destination = ship.position.directionalOffset(direction);
                const safeMove = gameMap.naiveNavigate(ship, destination);
                commandQueue.push(ship.move(safeMove));
            }
        }

        // if you are not 3/4 of the way through the game
        // and you have enough halite to build a ship
        // and no other ship is in the shipyard
        // then build a new ship
        if (
            game.turnNumber < 0.75 * hlt.constants.MAX_TURNS &&
            me.haliteAmount >= hlt.constants.SHIP_COST &&
            !gameMap.get(me.shipyard).isOccupied
        ) {
            commandQueue.push(me.shipyard.spawn());
        }

        return commandQueue;
    }
}
module.exports = SimpleBotStrategy;
