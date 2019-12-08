const hlt = require("../../hlt");

class ShipOrchestration {
    constructor(config) {
        this.shipsInRoute = new Map();
        this.shipsBackToSpawn = new Map();
        this.shipInNode = new Map();
        this.config = config;
    }

    getNextMoves(game, tree) {
        const commandQueue = [];
        const { gameMap, me } = game;

        for (const ship of me.getShips()) {
            //check and see if the ship is in route already OR if its in route back to the spawn
            //TODO: Update to create more spawn points

            let isInRouteToNode = this.shipsInRoute.get(ship.id);
            let isInRouteToSpawn = this.shipsBackToSpawn.get(ship.id);

            //check if the ship has 0 halite which likely means it has reached spawn point
            if (ship.haliteAmount === 0) {
                this.shipsBackToSpawn.delete(ship.id);
                this.shipsInRoute.delete(ship.id);
            }

            if (isInRouteToNode) {
                //check to see if the ship is already in the node
            } else if (isInRouteToSpawn) {
                const destination = me.shipyard.position;
                const safeMove = gameMap.naiveNavigate(ship, destination);
                commandQueue.push(ship.move(safeMove));
            } else {
                //traverse through the tree and apply a fitness function to each leaf node.
                let leaves = tree.getLeaves();
                let selected = Math.max(
                    ...leaves.map(leaf => leaf.getFitness())
                );

                //update the node
                selected.shipsInRouteToBlock++;
                this.shipsInRoute.set(ship.id, {
                    ship: ship,
                    node: selected
                });

                //create the move and add to queue
                const destination = selected.map.get(
                    new Position(
                        selected.map.width / 2,
                        selected.map.height / 2
                    )
                );
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
module.exports = ShipOrchestration;
