const hlt = require("./hlt");
const {
  Direction
} = require("./hlt/positionals");
const logging = require("./hlt/logging");

const game = new hlt.Game();
game.initialize().then(async () => {
  // At this point "game" variable is populated with initial map data.
  // This is a good place to do computationally expensive start-up pre-processing.
  // As soon as you call "ready" function below, the 2 second per turn timer will start.
  await game.ready("MyTestBot");

  logging.info(`My Player ID is ${game.myId}.`);

  while (true) {
    await game.updateFrame();

    const {
      gameMap,
      me
    } = game;

    const commandQueue = [];

    for (const ship of me.getShips()) {
      if (ship.haliteAmount > hlt.constants.MAX_HALITE / 2) {
        // if the current ships halite is greater than half the amount the ship can hold
        // (default 1000) then move back to the shipyard.
        const destination = me.shipyard.position;
        const safeMove = gameMap.naiveNavigate(ship, destination);
        commandQueue.push(ship.move(safeMove));
      } else if (gameMap.get(ship.position).haliteAmount < hlt.constants.MAX_HALITE / 10) {
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

    if (
      game.turnNumber < 0.75 * hlt.constants.MAX_TURNS &&
      me.haliteAmount >= hlt.constants.SHIP_COST &&
      !gameMap.get(me.shipyard).isOccupied
    ) {
      commandQueue.push(me.shipyard.spawn());
    }

    await game.endTurn(commandQueue);
  }
});