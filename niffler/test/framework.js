let assert = require("assert");
let fs = require("fs");
let Config = require("../config");
const logging = require("../../hlt/logging");
const Niffler = require("../botStrategyManager");
const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");
const params = {
    halitemax: 5000,
    maxships: 1,
    capacity: 500,
    recreate: 100,
    fitnessformaxships: 5000,
    fitnessfordistancetodropoff: 1,
    halitecellmodifier: 10,
    modifierturnsships: 0.5
};

let niffler = new Niffler(logging, params);
let gameObj = null;

setup(async () => {
    let content = fs.readFileSync("./niffler/data/game.json");

    gameObj = JSON.parse(content);
    gameObj.gameMap = new hlt.GameMap(
        gameObj.gameMap._cells.map(row => {
            return row.map(
                cell =>
                    new hlt.MapCell(
                        new Position(cell.position.x, cell.position.y),
                        cell.haliteAmount
                    )
            );
        }),
        gameObj.gameMap.width,
        gameObj.gameMap.height
    );

    let player = new hlt.Player(
        1,
        new hlt.Shipyard(1, 1, new hlt.Position(0, 0)),
        0
    );

    let ship = new hlt.Ship(1, 1, new hlt.Position(1, 1));
    ship.haliteAmount = 500;
    hlt.constants.MAX_HALITE = 500;
    hlt.constants.MAX_TURNS = 400;

    player._ships = new Map();
    player._ships.set(1, ship);

    gameObj.me = player;
});

suite("Game File Processing", () => {
    test("Game Object is not null", () => {
        assert.notEqual(gameObj, null);
    });

    test("Turn number is equal to one", () => {
        assert.equal(gameObj.turnNumber, 1);
    });

    test("Can get a map cell", () => {
        let cell = gameObj.gameMap.get(new Position(0, 0));
        assert.equal(cell.haliteAmount, 5);
    });
});

suite("Simple Strategy", () => {
    test("Strategy should have at least one move", () => {
        let moves = niffler.getNextMoves("SIMPLE", gameObj);
        assert.ok(moves.length > 0);
    });
});

suite("Binary Space Strategy", () => {
    test("Strategy should have at least one move", () => {
        let moves = niffler.getNextMoves("BINARY_SPACE", gameObj);
        assert.ok(moves.length > 0);
    });
});
