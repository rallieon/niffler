let assert = require("assert");
let fs = require("fs");
const Niffler = require("../botStrategyManager");

let niffler = new Niffler();
let gameObj = null;

setup(async () => {
    let content = fs.readFileSync("./niffler/data/game.json");
    gameObj = JSON.parse(content);
});

suite("Game File Processing", () => {
    test("Game Object is not null", () => {
        assert.notEqual(gameObj, null);
    });

    test("Turn number is equal to one", () => {
        assert.equal(gameObj.turnNumber, 1);
    });
});

suite("Binary Space Strategy", () => {
    test("Strategy should have at least one move", () => {
        let moves = niffler.getNextMoves("BINARY_SPACE", gameObj);
        assert.ok(moves.length > 0);
    });
});
