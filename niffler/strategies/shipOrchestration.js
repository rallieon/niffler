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

    getNextMoves(game, tree) {
        const commandQueue = [];
        const { gameMap, me } = game;

        for (const ship of me.getShips()) {
            //check and see if the ship is in route already OR if its in route back to the spawn
            //TODO: Update to create more spawn points
            let isInRouteToNode = this.shipsInRoute.get(ship.id);
            let isInRouteToSpawn = this.shipsBackToSpawn.get(ship.id);

            this.logger.debug(
                `Turn number = ${game.turnNumber}, ship = ${ship.id}, shipHalite = ${ship.haliteAmount}`
            );

            //are we at the spawn point. If so, reset for this ship
            if (
                ship.position.x === me.shipyard.position.x &&
                ship.position.y === me.shipyard.position.y
            ) {
                this.logger.debug(`Ship ${ship.id} is back at the shipyard.`);
                this.shipsBackToSpawn.delete(ship.id);
                this.shipsInRoute.delete(ship.id);
            }

            //if they have reached the ship capacity (based on configuration of parameter) then return home
            if (ship.haliteAmount > this.config.params.halitemax) {
                this.logger.debug(
                    `Ship ${ship.id} is going to turn around to spawn`
                );
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
                let selected = isInRouteToNode.node;
                this.logger.debug(
                    `Ship ${ship.id} is in route to node (distanceFromClosestDropoff=${selected.distanceFromClosestDropoff}, shipsInRouteToBlock = ${selected.shipsInRouteToBlock}, nodeHalite = ${selected.totalHalite}, width= ${selected.map.width}, height= ${selected.map.height})`
                );
                //move to the cell with the most halite in that node (greedy algorithm)
                const destination = this.getPositionWithMostHalite(
                    isInRouteToNode.node
                );
                const safeMove = gameMap.naiveNavigate(ship, destination);
                this.logger.debug(
                    `Ship is moving to ${JSON.stringify(destination)}`
                );
                commandQueue.push(ship.move(safeMove));
            } else if (isInRouteToSpawn) {
                this.logger.debug(`Ship ${ship.id} is in route to spawn`);
                const destination = me.shipyard.position;
                const safeMove = gameMap.naiveNavigate(ship, destination);
                commandQueue.push(ship.move(safeMove));
            } else {
                //traverse through the tree and apply a fitness function to each leaf node.
                let leaves = tree.getLeaves();
                let selected = this.getMaximumFitness(leaves);
                this.logger.debug(`Choosing Node for ship ${ship.id}`);
                this.logger.debug(
                    `selected = ${selected.leaf}, distanceFromClosestDropoff=${selected.distanceFromClosestDropoff}, shipsInRouteToBlock = ${selected.shipsInRouteToBlock}, nodeHalite = ${selected.totalHalite}, width= ${selected.map.width}, height= ${selected.map.height}`
                );

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
