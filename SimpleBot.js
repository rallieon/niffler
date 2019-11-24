const hlt = require("./hlt");
const logging = require("./hlt/logging");
const niffler = require("./niffler");

const game = new hlt.Game();

niffler.setParameters(...args);
niffler.setLogger(logging);

game.initialize().then(async () => {
    await game.ready("KeithBotSIMPLE");

    logging.info(`My Player ID is ${game.myId}.`);

    while (true) {
        await game.updateFrame();
        const commandQueue = niffler.getNextMoves("SIMPLE", game);
        await game.endTurn(commandQueue);
    }
});
