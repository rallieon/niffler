const hlt = require("../../hlt");

class ShipOrchestration {
    constructor(config, logger) {
        this.shipsInRoute = new Map();
        this.shipsBackToSpawn = new Map();
        this.shipInNode = new Map();
        this.config = config;
        this.logger = logger;
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

        //convert the leaf's relative position to the absolute position on the map
        let modified = node.getModifiedPosition(maxPos.x, maxPos.y);
        return new hlt.Position(modified.x, modified.y);
    }

    cleanUpShips(ship, me) {
        //are we at the spawn point. If so, reset for this ship
        if (
            ship.position.x === me.shipyard.position.x &&
            ship.position.y === me.shipyard.position.y
        ) {
            this.shipsBackToSpawn.delete(ship.id);
            this.shipsInRoute.delete(ship.id);
        }
    }

    checkShipHaliteStorage(ship) {
        //if they have reached the ship capacity (based on configuration of parameter) then return home
        if (ship.haliteAmount > this.config.params.capacity) {
            let node = this.shipsInRoute.get(ship.id);
            if (node) {
                node.shipsInRouteToBlock--;
                this.shipsInRoute.delete(ship.id);
            }

            this.shipsBackToSpawn.set(ship.id, {
                ship: ship,
                node: node
            });
        }
    }

    isShipInRouteToNode(ship) {
        return this.shipsInRoute.has(ship.id);
    }

    isShipInRouteToSpawn(ship) {
        return this.shipsBackToSpawn.has(ship.id);
    }

    navigateShipToNode(ship, gameMap) {
        let selected = this.shipsInRoute.get(ship.id).node;

        if (
            gameMap.get(ship.position).haliteAmount <=
            hlt.constants.MAX_HALITE / this.config.params.halitecellmodifier
        ) {
            //move to the cell with the most halite in that node (greedy algorithm)
            const destination = this.getPositionWithMostHalite(selected);
            const safeMove = gameMap.naiveNavigate(ship, destination);
            return ship.move(safeMove);
        }
    }

    navigateShipToClosestSpawn(ship, player, map) {
        const destination = player.shipyard.position;
        const safeMove = map.naiveNavigate(ship, destination);
        return ship.move(safeMove);
    }

    selectNodeForShip(ship, tree) {
        //traverse through the tree and apply a fitness function to each leaf node.
        let leaves = tree.getLeaves();
        let selected = this.getMaximumFitness(leaves);

        //update the node
        selected.shipsInRouteToBlock++;
        this.shipsInRoute.set(ship.id, {
            ship: ship,
            node: selected
        });
    }

    getNextMoves(game, tree) {
        const commandQueue = [];
        const { gameMap, me } = game;

        for (const ship of me.getShips()) {
            this.checkShipHaliteStorage(ship);

            if (this.isShipInRouteToNode(ship)) {
                commandQueue.push(this.navigateShipToNode(ship, gameMap));
            } else if (this.isShipInRouteToSpawn(ship)) {
                commandQueue.push(
                    this.navigateShipToClosestSpawn(ship, me, gameMap)
                );
            } else {
                this.selectNodeForShip(ship, tree);
                commandQueue.push(this.navigateShipToNode(ship, gameMap));
            }

            this.cleanUpShips(ship, me);
        }

        //build ships based on criteria
        if (
            game.turnNumber <
                this.config.params.modifierturnsships *
                    hlt.constants.MAX_TURNS &&
            me.haliteAmount >= hlt.constants.SHIP_COST &&
            !gameMap.get(me.shipyard).isOccupied
        ) {
            commandQueue.push(me.shipyard.spawn());
        }

        return commandQueue;
    }
}
module.exports = ShipOrchestration;
