const hlt = require("./hlt");
const logging = require("./hlt/logging");
const Niffler = require("./niffler");
const args = process.argv.slice(2);
const game = new hlt.Game();
const niffler = new Niffler();

niffler.setLogger(logging);
niffler.setParameters(args);

game.initialize().then(async () => {
    await game.ready("KeithBotBINARY_SPACE");
    logging.info(process.argv);
    logging.info(`My Player ID is ${game.myId}.`);

    while (true) {
        await game.updateFrame();
        const commandQueue = niffler.getNextMoves("BINARY_SPACE", game);
        await game.endTurn(commandQueue);
    }
});
