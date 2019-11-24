let assert = require("assert");
let fs = require("fs");
const Niffler = require("../botStrategyManager");
const hlt = require("../../hlt");
const { Direction, Position } = require("../../hlt/positionals");

let niffler = new Niffler();
let gameObj = null;

setup(async () => {
    let content = fs.readFileSync("./niffler/data/game.json");
    gameObj = JSON.parse(content);
    gameObj.gameMap = new hlt.GameMap(
        gameObj.gameMap._cells,
        gameObj.gameMap.width,
        gameObj.gameMap.height
    );
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

suite("Binary Space Strategy", () => {
    test("Strategy should have at least one move", () => {
        let moves = niffler.getNextMoves("BINARY_SPACE", gameObj);
        assert.ok(moves.length > 0);
    });
});
