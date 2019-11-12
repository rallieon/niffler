const hlt = require("./hlt");
const {
  Direction,
  Position
} = require("./hlt/positionals");
const logging = require("./hlt/logging");

const game = new hlt.Game();

// Helper Functions
const getMostHalitePosition = (map) => {
  var maxPosition = new Position(0, 0);
  var max = 0;

  for (var i = 0; i < map.width; i++) {
    for (var j = 0; j < map.height; j++) {
      const pos = new Position(i, j);
      const cell = map.get(pos);
      if (cell.haliteAmount > max) {
        max = cell.haliteAmount;
        maxPosition = pos;
      }
    }
  }
  return maxPosition;
};

// End Helper Functions

game.initialize().then(async () => {
  // At this point "game" variable is populated with initial map data.
  // This is a good place to do computationally expensive start-up pre-processing.
  // As soon as you call "ready" function below, the 2 second per turn timer will start.
  await game.ready("My New Bot");

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
      } else {
        // move towards cell with the highest amount of halite (greedy algorithm)
        const destination = getMostHalitePosition(gameMap);
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