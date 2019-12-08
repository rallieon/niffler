const hlt = require("../../hlt");

class ShipOrchestration {
    constructor(config) {
        this.shipsInRoute = new Map();
        this.shipsBackToSpawn = new Map();
        this.shipInNode = new Map();
        this.config = config;
    }

    getMaximumFitness(nodes) {
        let max = 0;
        let maxNode = null;

        for (let node of nodes) {
            if (node.getFitness() > max) {
                maxNode = node;
                max = node.getFitness();
            }
        }

        return maxNode;
    }

    getPositionWithMostHalite(node) {
        let max = 0;
        let maxPos = null;

        for (var i = 0; i < node.map.width; i++) {
            for (var j = 0; j < node.map.height; j++) {
                let pos = new hlt.Position(i, j);
                const cell = node.map.get(pos);
                if (cell.haliteAmount > max) {
                    max = cell.haliteAmount;
                    maxPos = pos;
                }
            }
        }

        return maxPos;
    }

    getNextMoves(game, tree) {
        const commandQueue = [];
        const { gameMap, me } = game;

        for (const ship of me.getShips()) {
            //check and see if the ship is in route already OR if its in route back to the spawn
            //TODO: Update to create more spawn points

            let isInRouteToNode = this.shipsInRoute.get(ship.id);
            let isInRouteToSpawn = this.shipsBackToSpawn.get(ship.id);

            //check if the ship has 0 halite which likely means it has reached spawn point and start over
            if (ship.haliteAmount === 0) {
                this.shipsBackToSpawn.delete(ship.id);
                this.shipsInRoute.delete(ship.id);
            }

            //if they have reached the ship capacity (based on configuration of parameter) then return home
            if (ship.haliteAmount > this.config.halitemax) {
                let node = this.shipsInRoute.get(ship.id);
                if (node) {
                    node.shipsInRouteToBlock--;
                    this.shipsInRoute.delete(ship.id);
                }

                this.shipsBackToSpawn.set(ship.id, {
                    ship: ship,
                    node: selected
                });
            }

            if (isInRouteToNode) {
                //move to the cell with the most halite in that node (greedy algorithm)
                const destination = this.getPositionWithMostHalite(
                    isInRouteToNode.node
                );
                const safeMove = gameMap.naiveNavigate(ship, destination);
                commandQueue.push(ship.move(safeMove));
            } else if (isInRouteToSpawn) {
                const destination = me.shipyard.position;
                const safeMove = gameMap.naiveNavigate(ship, destination);
                commandQueue.push(ship.move(safeMove));
            } else {
                //traverse through the tree and apply a fitness function to each leaf node.
                let leaves = tree.getLeaves();
                let selected = this.getMaximumFitness(leaves);

                //update the node
                selected.shipsInRouteToBlock++;
                this.shipsInRoute.set(ship.id, {
                    ship: ship,
                    node: selected
                });

                //create the move and add to queue
                const destination = this.getPositionWithMostHalite(selected);
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
