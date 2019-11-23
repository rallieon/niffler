const hlt = require("./hlt");
const logging = require("./hlt/logging");
const niffler = require("./niffler");

const game = new hlt.Game();

game.initialize().then(async () => {
    await game.ready("My New Bot");

    logging.info(`My Player ID is ${game.myId}.`);

    while (true) {
        await game.updateFrame();
        const commandQueue = [];

        for (const move of niffler.getNextMoves("SIMPLE", game)) {
            commandQueue.push(move)
        }

        await game.endTurn(commandQueue);
    }
});